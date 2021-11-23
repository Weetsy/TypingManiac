const express = require('express');
const https = require('https')
const url = require('url');
const app = express();
const fs = require('fs');

/*
async function getUserGraph(user) {
    const options = {
        hostname: "4wiarmu0k6.execute-api.us-east-1.amazonaws.com",
        path: "/dev/?user=" + user,
        //hostname: "reqres.in",
        //path: "/api/user?page=2",
        method: 'GET'
    }
    return new Promise((resolve, reject) => {
        let req = https.request(options, res => {
            res.on('data', data=> {
                resolve(Buffer.from(data).toString());
            })
        });

        req.on('error', error => {
            resolve(error);
        })
        req.end();
    });
}
*/

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

/*
app.get('/getStats', async function(req, res) {
    let user = url.parse(req.url, true).query.user;
    let graph = await getUserGraph(user);
    console.log(graph);
    res.send(graph);
});
*/

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
