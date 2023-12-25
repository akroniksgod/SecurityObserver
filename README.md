# SecurityObserver

Система представляет собой надежный, безотказный механизм пропуска рабочего перснала на режимный объект. Включает в себя обработку персональных данных, ведение статистики посещения рабочих мест.

Суть заключается в том, что сотрудник на входе в офис показывает QR-код на камеру. Некоторый турникет (в нашем случае замок) позволяет человеку пройти в офис, если он успешно распознался, т.е. является сотрудником фирмы. В веб-приложении администратор может просматривать информацию по сотрудникам фирмы, смотреть статистику посещаемости.

### Надежной и безотказной системой занимаются студенты группы АСУ-20-1б:

- Галинов Олег Юрьевич
- Карелов Вадим Андреевич 
- Тедеев Александр Зурабович
- Черных Артём Дмитриевич

Программа доступна только администрирующему персоналу, т.е. можно делать без системы аутентификации. Выделим следующие требования к проекту:
### Требования к интерфейсу:

- Просмотр списка всех зарегистрированных пользователей (из БД)
- Когда выбираем пользователя из списка можем:


    2.1. посмотреть базовую информацию о человеке (ФИО и тому подобное)

    2.2. посмотреть служебную информацию (просмотр входа/выхода за каждую неделю текущего месяца)

    2.3. просмотреть отработанные часы

- Генерация QR кодов на сайте для сотрудников

### Структура приложения

- СУБД: PostgreSQL
- Веб-приложение: React.js
- Backend-приложение: Flask - связующее звено между БД. Принимает запросы от Raspeberry PI и Web-приложения
- Приложение Rasberry: Flask 

### Требования к логгированию:

- события выхода и выхода человека по след шаблону: дата;время;имяизбд;
- запросы к БД

### Требования к внешним устройствам
- Наличие raspberry pi
- Наличие камеры
- Наличие замка