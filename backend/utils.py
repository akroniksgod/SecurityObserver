import re
from re import sub
from datetime import datetime
from backend.Models import DbQueriesLogger


def to_snake_case(name):
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()


def to_camel_case(s):
    # Use regular expression substitution to replace underscores and hyphens with spaces,
    # then title case the string (capitalize the first letter of each word), and remove spaces
    s = sub(r"(_|-)+", " ", s).title().replace(" ", "")

    # Join the string, ensuring the first letter is lowercase
    return ''.join([s[0].lower(), s[1:]])


from datetime import datetime

def log_db_query(session, table_name, is_admin, property_name, old_value, new_value):
    """
    Логирует информацию о запросе к базе данных.

    :param session: SQLAlchemy сессия
    :param table_name: Имя таблицы
    :param is_admin: Флаг, указывающий, был ли запрос выполнен администратором
    :param property_name: Имя свойства, которое было изменено
    :param old_value: Старое значение свойства
    :param new_value: Новое значение свойства
    """
    try:
        db_log_entry = DbQueriesLogger(
            date=datetime.now(),
            table_name=table_name,
            is_admin=is_admin,
            property_name=property_name,
            old_value=old_value,
            new_value=new_value
        )

        session.add(db_log_entry)
        session.commit()

        with open("db_queries_log.txt", "a") as log_file:
            log_file.write(f"{datetime.now()} - Table: {table_name}, Admin: {is_admin}, "
                            f"Property: {property_name}, Old Value: {old_value}, New Value: {new_value}\n")
    except Exception as e:
        print(f"Error logging database query: {str(e)}")
