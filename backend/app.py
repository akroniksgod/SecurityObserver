import os
from datetime import timedelta, datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from gevent import event
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import logging
import config
import query_data_calculation
from sqlalchemy.orm import declarative_base
from Models import Employee, create_db, DbQueriesLogger, EventCode
from utils import to_snake_case, log_db_query
from migrations import create_migrations
from flask_cors import CORS
from sqlalchemy import event

# Импорт приложения Карелова Вадима Андреевича
# import second_app

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
app = Flask(__name__, static_folder='../frontend/build')
CORS(app)
db_config = config.DB_CONNECTION_STR
engine = create_engine(config.DB_CONNECTION_STR, echo=True)
Base = declarative_base()


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
    session = Session(bind=engine)
    query = session.query(Employee).order_by(Employee.id.desc()).all()
    employees = []
    for employee in query:
        employees.append(employee.to_dict())

    return jsonify(employees)


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployee/id=<int:id>', methods=['GET'])
def get_employee(id):
    try:
        session = Session(bind=engine)
        employee = session.query(Employee).filter_by(id=id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        return jsonify(employee.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/createEmployee', methods=['POST'])
def create_employee():
    try:
        session = Session(bind=engine)
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
        session.commit()
        # Логирование запроса
        log_db_query(
            session,
            table_name='employee',
            is_admin=False,  # Пример, если запрос выполняется не администратором
            property_name='create_employee',
            old_value='',
            new_value=f'Surname: {new_employee.surname}, Name: {new_employee.name}'
        )
        return jsonify(new_employee.id), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/deleteEmployee/id=<int:employee_id>', methods=['GET'])
def delete_employee(employee_id):
    try:
        session = Session(bind=engine)
        employee = session.query(Employee).filter_by(id=employee_id).first()

        if not employee:
            return jsonify('Сотрудник не найден в базе данных'), 404

        session.delete(employee)
        session.commit()

        return jsonify("ok"), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/updateEmployee/id=<int:employee_id>', methods=['POST'])
def update_employee(employee_id):
    try:
        session = Session(bind=engine)
        employee = session.query(Employee).filter_by(id=employee_id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        update_data = request.get_json()
        for key, value in update_data.items():
            setattr(employee, to_snake_case(key), value)

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


# Функция для логирования запросов к базе данных
def log_db_queries(sender, sql, params, context, executemany):
    if context and "query" in context.info:
        session = Session(bind=engine)
        query_info = context.info["query"]

        # Логирование в таблицу db_queries_logger
        db_log_entry = DbQueriesLogger(
            date=datetime.now(),
            table_name=query_info["table"],
            is_admin=query_info.get("is_admin", False),
            property_name=query_info.get("property_name", ""),
            old_value=query_info.get("old_value", ""),
            new_value=query_info.get("new_value", "")
        )

        session.add(db_log_entry)
        session.commit()

        # Логирование в файл txt
        with open("db_queries_log.txt", "a") as log_file:
            log_file.write(f"{datetime.now()} - {sql} - {params}\n")

# Добавление обработчика событий для логирования запросов
event.listen(engine, "before_cursor_execute", log_db_queries)




if __name__ == '__main__':
    # create_db()
    # create_migrations()
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима Андреевича
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
