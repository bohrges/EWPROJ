var express = require('express');
var router = express.Router();
var axios = require('axios')

// Aux functions
const {checkLevel, checkLogin, getUsername} = require('../utils/aux.js');
var d = new Date().toISOString().substring(0, 16)

const api = 'http://backend:3000/posts';
const recordsapi = 'http://backend:3000';

// GET posts page ADMIN
router.get('/admin', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
    try {
      // Fetch all posts
      let postResponse = await axios.get(api);
      let posts = postResponse.data;
      // For each post, fetch info about the corresponding record 
      let detailsPromises = posts.map(post => {return axios.get(recordsapi + `/${post.InqId}`);});
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
    } catch (erro) { res.render('error', { error: erro, message: "Erro ao recuperar os posts ou detalhes das inquirições" });}} 
    else if (level != 'admin') {res.render('permissionDenied');} 
    else {res.redirect('/');}
});

// GET posts page 
router.get('/', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    try {
      // Fetch all posts
      let postResponse = await axios.get(api);
      let posts = postResponse.data;
      // For each post, fetch info about the corresponding record 
      let detailsPromises = posts.map(post => {
        return axios.get(recordsapi + `/${post.InqId}`);
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
    } catch (erro) {res.render('error', {error: erro,message: "Erro ao recuperar os posts ou detalhes das inquirições"});}} 
    else {res.redirect('/');}
});

// GET view to add a new post 
router.get('/newPost', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
    let newId = 0
    axios.get(api + '/postId')
      .then(resposta => {
        console.log("Respostsa data:")
        console.log(resposta.data)
        if (Object.keys(resposta.data).length === 0) { newId = 1; }
        else{
          id = parseInt(resposta.data)
          newId = (id + 1).toString()
        }
        res.render('newPost', {data: d, titulo: "Adicionar novo Post", postID: newId})
      })
      .catch(erro => {res.render('error', {error: erro, message: "Erro ao adicionar o post"})})}
  else {res.redirect('/');}
});

// POST a new post  
router.post('/newPost', async (req, res) => {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn) {
    try {
      // Fetch the list of all InqIds
      const response = await axios.get(recordsapi + '/allids');
      const ids = response.data;
      const id = req.body.InqId;
      // Check if the submitted InqId exists
      let returnLink = '/posts'
      if (!ids.includes(id)) { // Case where the InqId does not exist
        if (level === 'admin') {returnLink = '/posts/admin';} // Redirect to the admin page if the user is an admin
        res.render('nonExistingInqId', {link: returnLink});return;
      }
      // Reaches here only if the InqId exists
      const username = await getUsername(req, res);
      req.body.UserId = username // Add the username of the creator to the post
      // Proceed to create a new post
      const postResponse = await axios.post(api, req.body);
      if (level === 'admin') { res.redirect('http://localhost:3001/posts/admin');}
      else {res.redirect('http://localhost:3001/posts/');}
    } catch (error) {res.render('error', {error: error, message: "Erro ao processar o pedido"});}}
  else { res.redirect('/');}
});

// DELETE a single post
router.post('/delete-post/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
    axios.delete(api + `/${req.params.id}`)
      .then( // Redirect to current page, if it fails redirect to posts
        res.redirect(req.headers.referer || 'http://localhost:3001/posts/admin'))
      .catch(error => {res.render('error', {error: error, message: "Erro ao eliminar o post"})});} 
  else if (level != 'admin') {res.render('permissionDenied');} 
  else { res.redirect('/');}
});

// DELETE a single comment on a post
router.post('/delete-comment/:postId/:commentId', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  
  const level = await checkLevel(req, res);
  if (loggedIn && level === 'admin') {
    axios.delete(api + `/${req.params.postId}/delete-comment/${req.params.commentId}`)
      .then( // Redirect to current page, if it fails redirect to posts
        res.redirect(req.headers.referer || 'http://localhost:3001/posts/admin'))
      .catch(error => {res.render('error', {error: error, message: "Erro ao eliminar o comentário"})});} 
  else if (level != 'admin') {res.render('permissionDenied');} 
  else {res.redirect('/');}
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
    // Fetching maximum comment ID to increment it by 1
    const response = await axios.get(api + '/commentId');
    let newId = 0
    if (response.data == null) { newId = 1; }
    else{
      const commentID = parseInt(response.data);
      newId = (commentID + 1).toString();
    }
    req.body._id = newId
    axios.post(api + `/${req.params.post_id}/add-comment`, req.body)
      .then(response => {
          if (level === 'admin') {res.redirect(`http://localhost:3001/admin/${req.params.record_id}`)} 
          else {res.redirect(`http://localhost:3001/${req.params.record_id}`)}})
      .catch(error => {res.render('error', {error: error, message: "Erro ao adicionar o comentário"})});}
  else {res.redirect('/');}
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
    // Fetching maximum comment ID to increment it by 1
    const response = await axios.get(api + '/commentId');
    let newId = 0
    if (response.data == null) { newId = 1; }
    else{
      const commentID = parseInt(response.data);
      newId = (commentID + 1).toString();
    }
    req.body._id = newId
    axios.post(api + `/${req.params.id}/add-comment`, req.body)
      .then(response => {
        if (level === 'admin') {res.redirect('http://localhost:3001/posts/admin')} 
        else { res.redirect('http://localhost:3001/posts')}})
      .catch(error => {res.render('error', {error: error, message: "Erro ao adicionar o comentário"}) });}
  else {res.redirect('/');}
});

module.exports = router;