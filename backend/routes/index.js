var express = require('express');
var router = express.Router();
var Genere = require("../controllers/genere")

/* GET paginated list of generes. */
router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 0;
  const limit = 500; // Number of items per page

  Genere.getGeneresPaginated(page, limit)
      .then((data) => {
          const totalPages = Math.ceil(data.totalCount / limit); // Calculate the total number of pages
          res.jsonp({
              generes: data.generes,
              totalPages: totalPages
          });
      })
      .catch(error => {
          console.error("Failed to fetch generes:", error);
          res.status(500).render('error', { message: "Error retrieving data", error: error });
      });
});


/* GET dataset page. */
router.get('/:id', function(req, res, next) {
  Genere.findById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


/* GET search by name. */
router.get('/search/name/:name', function(req, res, next) {
  Genere.findByName(req.params.name)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

/* GET search by place. */
router.get('/search/place/:place', function(req, res, next) {
  Genere.findByPlace(req.params.place)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

/* GET search by date. */
router.get('/search/date/:date', function(req, res, next) {
  Genere.findByDate(req.params.date)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

module.exports = router;
