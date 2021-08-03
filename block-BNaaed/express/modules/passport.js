let passport = require('passport');
let GitHubStrategy = require('passport-github').Strategy;
let User = require('../models/user');

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        username: profile.username,
    }

    User.findOne({email: profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user) {
            User.create(profileData, (err, addedUser) => {
                if(err) return done(err);
                return done(null, addedUser);
            })
        }
        else {
            done(null, user);
        }
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});