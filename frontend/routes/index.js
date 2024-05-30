var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)

/* ---------- GET ----------*/

// /* Generes home page */
// router.get('/', function(req, res, next) {
//   axios.get('http://localhost:3000')
//     .then(resposta => {
//       res.render('index', {generes : resposta.data, data: d, titulo: "Lista de Generes"})
//     })
//     .catch(erro => {
//       res.render('error', {error: erro, message: "Erro ao recuperar as pessoas"})
//     })
// });

router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 0;

  axios.get(`http://localhost:3000?page=${page}`)
      .then(response => {
          res.render('index', {
              generes: response.data.generes,
              data: d,
              titulo: "Lista de Generes",
              page: page,
              totalPages: response.data.totalPages
          });
      })
      .catch(error => {
          res.render('error', {
              error: error,
              message: "Erro ao recuperar as pessoas"
          });
      });
});

/* Generes GET by ID */
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