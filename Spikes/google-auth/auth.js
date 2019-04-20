const GoogleStrategy = require('passport-google-oauth2')
    .OAuth2Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: "269537765601-01e2u9ms8p58b0flnru7ifiqmmagtp89.apps.googleusercontent.com",
        clientSecret: "Mp9vnNYjiZanmB-8VFKV_jo6",
        callbackURL: '/auth/google/callback'
    }, (token, refreshToken, profile, done) => {
        return done(null, {
            profile: profile,
            token: token
        });
    }));
};