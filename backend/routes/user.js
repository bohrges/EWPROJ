var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

router.get('/', auth.verificaAcesso, function(req, res){
  User.list()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/:id', auth.verificaAcesso, function(req, res){
  User.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/', auth.verificaAcesso, function(req, res){
  User.addUser(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/register', function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  userModel.register(new userModel({ email: req.body.email,
                                     username: req.body.username, 
                                     name: req.body.name, 
                                     filiacao: req.body.filiacao,
                                     level: req.body.level, 
                                     active: true, 
                                     dateLastAccess: d,
                                     dateCreated: d
                                   }), 
                                  req.body.password, 
                                  function(err, user) {
                                    if (err) 
                                      res.jsonp({error: err, message: "Register error: " + err})
                                    else{
                                      passport.authenticate("local")(req,res,function(){
                                        jwt.sign({ username: req.user.username, level: req.user.level, 
                                          sub: 'aula de EngWeb2023'}, 
                                          "EngWeb2023",
                                          {expiresIn: 3600},
                                          function(e, token) {
                                            if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                                            else res.status(201).jsonp({token: token})
                                          });
                                      })
                                    }     
  })
})


/*
router.post('/login', passport.authenticate('local'),  function(req, res){
  console.log("got to the backend")
  console.log(req.body)
  var d = new Date().toISOString().substring(0,19)
  User.updateUserLastAccess(req.user._id, d)
  jwt.sign({ username: req.user.username, level: req.user.level, 
    sub: 'aula de EngWeb2024'}, 
    "EngWeb2024",
    {expiresIn: 3600},
    function(e, token) {
      if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
  });
})*/

router.post('/login', function(req, res, next) {
  console.log(req.body);  // First log the incoming credentials

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!user) {
      console.log(info); // Log the info message from passport if user authentication fails
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not log in user' });
      }
      jwt.sign({ username: user.username, level: user.level, sub: 'aula de EngWeb2024' }, 
               'EngWeb2024', { expiresIn: 3600 }, function(e, token) {
        if (e) {
          console.error(e);
          return res.status(500).json({ error: "Erro na geração do token: " + e });
        }
        res.status(201).json({ token: token });
      });
    });
  })(req, res, next);
});



router.put('/:id', auth.verificaAcesso, function(req, res) {
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/desativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/ativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/password', auth.verificaAcesso, function(req, res) {
  User.updateUserPassword(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.delete('/:id', auth.verificaAcesso, function(req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na remoção do utilizador"})
    })
})

module.exports = router;