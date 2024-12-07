const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// To get user profile
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id })
        .select("-password")
        .populate("followers", "_id name") // Populate followers if needed
        .populate("following", "_id name"); // Populate following if needed
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await POST.find({ postedBy: req.params.id }).populate("postedBy", "_id");
        res.status(200).json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the user profile" });
    }
});

// To follow a user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        const followUser = await USER.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, { new: true });

        if (!followUser) {
            return res.status(404).json({ error: "User to follow not found" });
        }

        const currentUser = await USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true });

        res.json(currentUser);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: "An error occurred while following the user" });
    }
});

// To unfollow a user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        const unfollowUser = await USER.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user._id }
        }, { new: true });

        if (!unfollowUser) {
            return res.status(404).json({ error: "User to unfollow not found" });
        }

        const currentUser = await USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, { new: true });

        res.json(currentUser);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: "An error occurred while unfollowing the user" });
    }
});

// To upload a profile picture
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(req.user._id, {
            $set: { Photo: req.body.pic }
        }, { new: true });

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: "An error occurred while updating the profile picture" });
    }
});


module.exports = router;