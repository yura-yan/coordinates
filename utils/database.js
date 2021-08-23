const { Sequelize } = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false
})

module.exports = sequelize