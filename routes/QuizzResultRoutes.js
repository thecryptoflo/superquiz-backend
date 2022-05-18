var express = require('express');
var router = express.Router();
var QuizzResultController = require('../controllers/QuizzResultController.js');

/*
 * GET
 */
router.get('/', QuizzResultController.list);

/*
 * GET
 */
router.get('/:id', QuizzResultController.show);

module.exports = router;
