from flask import Flask, jsonify
import psycopg2
from psycopg2 import sql
import config
import threading
from gevent.pywsgi import WSGIServer

# Импорт приложения Карелова Вадима
# import second_app

app = Flask(__name__)
db_config = config.DB_CONFIG


@app.route('/get_data', methods=['GET'])
def get_data():
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    query = sql.SQL("SELECT * FROM employee")
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()

    json_data = [{'id': row[0], 'surname': row[1], 'name': row[2], 'patronymic': row[3], 'birthdate': row[4],
                  'address': row[5], 'position': row[6], 'phone_number': row[7]} for row in data]
    print(json_data)
    return jsonify(json_data)


if __name__ == '__main__':
    # Запуск Flask приложения
    app_thread = threading.Thread(target=app.run, kwargs={'debug': True})
    app_thread.start()

    # Запуск приложения Карелова Вадима
    # second_app_thread = threading.Thread(target=second_app.second_app_function)
    # second_app_thread.start()
