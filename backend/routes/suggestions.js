var express = require('express');
var router = express.Router();
var Suggestion = require("../controllers/suggestion")


// GET paginated list of suggestions. 
router.get('/', function(req, res, next) {
  Suggestion.getSuggestions()
      .then((data) => {res.jsonp(data);})
      .catch(error => {res.status(500);});
});

// GET automated ID before adding a new suggestion 
// This is used to get the next ID to be used when adding a new suggestion 
router.get('/suggestionID', function(req, res, next) {
  Suggestion.getMaxId()
  .then((data) => {res.jsonp(data)})
  .catch((erro) => {res.jsonp(erro)});
});

// GET single suggestion
router.get('/:id', function(req, res, next) {
  Suggestion.findById(req.params.id)
  .then((data) => {res.jsonp(data)})
  .catch((erro) => {res.jsonp(erro)});
});

// POST new suggestion 
router.post('/', function(req, res, next) {
  try {
    Suggestion.insert(req.body)
      .then((data) => {res.json(data); })
      .catch((error) => {res.status(400).json({ error: 'Database insertion failed', details: error });});
  } catch (error) {res.status(400).json({ error: 'Failed to parse Relationships or other input errors', details: error.message });}
});

// DELETE single suggestion 
router.delete('/:id', function(req, res, next) {
  Suggestion.removeById(req.params.id)
  .then((data) => {res.jsonp(data)}).catch((erro) => {res.jsonp(erro)});
});


module.exports = router;