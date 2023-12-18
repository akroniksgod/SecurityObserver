from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from Models import Event
from app import engine


def calculate_total_work_time(employee_id, start_date, end_date):
    try:
        session = Session(bind=engine)
        events = session.query(Event).\
            filter(Event.employee_id == employee_id, Event.date >= start_date, Event.date <= end_date).\
            order_by(Event.date).all()

        total_work_time = timedelta()
        last_event = None

        for event in events:
            if event.event_code_id == 1:  # 1 - код события "вход"
                last_event = event
            elif event.event_code_id == 2 and last_event is not None:  # 2 - код события "выход"
                total_work_time += event.date - last_event.date
                last_event = None

        return total_work_time

    except Exception as e:
        print(f"Error calculating total work time: {str(e)}")
        return None


def calculate_work_days(employee_id, month, year):
    try:
        session = Session(bind=engine)
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


def get_first_entry_time(employee_id, target_date):
    try:
        session = Session(bind=engine)
        entry_event = session.query(Event).\
            filter(Event.employee_id == employee_id, Event.event_code_id == 1, Event.date >= target_date).\
            order_by(Event.date).first()

        if entry_event:
            return entry_event.date
        else:
            return None

    except Exception as e:
        print(f"Error getting first entry time: {str(e)}")
        return None