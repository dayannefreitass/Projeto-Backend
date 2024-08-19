const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/v1/user/:id', userController.getUserById);

router.post('/v1/user', userController.createUser);

module.exports = router;
