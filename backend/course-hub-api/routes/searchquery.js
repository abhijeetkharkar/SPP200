var express = require('express');
var router = express.Router();
var controller = require('../controller/searchquery');

/* GET home page. */
router.post('/searchquery', controller.searchquery);

module.exports = router;