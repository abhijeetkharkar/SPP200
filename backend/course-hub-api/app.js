var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require('firebase');
var fs = require('fs');

// Loading Configuration from the keys.json file
// var obj = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

var indexRouter = require('./routes/index');
var autosuggestRouter = require('./routes/search');

var signupRouter = require('./routes/signup');
var profileRouter = require('./routes/profile');
var searchQueryRouter = require('./routes/searchquery');
var dealsQueryRouter = require('./routes/deals');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', indexRouter);
app.get('/autosuggest', autosuggestRouter);

app.get('/', indexRouter);
app.get('/profile:id', profileRouter);
app.post('/signup', signupRouter);
app.post('/searchquery', searchQueryRouter);
app.post('/deals', dealsQueryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    status: err.status || 500,
    message: err.message
  })
});

module.exports = app;