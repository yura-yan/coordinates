const express = require('express')
const sequelize = require('./utils/database')
const mainRoute = require('./routes/main')
const moment = require('moment')

const app = express()

const PORT = process.env.PORT || 3000

moment.suppressDeprecationWarnings = true;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/coordinates', mainRoute)

// сначала функция ждет пока будет подлючение к базу данным и потом запускает сервер
async function start() {
    try {
        await sequelize.sync()
        app.listen(PORT)
    } catch (error) {
        console.log(error)
    }
}
start()