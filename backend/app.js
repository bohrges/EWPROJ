var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require("mongoose")
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var cors = require('cors'); // Make sure to require the cors module

//var mongoDB = 'mongodb://127.0.0.1/genere';
var mongoDB = 'mongodb://mongodb/genere';

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
var suggestionsRouter = require('./routes/suggestions');

var app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Adjust this to your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));


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
app.use('/suggestions', suggestionsRouter);
app.use('/', datasetRouter);

// File upload route
const multer = require('multer');
const fs = require('fs');
const Genere = require('./controllers/genere'); // Adjust the path to your controller
const upload = multer({ dest: 'uploads/' });

app.post('/upload-json', upload.single('jsonFile'), (req, res) => {
  console.log('Received a file upload request');
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  const oldPath = path.join(__dirname, 'uploads', req.file.filename);

  // Read the uploaded JSON file
  fs.readFile(oldPath, 'utf8', (readError, data) => {
    if (readError) {
      console.log('Error reading file:', readError);
      return res.status(500).send('Error reading file.');
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.log('Invalid JSON file:', parseError);
      return res.status(400).send('Invalid JSON file.');
    }

    // Store the JSON data in MongoDB using the Genere controller
    Genere.insert(jsonData)
      .then(result => {
        res.send("Data successfully uploaded and inserted into MongoDB.");
        // Optionally, delete the uploaded file after successful insertion
        fs.unlink(oldPath, (unlinkError) => {
          if (unlinkError) {
            console.error('Error deleting original file:', unlinkError);
          }
        });
      })
      .catch(error => {
        console.error("Error inserting data into MongoDB", error);
        res.status(500).send("Failed to insert data into database");
      });
  });
});

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