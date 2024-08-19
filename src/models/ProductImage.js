const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de que este caminho está correto

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // Verifique se este é o nome correto do seu modelo de produto
      key: 'id',
    },
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Isso irá adicionar as colunas `created_at` e `updated_at`
  tableName: 'product_images', // Nome da tabela no banco de dados
});

module.exports = ProductImage;
