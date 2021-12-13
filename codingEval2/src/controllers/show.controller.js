const express = require("express");
const Show = require("../models/show.model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, async(req, res) => {
    try {
        const show = await Show.create(req.body);
        return res.status(201).send(show);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

router.get("/", async(req, res) => {
    try {
        const shows = await Show.find().lean().exec();
        return res.status(201).send(shows);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});


module.exports = router;