const express = require("express");

const Post = require("../models/post.model");

const authenticate = require("../middlewares/authenticate");

const authorise = require("../middlewares/authorise");

const router = express.Router();

router.post("/", authenticate, authorise(['author', 'admin']), async(req, res) => {
    try {
        const user = req.user;

        const post = await Post.create({
            title: req.body.title,
            body: req.body.body,
            user: user.user._id,
        });

        return res.status(201).json({ post });
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

// Delete the post
router.delete("/post-id=:id", authenticate, authorise(['author', 'admin']), async(req, res) => {
    try {
        const dltPost = await Post.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).send(dltPost);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});

// Update the post
router.patch("/post-id=:id", authenticate, authorise(['author', 'admin']), async(req, res) => {
    try {
        const upPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, }).lean().exec();
        res.status(201).send(upPost);
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
});
// Find All
router.get("/", authenticate, async(req, res) => {
    const posts = await Post.find().lean().exec();

    return res.send(posts);
});

module.exports = router;