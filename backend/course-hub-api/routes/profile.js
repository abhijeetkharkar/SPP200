var express = require('express');
var router = express.Router();

var profileController = require('../controller/profile');

/* GET Profile page. */
router.post('/profile:id', profileController.viewProfile);

module.exports = router;