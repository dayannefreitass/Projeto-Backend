const express = require('express');
const { Category } = require('../models'); // Ajuste o caminho para o modelo correto
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes');

const app = express();
const router = express.Router();

// Middleware para parsing de JSON
app.use(express.json());

// Roteamento para categorias
router.get('/v1/category/search', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const fields = req.query.fields ? req.query.fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'];
        const useInMenu = req.query.use_in_menu === 'true';

        const queryOptions = {};
        if (limit !== -1) {
            queryOptions.limit = limit;
            queryOptions.offset = (page - 1) * limit;
        }

        if (req.query.use_in_menu) {
            queryOptions.where = { use_in_menu: useInMenu };
        }

        queryOptions.attributes = fields;

        const categories = await Category.findAll(queryOptions);
        const total = await Category.count(queryOptions.where ? { where: queryOptions.where } : {});

        const response = {
            data: categories,
            total,
            limit,
            page
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Rotas de usuários
app.use('/api', userRoutes);

// Rotas de produtos
app.use('/api/products', productRoutes);

// Configuração do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
