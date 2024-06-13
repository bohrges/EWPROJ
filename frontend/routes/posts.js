var express = require('express');
var router = express.Router();
var axios = require('axios')

// Aux functions
const {getCurrentFormattedDate, getCurrentFormattedDateV2, checkLevel, checkLogin, getUsername} = require('../utils/aux.js');

var d = new Date().toISOString().substring(0, 16)

// GET posts page ADMIN
router.get('/admin', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
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
      res.render('postsAdmin', {
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
  } else if (level != 'admin') {
    res.render('permissionDenied');
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


// GET posts page 
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


// GET view to add a new post 
router.get('/newPost', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
    axios.get('http://localhost:3000/posts/postId')
      .then(resposta => {
        const id = parseInt(resposta.data)
        const newId = (id + 1).toString()
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


// POST a new post  
router.post('/newPost', async (req, res) => {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn) {
    try {
      // Fetch the list of all InqIds
      const response = await axios.get('http://localhost:3000/allids');
      const ids = response.data;
      const id = req.body.InqId;
      // Check if the submitted InqId exists
      let returnLink = '/posts'
      if (!ids.includes(id)) {
        if (level === 'admin') {
          returnLink = '/posts/admin';
        } 
        res.render('nonExistingInqId', {link: returnLink});
        return;
      }
      // Getting the current user using the token
      const token = req.cookies.token;
      // Fetching the username from the token
      const username = await getUsername(req, res);
      req.body.UserId = username

      // Proceed to create a new post
      const postResponse = await axios.post('http://localhost:3000/posts/', req.body);
      if (level === 'admin') {
        res.redirect('http://localhost:3001/posts/admin');
      }
      else {
        res.redirect('http://localhost:3001/posts/');
      }
    } catch (error) {
      res.render('error', {error: error, message: "Erro ao processar o pedido"});
    }
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// DELETE a single post
router.post('/delete-post/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
    axios.delete(`http://localhost:3000/posts/${req.params.id}`)
      .then( // Redirect to current page, if it fails redirect to posts
        res.redirect(req.headers.referer || 'http://localhost:3001/posts/admin')
      )
      .catch(error => {
        res.render('error', {error: error, message: "Erro ao eliminar o post"})
      });
  } else if (level != 'admin') {
  res.render('permissionDenied');
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// DELETE a single comment on a post
router.post('/delete-comment/:postId/:commentId', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
    axios.delete(`http://localhost:3000/posts/${req.params.postId}/delete-comment/${req.params.commentId}`)
      .then( // Redirect to current page, if it fails redirect to posts
        res.redirect(req.headers.referer || 'http://localhost:3001/posts/admin')
      )
      .catch(error => {
        res.render('error', {error: error, message: "Erro ao eliminar o comentário"})
      });
  } else if (level != 'admin') {
    res.render('permissionDenied');
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


// POST new comment from the record page
router.post('/:post_id/add-comment-genere/:record_id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn) {
    // Getting the current user using the token
    const token = req.cookies.token;
    // Fetching the username from the token
    const username = await getUsername(req, res);
    req.body.UserId = username
    
    axios.post(`http://localhost:3000/posts/${req.params.post_id}/add-comment`, req.body)
      .then(response => {
          if (level === 'admin') {
            res.redirect(`http://localhost:3001/admin/${req.params.record_id}`) // need second parameter to redirect to the correct page
          } else {
          res.redirect(`http://localhost:3001/${req.params.record_id}`) // need second parameter to redirect to the correct page
          }
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


// POST new comment from the Posts page
router.post('/:id/add-comment', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  const level = await checkLevel(req, res);
  if (loggedIn) {
    // Getting the current user using the token
    const token = req.cookies.token;
    // Fetching the username from the token
    const username = await getUsername(req, res);
    req.body.UserId = username

    axios.post(`http://localhost:3000/posts/${req.params.id}/add-comment`, req.body)
      .then(response => {
        if (level === 'admin') {
          res.redirect('http://localhost:3001/posts/admin')
        } else { 
          res.redirect('http://localhost:3001/posts')
        }
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