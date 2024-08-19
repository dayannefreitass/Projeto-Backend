// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env; // Certifique-se de definir SECRET_KEY no seu .env

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'

    if (!token) return res.status(400).json({ message: 'Bad Request: Missing token' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
