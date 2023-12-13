from flask import Flask, jsonify
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


@app.route('/get_data', methods=['GET'])
def getEmployees():
    return session.query(Employee).all()


if __name__ == '__main__':
    session = Session(bind=engine)
    getEmployees()
    app.run()

    # Запуск Flask приложения
    # app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    # app_thread.start()

    # Запуск приложения Карелова Вадима
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
