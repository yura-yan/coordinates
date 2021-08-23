const { Router } = require('express')
const { validationResult } = require('express-validator')
const { postValidators } = require('../utils/validators')
const { queryValidators } = require('../utils/validators')
const Coordinate = require('../models/coordinate')
const User = require('../models/user')

const router = Router()

// метод GET
router.get('/', queryValidators, async (req, res) => {

// если валидатор обнаружил ошибку код прекращает выполняться дальше, и отправляется сообщение об ошибке
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        })
    }

    let startedDate
    let endDate
    let coordinates = []

// проверяем нам пришло одна дата или две даты
    if (/,/.test(req.query.date)) {
        const start = req.query.date.match(/.+(?=,)/)
        // переменная startedDate равен начальной дате
        startedDate = start[0]
        const end = req.query.date.match(/(?<=,).+/)
        // переменная endDate равен конечной дате
        endDate = end[0]

        // проверяем начальную и конечную дату на формат MM/DD//YYYY
        if (!(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(startedDate)) || !(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(endDate))) {
            return res.status(400).json({
                message: 'Пожалуйста введите правильную дату в формате "MM/DD/YYYY"'
            })
        }

        // проверяем чтобы начальная дата была не больше конечной даты
        let fdate = new Date(startedDate)
        let ldate = new Date(endDate)
        if (fdate.valueOf() > ldate.valueOf()) {
            return res.status(400).json({
                message: 'Начальная дата должно быть меньше конечной даты'
            })
        }
    }
    // если нам пришло одна дата снова проверяем его формат на MM/DD/YYYY
    else if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(req.query.date)) {
        startedDate = req.query.date
    } else {
        return res.status(400).json({
            message: 'Пожалуйста введите правильную дату в формате "MM/DD/YYYY"'
        })
    }

    // ищем пользователя по id
    User.findByPk(req.query.id).then(user => {

        if (!user) return res.status(404).json({ message: 'Пользователь с таким id не найден' })

        // если пользователь найден ищем его координаты с помощью функции getCoordinate
        user.getCoordinates()
            .then(result => {
                // если координаты найдены обрабатываем их в цикле чтобы отфильтровать по дате
                for (let i = 0; i < result.length; i++) {
                    // проверяем нам пришло одна дата или две даты
                    if (startedDate && endDate) {
                        let cDate = new Date(result[i].date)
                        cDate.setHours(0, 0, 0, 0)
                        let fDate = new Date(startedDate)
                        fDate.setHours(0, 0, 0, 0)
                        let lDate = new Date(endDate)
                        lDate.setHours(0, 0, 0, 0)
                        
                        // делаем фильтрацию координат по начальной и конечной дате
                        if (cDate.toUTCString() >= fDate.toUTCString() || cDate.toUTCString() <= lDate.toUTCString()) {
                            coordinates.push(result[i].coordinates)
                        }
                    } else {
                        let cDate = new Date(result[i].date)
                        cDate.setHours(0, 0, 0, 0)
                        let fDate = new Date(startedDate)
                        fDate.setHours(0, 0, 0, 0)

                        // делаем фильтрацию координат по одной дате
                        if (cDate.toUTCString() === fDate.toUTCString()) {
                            coordinates = (result[i].coordinates)
                        }
                    }
                }
                
                res.status(200).json({
                    user: user.name,
                    coordinates: coordinates})
            })
            .catch(err => res.status(500).json({
                message: err
            }))
    }).catch(err => res.status(500).json({
        message: err
    }))
})

// метод POST
router.post('/', postValidators, async (req, res) => {

// если валидатор обнаружил ошибку код прекращает выполняться дальше, и отправляется сообщение об ошибке
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        })
    }

// ищем пользователя по id
    User.findByPk(req.body.id).then(user => {
        
        if (!user) {
            // если пользователь не найден создаем его
            User.create({
                id: req.body.id,
                name: req.body.name
            })
                .then(res => {
                    const userId = res.id;
                    // создаем координаты и связываем их с пользователем по полю userId
                    Coordinate.create({
                        coordinates: req.body.coordinates,
                        date: new Date(req.body.date),
                        userId: userId
                    }).catch(err => res.status(500).json({
                        message: err
                    }))
                })
                .catch(err => res.status(500).json({
                    message: err
                }));
        }
        else {
            // если пользователь найден создаем координаты и связываем их с пользователем с помощью функции createCoordinate
            user.createCoordinate({
                coordinates: req.body.coordinates,
                date: new Date(req.body.date)
            }).catch(err => console.log(err));
        }
    }).catch(err => res.status(500).json({
        message: err
    }));

    res.status(201).json({
        message: 'Координаты успешно созданы'
    })
})

module.exports = router