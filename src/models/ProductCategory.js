const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de que este caminho está correto

const ProductCategory = sequelize.define('ProductCategory', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // Nome do modelo de produtos
      key: 'id',
    },
    onDelete: 'CASCADE', // Define o comportamento em caso de exclusão do produto
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories', // Nome do modelo de categorias
      key: 'id',
    },
    onDelete: 'CASCADE', // Define o comportamento em caso de exclusão da categoria
  },
}, {
  timestamps: false, // Se não precisar de `created_at` e `updated_at`
  tableName: 'product_categories', // Nome da tabela no banco de dados
});

module.exports = ProductCategory;
