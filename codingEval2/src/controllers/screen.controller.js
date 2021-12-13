const express = require("express");
const Screen = require("../models/screen.model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, async(req, res) => {
    try {
        const screen = await Screen.create(req.body);
        res.status(201).send(screen);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});


module.exports = router;