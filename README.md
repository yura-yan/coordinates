Проект создан на фреймворке Express.js и использует Sequelize ORM для работы с базой данных

Имеется два метода:

1 - /coordinates GET метод, который отдает GPS координаты по id пользователя и по дате. Id и дата предаются как query параметры и 
они обязательны. Id должно быть целочисленным а формат даты должно быть MM/DD/YYYY или можно передать две даты в формате MM/DD/YYYY,MM/DD/YYYY

2 - /coordinates POST метод, который создает новые координати по id пользователя и связывает эти координати с пользователем. Передаются POST 
данные в таком формате: "id: 1, name: 'Алексей', coordinates: [3.5,4.1], date: 22/05/2018"

Проект можно тестировать с помощью сервиса Postman
