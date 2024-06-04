var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)

/* GET posts page */
router.get('/', async function(req, res, next) {
  try {
    // Fetch all posts
    let postResponse = await axios.get('http://localhost:3000/posts');
    let posts = postResponse.data;

    // For each post, fetch info about the corresponding inquiry 
    let detailsPromises = posts.map(post => {
      return axios.get(`http://localhost:3000/${post.InqId}`);
    });
    let detailsResponses = await Promise.all(detailsPromises);

    // Combine the data
    let combinedPosts = posts.map((post, index) => {
      let details = detailsResponses[index].data;
      return {
        ...post, // spread existing post data
        Name: details.Name,
        Date: details.UnitDateFinal,
        Location: details.Location
      };
    });

    res.render('posts', {
      posts: combinedPosts,
      titulo: "Lista de Posts"
    });
  } catch (erro) {
    res.render('error', {
      error: erro,
      message: "Erro ao recuperar os posts ou detalhes das inquirições"
    });
  }
});


/* GET view to add a new post */
router.get('/newPost', function(req, res, next) {
  // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
  axios.get('http://localhost:3000/posts/postId')
    .then(resposta => {
      const id = parseInt(resposta.data)
      const newId = (id + 1).toString()
      console.log(newId)
      res.render('newPost', {data: d, titulo: "Adicionar novo Post", postID: newId})
    })
});


router.post('/newPost', async (req, res) => {
  try {
    // Fetch the list of all InqIds
    const response = await axios.get('http://localhost:3000/allids');
    const ids = response.data;
    const id = req.body.InqId;
    // Check if the submitted InqId exists
    if (!ids.includes(id)) {
      res.render('nonExistingInqId');
      return;
    }
    // If the InqId exists, proceed to create a new post
    const postResponse = await axios.post('http://localhost:3000/posts/', req.body);
    res.redirect('http://localhost:3001/posts/');
  } catch (error) {
    res.render('error', {error: error, message: "Erro ao processar o pedido"});
  }
});


/* POST new comment */
router.post('/:id/add-comment', function(req, res, next) {
  console.log(req.params.id)
  console.log(JSON.stringify(req.body))
  axios.post(`http://localhost:3000/posts/${req.params.id}/add-comment`, req.body)
    .then(response => {
        res.redirect('http://localhost:3001/posts')
    })
    .catch(error => {
        res.render('error', {error: error, message: "Erro ao adicionar o comentário"})
    });
});



module.exports = router;
  

