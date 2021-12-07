// NOTE: TypingTest.js should be used in conjunction with Scripts.js, and
// Scripts.js should be loaded FIRST.

/*
TypingTest class is used to hold data relevant to the current typing test
session.
*/
class TypingTest {
  constructor(time) {
    this.testTime = time; // seconds for test
    this.originalTime = time; // original start time
    this.typedWords = 0;
    this.correctChars = 0;
    this.missedChars = 0;
    this.startedTest = false;
    this.chosenWords = [];
    this.currentWords = [];
    this.timer; // Global timer variable
  }
  /*
    (Array: String) getWords returns an array of Strings containing words. This
    function splits on the space character in the current input field and
    removes all empty strings from the String Array in the case that multiple
    concurrent space characters are present, or there's a trailing space
    character.
    */
  getWords(value) {
    return value.split(' ').filter((elem) => elem != '');
  }
  /*
    (Boolean) analyzeWords takes some (Array: String) words from the input field
    on the webpage and uses (Array: String) currentWords from the on-screen
    wordbank segment, and (Array: String) chosenWords from the total bank of
    chosen words and removes correct words from the currentWords field. When a
    word from currentWords is removed, another is added at the tail of the list
    from the chosenWords bank. Returns true if all of the typed words are
    correct, and false otherwise.
    */
  analyzeWords(words) {
    let phraseLength = words.length;
    // In a perfect world we just compare the first word
    for (let i = 0; i < phraseLength; i++) {
      if (i >= this.currentWords.length) {
        break;
      }
      if (words[0] === this.currentWords[0]) {
        document.getElementById('typeBox').style.color = '#FFFFFF';
        this.currentWords.shift(); // Remove head of current words
        this.currentWords.push(this.chosenWords.shift()); // Add next word to chosenWords
        words.shift(); // Remove word at front
        document.getElementById('typeBox').value = words.join(' ');
        document.getElementById('randomWords').innerHTML = this.currentWords.join(' ');
        document.getElementById('typeBox').placeholder = '';
        this.typedWords = this.typedWords + 1;
      }
    }
    if (phraseLength > words.length) return true;
    return false;
  }
  /*
    (Boolean) analyzeSubstrings takes a (String) word from the input field and
    compares it to the (String) currentWord that should be typed in by the user.
    In the case that word is a substring of currentWord starting from the first
    character in the word, the typeBox element is colored white. Otherwise the
    typeBox element is colored red. Returns true when the substrings are
    matching and false otherwise.
    */
  analyzeSubstrings(word) {
    for (let i = 0; i < word.length; i++) {
      if (i < this.currentWords[0].length) {
        if (word[i] !== this.currentWords[0][i]) {
          document.getElementById('typeBox').style.color = '#FF0000';
          return false;
        } else {
          document.getElementById('typeBox').style.color = '#FFFFFF';
        }
      } else {
        if (word[this.currentWords[0].length] != ' ') {
          document.getElementById('typeBox').style.color = '#FF0000';
          return false;
        }
      }
    }
    return true;
  }
  /*
    (void) insertStats takes a (String) user, (Double) speed, (Int) accuracy and
    sends them off to be inserted into DynamoDB as a [User: speed, accuracy]
    record.
    */
  insertStats(user, speed, accuracy) {
    // instantiate a headers object
    let myHeaders = new Headers();
    // add content type header to object
    myHeaders.append('Content-Type', 'application/json');
    // using built in JSON utility package turn object to string and store in a variable
    let raw = JSON.stringify({ 'User': user, 'WPM': speed, 'Accuracy': accuracy });
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
      // make API call with parameters and use promises to get response
    fetch('https://4wiarmu0k6.execute-api.us-east-1.amazonaws.com/dev', requestOptions)
      .then(response => response.text())
      .then(result => console.log(JSON.parse(result).body))
      .catch(error => console.log('error', error));
  }
  /*
    (void) countDown is a function that runs from a generated interval object
    that counts down every 1 second. When the (int) currentTime for the test
    reaches zero, the test ends and the function displays the WPM and accuracy
    of the typing test.
    */
  countDown() {
    this.testTime -= 1; // Decrement time
    if (this.testTime <= 0) {
      let WPM = this.typedWords / (this.originalTime / 60);
      let totalChars = this.correctChars + this.missedChars;
      let accuracy = Math.floor((this.correctChars / totalChars) * 100);
      console.log('Accuracy is ' + accuracy.toString());
      clearInterval(this.timer);
      document.getElementById('score').style.display = 'block';
      document.getElementById('score').innerHTML = 'Congrats! You typed ' +
                WPM.toString() + ' WPM!';
      document.getElementById('typeBox').style.display = 'none';
      // Insert stats for the logged in user
      const login = gitHubLogin();
      // If we aren't logged in, do not submit speed
      if (login != null) {
        login.then((data) => {
          if (data != null) { // If our token is still valid
            this.insertStats(data, WPM, accuracy); // Insert data into DynamoDB
          }
        });
      }
    }
    document.getElementById('countdown').innerHTML = this.testTime.toString();
  }
}

// Configures initial page
function configurePage(ct) {
  // Select random words to use from wordbank
  let randomCount = 200; // Pick 200 words in pool
  let shownCount = 8;
  // Hide score element
  document.getElementById('score').style.display = 'none';
  for (let i = 0; i < randomCount; i++) {
    ct.chosenWords.push(wordbank[Math.floor(Math.random() * wordbank.length)]);
  }
  for (let i = 0; i < shownCount; i++) {
    if (ct.chosenWords.length == 0) {
      break; // Don't try adding words when currentWords is empty
    }
    ct.currentWords.push(ct.chosenWords.shift()); // Grab 20 words from chosenWords
  }
  document.getElementById('randomWords').innerHTML = ct.currentWords.join(' ');
  document.getElementById('countdown').innerHTML = ct.testTime.toString();
  document.getElementById('typeBox').addEventListener('keyup', (event) => {
    event.preventDefault();
    if (document.getElementById('typeBox').value != 0) {
      if (!ct.startedTest) {
        ct.startedTest = true;
        ct.timer = setInterval(() => {
          ct.countDown();
        }, 1000);
      }
    }
    let checkSpace = false;
    if (event.keyCode == 32) {
      let value = document.getElementById('typeBox').value;
      // console.log("inputted word is " + value);
      let words = ct.getWords(value);
      checkSpace = ct.analyzeWords(words);
    }
    if (!checkSpace) {
      let word = document.getElementById('typeBox').value;
      let result = ct.analyzeSubstrings(word, ct.currentWords[0]);
      if (event.keyCode != 8) { // Ignore backspace characters in accuracy
        if (result) ct.correctChars += 1;
        else ct.missedChars += 1;
      }
    }
  });
}
