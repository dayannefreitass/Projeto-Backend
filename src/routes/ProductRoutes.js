// src/routes/productRoutes.js
const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductImage = require('../models/ProductImage');
const ProductOption = require('../models/ProductOption');
const authenticateToken = require('../middlewares/authMiddleware'); // Adicione a importação
const router = express.Router();

// Rota para criação de um novo produto
router.post('/', authenticateToken, async (req, res) => { // Adicione authenticateToken
    try {
        const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

        // Validação simples dos campos obrigatórios
        if (!name || !slug || !price || !category_ids || !images) {
            return res.status(400).json({ message: 'Bad Request: Missing required fields' });
        }

        // Criação do produto
        const newProduct = await Product.create({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Adicionando categorias ao produto
        if (category_ids.length) {
            const categories = await ProductCategory.findAll({
                where: { id: { [Op.in]: category_ids } }
            });
            await newProduct.setCategories(categories);
        }

        // Adicionando imagens ao produto
        if (images.length) {
            const imagePromises = images.map(img => ProductImage.create({
                product_id: newProduct.id,
                type: img.type,
                content: img.content
            }));
            await Promise.all(imagePromises);
        }

        // Adicionando opções ao produto
        if (options.length) {
            const optionPromises = options.map(opt => ProductOption.create({
                product_id: newProduct.id,
                title: opt.title,
                shape: opt.shape,
                radius: opt.radius,
                type: opt.type,
                values: opt.values.join(',')
            }));
            await Promise.all(optionPromises);
        }

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Rota de busca de produtos com filtros
router.get('/search', async (req, res) => {
    try {
        const { limit = 12, page = 1, match, category_ids, priceRange, ...options } = req.query;

        let queryOptions = {
            where: {},
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            include: [{ model: ProductCategory }, { model: ProductImage }, { model: ProductOption }]
        };

        if (match) {
            queryOptions.where = {
                ...queryOptions.where,
                [Op.or]: [
                    { name: { [Op.like]: `%${match}%` } },
                    { description: { [Op.like]: `%${match}%` } }
                ]
            };
        }

        if (category_ids) {
            const categoryIdArray = category_ids.split(',').map(id => parseInt(id));
            queryOptions.include[0].where = { id: { [Op.in]: categoryIdArray } };
        }

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            queryOptions.where.price = {
                [Op.between]: [minPrice, maxPrice]
            };
        }

        Object.keys(options).forEach(optionKey => {
            if (optionKey.startsWith('option[')) {
                const optionId = optionKey.match(/\d+/)[0];
                const optionValues = options[optionKey].split(',');
                queryOptions.include[2].where = {
                    id: optionId,
                    values: { [Op.or]: optionValues }
                };
            }
        });

        const products = await Product.findAndCountAll(queryOptions);

        res.status(200).json({
            data: products.rows,
            total: products.count,
            limit: parseInt(limit),
            page: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Rota para atualização de produto
router.put('/:id', authenticateToken, async (req, res) => { // Adicione authenticateToken
    try {
        const { id } = req.params;
        const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

        // Busca do produto pelo ID
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Atualização dos dados do produto
        await product.update({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Atualização das categorias do produto
        if (category_ids && category_ids.length) {
            const categories = await ProductCategory.findAll({
                where: { id: { [Op.in]: category_ids } }
            });
            await product.setCategories(categories);
        }

        // Atualização das imagens do produto
        if (images && images.length) {
            for (const img of images) {
                if (img.deleted && img.id) {
                    // Deletar imagem existente
                    await ProductImage.destroy({ where: { id: img.id } });
                } else if (img.id) {
                    // Atualizar imagem existente
                    await ProductImage.update(
                        { type: img.type, content: img.content },
                        { where: { id: img.id } }
                    );
                } else {
                    // Criar nova imagem
                    await ProductImage.create({
                        product_id: product.id,
                        type: img.type,
                        content: img.content
                    });
                }
            }
        }

        // Atualização das opções do produto
        if (options && options.length) {
            for (const opt of options) {
                if (opt.deleted && opt.id) {
                    // Deletar opção existente
                    await ProductOption.destroy({ where: { id: opt.id } });
                } else if (opt.id) {
                    // Atualizar opção existente
                    await ProductOption.update(
                        { radius: opt.radius, values: opt.values ? opt.values.join(',') : null },
                        { where: { id: opt.id } }
                    );
                } else {
                    // Criar nova opção
                    await ProductOption.create({
                        product_id: product.id,
                        title: opt.title,
                        shape: opt.shape,
                        type: opt.type,
                        values: opt.values ? opt.values.join(',') : null
                    });
                }
            }
        }

        res.status(204).send(); // No Content
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

// Rota para exclusão de produto
router.delete('/:id', authenticateToken, async (req, res) => { // Adicione authenticateToken
    try {
        const { id } = req.params;

        // Busca do produto pelo ID
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Exclusão do produto
        await product.destroy();

        res.status(204).send(); // No Content
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

module.exports = router;
