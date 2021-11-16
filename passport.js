const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"676733473796-pevkcgn2kubj18dibge8ghkh8o25dqii.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://localhost:3000/redirect",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));