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
from Models.EntranceCode import EntranceCode
from Models.EntrancesLogger import EntrancesLogger
from sqlalchemy.orm import declarative_base
import threading
from gevent.pywsgi import WSGIServer

# Импорт приложения Карелова Вадима
# import second_app

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


def calculate_work_days(employee_id, month, year):
    try:
        session = Session()
        start_date = datetime(year, month, 1)
        end_date = start_date.replace(month=start_date.month + 1) - timedelta(days=1)

        events = session.query(Event). \
            filter(Event.employee_id == employee_id, Event.date >= start_date, Event.date <= end_date). \
            order_by(Event.date).all()

        work_days = 0
        last_event = None

        for event in events:
            if last_event is not None and (event.date - last_event.date) > timedelta(hours=6):
                work_days += 1

            last_event = event

        return work_days

    except Exception as e:
        print(f"Error calculating work days: {str(e)}")
        return None


@app.route('/getEmployeeWorkedDays', methods=['POST'])
def calculate_work_days_route():
    try:
        data = request.json
        employee_id = data.get('employee_id')
        month = data.get('month')
        year = data.get('year')

        if not all([employee_id, month, year]):
            return jsonify({'error': 'Missing required parameters'}), 400

        work_days = calculate_work_days(int(employee_id), int(month), int(year))

        if work_days is not None:
            return jsonify({'work_days': work_days}), 200
        else:
            return jsonify({'error': 'Error calculating work days'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
