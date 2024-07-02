
# Мессенджер: Nestjs, ReactJS, MongoDB, WebSocket

Функции:

1.Регистрация, логин <br />
2.Отправка сообщений в режиме реального времени через WebSocket(текст, изображения) <br /> 
3.Отслеживания статуса пользователя в режиме реального времени через WebSocket <br /> 
4.Поиск пользователей <br /> 
5.Добавление контактов <br />


## Запуск

Перед запуском в каталоге **/serice/src/app.module.ts** поменяйте **MONGODB_URL** на **свою строчку подключения** к базе данных MongoDB <br />
<br />

Что запустить проект, перейти в каталог **serice** из терминала и запустить **(серверная часть)**:

```bash
  npm run start:dev
```
Потом из каталога **serice_clent** запустить команды **(клиентская часть)**:

```bash
  npm start
```
По необходимости запустить команду для установки пакетов в каталогах:
```bash
  npm install
```


## Переменные окружения

В каталоге **serice** в .env файле переменные **(серверная часть)**: <br />
<br />
JWT_ACCES_SECRET - секрет для jwt access токенов <br />
JWT_REFRESH_SECRET - секрет для jwt refresh токенов <br />
EXPIRE_ACCESS - время жизни access токена <br />
EXPIRE_REFRESH - время жизни refresh токена <br />
<br />
<br />
В каталоге **serice_clent** в .env файле переменные **(клиентская часть)**: <br />
<br />
REACT_APP_SERVER_URL- url серверной части

## Схемы
1. Схемы отображения статуса пользователя:<br />

![alt text](https://thumb.cloud.mail.ru/weblink/thumb/xw1/NnQW/QS3F98wen)

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
<br />
<br />
![alt text](https://thumb.cloud.mail.ru/weblink/thumb/xw1/XtAW/iWHSbawin)

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
<br />
<br />
![alt text](https://thumb.cloud.mail.ru/weblink/thumb/xw1/iMsF/NUMAuAdva)

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
<br /><br />
