/*
(Promise) gitHubLogin returns a Promise that contains the username of the user
currently signed into the website. This function performs a GET request with
GitHub's API for accessing user information. To access the user's information,
first check if the return value is null, and if not then access the data through
the returned Promise's .then((data) => {}) method. 
*/
function gitHubLogin() {
    if (!document.cookie.includes('github-token')) {
        return null;
    }
    return new Promise((resolve, reject) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            mode: 'cors',
            headers: {
                'Authorization': 'token ' + document.cookie.split(';')[0].split('=')[1]
            }
        };
        fetch('https://api.github.com/user', requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result).login))
        .catch(error => {
            console.log('error', error);
            reject(null);
        });
    });
}

// Functions outside of TypingTest class but relevant to it
/*
(JSON) getUserData performs a GET request to get data from the DynamoDB data
base for the given (String) user. Returns a JSON object containing records
for the user.
*/
async function getUserData(user) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors'
    };
    return new Promise((resolve, reject) => {
        fetch("https://4wiarmu0k6.execute-api.us-east-1.amazonaws.com/dev/?user=" + user, requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result)))
        .catch(error => console.log('error', error));
    });
}
