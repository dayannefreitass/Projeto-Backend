// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);

    const statusCode = err.statusCode || 500; // Se `statusCode` não estiver definido, usa 500
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
