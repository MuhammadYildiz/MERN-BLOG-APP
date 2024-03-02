/* Require node js packages */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")
/* require routers from routes */
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postsRouter");
const commentRouter = require("./routes/commentsRouter");
const multer = require("multer");
const path = require("path");
/* create server app use express*/
const app = express()
/*Create Middleware for server */
const dotenv = require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/images", express.static(path.join(__dirname,"/images")))
/* image upload use multer */
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, 'images');
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);
    }
});
const upload = multer({ storage: storage });
/* upload image to images storage use  app.post method */
app.post('/api/upload', upload.single('file'), (req, res) => {
    return res.status(200).json({ message: 'Image has been uploaded successfully!' });
});
/* Auth Router */
app.use("/api/auth", authRouter)
/* user router */
app.use("/api/users", userRouter)
/* Blog posts router */
app.use("/api/posts", postRouter) /* for blog */
/* blog comments router */
app.use("/api/comments", commentRouter) /* for blog */
/* Connect to MongoDB with server */
/* user mongoDB url get from .env file */
mongoose.connect(process.env.MongoDB_URL)
    .then(() => {
        console.log("Project connected with MongoDB database");
        /* Connect with server Port */
        /* user server port  get from .env file */
        app.listen(process.env.PORT, () => {
            console.log("Project working on port " + process.env.PORT);
        })
    }).catch((err) => {
        console.error(err)
    });

