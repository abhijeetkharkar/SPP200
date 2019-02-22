var express = require('express');
var router = express.Router();
// var homepage = require('../controller/index')
var signUpController = require('../controller/signup')

/* GET SignUp page. */
router.get('/signup', signUpController.addUsers)

module.exports = router;