const express = require("express");

const { register, login } = require("./controllers/auth.controller");
const postController = require("./controllers/post.controller");

const passport = require("./configs/passport");

const app = express();

app.use(express.json());

app.use(passport.initialize());

passport.serializeUser(function({ user, token }, done) {
    done(null, { user, token });
});
passport.deserializeUser(function(user, done) {
    done(err, user);
});


// app.use("/users", userController) // /register /login
app.post("/register",

    register);

app.post("/login", login);

// Google Authentication
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/google/failure",
    }),
    function(req, res) {
        return res.status(201).json({ user: req.user, token: req.user.token });
    }
);

app.get("/auth/google/failure", function(req, res) {
    return res.send("Something went wrong");
});

// Facebook Authentiction

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/auth/facebook/failure",
    }),
    function(req, res) {
        return res.status(201).json({ user: req.user, token: req.user.token });
    }
);

app.get("/auth/facebook/failure", function(req, res) {
    return res.send("Something went wrong");
});


app.use("/post", postController);

module.exports = app;