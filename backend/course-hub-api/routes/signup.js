var express = require('express');
var router = express.Router();
var homepage = require('../controller/index')
var signup = require('../controller/signup')

/* GET home page. */
router.get('/signup', signup.addUsers)

module.exports = router;
