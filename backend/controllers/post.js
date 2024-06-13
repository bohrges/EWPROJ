const mongoose = require("mongoose");
const Post = require("../models/post"); 

/* Function to get all posts */
module.exports.getPosts = () => {
    return Post
        .find()
        .exec()
}

/* Function to get a single post */
module.exports.getPost = (id) => {
    return Post
        .findOne({_id: id})
        .exec()
}

/* Function to insert a post */
module.exports.insertPost = (post) => {
    var newPost = new Post(post)
    return newPost.save()
    
}

/* Function to add a comment to a post */
module.exports.addComment = (id, comment) => {
    return Post
        .findOneAndUpdate({_id: id}, {$push: {Comments: comment}})
        .exec()
        .then(result => {
            if (!result) {
                throw new Error('Post not found');
            }
            return result;
        })
        .catch(err => {
            console.error('Error updating post:', err);
            throw err;
        });
}

/* Function to delete a post */
module.exports.deletePost = id => {
    return Post
        .deleteOne({_id: id})
        .exec()
}

/* Function to delete a comment from a post */
module.exports.deleteComment = (id, commentId) => {
    return Post
        .updateOne(
            { _id: id },
            { $pull: { Comments: { _id: commentId } } }
        )
        .exec()
}

/* Function to get the maximum post id */
module.exports.getMaxId = async () => {
    const max_Id = await Post.find({}, {_id: 1}).sort({_id: -1}).limit(1);
    return max_Id[0]._id
}

/* Function to get all posts related to a specific record */
module.exports.getPostsByInqId = inqId => { 
    return Post
        .find({InqId: inqId})
        .exec()
}




