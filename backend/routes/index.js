var express = require('express');
var router = express.Router();
var Genere = require("../controllers/genere")

/* GET home page. */
router.get('/', function(req, res, next) {
  Genere.list()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

module.exports = router;
