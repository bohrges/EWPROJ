var express = require('express');
var router = express.Router();
var Suggestion = require("../controllers/suggestion")


// GET paginated list of suggestions. 
router.get('/', function(req, res, next) {
  console.log("Fetching suggestions...");
  Suggestion.getSuggestions()
      .then((data) => {
          console.log("Suggestions fetched successfully");
          console.log(data);
          res.jsonp(data);
      })
      .catch(error => {
          console.error("Failed to fetch suggestions:", error);
          res.status(500).render('error', { message: "Error retrieving data", error: error });
      });
});


// GET automated ID before adding a new record 
// This is used to get the next ID to be used when adding a new record 
router.get('/suggestionID', function(req, res, next) {
  Suggestion.getMaxId()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});




// GET single suggestion
router.get('/:id', function(req, res, next) {
  Suggestion.findById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


// POST new suggestion 
router.post('/', function(req, res, next) {
  console.log("Adding new suggestion...");
  try {
    console.log("Adding new suggestion, dentro do try");
    Suggestion.insert(req.body)
      .then((data) => {
        res.json(data); 
      })
      .catch((error) => {
        console.log('Database insertion error:', error);
        res.status(400).json({ error: 'Database insertion failed', details: error });
      });
  } catch (error) {
    console.log('Error processing request:', error);
    res.status(400).json({ error: 'Failed to parse Relationships or other input errors', details: error.message });
  }
});


// DELETE single suggestion 
router.delete('/:id', function(req, res, next) {
  Suggestion.removeById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


module.exports = router;