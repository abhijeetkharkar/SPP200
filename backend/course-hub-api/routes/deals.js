var express = require('express');
var router = express.Router();
var deals = require('../controller/deals')

/* GET home page. */
router.post('/deals', deals.courseDeals);

module.exports = router;