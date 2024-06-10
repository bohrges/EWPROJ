var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require("mongoose")
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var mongoDB = 'mongodb://127.0.0.1/genere';

mongoose.connect(mongoDB, {useNewUrlParser : true, useUnifiedTopology: true})

var db = mongoose.connection

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'))
db.once('open', () => {
  console.log('Conexão ao MongoDB realizada com sucesso')
})

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var datasetRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var userRouter = require('./routes/user');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'EngWeb2024',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/posts',postsRouter); 
app.use('/users', userRouter);
app.use('/', datasetRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.jsonp(JSON.stringify(err));
});


module.exports = app;