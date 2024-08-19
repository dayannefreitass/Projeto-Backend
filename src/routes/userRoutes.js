// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// Endpoint para obter um usuário pelo ID
router.get('/v1/user/:id', authenticateToken, userController.getUserById);

// Endpoint para deletar um usuário pelo ID
router.delete('/v1/user/:id', authenticateToken, userController.deleteUserById);

// Endpoint para gerar token JWT
router.post('/v1/user/token', userController.generateToken);

module.exports = router;
