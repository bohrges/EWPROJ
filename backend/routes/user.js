var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')

// verifies the user is logged in
router.get('/', function(req, res) {
  const token = req.query.token;
  if (!token) {return res.status(401).json({ message: 'No token provided.' });}
  jwt.verify(token, "EngWeb2024", (err, decoded) => {
    if (err) {return res.status(403).json({ message: 'Failed to authenticate token.' });}
    else {res.json({ message: 'Token is valid.' });}
  });
});

// returns current user details (username and level) based on the token
router.get('/details', function(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "EngWeb2024", (err, decoded) => {
    if (err) { return res.status(403).json({ message: 'Failed to authenticate token.' });}
    else {res.json({username: decoded.username, level: decoded.level });}
  });
});

// registers a user
router.post('/register', function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  userModel.register(new userModel({ email: req.body.email,
                                     username: req.body.username, 
                                     name: req.body.name, 
                                     level: req.body.level, 
                                     active: true, 
                                     dateLastAccess: d,
                                     dateCreated: d,
                                     _id: req.body.username
                                   }), 
                                  req.body.password, 
                                  function(err, user) {
                                    if (err) {
                                      console.log(err)
                                      res.status(530).jsonp({error: err})
                                    } else{
                                      passport.authenticate("local")(req,res,function(){
                                        jwt.sign({ username: req.user._id, level: req.user.level, 
                                          sub: 'aula de EngWeb2023'}, // might not be necessary
                                          "EngWeb2024",
                                          {expiresIn: 3600},
                                          function(e, token) {
                                            if(e) res.status(500).jsonp({error: "Error generating the token: " + e}) 
                                            else res.status(201).jsonp({token: token})
                                          });
                                      })
                                    }     
  })
})

// logs in a user
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {return res.status(500).json({ error: 'Internal Server Error' });}
    if (!user) {return res.status(401).json({ error: 'Invalid credentials' });}
    req.logIn(user, function(err) {
      if (err) {return res.status(500).json({ error: 'Could not log in user' });}
      jwt.sign({ username: user.username, level: user.level, sub: 'aula de EngWeb2024' }, 
               'EngWeb2024', { expiresIn: 3600 }, function(e, token) {
        if (e) {return res.status(500).json({ error: "Erro na geração do token: " + e });}
        res.status(201).json({ token: token });
      });
    });
  })(req, res, next);
});


module.exports = router;