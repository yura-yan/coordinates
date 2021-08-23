const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database');
const coordinate = require('./coordinate');

// определяем схему для моделя user
const user = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
// отключаем поля createdAt и updatedAt из таблицы
    {
        timestamps: false,

        createdAt: false,

        updatedAt: false,
    })

// связываем таблицу user с таблицей coordinate
user.hasMany(coordinate, { onDelete: "cascade"});

module.exports = user