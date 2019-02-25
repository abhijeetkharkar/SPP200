
var express = require('express');
var router = express.Router();
var homepage = require('../controller/index')

/* GET home page. */
router.get('/', homepage.indexpage)

module.exports = router;