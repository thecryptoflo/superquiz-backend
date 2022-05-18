var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * GET
 */

router.get('/:id', UserController.show);

router.get('/logout', UserController.logout);

/*

 * POST
 */
router.post('/', UserController.create);

router.post('/login', UserController.login);

/*
 * PUT
 */
router.put('/:id', UserController.update);

module.exports = router;
