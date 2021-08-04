var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    var email = profile._json.email;

    var githubData = {
        email: email,
        providers: [profile.provider],
        github: {
            name: profile.displayName,
            username: profile.username,
            image: profile._json.avatar_url
        }
    }

    User.findOne({email}, (err, user) => {
        if(err) return done(err, false);
        if(!user) {
            User.create(githubData, (err, addedUser) => {
                if(err) return done(err, false);
                return done(null, addedUser);
            })
        }
        else {
            if(user.providers.includes(profile.provider)) {
                return done(null, user);
            } else {
                user.providers.push(profile.provider);
                user.github = {...githubData.github},
                user.save((err, updatedData) => {
                    if(err) return done(err, false);
                    return done(null, updatedData);
                })
            }
        }
    })

}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    var email = profile._json.email;
    var googleData = {
        email: email,
        providers: [profile.provider],
        google: {
            name: profile._json.name,
            image: profile._json.picture
        }
    }
    User.findOne({email}, (err, user) => {
        if(err) return done(err, false);
        if(!user) {
            User.create(googleData, (err, addedUser) => {
                if(err) return done(err, false);
                return done(null, addedUser);
            })
        } else {
            if(user.providers.includes(profile.provider)) {
                return done(null, user);
            } else {
                user.providers.push(profile.provider);
                user.google = {...googleData.google};
                user.save((err, updatedData) => {
                    if(err) return done(err, false);
                    return done(null, updatedData);
                })
            }
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});