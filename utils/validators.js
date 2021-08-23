const { body, query } = require('express-validator')

// валидация query параметров
exports.queryValidators = [
    // если id не int то валидатор выбрасывает ошибку с сообщением 
    query('id')
        .isInt()
        .withMessage('Пожалуйста введите правильный id'),
    // валидатор проверяет поля даты существует или нет
    query('date')
        .custom((value) => {
            if (!value) {
                return false
            }
            return true
        })
        .withMessage('Пожалуйста введите дату, поля даты не может быть пустой')
]

// валидация post параметров
exports.postValidators = [
    // если id не int то валидатор выбрасывает ошибку с сообщением 
    body('id')
        .isInt()
        .withMessage('Пожалуйста введите правильный id'),
        // валидатор проверяет длину поля name
    body('name')
        .isLength({ min: 3 }).withMessage('Поля имя должно содержать минимум 3 буквы')
        .trim(),
    // координаты должны быть массивами с числами с плавающей запятой
    body('coordinates')
        .isArray()
        .custom((value) => {
            if ((Number(value[0]) === value[0] && value[0] % 1 !== 0) && (Number(value[1]) === value[1] && value[1] % 1 !== 0)) {
                return true
            }
            return false
        })
        .withMessage('Пожалуйста введите правильные координаты'),
    // Формат даты должно быть MM/DD/YYYY
    body('date')
        .custom((value) => {
            if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(value)) {
                return true
            }
            throw new Error('Пожалуйста введите правильную дату в формате "MM/DD/YYYY"')
        })
]