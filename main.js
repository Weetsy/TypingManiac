const express = require('express');
const https = require('https')
const url = require('url');
const app = express();
const fs = require('fs');

app.get('/', function(req, res) {
    res.sendFile(`${__dirname}/views/home.html`);
});

app.get('/stats', function(req, res) {
    res.sendFile(`${__dirname}/views/stats.html`);
});

app.get('/home.css', function(req, res) {
    res.sendFile(`${__dirname}/css/home.css`);
});

app.get('/1000-words.js', function(req, res) {
    res.sendFile(`${__dirname}/scripts/1000-words.js`);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
