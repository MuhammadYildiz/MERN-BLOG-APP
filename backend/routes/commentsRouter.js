const express = require("express")
const User = require("../models/userModel");
const Post = require("../models/postModel.js")
const Comment = require("../models/commentsModel")
const verifyToken = require("../verifyToken.js")
const router = express.Router()

/* Create and  Post comment */
router.post("/create", verifyToken, async (req, res) => {
    try {
        /* Create new comment*/
        const newComment = new Comment(req.body)
        /* save new comment */
        const comment = await newComment.save()
        return res.status(200).json({ message: "Create and post new comment is successful!", comment });
    } catch (error) {
        console.error("Error during post comment:", error);
        return res.status(500).json({ message: "Post comment failed. Please try again !" });
    }
})
/* Get all comment Comments */
router.get("/", async (req, res) => {
    try {
        /* Find all comments from the database */
        const allComments = await Comment.find({}).sort({ createdAt: 1 });
        /* return all comments */
        return res.status(200).json({ message: "Get all Comments is successful!", allComments });
    } catch (error) {
        console.error("Error during get all Comments:", error);
        return res.status(500).json({ message: "Get all Comments is failed. Please try again!." });
    }
});

/* Get comment details  By ID */
router.get("/:id", async (req, res) => {
    try {
        /* Fine comment from data base with id */
        const comment = await Comment.findById(req.params.id)
        /* return  comment */
        return res.status(200).json({ message: "Get comment detailer is successful!", comment });
    } catch (error) {
        console.error("Error during get comment:", error);
        return res.status(500).json({ message: "Get comment post is failed. Please try again!." });
    }
})

/* Get user comments By user ID */
router.get("/post/:postId", async (req, res) => {
    try {
        /* Find comment from database with postId */
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        /* return comment */
        return res.status(200).json({ message: "Get users all  comments is  successful!", comments });
    } catch (error) {
        console.error("Error during get comment:", error);
        return res.status(500).json({ message: "Get comments is failed. Please try again!." });
    }
});
/* Update comment by ID */
router.put("/:id", verifyToken, async (req, res) => {
    try {
        /* control comments and find from database and update as a new comment post */
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        /* Control  updated comment*/
        if (!updatedComment) {
            return res.status(404).json({ message: "comment is not found for update." });
        }
        /* return updated comment */
        return res.status(200).json({ message: "Update comment successful!", updatedComment });
    } catch (error) {
        console.error("Error during Update comment:", error);
        return res.status(500).json({ message: "comment update is failed. Please try again!." });
    }
});
/* Delete comment By ID */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        /* find comment  from database*/
        await Comment.findByIdAndDelete(req.params.id);
        /*  return deleted message */
        return res.status(200).json({ message: "Delete comment is successfully!", });
    } catch (error) {
        console.error("Error during Delete comment:", error);
        return res.status(500).json({ message: "Delete comment failed. Please try again!" });
    }
});
/* Delete all comments */
router.delete("/", verifyToken, async (req, res) => {
    try {
        /* Delete all comments from the database */
        const deleteResult = await Comment.deleteMany({});
        /* Return success message */
        return res.status(200).json({ message: "Delete all comments is successful!", deletedCount: deleteResult.deletedCount });
    } catch (error) {
        console.error("Error during delete all comments:", error);
        return res.status(500).json({ message: "Delete all comments failed. Please try again!." });
    }
});
/* export user router */
module.exports = router;