var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require('firebase');
var fs = require('fs');

// Loading Configuration from the keys.json file 
var obj = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Loading config keys in a config object.
var config = {
	apiKey: obj.firebase_apiKey,
	authDomain: obj.firebase_authDomain,
	databaseURL: obj.firebase_databaseURL,
	storageBucket: obj.firebase_storageBucket,
	messagingSenderId: obj.firebase_messagingSenderId,
	projectId: obj.firebase_projectId
};


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', indexRouter);
app.post('/signup', jsonParser, signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  res.json({
    status: err.status || 500,
    message: err.message
  })
});

module.exports = app;