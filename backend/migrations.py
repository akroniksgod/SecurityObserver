import random
from datetime import datetime, timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import Models
import string
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.DB_CONNECTION_STR
db = SQLAlchemy(app)
migrate = Migrate(app, db)


def generate_random_date(start_date, end_date):
    # Преобразование строк в объекты datetime
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    # Вычисление разницы между начальной и конечной датами
    delta = end_date - start_date

    # Генерация случайного числа в пределах разницы дней
    random_days = random.randint(0, delta.days)

    # Создание новой даты путем добавления случайного количества дней к начальной дате
    random_date = start_date + timedelta(days=random_days)

    return random_date


def generate_random_status():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 1)

    # Возвращение "Успешно", если random_number равен 1, иначе "Неуспешно"
    return "Успешно" if random_number == 1 else "Неуспешно"


def generate_random_surname():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "Иванов"
        case 1: return "Суворов"
        case 2: return "Петров"
        case 3: return "Соколов"
        case 4: return "Сидоров"
        case 5: return "Денисов"


def generate_random_name():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "Иван"
        case 1: return "Александр"
        case 2: return "Петр"
        case 3: return "Вячеслав"
        case 4: return "Юрий"
        case 5: return "Сергей"


def generate_random_patronymic():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "Иванович"
        case 1: return "Александрович"
        case 2: return "Петрович"
        case 3: return "Вячеславович"
        case 4: return "Юрьевич"
        case 5: return "Сергеевич"


def generate_random_street():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "Ленина, "
        case 1: return "Завьялова, "
        case 2: return "Королева, "
        case 3: return "Веденеева, "
        case 4: return "Поздеева, "
        case 5: return "Сталина, "


def generate_random_house_num():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "10"
        case 1: return "15"
        case 2: return "25"
        case 3: return "44"
        case 4: return "33"
        case 5: return "12"


def generate_random_position():
    # Генерация случайного числа (0 или 1)
    random_number = random.randint(0, 5)
    match random_number:
        case 0: return "Директор"
        case 1: return "Бухгалтер"
        case 2: return "Программист"
        case 3: return "Инженер"
        case 4: return "Рабочий"
        case 5: return "Уборщик"


def generate_random_phone_number():
    # Генерация случайного кода оператора (например, 901)
    operator_code = str(random.randint(900, 999))

    # Генерация случайного номера телефона (например, 1234567)
    phone_number = str(random.randint(1000000, 9999999))

    # Сборка полного номера телефона с кодом страны и разделителями
    full_phone_number = f"+7 {operator_code}{phone_number[:3]}{phone_number[3:5]}{phone_number[5:]}"

    return full_phone_number


def generate_random_string(length=15):
    # Возможные символы для генерации строки
    characters = string.ascii_letters + string.digits + string.punctuation

    # Генерация случайной строки
    random_string = ''.join(random.choice(characters) for _ in range(length))

    return random_string


def generate_random_table():
    random_number = random.randint(0, 4)
    match random_number:
        case 0: return "entrances_logger"
        case 1: return "event"
        case 2: return "event_code"
        case 3: return "entrance_code"
        case 4: return "employee"


def generate_random_bool():
    random_number = random.randint(0, 1)
    match random_number:
        case 0: return True
        case 1: return False


def create_event_code():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        new_eventcode1 = Models.EventCode(event_name='Человек зашел', is_successful_event=True)
        db.session.add(new_eventcode1)
        db.session.commit()
        new_eventcode = Models.EventCode(event_name='Человек вышел', is_successful_event=True)
        db.session.add(new_eventcode)
        db.session.commit()


def create_event():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        start_date_str = "2020-01-01"
        end_date_str = "2023-12-31"
        for i in range(200):
            random_date = generate_random_date(start_date_str, end_date_str)
            new_event = Models.Event(event_code_id=(random.randint(1,2)), date=random_date, employee_id=(random.randint(1,100)))
            db.session.add(new_event)
            db.session.commit()


def create_entrances_logger():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        for i in range(200):
            new_entrances_logger = Models.EntrancesLogger(event_id=(i+1), message=generate_random_status())
            db.session.add(new_entrances_logger)
            db.session.commit()


def create_employee():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        start_date_str = "1970-01-01"
        end_date_str = "2000-12-31"
        for i in range(100):
            rnd_address = generate_random_street()+generate_random_house_num()
            new_employee = Models.Employee(surname=generate_random_surname(), name=generate_random_name(), patronymic=generate_random_patronymic(), birth_date=generate_random_date(start_date_str,end_date_str), address=rnd_address, position=generate_random_position(), phone_number=generate_random_phone_number())
            db.session.add(new_employee)
            db.session.commit()


def create_entrance_code():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        for i in range(100):
            new_entrance_code = Models.EntranceCode(employee_id=(i+1), code=generate_random_string(15), creation_date=generate_random_date('2020-01-01', '2023-12-31'))
            db.session.add(new_entrance_code)
            db.session.commit()


def create_db_queries_logger():
    with app.app_context():
        db.create_all()
        migrate.init_app(app)
        for i in range(20):
            new_db_queries_logger = Models.DbQueriesLogger(date=generate_random_date('2020-01-01','2023-12-31'), table_name=generate_random_table(), is_admin=generate_random_bool(), property_name="Имя свойства", old_value='Старое значение', new_value='Новое значение')
            db.session.add(new_db_queries_logger)
            db.session.commit()


def create_migrations():
    # Производить вызов именно в таком порядке
    create_employee()
    create_event_code()
    create_entrance_code()
    create_event()
    create_entrances_logger()
    create_db_queries_logger()

if __name__ == 'main':
    create_migrations()
