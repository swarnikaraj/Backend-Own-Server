const express = require("express");

const sendMail = require("../utils/send-mail");

const router = express.Router();

const User = require("../models/user.model");

const admin = [
    "a1@gmail.com",
    "a2@gmail.com",
    "a3@gmail.com",
    "a4@gmail.com",
    "a5@gmail.com"
]

router.post("/", async(req, res) => {
    try {
        const adduser = await User.create(req.body);

        sendMail("bhanu@sender.com", "anand@rec.com", `Welcome to ABC system ${req.body.first_name} ${req.body.last_name}`,
            `Hi ${req.body.first_name}, Please confirm your email address`,
            `<h3>Hi ${req.body.first_name}, Please confirm your email address</h3>`,
        );
        sendMail("bhanu@sender.com", admin, `${req.body.first_name} ${req.body.last_name} has registered with us`,
            `Please Welcome ${req.body.first_name} ${req.body.last_name}`,
            `<h1>Please Welcome ${req.body.first_name} ${req.body.last_name}</h1>`,
        )

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