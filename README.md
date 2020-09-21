# zimad_test
Перед запуском проектом следует запустить команду 
~~~ 
npm i 
~~~
Далее запуск проекта 
~~~ 
npm run start
~~~
Проект запускается на 3000 порту.

Для проверки работоспособности, системе следует отправить след. запросы по образцу:
* /signin [POST]
~~~
POST http://localhost:3000/signin/

Content-Type: application/json
{
  "id":"username",
  "password":"password"
}
~~~
* /signin/new_token [POST]
~~~
POST http://localhost:3000/signin/new_token/
Content-Type: application/json
{
  "refreshToken":"refresh token here"
}
~~~
* /signup [POST]
~~~
POST http://localhost:3000/signup/
Content-Type: application/json
{
  "id":"user3",
  "password":"3"
}
~~~
* /file/upload [POST] файл для загрузки следует прикрепить в теле запроса
~~~
POST http://localhost:3000/file/upload
Authorization: Bearer <bearer token here>
~~~
* /file/list [GET] В примере выбор 3ей страницы, размер страницы: 2
~~~
GET http://localhost:3000/file/list?list_size=2&page=3
Authorization: Bearer <bearer token here>
~~~
* /file/delete/:id [DELETE] В параметрах следует указать id файла
~~~
DELETE http://localhost:3000/file/delete?id=42
Authorization: Bearer <bearer token here>
~~~
* /file/:id [GET] В параметрах следует  указать id файла
~~~
GET http://localhost:3000/file?id=42
Authorization: Bearer <bearer token here>
~~~
* /file/download/:id [GET]  В параметрах следует  указать id файла
~~~
GET http://localhost:3000/file/download?id=42
Authorization: Bearer <bearer token here>
~~~
* /file/update/:id [PUT] файл для загрузки следует прикрепить в теле запроса. В параметрах следует  указать id обновляемого файла
~~~
GET http://localhost:3000/file/update?id=42
Authorization: Bearer <bearer token here>
~~~
* /info [GET] 
~~~
GET http://localhost:3000/info
Authorization: Bearer <bearer token here>
~~~
* /logout [GET] 
~~~
GET http://localhost:3000/logout
Authorization: Bearer <bearer token here>
~~~


Структура проекта:
* /database - содержит в себе файл db_utils с запросами и dbconfig с конфигом подключения
* /models - содержит в себе модели классов (только класс файлов)
* /routes - содержит все роуты
	* file.js - все роуты /file
	* info.js - все роуты /info
	* latency.js - все роуты /latency
	* logout.js - все роуты /logout
	* signin.js - все роуты /signin
	* signup.js - все роуты /signup
* .env - содержат ключи для создания access и refresh токенов  
* app.js - основное приложение 
* requests.rest - содержит в себе часть запросов для тестирования 
