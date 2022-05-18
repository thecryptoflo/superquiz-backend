var express = require('express');
var router = express.Router();
var MainController = require('../controllers/MainController.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.session.userId);
  res.json("Hey");
});

module.exports = router;
