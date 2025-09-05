# centervnl.ru

## Структура проекта:

[admin](.\admin) - клиент админки на angular  
[public](.\public) - статические файлы для работы сайта  
[server](.\server) - основная папка сайта  
  [server\api](.\server\api) - API для работы админки  
  [server\config](.\server\config) - настройки конфигурации  
  [server\controllers](.\server\controllers) - контроллеры сайта  
  [server\middleware](.\server\middleware) - middleware сайта  
  [server\routes](.\server\routes) - роуты сайта  
  [server\views](.\server\views) - шаблоны страниц jade (pug)  
uploads - папка для загрузки пользовательских файлов  


## Как запустить:

1. Клонировать репозиторий
2. Настроить MongoDB
3. Настройть конфигурацию [keys.dev.js](.\server\config\keys.dev.js)
```
module.exports = {
  mongoURI:       // ссылка на подключение к MongoDB
  jwt: 'dev-jwt',
  emailUser:      // почта (не обязательно)
  emailPassword:  // пароль от почты (не обязательно)
}
```
4. Установить зависимости для сервера `npm i`
5. Запустить сервер в режиме разработки `npm run server`. Сайт запустится на http://localhost:5001/.
6. Установить зависимости для админки `cd admin` и `npm i`
7. Запустить сервер + админку в режиме разработки `npm run dev`