var express = require('express');
var router = express.Router();
var axios = require('axios')
var fs = require('fs');
const path = require('path'); // Require the path module

var multer = require('multer')
var upload = multer({dest: 'uploads'})

const { parse, transforms: { unwind, flatten } } = require('json2csv');

const api = 'http://backend:3000';


// Aux functions
const { getCurrentFormattedDate, getCurrentFormattedDateV2, checkLevel, checkLogin, getUsername } = require('../utils/aux');
var d = new Date().toISOString().substring(0, 16)

// GET login 
router.get('/', function (_, res) {
  res.render('login');
  return;
});

// POST login 
router.post('/login', function (req, res) {
  axios.post(api + '/users/login', req.body)
    .then(async response => {
      res.cookie('token', response.data.token) // Saving the token in the cookie
      const token = response.data.token; // Getting the token
      // Fetching the level
      let details = await axios.get(api + '/users/details', { headers: { Authorization: `Bearer ${token}` } })
      let level = details.data.level
      if (level == 'admin') { res.redirect('http://localhost:3001/admin/home') }
      else { res.redirect('http://localhost:3001/home') }
    })
    .catch(err => {
      res.render('loginError', { error: err, message: "Error logging in" })
    })
})

// GET register 
router.get('/register', function (req, res, next) {
  res.render('register', { data: d, titulo: "Register" })
});

// POST register 
router.post('/register', function (req, res) {
  axios.post(api + '/users/register', req.body)
    .then(response => { res.redirect('/'); })
    .catch(err => {
      if (err.response.status == 530) { // Username already exists
        res.render('registerError', { error: err, message: "Username already exists. Please, choose another one." })
      } else { res.render('loginError', { error: err, message: "Error registering user" }) }
    })
})

// GET logout 
router.get('/logout', (req, res) => {
  res.cookie('token', "null.null.null") // Setting the token to null
  res.redirect('/')
})

// GET home page for ADMIN. (500 records per page) 
router.get('/admin/home', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    const token = req.cookies.token;
    const page = parseInt(req.query.page) || 0;
    axios.get(api + `?page=${page}&token=${token}`)
      .then(response => {
        res.render('indexAdmin', {
          generes: response.data.generes,
          titulo: "Record List",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/admin/home?page=${page + 1}`,
          previousPageURL: `http://localhost:3001/admin/home?page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// GET home page for USER. (500 records per page)
router.get('/home', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    const token = req.cookies.token;
    const page = parseInt(req.query.page) || 0;
    axios.get(api + `?page=${page}&token=${token}`)
      .then(response => {
        res.render('index', {
          generes: response.data.generes,
          titulo: "Record List",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/home?page=${page + 1}`,
          previousPageURL: `http://localhost:3001/home?page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else { res.redirect('/'); }
});

// Search motor for ADMIN
router.get('/admin/home/search', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    const searchType = req.query.searchType;
    const searchValue = req.query.searchValue;
    const page = parseInt(req.query.page) || 0;
    const url = api + `/search?searchType=${searchType}&searchValue=${searchValue}&page=${page}`;
    axios.get(url)
      .then(response => {
        res.render('indexAdmin', {
          generes: response.data.generes,
          data: d,
          titulo: "Record List",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/admin/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page + 1}`,
          previousPageURL: `http://localhost:3001/admin/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// Search motor for USER
router.get('/home/search', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    const searchType = req.query.searchType;
    const searchValue = req.query.searchValue;
    const page = parseInt(req.query.page) || 0;
    const url = api + `/search?searchType=${searchType}&searchValue=${searchValue}&page=${page}`;
    axios.get(url)
      .then(response => {
        res.render('index', {
          generes: response.data.generes,
          data: d,
          titulo: "Record List",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page + 1}`,
          previousPageURL: `http://localhost:3001/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else { res.redirect('/'); }
});

// Sort motor for ADMIN
router.get('/admin/home/sort', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    const sortType = req.query.sortBy;
    const page = parseInt(req.query.page) || 0;
    const url = api + `/sort?sortType=${sortType}&page=${page}`;
    axios.get(url)
      .then(response => {
        res.render('indexAdmin', {
          generes: response.data.generes,
          data: d,
          titulo: "Record List",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/admin/home/sort?sortBy=${sortType}&page=${page + 1}`,
          previousPageURL: `http://localhost:3001/admin/home/sort?sortBy=${sortType}&page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// Sort motor for USER
router.get('/home/sort', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    const sortType = req.query.sortBy;
    const page = parseInt(req.query.page) || 0;
    const url = api + `/sort?sortType=${sortType}&page=${page}`;
    axios.get(url)
      .then(response => {
        res.render('index', {
          generes: response.data.generes,
          data: d,
          titulo: "Lista de Generes",
          page: page,
          totalPages: response.data.totalPages,
          nextPageURL: `http://localhost:3001/home/sort?sortBy=${sortType}&page=${page + 1}`,
          previousPageURL: `http://localhost:3001/home/sort?sortBy=${sortType}&page=${page - 1}`
        });
      })
      .catch(error => { res.render('error', { error: error, message: "Error retrieving the records" }); });
  }
  else { res.redirect('/'); }
});

// GET view to add a new record (only for admins)
router.get('/newRecord', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    // Fetching max current IDs, then adding 1 to them to guarantee a unique ID
    let newId = 0
    let newUselessID = 0
    axios.get(api + '/genereID')
      .then(resposta => {
        if (Object.keys(resposta.data).length === 0) { newId = 1; }
        else {
          const id = parseInt(resposta.data.max_Id[0]._id)
          newId = (id + 1).toString()
        }
        const uselessID = parseInt(resposta.data.maxId[0].ID) // This is being done just to comply with the format
        if (uselessID == "NaN") {newUselessID = 1}
        else {newUselessID = (uselessID + 1).toString()}
        res.render('newRecord', { data: d, titulo: "Add new record", genereID: newId, uselessID: newUselessID })
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error adding new record" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// POST new record (only for admins)
router.post('/newRecord', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    // Handling the relationships
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    if (!(relationships.length == 1 && relationships[0] == '')) { // Case where there are relationships
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({ '_id': id, 'Relationship': rel })
      }
      req.body['Relationships'] = relJson
    } else { // Case where there are no relationships
      req.body['Relationships'] = [] // make it an empty list
    }
    const username = await getUsername(req, res); // Getting the current user using the token
    req.body.Creator = username // Adding the creator to the record
    req.body.Created = getCurrentFormattedDate() // Adding the creation date to the record
    
    axios.post(api + '/', req.body)
      .then(resposta => { res.redirect('http://localhost:3001/admin/home') })
      .catch(erro => { res.render('error', { error: erro, message: "Error adding new record" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// GET view to edit a record ADMIN
router.get('/admin/edit/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    axios.get(api + '/' + req.params.id)
      .then(resposta => {
        res.render('editRecordAdmin', { genere: resposta.data, data: d, titulo: "Editar Genere " + resposta.data['UnitTitle'] })
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error editing the record" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// GET view to edit a record USER
router.get('/edit/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    axios.get(api + '/' + req.params.id)
      .then(resposta => {
        res.render('editRecord', { genere: resposta.data, data: d, titulo: "Editar Genere " + resposta.data['UnitTitle'] })
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error editing the record" }) })
  }
  else { res.redirect('/'); }
});

// POST edited record ADMIN
router.post('/admin/edit/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    // Handling the relationships
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    if (!(relationships.length == 1 && relationships[0] == '')) { // Case where there are relationships
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({ '_id': id, 'Relationship': rel })
      }
      req.body['Relationships'] = relJson
    } else { // Case where there are no relationships
      req.body['Relationships'] = [] // make it an empty list
    }
    const username = await getUsername(req, res);
    req.body.ProcessInfo = "Registo modificado pelo utilizador " + username + ", na data " + getCurrentFormattedDateV2()
    axios.put(api + '/' + req.params.id, req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/admin/home')
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error editing the record" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// POST edited record USER
router.post('/edit/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    // Handling the relationships
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    if (!(relationships.length == 1 && relationships[0] == '')) { // Case where there are relationships
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({ '_id': id, 'Relationship': rel })
      }
      req.body['Relationships'] = relJson
    } else { // Case where there are no relationships
      req.body['Relationships'] = [] // make it an empty list
    }
    const username = await getUsername(req, res);
    req.body.ProcessInfo = "Registo modificado pelo utilizador " + username + ", na data " + getCurrentFormattedDateV2()
    // Change fields to make it into a suggestion
    req.body['IdGenere'] = req.body['_id']
    // Get max suggestion id from the api, increment it by 1 to guarantee a unique id
    const suggId = await axios.get(api + '/suggestions/suggestionID')
    let newSuggId = 0
    if (Object.keys(suggId.data).length === 0) { newId = 1; }
    else { 
      const suggIdInt = parseInt(suggId.data)
      newSuggId = (suggIdInt + 1).toString()
    }
    req.body['_id'] = newSuggId
    // Post in the suggestions collection
    axios.post(api + '/suggestions/', req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/home')
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error editing the record" }) })
  }
  else { res.redirect('/'); }
});

// DELETE record (only for admins)
router.post('/delete/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    axios.delete(api + '/' + req.params.id)
      .then(resposta => { res.redirect('http://localhost:3001/admin/home') })
      .catch(erro => { res.render('error', { error: erro, message: "Error deleting the record" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// GET admin suggestions page
router.get('/admin/suggestions', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    axios.get(api + '/suggestions')
      .then(resposta => {
        res.render('suggestions', { suggestions: resposta.data, data: d, titulo: "Suggestions" })
      })
      .catch(erro => { res.render('error', { error: erro, message: "Error retrieving the suggestions" }) })
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
})

// POST accept suggestion 
router.post('/admin/acceptSuggestion/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    try {
      // Fetching the suggestion
      const response = await axios.get(api + '/suggestions/' + req.params.id);
      const suggestion = response.data;
      // Changing the fields to make it into a record
      suggestion['_id'] = suggestion['IdGenere'];
      delete suggestion['IdGenere'];
      // PUT record
      await axios.put(api + '/' + suggestion['_id'], suggestion);
      // Deleting the suggestion
      await axios.delete(api + '/suggestions/' + req.params.id);
      // Redirecting to the suggestions page
      res.redirect('http://localhost:3001/admin/suggestions');
    } catch (error) { res.render('error', { error, message: "Failed operation during suggestion processing" }); }
  }
  else if (level !== 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// POST refuse suggestion
router.post('/admin/refuseSuggestion/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    try {
      // Deleting the suggestion
      await axios.delete(api + '/suggestions/' + req.params.id);
      // Redirecting to the suggestions page
      res.redirect('http://localhost:3001/admin/suggestions');
    } catch (error) { res.render('error', { error, message: "Failed operation during suggestion processing" }); }
  }
  else if (level !== 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
})

// Aux function to remove unnecessary fields from the data
const removeFields = (data) => {
  delete data.Id;
  delete data.__v;
  return data;
};

router.get('/download', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    axios.get(api + '/download')
      .then(response => {
        // Removes unnecessary fields from the data
        const transformOpts = { objectMode: true, transforms: [removeFields] };
        // Converts data from JSON to CSV
        const csv = parse(response.data, transformOpts);
        res.setHeader('Content-disposition', 'attachment; filename=records.csv');
        res.setHeader('Content-type', 'text/csv');
        res.write(csv);
        res.end();
      })
      .catch(error => { res.render('error', { error: error, message: "Error downloading the records" }); });
  }
  else { res.redirect('/'); }
});

// GET a single record by ID ADMIN
router.get('/admin/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    try {
      // Fetch the record by ID
      let recordResponse = await axios.get(api + '/' + req.params.id)
      let record = recordResponse.data
      // Fetch all the posts made about the record
      let recordPostsResponse = await axios.get(api + '/posts?inqid=' + req.params.id)
      let recordPosts = recordPostsResponse.data
      // Combine the data
      let combinedData = {
        ...record,
        posts: recordPosts
      }
      res.render('genereAdmin', { genere: combinedData, data: d, titulo: "Genere " + combinedData['UnitTitle'] })
    } catch (error) { res.render('error', { error: error, message: "Error retrieving the genere" }) }
  }
  else if (level != 'admin') { res.render('permissionDenied'); }
  else { res.redirect('/'); }
});

// GET a single record by ID 
router.get('/:id', async function (req, res, next) {
  const loggedIn = await checkLogin(req, res);
  if (loggedIn) {
    try {
      // Fetch the record by ID
      let recordResponse = await axios.get(api + '/' + req.params.id)
      let record = recordResponse.data
      // Fetch all the posts made about the record
      let recordPostsResponse = await axios.get(api + '/posts?inqid=' + req.params.id)
      let recordPosts = recordPostsResponse.data
      // Combine the data
      let combinedData = {
        ...record,
        posts: recordPosts
      }
      res.render('genere', { genere: combinedData, data: d, titulo: "Genere " + combinedData['UnitTitle'] })
    } catch (error) { res.render('error', { error: error, message: "Error retrieving the genere" }) }
  }
  else { res.redirect('/'); }
});


// File submission route
router.post('/upload-json', upload.single('jsonFile'), (req, res) => {
  const loggedIn = checkLogin(req, res);
  if (loggedIn) {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const oldPath = path.join(__dirname, '/../uploads/', req.file.filename);
    const newPath = path.join(__dirname, '/../public/fileStore/', req.file.originalname);

    fs.copyFile(oldPath, newPath, (error) => {
      if (error) {
        return res.status(500).send('Error copying file.');
      }
      fs.chmod(newPath, 0o644, (chmodError) => { // Set the file permissions to 644 (owner: read/write, group: read, others: read)
        if (chmodError) {
          return res.status(500).send('Error setting file permissions.');
        }
        fs.unlink(oldPath, (unlinkError) => {
          if (unlinkError) {
            return res.status(500).send('Error deleting original file.');
          }
          res.render('uploadSuccess');
        });
      });
    });
  }
  else{
    res.redirect('/');
  }
});

module.exports = router;