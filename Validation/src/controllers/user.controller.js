const express = require("express");

const { body, validationResult } = require('express-validator');

const router = express.Router();

const User = require("../models/user.model");

router.post("/",
    // first Name validation
    body('first_name').isLength({ min: 1 })
    .withMessage("Enter the First Name"),

    // Last Name validation
    body('last_name').isLength({ min: 1 })
    .withMessage("Enter the last Name"),

    // Email validation
    body('email').custom(async(value) => {
        const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        if (!isEmail) {
            throw new Error("Please enter proper email");
        }
    }),

    // Pincode validation
    body('pincode').isLength({ min: 6, max: 6 })
    .withMessage("Pincode should be exactly 6 digits"),

    // Age validation
    body('age').isLength({ min: 1, max: 100 })
    .withMessage("Age should be between 1 to 100"),

    // Gender validation
    body('gender')
    .isLength({ min: 1 })
    .isIn(['Male', 'Female', 'Others'])
    .withMessage("Enter gender type like Male,Female or Others"),

    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const adduser = await User.create(req.body);

            return res.status(201).json({ adduser });
        } catch (e) {
            return res.status(500).json({ status: "failed", message: e.message });
        }
    });

router.get("/", async(req, res) => {
    try {
        const page = +req.query.page || 1;
        const size = +req.query.size || 2;

        const offset = (page - 1) * size;

        const users = await User.find().skip(offset).limit(size).lean(size).catch();

        const totalPage = Math.ceil(
            (await User.find().countDocuments()) / size
        );

        return res.send({ users, totalPage });
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

module.exports = router;