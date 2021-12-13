const express = require("express");
const Theatre = require("../models/theatre.model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, async(req, res) => {
    try {
        const theatre = await Theatre.create(req.body);
        return res.status(201).send(theatre);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});


module.exports = router;