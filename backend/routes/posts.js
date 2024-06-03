var express = require('express');
var router = express.Router();
var Post = require("../controllers/post")


/* GET all posts */
router.get('/', function(req, res, next) {
    Post.getPosts()
    .then(posts => {
        res.jsonp(posts);
    })
    }
);


/* GET automated ID before adding a new post */
router.get('/postID', function(req, res, next) {
    Post.getMaxId()
    .then((data) => {
      res.jsonp(data)
    }).catch((erro) => {
      res.jsonp(erro)
    });
  });

  

/* GET a single post */
router.get('/:id', function(req, res, next) {
    Post.getPost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

/* POST a single post */
router.post('/', function(req, res, next) {
    Post.insertPost(req.body)
    .then(post => {
        res.jsonp(post);
    })
    }
);

/* POST a single comment on a post */
router.post('/:id/add-comment/', function(req, res, next) {
    console.log("aqui")
    console.log(req.params.id)
    console.log(req.body)
    Post.addComment(req.params.id, req.body)
    .then(post => {
        res.jsonp(post);
    })
    }
);

/* DELETE a single post */
router.delete('/:id', function(req, res, next) {
    Post.deletePost(req.params.id)
    .then(post => {
        res.jsonp(post);
    })
    }
);

module.exports = router;