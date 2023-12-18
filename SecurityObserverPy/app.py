from datetime import timedelta, datetime
from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import logging
import config
from Models.Employee import Employee
from Models.DbQueriesLogger import DbQueriesLogger
from Models.EventCode import EventCode
from Models.Event import Event
import query_data_calculation
from Models.EntranceCode import EntranceCode
from Models.EntrancesLogger import EntrancesLogger
from sqlalchemy.orm import declarative_base
import threading
from gevent.pywsgi import WSGIServer

# Импорт приложения для сканирования qr кода
import camera_scanner

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
app = Flask(__name__)
db_config = config.DB_CONFIG
engine = create_engine(config.DB_CONFIG, echo=True)
Base = declarative_base()


def create_db():
    Base.metadata.create_all(engine, tables=[EventCode.__table__, Employee.__table__, DbQueriesLogger.__table__])
    Base.metadata.create_all(engine, tables=[Event.__table__])
    Base.metadata.create_all(engine)


def delete_db():
    Base.metadata.drop_all(engine)


@app.route('/getEmployees', methods=['GET'])
def get_employees():
    session = Session(bind=engine)
    return session.query(Employee).all()


@app.route('/createEmployee', methods=['POST'])
def create_employee():
    try:
        session = Session(bind=engine)
        data = request.json
        new_employee = Employee(
            surname=data.get('surname'),
            name=data.get('name'),
            patronymic=data.get('patronymic'),
            birthdate=data.get('birthdate'),
            address=data.get('address'),
            position=data.get('position'),
            phone_number=data.get('phone_number')
        )
        session.add(new_employee)
        session.commit()
        return jsonify({'message': 'Employee added successfully!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/delete_employee/<int:employee_id>', methods=['DELETE'])
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


@app.route('/update_employee/<int:employee_id>', methods=['PUT'])
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


@app.route('/getEmployeeWorkedDays', methods=['POST'])
def calculate_work_days_route():
    try:
        data = request.json
        employee_id = data.get('employee_id')
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


@app.route('/calculate_total_work_time', methods=['POST'])
def calculate_total_work_time_route():
    try:
        data = request.json
        employee_id = data.get('employee_id')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')

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


@app.route('/get_first_entry_time', methods=['POST'])
def get_first_entry_time_route():
    try:
        data = request.json
        employee_id = data.get('employee_id')
        target_date_str = data.get('target_date')

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
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима Андреевича
    second_app_thread = threading.Thread(target=camera_scanner.start_camera_scanner(), daemon=True)
    second_app_thread.start()
    second_app_thread.join()
