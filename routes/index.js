var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('Hi there');
});

module.exports = router;
