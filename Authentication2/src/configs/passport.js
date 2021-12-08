const passport = require("passport");

const { uuid } = require('uuidv4');

const GoogleStrategy = require('passport-google-oauth2').Strategy;

const FacebookStrategy = require('passport-facebook').Strategy;

const { newToken } = require("../controllers/auth.controller");

require("dotenv").config();

const User = require("../models/user.model");

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:2345/auth/google/callback",
        userProfileURL: "https://**www**.googleapis.com/oauth2/v3/userinfo",
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        console.log("accessToken,refreshToken , Profile", accessToken, refreshToken, profile);

        let user = await User.findOne({ email: profile._json.email })
            .lean()
            .exec();
        if (!user) {
            user = await User.create({
                name: profile._json.name,
                email: profile._json.email,
                password: uuid(),
            });
        }
        const token = newToken(user);
        return done(null, { user, token });
    }
));

passport.use(new FacebookStrategy({
        clientID: "457453066003574",
        clientSecret: "b6e0fc4d91e07c4c823d04443a52bbc1",
        callbackURL: "http://localhost:2345/auth/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        console.log("accessToken,refreshToken , Profile", accessToken, refreshToken, profile);
        let user = await User.findOne({ email: profile._json.id })
            .lean()
            .exec();
        if (!user) {
            user = await User.create({
                name: profile._json.name,
                email: profile._json.id,
                password: uuid(),
            });
        }
        const token = newToken(user);
        return cb(null, { user, token });
    }
));

module.exports = passport;