const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

const client = new AuthorizationCode({
    client: {
        id: '881d76238cc4707084a6',
        secret: '3ea5b4c93afd6d1be0c6de15735c70bf4fd21a77'
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
    state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});

app.get('/login', function(req, res) {
    res.send('Hello<br><a href="/auth">Log in with Github</a>');
    //res.sendFile(`${__dirname}/views/home.html`);
});

app.get('/', function(req, res) {
    //res.send('Hello<br><a href="/auth">Log in with Github</a>');
    res.sendFile(`${__dirname}/views/home.html`);
});

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

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
      code,
    };
    try {
      const accessToken = await client.getToken(options);
      console.log(accessToken.token.access_token);
      res.cookie('github-token', accessToken.token.access_token);
      res.redirect('/');
    } catch (error) {
      console.error('Access Token Error', error.message);
      resolve(res.status(500).json('Authentication failed'));
    }
  });

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
