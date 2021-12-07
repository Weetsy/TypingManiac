const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

// Set custom application icon
app.use('/favicon.ico', express.static(`${__dirname}/icons/favicon.ico`));
/*
OAuth2 configuration data to use GitHub for logging into our application. The
client secret is stored in the OAUTHSECRET environment variable, so that will
need to be configured before the application can be used.
*/
const client = new AuthorizationCode({
  client: {
    id: '881d76238cc4707084a6',
    secret: process.env.OAUTHSECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  }
});

// Authorization uri definition
const authorizationUri = client.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'user',
  state: 'j!=.X6n%yyyeXz', // Random human-generated code :)
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri);
});

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/views/home.html`);
});

// Send JS and CSS files to the client
app.get('/home.css', function(req, res) {
  res.sendFile(`${__dirname}/css/home.css`);
});

app.get('/1000-words.js', function(req, res) {
  res.sendFile(`${__dirname}/scripts/1000-words.js`);
});

app.get('/TypingTest.js', function(req, res) {
  res.sendFile(`${__dirname}/scripts/TypingTest.js`);
});

app.get('/Scripts.js', function(req, res) {
  res.sendFile(`${__dirname}/scripts/Scripts.js`);
});

app.get('/Stats.js', function(req, res) {
  res.sendFile(`${__dirname}/scripts/Stats.js`);
});

/*
The GitHub login page is going to redirect us to the /callback route so that
NodeJS can send our authentication token to the front end. The authentication
token is saved to the client's web browser as a cookie to access their GitHub
profile information. After logging in the client is sent back to '/'.
*/
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const options = {
    code,
  };
  try {
    const accessToken = await client.getToken(options);
    res.cookie('github-token', accessToken.token.access_token);
    res.redirect('/');
  } catch (error) {
    console.error('Access Token Error', error.message);
    resolve(res.status(500).json('Authentication failed'));
  }
});

app.get('/stats', function(req, res) {
  res.sendFile(`${__dirname}/views/stats.html`);
});

app.post('/insertStats', jsonParser, function(req, res) {
  let user = req.body.User;
  let speed = req.body.WPM;
  let accuracy = req.body.Accuracy;

  // using built in JSON utility package turn object to string and store in a variable
  let raw = JSON.stringify({ 'User': user, 'WPM': speed, 'Accuracy': accuracy });
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw,
    redirect: 'follow'
  };
  // make API call with parameters and use promises to get response
  fetch('https://4wiarmu0k6.execute-api.us-east-1.amazonaws.com/dev', requestOptions)
    .then(response => response.text())
    .then(result => res.send(JSON.parse(result).body))
    .catch(error => console.log('error', error));
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
