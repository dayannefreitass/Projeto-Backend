const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

const getUserById = async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica se o token é válido
        jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(204).send(); // Requisição bem-sucedida, mas sem conteúdo
    } catch (error) {
        console.error('Error fetching user:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getUserById
};
