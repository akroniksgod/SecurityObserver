from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import logging
import config
from Models import DbQueriesLogger, EventCode, EntrancesLogger, Event, EventCode
from Models.Employee import Employee
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


if __name__ == '__main__':
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
