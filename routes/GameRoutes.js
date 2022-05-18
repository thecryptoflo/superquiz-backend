var express = require('express');
var router = express.Router();
var GameController = require('../controllers/GameController.js');

/*
 * GET
 */
router.get('/:id', GameController.show);

/*
 * POST
 */
router.post('/', GameController.create);
router.post('/:id/start', GameController.startGame);
router.post('/:id/answer', GameController.answerQuestion);
router.post('/:id/next', GameController.nextQuestion);

module.exports = router;
