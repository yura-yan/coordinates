const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database');

// определяем схему для моделя coordinate
const coordinate = sequelize.define('coordinate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    coordinates: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
}, 
// отключаем поля createdAt и updatedAt из таблицы
    {
        timestamps: false,

        createdAt: false,

        updatedAt: false,
    })

module.exports = coordinate