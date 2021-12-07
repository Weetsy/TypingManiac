class Stats {
  getUserData(user) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      mode: 'cors'
    };
    return new Promise((resolve, reject) => {
      fetch('https://4wiarmu0k6.execute-api.us-east-1.amazonaws.com/dev/?user=' + user, requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result)))
        .catch(error => console.log('error', error));
    });
  }

  constructor(user) {
    this.user = user;
    this.dataset = this.getUserData(user);
    this.wpmDaily = null;
    this.wpmAll = null;
    this.accDaily = null;
    this.accAll = null;
    this.populateObject();
  }

  createGraph(xData, yData, yLabel, overallLabel) {
    let chartOptions = {
      type: 'line',
      data: {
        labels: xData,
        datasets: [
          {
            label: overallLabel,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: yData,
            fill: false,
          },
        ],
      },
      options: {
        title: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time',
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: yLabel,
              },
            }
          ]
        },
      }
    };

    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
      mode: 'cors'
    };

    return new Promise((resolve, reject) => {
      fetch('https://quickchart.io/chart?c=' + JSON.stringify(chartOptions), requestOptions)
        .then()
        .then(result => {
          resolve(result.url);
        })
        .catch(error => console.log('error', error));
    });

  }

  setChart(chart, type) {
    let header = '';
    if (type == 'wpm') {
      header = 'wpmChart';
      if (document.getElementById(header + 'X') != null) {
        document.getElementById(header + 'X').remove();
      }
    }
    if (type == 'acc') {
      header = 'accChart';
      if (document.getElementById(header + 'X') != null) {
        document.getElementById(header + 'X').remove();
      }
    }
    let img = document.createElement('img');
    img.src = chart;
    img.id = header + 'X';
    img.width = 500;
    document.getElementById(header).append(img);
  }

  // helper funciton for calling sort on the array in sortByVersion
  versionCompare(a, b) {
    if (Number(a['Version']) > Number(b['Version'])) {
      return 1;
    }
    if (Number(a['Version']) < Number(b['Version'])) {
      return -1;
    }
    return 0;
  }

  sortByVersion(submissions) {
    submissions.sort(this.versionCompare);
  }

  checkDate(day, month, year, combined) {
    let cDate = combined.substring(0, 8);
    cDate = new Date(cDate);
    let cDay = cDate.getDate();
    let cMonth = cDate.getMonth();
    let cYear = cDate.getFullYear();

    console.log(`cDay = ${cDay} cmonth = ${cMonth} cyear = ${cYear}`);

    if (cDay == day && cMonth == month && cYear == year) {
      return 1;
    }
    return 0;
  }

  async populateObject() {
    this.dataset = await this.dataset; // ensure the promise has resolved from the constructor
    this.dataset = this.dataset.Items;
    this.sortByVersion(this.dataset);
    console.log(this.dataset);
    let wpm = [];
    let accuracy = [];
    let dates = [];
    let i = 0;

    while (i < this.dataset.length) {
      wpm.push(this.dataset[i].WPM);
      accuracy.push(this.dataset[i].Accuracy);
      dates.push(this.dataset[i].Time);
      i++;
    }
    console.log(`wpm = ${wpm}`);
    console.log(`acc = ${accuracy}`);

    i = 0;
    let myDate = new Date();
    let day = myDate.getDate();
    let month = myDate.getMonth();
    let year = myDate.getFullYear();

    let dailyX = [];
    let dailyWPM = [];
    let dailyAcc = [];
    while (i < dates.length) {
      if (this.checkDate(day, month, year, dates[i]) == 1) {
        console.log('today!');
        dailyX.push(dates[i]);
        dailyWPM.push(wpm[i]);
        dailyAcc.push(accuracy[i]);
      }
      i++;
    }

    this.wpmAll = await this.createGraph(dates, wpm, 'WPM', 'Your WPM');
    this.accAll = await this.createGraph(dates, accuracy, 'Accuracy', 'Your Accuracy');

    this.setChart(this.wpmAll, 'wpm');
    this.setChart(this.accAll, 'acc');

    this.wpmDaily = await this.createGraph(dailyX, dailyWPM, 'WPM', 'Your WPM');
    this.accDaily = await this.createGraph(dailyX, dailyAcc, 'Accuracy', 'Your Accuracy');

  }
}