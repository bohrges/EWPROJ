var express = require('express');
var router = express.Router();
var axios = require('axios')

// Aux functions
const { getCurrentFormattedDate, getCurrentFormattedDateV2, checkLevel, checkLogin, getUsername } = require('../utils/aux');

var d = new Date().toISOString().substring(0, 16)

// GET login 
router.get('/', function(_, res) {
  res.render('login');
  return;
});

// POST login 
router.post('/login', function(req, res){
  axios.post('http://localhost:3000/users/login', req.body)
    .then(async response => {
      res.cookie('token', response.data.token)
      const token = response.data.token;
      // Fetching the level
      let details = await axios.get('http://localhost:3000/users/details', { headers: { Authorization: `Bearer ${token}` } })
      let level = details.data.level
      if (level == 'admin') {
        res.redirect('http://localhost:3001/admin/home')
      }
      else {
        res.redirect('http://localhost:3001/home')
      }
    })
    .catch(err => {
      res.render('loginError', {error: err, message: "Error logging in"})    
    })
})

// GET register 
router.get('/register', function(req, res, next) {
  res.render('register', {data: d, titulo: "Register"})
});

// POST register 
router.post('/register', function(req, res){
  axios.post('http://localhost:3000/users/register', req.body)
    .then(response => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err)
      if (err.response.status == 530) { // Username already exists
        res.render('registerError', {error: err, message: "Username already exists. Please, choose another one."})
      } else {
      res.render
      ('loginError', {error: err, message: "Error registering user"}) 
      }
    })
})

// GET logout 
router.get('/logout', (req, res) => {
  res.cookie('token', "null.null.null")
  res.redirect('/')
})

// GET home page for ADMIN. (500 records per page) 
router.get('/admin/home', async function(req, res, next) { 
  const loggedIn = await checkLogin(req, res);  
  const level = await checkLevel(req, res); 
  if (loggedIn && level == 'admin') {
    const token = req.cookies.token; 
    const page = parseInt(req.query.page) || 0;
    axios.get(`http://localhost:3000?page=${page}&token=${token}`)
        .then(response => {
            res.render('indexAdmin', {
                generes: response.data.generes, 
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/admin/home?page=${page+1}`,
                previousPageURL: `http://localhost:3001/admin/home?page=${page-1}` 
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  } else if (level != 'admin') {
    res.render('permissionDenied');
  } else {
    console.log("User not logged in or token validation failed.");
    res.render('permissionDenied');
  }
});

// GET home page for USER. (500 records per page)
router.get('/home', async function(req, res, next) {  
  const loggedIn = await checkLogin(req, res); 

  if (loggedIn) {
    const token = req.cookies.token; 
    const page = parseInt(req.query.page) || 0;
    axios.get(`http://localhost:3000?page=${page}&token=${token}`)
        .then(response => {
            res.render('index', {
                generes: response.data.generes,
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/home?page=${page+1}`,
                previousPageURL: `http://localhost:3001/home?page=${page-1}` 
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  } else {
    console.log("User not logged in or token validation failed.");
    res.render('permissionDenied');
  }
});

// Search motor for ADMIN
router.get('/admin/home/search', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    const searchType = req.query.searchType;
    const searchValue = req.query.searchValue;
    const page = parseInt(req.query.page) || 0;
    const url = `http://localhost:3000/search?searchType=${searchType}&searchValue=${searchValue}&page=${page}`;
    axios.get(url)
        .then(response => {
            res.render('indexAdmin', {
                generes: response.data.generes,
                data: d,
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/admin/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page+1}`,
                previousPageURL: `http://localhost:3001/admin/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page-1}`
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  } else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// Search motor for USER
router.get('/home/search', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  if (loggedIn) {
    const searchType = req.query.searchType;
    const searchValue = req.query.searchValue;
    const page = parseInt(req.query.page) || 0;
    const url = `http://localhost:3000/search?searchType=${searchType}&searchValue=${searchValue}&page=${page}`;
    axios.get(url)
        .then(response => {
            res.render('index', {
                generes: response.data.generes,
                data: d,
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page+1}`,
                previousPageURL: `http://localhost:3001/home/search?searchType=${searchType}&searchValue=${searchValue}&page=${page-1}`
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// Sort motor for ADMIN
router.get('/admin/home/sort', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    // Fetching the data
    const sortType = req.query.sortBy;
    const page = parseInt(req.query.page) || 0;
    const url = `http://localhost:3000/sort?sortType=${sortType}&page=${page}`;
    axios.get(url)
        .then(response => {
            res.render('indexAdmin', {
                generes: response.data.generes,
                data: d,
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/admin/home/sort?sortBy=${sortType}&page=${page+1}`,
                previousPageURL: `http://localhost:3001/admin/home/sort?sortBy=${sortType}&page=${page-1}`
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  } else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// Sort motor for USER
router.get('/home/sort', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  if (loggedIn) {
    // Fetching the data
    const sortType = req.query.sortBy;
    const page = parseInt(req.query.page) || 0;
    const url = `http://localhost:3000/sort?sortType=${sortType}&page=${page}`;
    axios.get(url)
        .then(response => {
            res.render('index', {
                generes: response.data.generes,
                data: d,
                titulo: "Lista de Generes",
                page: page,
                totalPages: response.data.totalPages,
                nextPageURL: `http://localhost:3001/home/sort?sortBy=${sortType}&page=${page+1}`,
                previousPageURL: `http://localhost:3001/home/sort?sortBy=${sortType}&page=${page-1}`
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Error retrieving the records"
            });
        });
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// GET view to add a new record (only for admins)
router.get('/newRecord', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
    axios.get('http://localhost:3000/genereID')
      .then(resposta => {
        const id = parseInt(resposta.data.max_Id[0]._id)
        const newId = (id + 1).toString()
        const uselessID = parseInt(resposta.data.maxId[0].ID)
        const newUselessID = (uselessID + 1).toString()
        res.render('newRecord', {data: d, titulo: "Add new record", genereID: newId, uselessID: newUselessID})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Error adding new record"})
      })
  }
  else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  } 
});


// POST new record (only for admins)
router.post('/newRecord', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
      let relJson = []
      relationships = req.body['Relationships'].split('\n')
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({'_id': id, 'Relationship': rel})
      }
      req.body['Relationships'] = relJson
      // Getting the current user using the token
      const username = await getUsername(req, res);
      req.body.Creator = username
      req.body.Created = getCurrentFormattedDate()
      axios.post('http://localhost:3000/', req.body)
        .then(resposta => {
          res.redirect('http://localhost:3001/admin/home')
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro ao adicionar o genere"})
        })
  }
  else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});











// GET view to edit a record ADMIN
router.get('/admin/edit/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    axios.get('http://localhost:3000/' + req.params.id)
      .then(resposta => {
        res.render('editRecordAdmin', {genere : resposta.data, data: d, titulo: "Editar Genere " + resposta.data['UnitTitle']})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao editar o genere"})
      })
  } else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


// GET view to edit a record USER
router.get('/edit/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  if (loggedIn) {
    axios.get('http://localhost:3000/' + req.params.id)
      .then(resposta => {
        res.render('editRecord', {genere : resposta.data, data: d, titulo: "Editar Genere " + resposta.data['UnitTitle']})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao editar o genere"})
      })
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});




// POST edited record ADMIN
router.post('/admin/edit/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    if (!(relationships.length == 1 && relationships[0] == ''))
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({'_id': id, 'Relationship': rel})
      }
    // Getting the current user using the token
    const username = await getUsername(req, res);
    req.body.ProcessInfo = "Registo modificado pelo utilizador " + username + ", na data " + getCurrentFormattedDateV2()

    if (relJson.length > 0){
      req.body['Relationships'] = relJson
    } else {
      // make it an empty list
      req.body['Relationships'] = []
    }
    axios.put('http://localhost:3000/' + req.params.id, req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/admin/home')
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao editar o genere"})
      })
  }
  else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});



// POST edited record USER
router.post('/edit/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  // Await the checkLogin function
  if (loggedIn) {
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    if (!(relationships.length == 1 && relationships[0] == ''))
      for (let i = 0; i < relationships.length; i++) {
        id = relationships[i].split(':')[0]
        rel = relationships[i].split(':')[1]
        relJson.push({'_id': id, 'Relationship': rel})
      }
    // Getting the current user using the token
    const username = await getUsername(req, res);
    req.body.ProcessInfo = "Registo modificado pelo utilizador " + username + ", na data " + getCurrentFormattedDateV2()

    if (relJson.length > 0){
      req.body['Relationships'] = relJson
    } else {
      // make it an empty list
      req.body['Relationships'] = []
    }
    axios.put('http://localhost:3000/' + req.params.id, req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/home')
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao editar o genere"})
      })
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});











// DELETE record (only for admins)
router.post('/delete/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res);  
  const level = await checkLevel(req, res); 
  if (loggedIn && level == 'admin') {
    axios.delete('http://localhost:3000/' + req.params.id)
      .then(resposta => {
        res.redirect('http://localhost:3001/admin/home')
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Error deleting the record"})
      })
  }
  else if (level != 'admin') {
    res.render('permissionDenied');
  }
  else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});

// GET a single record by ID ADMIN
router.get('/admin/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  const level = await checkLevel(req, res);
  if (loggedIn && level == 'admin') {
    try{
      // Fetch the record by ID
      let recordResponse = await axios.get('http://localhost:3000/' + req.params.id)
      let record = recordResponse.data
      // Fetch all the posts made about the record
      let recordPostsResponse = await axios.get('http://localhost:3000/posts?inqid=' + req.params.id) 
      let recordPosts = recordPostsResponse.data
      // Combine the data
      let combinedData = {
        ...record,
        posts: recordPosts
      }
    res.render('genereAdmin', {genere : combinedData, data: d, titulo: "Genere " + combinedData['UnitTitle']})
    } catch (error) {
      res.render('error', {error: error, message: "Error retrieving the genere"})
    }
  } else if (level != 'admin') {
    res.render('permissionDenied');
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


// GET a single record by ID 
router.get('/:id', async function(req, res, next) {
  const loggedIn = await checkLogin(req, res); 
  if (loggedIn) {
    try{
      // Fetch the record by ID
      let recordResponse = await axios.get('http://localhost:3000/' + req.params.id)
      let record = recordResponse.data
      // Fetch all the posts made about the record
      let recordPostsResponse = await axios.get('http://localhost:3000/posts?inqid=' + req.params.id) 
      let recordPosts = recordPostsResponse.data
      // Combine the data
      let combinedData = {
        ...record,
        posts: recordPosts
      }
    res.render('genere', {genere : combinedData, data: d, titulo: "Genere " + combinedData['UnitTitle']})
    } catch (error) {
      res.render('error', {error: error, message: "Error retrieving the genere"})
    }
  } else {
    console.log("User not logged in or token validation failed.");
    res.redirect('/');
  }
});


module.exports = router;