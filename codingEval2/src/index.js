const express = require("express");

const { register, login } = require("./controllers/auth.controllers");

const movieController = require("./controllers/movie.controller");
const screenController = require("./controllers/screen.controller");
const seatController = require("./controllers/seat.controller");
const showController = require("./controllers/show.controller");
const theatreController = require("./controllers/theatre.controller");

const app = express();

app.use(express.json());

app.post("/register", register);

app.post("/login", login);

app.use("/movie", movieController);
app.use("/screen", screenController);
app.use("/seat", seatController);
app.use("/show", showController);
app.use("/theatre", theatreController);
module.exports = app;