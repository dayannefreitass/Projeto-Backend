const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // ID será incrementado automaticamente
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Valor padrão é 0 (falso)
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,  // Preenchimento obrigatório
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,  // Preenchimento obrigatório
    },
    use_in_menu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Valor padrão é 0 (falso)
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,  // Valor padrão é 0
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,  // Preenchimento opcional
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,  // Preenchimento obrigatório
    },
    price_with_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,  // Preenchimento obrigatório
    },
}, {
    timestamps: true,  // Gera automaticamente created_at e updated_at
});

module.exports = Product;
