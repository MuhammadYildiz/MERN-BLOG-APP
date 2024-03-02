const express = require("express")
const User = require("../models/userModel");
const Post = require("../models/postModel.js")
const Comment = require("../models/commentsModel.js")
const verifyToken = require("../verifyToken.js")
const router = express.Router()

/* Create and  Post Blog */
router.post("/create", verifyToken, async (req, res) => {
    try {
        /* Create new blog post */
        const newPostBlog = new Post(req.body)
        /* save new Blog */
        const savedPostBlog = await newPostBlog.save()
        return res.status(200).json({ message: "Create and post new blog is successful!", savedPostBlog });
    } catch (error) {
        console.error("Error during post blog:", error);
        return res.status(500).json({ message: "Post blog failed. Please try again !" });
    }
})
/* Get all blog posts */
router.get("/", async (req, res) => {
    try {
        /* Extract the search parameter from the query */
        const searchQuery = req.query.search;
        /* Create a regex search filter if the search parameter is provided */
        const searchFilter = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, 'i') } }
            : {};
        /* Find all blogs from the database with or without the search filter */
        const posts = await Post.find(searchFilter).sort({ createdAt: -1 });
        /* Find all blogs from the database with search filter */
        /* Return all blogs */
        return res.status(200).json({ message: "Get all posts is successful!", posts });
    } catch (error) {
        console.error("Error during get all posts:", error);
        return res.status(500).json({ message: "Get all posts is failed. Please try again !" });
    }
});

/* Get  blog posts with search*/
router.get("/search", async (req, res) => {
    const query = req.query
    try {
        /* create and filter  search team */
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }, /* $options: "i" change search title to loverCase */
        }
        /* Control search is empty or not */
        if (!query.search) {
            return res.status(404).json({ message: "Search title is empty. Please enter a search title !" });
        }
        /* Find all blogs from the database with search filter */
        const searchPosts = await Post.find(searchFilter);
        if (searchPosts.length === 0) {
            return res.status(404).json({ message: "Search title is not fount. Please try again !" });
        }
        /* return all blogs */
        return res.status(200).json({ message: "Search posts is successful!", searchPosts, searchFilter });
    } catch (error) {
        console.error("Error during search posts:", error);
        return res.status(500).json({ message: "Search posts is failed. Please try again !" });
    }
});

/* Get post details  By ID */
router.get("/:id", async (req, res) => {
    try {
        /* Fine blog from data base with id */
        const post = await Post.findById(req.params.id)
        /* return  blog */
        return res.status(200).json({ message: "Get post detailer is successful!", post });
    } catch (error) {
        console.error("Error during get post:", error);
        return res.status(500).json({ message: "Get blog post is failed. Please try again !" });
    }
})

/* Get user post By user ID */
router.get("/user/:userId", async (req, res) => {
    try {
        /* Find blog from database with userId */
        const posts = await Post.find({ userId: req.params.userId });
        /* return blog */
        return res.status(200).json({ message: "Get users all  post is  successful!", posts });
    } catch (error) {
        console.error("Error during get post:", error);
        return res.status(500).json({ message: "Get blog post failed. Please try again !" });
    }
});
/* Update Blog by ID */
router.put("/:id", verifyToken, async (req, res) => {
    try {
        // Find existing post by ID
        const existingPost = await Post.findById(req.params.id);
        // Check if a new file is provided
        if (req.body.photo && req.body.photo !== existingPost.photo) {
            // Handle file update logic (e.g., delete old file, save new file)
            // ...
            // Update the post with the new file name
            existingPost.photo = req.body.photo;
        }
        // Update other fields in the post
        existingPost.title = req.body.title;
        existingPost.desc = req.body.desc;
        existingPost.categories = req.body.categories;
        // Save the updated post
        const updatedBlog = await existingPost.save();
        // Alternatively, you can use the following code if you prefer the update with findByIdAndUpdate
        // const updatedBlog = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        // Control if the updated blog is not found
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog is not found for update." });
        }
        // Return the updated blog
        return res.status(200).json({ message: "Update Blog successful!", updatedBlog });
    } catch (error) {
        console.error("Error during Update blog:", error);
        return res.status(500).json({ message: "Blog update is failed. Please try again !" });
    }
});

/* Delete blog By ID */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        /* find blog  from database*/
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ postId: req.params.id })
        /*  return deleted message */
        return res.status(200).json({ message: "Delete blog is successfully!", });
    } catch (error) {
        console.error("Error during Delete blog:", error);
        return res.status(500).json({ message: "Delete blog failed. Please try again !" });
    }
});
/* Delete all blogs */
router.delete("/", verifyToken, async (req, res) => {
    try {
        /* Delete all blogs from the database */
        const deleteResult = await Post.deleteMany({});
        /* Return success message */
        return res.status(200).json({ message: "Delete all blogs is successful!", deletedCount: deleteResult.deletedCount });
    } catch (error) {
        console.error("Error during delete all blogs:", error);
        return res.status(500).json({ message: "Delete all blogs failed. Please try again !" });
    }
});


/* export user router */
module.exports = router;