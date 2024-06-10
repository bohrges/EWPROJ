var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)

// aux function to check if user is logged in
async function checkLogin(req, res) {
  console.log("aux function to check if user is logged in");
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const response = await axios.get(`http://localhost:3000/users?token=${token}`);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

/* GET posts page */
router.get('/', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
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
          ...post, 
          Name: details.Name,
          Date: details.UnitDateFinal,
          Location: details.Location
        };
      });
      res.render('posts', {
        posts: combinedPosts,
        titulo: "Lista de Posts",
        data: d
      });
    } catch (erro) {
      res.render('error', {
        error: erro,
        message: "Erro ao recuperar os posts ou detalhes das inquirições"
      });
    }
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


/* GET view to add a new post */
router.get('/newPost', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
    axios.get('http://localhost:3000/posts/postId')
      .then(resposta => {
        const id = parseInt(resposta.data)
        const newId = (id + 1).toString()
        console.log(newId)
        res.render('newPost', {data: d, titulo: "Adicionar novo Post", postID: newId})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao adicionar o post"})
      })
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


/* POST a new post  */
router.post('/newPost', async (req, res) => {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {

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
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


/* POST new comment from the record page*/
router.post('/:post_id/add-comment-genere/:record_id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    console.log(JSON.stringify(req.body))
    console.log("abcd")
    console.log(req.params.post_id)
    console.log(req.params.record_id)
    axios.post(`http://localhost:3000/posts/${req.params.post_id}/add-comment`, req.body)
      .then(response => {
          res.redirect(`http://localhost:3001/${req.params.record_id}`) // need second parameter to redirect to the correct page
      })
      .catch(error => {
          res.render('error', {error: error, message: "Erro ao adicionar o comentário"})
      });
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


/* POST new comment from the Posts page*/
router.post('/:id/add-comment', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    console.log(req.params.id)
    console.log(JSON.stringify(req.body))
    axios.post(`http://localhost:3000/posts/${req.params.id}/add-comment`, req.body)
      .then(response => {
          res.redirect('http://localhost:3001/posts')
      })
      .catch(error => {
          res.render('error', {error: error, message: "Erro ao adicionar o comentário"})
      });
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});



module.exports = router;
  

