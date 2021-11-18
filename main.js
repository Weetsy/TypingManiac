const express = require('express');
const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const fs = require('fs');
require('./passport');

app.use(cookieParser());
app.use(session({secret: 'mySec'}))

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    console.log(req.session)
    if(req.session.sessionID) {
        res.sendFile(`${__dirname}/views/home.html`);
    }
    else{
        res.redirect('/google');
    }
});

app.get('/home.css', function(req, res) {
    res.sendFile(`${__dirname}/css/home.css`);
})

app.get('/1000-words.js', function(req, res) {
    res.sendFile(`${__dirname}/scripts/1000-words.js`);
})

app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
));

app.get('/redirect', function(req, res) {
    res.redirect('/')
})

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
