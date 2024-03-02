const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  // other fields...
},{timestamps:true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
