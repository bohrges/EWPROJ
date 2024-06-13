const mongoose = require("mongoose");
const Post = require("../models/post"); 

// Get all posts 
module.exports.getPosts = () => {
    return Post
        .find()
        .exec()
}

// Get a single post 
module.exports.getPost = (id) => {
    return Post
        .findOne({_id: id})
        .exec()
}

// Insert a post
module.exports.insertPost = (post) => {
    var newPost = new Post(post)
    return newPost.save()
    
}

// Add a comment to a post 
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

// Delete a post 
module.exports.deletePost = id => {
    return Post
        .deleteOne({_id: id})
        .exec()
}

// Delete a comment from a post 
module.exports.deleteComment = (id, commentId) => {
    return Post
        .updateOne(
            { _id: id },
            { $pull: { Comments: { _id: commentId } } }
        )
        .exec()
}

// Get the maximum post id 
module.exports.getMaxId = async () => {
    const max_Id = await Post.find({}, {_id: 1}).sort({_id: -1}).limit(1);
    return max_Id[0]._id
}

// Get the maximum comment id
module.exports.getMaxCommentId = async function getMaxCommentId() {
    try {
      const result = await Post.aggregate([
        { $unwind: '$Comments' }, 
        { $group: {
          _id: null,
          maxCommentId: { $max: '$Comments._id' } 
        }}
      ]);
      if (result.length > 0) {
        console.log('Max Comment ID:', result[0].maxCommentId);
        return result[0].maxCommentId;
      } else {
        console.log('No comments found');
        return null;
      }
    } catch (err) {
      console.error('Failed to retrieve maximum comment ID:', err);
      return null;
    }
  }
  
// Get all posts related to a specific record 
module.exports.getPostsByInqId = inqId => { 
    return Post
        .find({InqId: inqId})
        .exec()
}