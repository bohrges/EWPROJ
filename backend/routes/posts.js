var express = require('express');
var router = express.Router();
var Post = require("../controllers/post")


/* GET posts */
router.get('/', function(req, res, next) {
    Post.getPosts()
    .then(posts => {
        res.jsonp(posts);
    })
    }
);

/* GET post */
router.get('/:id', function(req, res, next) {
    Post.getPost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

/* POST post */
router.post('/', function(req, res, next) {
    Post.insertPost(req.body)
    .then(post => {
        res.jsonp(post);
    })
    }
);

/* DELETE post */
router.delete('/:id', function(req, res, next) {
    Post.deletePost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

module.exports = router;