const express = require('express');
const { Category } = require('../models'); // Certifique-se de que o modelo Category está exportado corretamente
const router = express.Router();

// Endpoint para cadastrar uma nova categoria
router.post('/', async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;

        // Verificação básica dos campos obrigatórios
        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required' });
        }

        // Criação da nova categoria
        const newCategory = await Category.create({
            name,
            slug,
            use_in_menu: use_in_menu || false // Valor padrão para use_in_menu é false
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Endpoint para obter uma categoria pelo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Endpoint para obter uma lista de categorias com filtros
router.get('/search', async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, use_in_menu } = req.query;

        const options = {
            limit: limit === '-1' ? null : parseInt(limit),
            offset: (page - 1) * limit,
            attributes: fields ? fields.split(',') : undefined,
            where: use_in_menu ? { use_in_menu: true } : undefined
        };

        const categories = await Category.findAndCountAll(options);

        res.status(200).json({
            data: categories.rows,
            total: categories.count,
            limit: parseInt(limit),
            page: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Endpoint para atualizar uma categoria pelo ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, use_in_menu } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.use_in_menu = use_in_menu !== undefined ? use_in_menu : category.use_in_menu;

        await category.save();

        res.status(204).send(); // Nenhum conteúdo é retornado, apenas o status 204
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Endpoint para deletar uma categoria pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se a categoria existe
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Deleta a categoria
        await Category.destroy({ where: { id } });

        // Retorna sucesso sem conteúdo
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

module.exports = router;
