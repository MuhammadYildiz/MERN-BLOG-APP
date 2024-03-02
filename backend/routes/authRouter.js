/* Require node packages */
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const validator = require("validator")
/* require user model  */
const User = require("../models/userModel");
/* Create express router */
const router = express.Router();
/* Register , Create  User*/
router.post("/register", async (req, res) => {
    try {
        const { username, email } = req.body
        /* Control inputs */
        if (!username) {
            return res.status(400).json({ message: "Please enter an user name." });
        }
        if (!email) {
            return res.status(400).json({ message: "Please enter an user email." });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Please enter an user password." });
        }
        /* Valid email type is email or not */
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email." });
        }
        /* Valid password is strong or not */
        if (!validator.isStrongPassword(req.body.password)) {
            return res.status(400).json({ message: "Please enter a strong password! (Uppercase,lowercase,numbers and characters!)" })
        }
        /* Control user already have a account or not   */
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already have an account. Please login." });
        }
        /* Create a salt for use hashed password */
        const salt = await bcrypt.genSalt(10)
        /* Create hashed password */
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)
        /* Create new user */
        const newUser = new User({ username, email, password: hashedPassword })
        /* save new user */
        const savedNewUser = await newUser.save()
        /*  Create and get secret key for token use node*/
        /* 1. open new terminal and write: node
        2. require('crypto').randomBytes(64).toString('hex');
        3. write in .env file : TOKEN_SECRET_KEY ='bea5570a34e356c4ece45f4f46ccee3faeb143b6bd2d08465c9c536d034805d580cd3a05b13f8aed256938a53d4a32c181fade047dc221c4065eebbadbcc150b' */
        const secretKey = process.env.TOKEN_SECRET_KEY;
        /* Create new user token */
        const token = jwt.sign({ id: savedNewUser._id, username: savedNewUser.username, email: savedNewUser.email }, secretKey, { expiresIn: "3d" })
        /* Hide hashed password in postman */
        const { password, ...info } = savedNewUser._doc
        /* return saved new user info */
        /* res.cookie("token", token)  for save token in cookie*/
        return res.cookie("token", token).status(200).json({ message: "Register successful!", savedNewUser: info, token })

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Used user name . Please enter an other user name !" });
    }
})
/* Login */
router.post("/login", async (req, res) => {
    try {
        /* Get email and password from body as user from users input*/
        const { email } = req.body
        /* Control user input infos */
        if (!req.body.email) {
            return res.status(400).json({ message: "Please enter an user email." });
        }
        /* Control email type is a email or not */
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: "Please enter a valid email." });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Please enter an user password." });
        }
        /* Control user is have an account or not */
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Invalid user credentials, pleaser register!" })
        }
        /* Control user password */
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: "Wrong credentials password!" })
        }
        /*  Create and get secret key for token*/
        const secretKey = process.env.TOKEN_SECRET_KEY || "yourSecretKey";
        /* Create user token */
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secretKey, { expiresIn: "3d" })
        /* for not show hashed password in Postman */
        const { password, ...info } = user._doc; /* Hide password in user info */
        return res.cookie("token", token).status(200).json({ message: "Login successful!", user: info, token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Login failed. Please try again !" });
    }
})

/* Logout */
router.post("/logout", async (req, res) => {
    try {
        // Implement secure cookie options
        return res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json({ message: "User logout successful!" });

    } catch (error) {
        console.error("Error during Logout:", error);
        return res.status(500).json({ message: "Logout failed. Please try again !" });
    }
})

/* Refetch user */
router.get("/refetch", (req, res) => {
    const token = req.cookies.token
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, {}, async(err, data)=>{
        if(err){
            return res.status(401).json({ message: "Wrong credentials !", err })
        }
        return res.status(200).json({ message: "Refetch successful!",  data})
    })
})
/* export auth router */
module.exports = router
