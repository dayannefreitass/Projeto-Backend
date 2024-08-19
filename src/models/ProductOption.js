const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de que este caminho está correto

const ProductOption = sequelize.define('ProductOption', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shape: {
    type: DataTypes.ENUM('square', 'circle'),
    allowNull: true,
    defaultValue: 'square',
  },
  radius: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.ENUM('text', 'color'),
    allowNull: true,
    defaultValue: 'text',
  },
  values: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Isso irá adicionar as colunas `created_at` e `updated_at`
  tableName: 'product_options', // Nome da tabela no banco de dados
});

module.exports = ProductOption;
