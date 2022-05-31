var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var GameController = require('../controllers/GameController.js');

/*
 * GET
 */

router.get('/:id', UserController.show);
router.get('/:id/history', GameController.showPlayerHistory);

/*
 * PUT
 */
router.put('/:id', UserController.update);

module.exports = router;
