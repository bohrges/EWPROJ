const mongoose = require("mongoose");
const Post = require("../models/post"); 

module.exports.getPosts = () => {
    return Post
        .find()
        .exec()
}

module.exports.getPost = (id) => {
    return Post
        .findOne({_id: id})
        .exec()
}

module.exports.insertPost = (post) => {
    var newPost = new Post(post)
    return newPost.save()

}

module.exports.deletePost = id => {
    return Post
        .deleteOne({_id: id})
        .exec()
}
