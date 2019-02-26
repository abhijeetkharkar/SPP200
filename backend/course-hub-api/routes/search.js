var express = require('express');
var router = express.Router();
var search = require('../controller/search')

/* GET home page. */
router.get('/autosuggest', search.autosuggest)

module.exports = router;