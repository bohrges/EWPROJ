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
    console.log(url);
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