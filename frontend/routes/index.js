var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)


/* GET home page. (500 records per page) */
router.get('/', function(req, res, next) { 
  const page = parseInt(req.query.page) || 0;
  axios.get(`http://localhost:3000?page=${page}`)
      .then(response => {
          res.render('index', {
              generes: response.data.generes,
              data: d,
              titulo: "Lista de Generes",
              page: page,
              totalPages: response.data.totalPages,
              nextPageURL: `http://localhost:3001?page=${page+1}`,
              previousPageURL: `http://localhost:3001?page=${page-1}` 
          });
      })
      .catch(error => {
          res.render('error', {
              error: error,
              message: "Erro ao recuperar as pessoas"
          });
      });
});


// Search motor 
router.get('/search', function(req, res, next) {
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
              nextPageURL: `http://localhost:3001/search?searchType=${searchType}&searchValue=${searchValue}&page=${page+1}`,
              previousPageURL: `http://localhost:3001/search?searchType=${searchType}&searchValue=${searchValue}&page=${page-1}`
          });
      })
      .catch(error => {
          res.render('error', {
              error: error,
              message: "Erro ao recuperar as pessoas"
          });
      });
});

// Sort motor
router.get('/sort', function(req, res, next) {
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
                nextPageURL: `http://localhost:3001/sort?sortBy=${sortType}&page=${page+1}`,
                previousPageURL: `http://localhost:3001/sort?sortBy=${sortType}&page=${page-1}`
            });
        })
        .catch(error => {
            res.render('error', {
                error: error,
                message: "Erro ao recuperar as pessoas"
            });
        });
});

/* GET view to add a new record */
router.get('/newRecord', function(req, res, next) {
    // Fetching automated ID, which is the max current _id. Then, incrementing it by 1 to guarantee an unique_id
    axios.get('http://localhost:3000/genereID')
      .then(resposta => {
        const id = parseInt(resposta.data.max_Id[0]._id)
        const newId = (id + 1).toString()
        const uselessID = parseInt(resposta.data.maxId[0].ID)
        const newUselessID = (uselessID + 1).toString()
  
        console.log(newId)
        console.log(newUselessID)
        
        res.render('newRecord', {data: d, titulo: "Adicionar novo genere", genereID: newId, uselessID: newUselessID})
      })
  });

/* POST new record */
router.post('/newRecord', function(req, res, next) {
    let relJson = []
    relationships = req.body['Relationships'].split('\n')
    for (let i = 0; i < relationships.length; i++) {
      id = relationships[i].split(':')[0]
      rel = relationships[i].split(':')[1]
      relJson.push({'_id': id, 'Relationship': rel})
    }
    req.body['Relationships'] = relJson
    axios.post('http://localhost:3000/', req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/')
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao adicionar o genere"})
      })
  });

/* GET view to edit a record */
router.get('/edit/:id', async function(req, res, next) {
    axios.get('http://localhost:3000/' + req.params.id)
      .then(resposta => {
        res.render('editRecord', {genere : resposta.data, data: d, titulo: "Editar Genere " + resposta.data['UnitTitle']})
      })
});

/* PUT edited record */
router.post('/edit/:id', function(req, res, next) {
  let relJson = []
  relationships = req.body['Relationships'].split('\n')
  for (let i = 0; i < relationships.length; i++) {
    id = relationships[i].split(':')[0]
    rel = relationships[i].split(':')[1]
    relJson.push({'_id': id, 'Relationship': rel})
  }
  req.body['Relationships'] = relJson
    axios.put('http://localhost:3000/' + req.params.id, req.body)
      .then(resposta => {
        res.redirect('http://localhost:3001/')
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao editar o genere"})
      })
  });


/* GET records by ID */
router.get('/:id', function(req, res, next) {
  axios.get('http://localhost:3000/' + req.params.id)
    .then(resposta => {
      res.render('genere', {genere : resposta.data, data: d, titulo: "Genere " + resposta.data['UnitTitle']})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar as pessoas"})
    })
});




module.exports = router;