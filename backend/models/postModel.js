const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc : {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: false,
    },
    categories:{
        type: Array,
        required: false,
    }
}, {timestamps: true})
const Post = mongoose.model("Post", postSchema);
module.exports = Post;