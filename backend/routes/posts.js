var express = require('express');
var router = express.Router();
var Post = require("../controllers/post")


// GET all posts 
router.get('/', function(req, res, next) {
    if (req.query.inqid) {
        Post.getPostsByInqId(req.query.inqid)
        .then(posts => {
            res.jsonp(posts);
        })
    }
    else {
        Post.getPosts()
        .then(posts => {
            res.jsonp(posts);
        })
    }
    }
);


// GET automated ID before adding a new post 
// This is used to get the next ID to be used when adding a new post 
router.get('/postID', function(req, res, next) {
    Post.getMaxId()
    .then((data) => {
      res.jsonp(data)
    }).catch((erro) => {
      res.jsonp(erro)
    });
  });

// GET automateed ID before adding a new comment
// This is used to get the next ID to be used when adding a new comment
router.get('/commentID', function(req, res, next) {
    Post.getMaxCommentId()
    .then((data) => {
      res.jsonp(data)
    }).catch((erro) => {
      res.jsonp(erro)
    });
  });


// GET a single post 
router.get('/:id', function(req, res, next) {
    Post.getPost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

// POST a single post 
router.post('/', function(req, res, next) {
    Post.insertPost(req.body)
    .then(post => {
        res.jsonp(post);
    })
    }
);

// POST a single comment on a post 
router.post('/:id/add-comment/', function(req, res, next) {
    Post.addComment(req.params.id, req.body)
    .then(post => {
        res.jsonp(post);
    })
    }
);

// DELETE a single post 
router.delete('/:id', function(req, res, next) {
    Post.deletePost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

// DELETE a single comment on a post 
router.delete('/:id/delete-comment/:commentId', function(req, res, next) {
    console.log("deleting comment")
    Post.deleteComment(req.params.id, req.params.commentId)
    .then(post => {
        res.jsonp(post);
    })
    }
);

module.exports = router;