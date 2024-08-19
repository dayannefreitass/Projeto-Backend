const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // ID será incrementado automaticamente
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
}, {
    timestamps: true,  // Gera automaticamente created_at e updated_at
});

module.exports = Category;
