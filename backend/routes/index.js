var express = require('express');
var router = express.Router();
var Genere = require("../controllers/genere")


// GET paginated list of generes. 
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


// GET search by name 
router.get('/search', function(req, res, next) {
  const limit = 500;
  const page = parseInt(req.query.page) || 0;
  const type = req.query.searchType;
  const val = req.query.searchValue;
  var tmp = "";
  if (type == "name") {
    tmp = Genere.findByName(page, limit, val) 
  }
  else if (type == "date") {
    tmp = Genere.findByDate(page, limit, val)
  }
  else if (type == "location") {
    tmp = Genere.findByLocation(page, limit, val)
  }
  else if (type == "county") {
    tmp = Genere.findByCounty(page, limit, val)
  }
  else if (type == "district") {
    tmp = Genere.findByDistrict(page, limit, val)
  }
  tmp
    .then((data) => {
      const totalPages = Math.ceil(data.totalCount/limit); 
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


// GET sort 
router.get('/sort', function(req, res, next) {
  const limit = 500;
  const page = parseInt(req.query.page) || 0;
  const sortType = req.query.sortType;
  var tmp = "";
  if (sortType == "name") {
    tmp = Genere.sortByName(page, limit, sortType)
  }
  else if (sortType == "nameDesc") {
    tmp = Genere.sortByNameDesc(page, limit, sortType)
  }
  else if (sortType == "year") {
    tmp = Genere.sortByDate(page, limit, sortType)
  }
  else if (sortType == "yearDesc") {
    tmp = Genere.sortByDateDesc(page, limit, sortType)
  }
  else if (sortType == "location") {
    tmp = Genere.sortByLocation(page, limit, sortType)
  }
  else if (sortType == "locationDesc") {
    tmp = Genere.sortByLocationDesc(page, limit, sortType)
  }
  else if (sortType == "county") {
    tmp = Genere.sortByCounty(page, limit, sortType)
  }
  else if (sortType == "countyDesc") {
    tmp = Genere.sortByCountyDesc(page, limit, sortType)
  }
  else if (sortType == "district") {
    tmp = Genere.sortByDistrict(page, limit, sortType)
  }
  else if (sortType == "districtDesc") {
    tmp = Genere.sortByDistrictDesc(page, limit, sortType)
  }
  else if (sortType == "id"){
    tmp = Genere.sortById(page, limit, sortType)
  }
  else if (sortType == "idDesc"){
    tmp = Genere.sortByIdDesc(page, limit, sortType)
  }
  tmp
    .then((data) => {
      const totalPages = Math.ceil(data.totalCount/limit); 
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


// GET automated ID before adding a new record 
// This is used to get the next ID to be used when adding a new record 
router.get('/genereID', function(req, res, next) {
  Genere.getMaxId()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


// GET all ids 
// This is used on posts creation, to guarantee the post created refers to a valid inquirição 
router.get('/allids', function(req, res, next) {
  Genere.getAllIds()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


// GET single record
router.get('/:id', function(req, res, next) {
  Genere.findById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


// POST new record 
router.post('/', function(req, res, next) {
  try {
  
    Genere.insert(req.body)
      .then((data) => {
        res.json(data); 
      })
      .catch((error) => {
        console.error('Database insertion error:', error);
        res.status(400).json({ error: 'Database insertion failed', details: error });
      });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(400).json({ error: 'Failed to parse Relationships or other input errors', details: error.message });
  }
});


// DELETE single record 
router.delete('/:id', function(req, res, next) {
  Genere.removeById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


// PUT update record 
router.put('/:id', function(req, res, next) {
  try {
    Genere.update(req.params.id, req.body)
      .then((data) => {
        res.json(data); 
      })
      .catch((error) => {
        console.error('Database update error:', error);
        res.status(400).json({ error: 'Database update failed', details: error });
      });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(400).json({ error: 'Failed to parse Relationships or other input errors', details: error.message });
  }
});


module.exports = router;
