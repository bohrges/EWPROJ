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

    // Fetch additional details for each post using Promise.all to handle multiple requests
    let detailsPromises = posts.map(post => {
      return axios.get(`http://localhost:3000/${post.InqId}`);
    });

    // Resolve all promises to get details
    let detailsResponses = await Promise.all(detailsPromises);

    // Combine post data with additional details
    let combinedPosts = posts.map((post, index) => {

      // Assume detailsResponse data includes fields 'Name' and 'UnitDateFinal' and 'Location'
      let details = detailsResponses[index].data;
      return {
        ...post, // spread existing post data
        Name: details.Name,
        Date: details.UnitDateFinal,
        Location: details.Location
      };
    });

    // Render the posts template with combined data
    res.render('posts', {
      posts: combinedPosts,
      titulo: "Lista de Posts"
    });
  } catch (erro) {
    // Handle errors such as network issues or missing data
    res.render('error', {
      error: erro,
      message: "Erro ao recuperar os posts ou detalhes das inquirições"
    });
  }
});


/* GET view to add a new post */
router.get('/newPost', function(req, res, next) {
    res.render('newPost', {data: d, titulo: "Adicionar novo Post"})
  });

/* POST new record */
router.post('/newPost', function(req, res, next) {
  axios.post('http://localhost:3000/posts/', req.body)
    .then(resposta => {
      res.redirect('http://localhost:3001/posts/')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao adicionar o genere"})
    })
});




  module.exports = router;
  