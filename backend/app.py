import os
from datetime import timedelta, datetime
from flask import Flask, jsonify, request, send_from_directory
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import logging
import config
import query_data_calculation
from sqlalchemy.orm import declarative_base
from Models import Employee, create_db
from migrations import create_migrations

# Импорт приложения Карелова Вадима Андреевича
# import second_app

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
app = Flask(__name__, static_folder='../frontend/build')
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
    return session.query(Employee).all()


@app.route(f'{config.BASE_BACKEND_ROUTE}/createEmployee', methods=['POST'])
def create_employee():
    try:
        session = Session(bind=engine)
        data = request.json
        new_employee = Employee(
            id=data.get('id'),
            surname=data.get('surname'),
            name=data.get('name'),
            patronymic=data.get('patronymic'),
            birthdate=data.get('birthdate'),
            address=data.get('address'),
            position=data.get('position'),
            phoneNumber=data.get('phoneNumber')
        )
        session.add(new_employee)
        session.commit()
        return jsonify({'message': 'Employee added successfully!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/deleteEmployee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        session = Session(bind=engine)
        employee = session.query(Employee).filter_by(id=employee_id).first()

        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        session.delete(employee)
        session.commit()

        return jsonify({'message': 'Employee deleted successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/updateEmployee/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    try:
        session = Session(bind=engine)
        employee = session.query(Employee).filter_by(id=employee_id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        update_data = request.json
        for key, value in update_data.items():
            setattr(employee, key, value)

        session.commit()
        return jsonify({'message': f'Employee {employee_id} updated successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeWorkedDays', methods=['POST'])
def calculate_work_days_route():
    try:
        data = request.json
        employee_id = data.get('employeeId')
        month = data.get('month')
        year = data.get('year')

        if not all([employee_id, month, year]):
            return jsonify({'error': 'Missing required parameters'}), 400

        work_days = query_data_calculation.calculate_work_days(int(employee_id), int(month), int(year))

        if work_days is not None:
            return jsonify({'work_days': work_days}), 200
        else:
            return jsonify({'error': 'Error calculating work days'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeWorkSpan', methods=['POST'])
def calculate_total_work_time_route():
    try:
        data = request.json
        employee_id = data.get('id')
        start_date_str = data.get('datetimeStart')
        end_date_str = data.get('datetimeEnd')

        if not all([employee_id, start_date_str, end_date_str]):
            return jsonify({'error': 'Missing required parameters'}), 400

        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

        total_work_time = query_data_calculation.calculate_total_work_time(int(employee_id), start_date, end_date)

        if total_work_time is not None:
            return jsonify({'total_work_time': str(total_work_time)}), 200
        else:
            return jsonify({'error': 'Error calculating total work time'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route(f'{config.BASE_BACKEND_ROUTE}/getEmployeeEntranceTime', methods=['POST'])
def get_first_entry_time_route():
    try:
        data = request.json
        employee_id = data.get('employeeId')
        target_date_str = data.get('targetDate')

        if not all([employee_id, target_date_str]):
            return jsonify({'error': 'Missing required parameters'}), 400

        target_date = datetime.strptime(target_date_str, '%Y-%m-%d')

        entry_time = query_data_calculation.get_first_entry_time(int(employee_id), target_date)

        if entry_time is not None:
            return jsonify({'entry_time': str(entry_time)}), 200
        else:
            return jsonify({'error': 'No entry time found for the specified date'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    create_db()
    create_migrations()
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима Андреевича
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
