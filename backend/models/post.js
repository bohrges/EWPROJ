const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    _id: String,
    UserId: String,
    CommentText: String
  });
 
// Main schema for a post
const postSchema = new Schema({
    _id: String,
    UserId: String,
    InqId: String,
    PostTitle: String,
    PostText: String,
    Comments: [commentsSchema]
}, {
    versionKey: false}
);

const Post = mongoose.model('posts', postSchema);

module.exports = Post;