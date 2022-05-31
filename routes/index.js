var express = require('express');
var router = express.Router();
var GameController = require('../controllers/GameController.js');
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");

/**
 * Only public route there, no auth needed
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json("Hello there");
});

/* GET leaderboard. */
router.get('/categories', CategoryController.list);

router.get('/leaderboard', GameController.showLeaderboard);

/*
 * POST
 */

router.post('/register', UserController.create);

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

module.exports = router;
