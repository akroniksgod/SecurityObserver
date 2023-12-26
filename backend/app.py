import os
import threading
from datetime import timedelta, datetime

from cv2.gapi.ie import params
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from psycopg2 import sql
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session
import config
import query_data_calculation
from sqlalchemy.orm import declarative_base
from Models import Employee, create_db, DbQueriesLogger, EventCode, EntranceCode, create_session
from utils import to_snake_case
from migrations import create_migrations
from flask_cors import CORS
from sqlalchemy import event
import logging
# Импорт приложения для сканирования qr кода
#import camera_scanner


logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
app = Flask(__name__, static_folder='../frontend/build')
CORS(app)
db_config = config.DB_CONNECTION_STR
engine = create_engine(config.DB_CONNECTION_STR, echo=True)
Base = declarative_base()
session = create_session(engine)

# Инициализация логгера
logger = logging.getLogger('app_logger')
logger.setLevel(logging.INFO)

# Создание форматтера для логгера
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# Создание обработчика для записи в файл
file_handler = logging.FileHandler('app_log.txt')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def run_frontend(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route(f'{config.BASE_BACKEND_ROUTE}/', methods=['GET'])
def welcome_route():
    escape_char = "<br/>"
    return (f'Routes:{escape_char}'
            f'/getEmployees{escape_char}'
            f'/createEmployee{escape_char}'
            f'/deleteEmployee/employeeId{escape_char}'
            f'/updateEmployee/employeeId{escape_char}'
            f'/updateEmployee/employeeId{escape_char}'
            f'/getEmployeeWorkedDays{escape_char}'
            f'/getEmployeeWorkSpan{escape_char}'
            '/getEmployeeEntranceTime')


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployees', methods=['GET'])
def get_employees():
    query = session.query(Employee).order_by(Employee.id.desc()).all()
    employees = []
    for employee in query:
        employees.append(employee.to_dict())

    return jsonify(employees)


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployee/id=<int:id>', methods=['GET'])
def get_employee(id):
    try:
        employee = session.query(Employee).filter_by(id=id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        return jsonify(employee.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/createEmployee', methods=['POST'])
def create_employee():
    try:
        data: dict = request.get_json()
        new_employee = Employee(
            surname=data.get('surname'),
            name=data.get('name'),
            patronymic=data.get('patronymic'),
            birth_date=data.get('birthDate'),
            address=data.get('address'),
            position=data.get('position'),
            phone_number=data.get('phoneNumber')
        )
        session.add(new_employee)
        log_query_to_db(
            session,
            table_name='employee',
            is_admin=True,
            property_name='new_employee',
            old_value='',
            new_value=f'Surname: {new_employee.surname}, Name: {new_employee.name}, Position: {new_employee.position}'
        )
        session.commit()

        return jsonify(new_employee.id), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/deleteEmployee/id=<int:employee_id>', methods=['GET'])
def delete_employee(employee_id):
    try:
        employee = session.query(Employee).filter_by(id=employee_id).first()

        if not employee:
            return jsonify('Сотрудник не найден в базе данных'), 404

        session.delete(employee)
        log_query_to_db(
            session,
            table_name='employee',
            is_admin=True,
            property_name='del_employee',
            new_value='',
            old_value=f'Surname: {employee.surname}, Name: {employee.name}, Position: {employee.position}'
        )
        session.commit()

        return jsonify("ok"), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/updateEmployee/id=<int:employee_id>', methods=['POST'])
def update_employee(employee_id):
    try:
        employee = session.query(Employee).filter_by(id=employee_id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        # Capture the state of the employee before the update
        original_state = {c.key: getattr(employee, c.key) for c in inspect(employee).mapper.column_attrs}

        update_data = request.get_json()
        for key, value in update_data.items():
            setattr(employee, to_snake_case(key), value)

        # Capture the state of the employee after the update
        updated_state = {c.key: getattr(employee, c.key) for c in inspect(employee).mapper.column_attrs}

        # Identify and log the changes
        old_val = []
        new_val = []
        for key, original_value in original_state.items():
            updated_value = updated_state[key]
            if original_value != updated_value:
                old_val.append(f'{key}: {original_value}')
                new_val.append(f'{key}: {updated_value}')

        log_query_to_db(
            session,
            table_name='employee',
            is_admin=True,
            property_name='update_employee',
            old_value=', '.join(old_val),
            new_value=', '.join(new_val),
        )

        session.commit()
        return jsonify(employee.id), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeWorkedDays/id=<int:employee_id>', methods=['POST'])
def calculate_work_days_route(employee_id):
    try:
        data = request.get_json()
        month = data.get('month')
        year = data.get('year')

        if not all([employee_id, month, year]):
            return jsonify({'error': 'Missing required parameters'}), 400

        work_days = query_data_calculation.calculate_work_days(int(employee_id), int(month), int(year))

        if work_days is not None:
            return jsonify(work_days), 200

        return jsonify({'error': 'Error calculating work days'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeWorkSpan/id=<int:employee_id>', methods=['POST'])
def calculate_total_work_time_route(employee_id):
    try:
        data = request.get_json()
        start_date_str = data.get('datetimeStart')
        end_date_str = data.get('datetimeEnd')

        if not all([employee_id, start_date_str, end_date_str]):
            return jsonify({'error': 'Нет обходимых параметров'}), 400

        start_date = datetime.strptime(start_date_str, '%d-%m-%Y')
        end_date = datetime.strptime(end_date_str, '%d-%m-%Y')

        total_work_time = query_data_calculation.calculate_total_work_time(int(employee_id), start_date, end_date)
        print(total_work_time)
        if total_work_time is not None:
            return jsonify(str(total_work_time)), 200
        else:
            return jsonify({'error': 'Ошибка расчёта времени'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeEntranceTime/id=<int:employee_id>', methods=['POST'])
def get_first_entry_time_route(employee_id):
    try:
        data = request.get_json()
        target_date_str = data.get('date')

        if not all([employee_id, target_date_str]):
            return jsonify({'error': 'Missing required parameters'}), 400

        target_date = datetime.strptime(target_date_str, '%d-%m-%Y')

        entry_time = query_data_calculation.get_first_entry_time(int(employee_id), target_date)

        if entry_time is not None:
            return jsonify(str(entry_time)), 200
        else:
            return jsonify("Время входа не найдено"), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/checkQRCode', methods=['POST'])
def check_QR_code():
    try:
        data = request.get_json()
        qrcode_string = data.get('qrcode_string')

        if not all([qrcode_string]):
            return jsonify({'error': 'Missing required parameters'}), 400

        # Проверка наличия кода в таблице EntranceCode
        entrance_code = session.query(EntranceCode).filter_by(code=qrcode_string).first()

        if entrance_code:
            return jsonify({'valid': True}), 200
        else:
            return jsonify({'valid': False}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def log_query_to_db(session, table_name, is_admin, property_name, old_value, new_value):
    try:
        # Создание объекта для логирования в базу данных
        db_logger_entry = DbQueriesLogger(
            table_name=table_name,
            is_admin=is_admin,
            property_name=property_name,
            old_value=old_value,
            new_value=new_value
        )

        # Добавление записи в сессию и коммит в базу данных
        session.add(db_logger_entry)

        # Логирование в файл
        log_message = f"Table: {table_name}, Property: {property_name}, Old Value: {old_value}, New Value: {new_value}"
        logger.info(log_message)

    except Exception as e:
        # Логирование ошибок
        logger.error(f"Error logging to database: {str(e)}")



if __name__ == '__main__':
    # create_db()
    # create_migrations()
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения сканера QR кодов
    # second_app_thread = threading.Thread(target=camera_scanner.start_camera_scanner(), daemon=True)
    # second_app_thread.start()
