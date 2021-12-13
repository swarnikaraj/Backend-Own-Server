const express = require("express");
const Seat = require("../models/seat.model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, async(req, res) => {
    try {
        const show = await Seat.findOne({ show: req.body.show }).lean().exec();

        if (show) {
            return res.status(401).json({
                status: "failed",
                message: "You have already booked this show",
            });
        }
        const seat = await Seat.create(req.body);
        return res.status(201).send(seat);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

router.get("/", async(req, res) => {
    try {
        const seats = await Seat.find().lean().exec();
        return res.status(201).send(seats);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});


module.exports = router;