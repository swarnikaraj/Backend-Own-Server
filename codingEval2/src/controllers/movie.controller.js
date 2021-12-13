const express = require("express");
const Movie = require("../models/movie.model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, async(req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).send(movie);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

router.get("/", async(req, res) => {
    try {
        const movies = await Movie.find().lean().exec();
        res.status(201).send(movies);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

module.exports = router;