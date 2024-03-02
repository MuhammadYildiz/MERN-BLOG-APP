const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Post = require("../models/postModel.js")
const Comment = require("../models/commentsModel")
const verifyToken = require("../verifyToken.js")
const router = express.Router();

/* Get all users */
router.get("/", async (req, res) => {
    try {
        /* Find all users from the database */
        const allUsers = await User.find({});
        /* Hide all users' passwords in postman */
        const usersWithoutPasswords = allUsers.map(user => {
            const { password, ...info } = user._doc;
            return info;
        });
        /* Return all users without passwords */
        return res.status(200).json({ message: "Get all users is successful!", allUsers: usersWithoutPasswords });
    } catch (error) {
        console.error("Error during get user:", error);
        return res.status(500).json({ message: "Get user failed. Please try again !" });
    }
});

/* Get user By ID */
router.get("/:id", async (req, res)=>{
    try {
        /* Fine user from data base with id */
        const user = await User.findById(req.params.id)
        /* hide password in postman  */
        const {password,...info} = user._doc
        /* return user info without password */
        return res.status(200).json({ message: "Get user successful!", user:info });
    } catch (error) {
        console.error("Error during get user:", error);
        return res.status(500).json({ message: "Get user failed. Please try again !" });
    }
})
/* Update user by ID */
router.put("/:id", verifyToken, async (req, res) => {
    try {
        /* Control if the update password is provided */
        if (req.body.password) {
            /* If updating the password, create a new hashed password */
            const salt = await bcrypt.genSalt(10);
            req.body.password =  bcrypt.hashSync(req.body.password, salt);
        }
        /* Control if user info is found from the database and updated as new user info */
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        /* Control if the user is updated */
        if (!updateUser) {
            return res.status(404).json({ message: "User not found." });
        }
        /* Hide the updated user password */
        const { password, ...info } = updateUser._doc;
        /* Return the updated user without the password */
        return res.status(200).json({ message: "Update user successful!, please login again!", updateUser:info});
    } catch (error) {
        console.error("Error during update user:", error);

        /* Check for validation errors */
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "User update failed. Please try again!" });
    }
});

/* Delete user By ID */
router.delete("/:id",verifyToken, async (req, res) => {
    try {
        /* find user info  from database*/
        await User.findByIdAndDelete(req.params.id);
        /* find and delete also an other info about user  for example user posts or comments*/
        await Post.deleteMany({ userId: req.params.id })
        await Comment.deleteMany({ userId: req.params.id })
        /*  return deleted message */
        return res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json({ message: "User delete successful!" });
    } catch (error) {
        console.error("Error during Delete user:", error);
        return res.status(500).json({ message: "Delete user failed. Please try again !" });
    }
});
/* Delete all users */
router.delete("/", verifyToken, async (req, res) => {
    try {
        /* Delete all users from the database */
        const deleteResult = await User.deleteMany({});
        /* Return success message */
        return res.status(200).json({ message: "Delete all users is successful!", deletedCount: deleteResult.deletedCount });
    } catch (error) {
        console.error("Error during delete all users:", error);
        return res.status(500).json({ message: "Delete all users failed. Please try again !" });
    }
});
/* export user router */
module.exports = router;
