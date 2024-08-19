const express = require('express');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('../routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
