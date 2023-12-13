from sqlalchemy import Integer, Column, DateTime, PrimaryKeyConstraint, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Event(Base):
    __tablename__ = 'event'
    id = Column(Integer, primary_key=True)
    event_code_id = Column(Integer, ForeignKey('event_code.id'))
    date = Column(DateTime(), default=datetime.now)
    employee_id = Column(Integer, ForeignKey('employee.id'))

    __table_args__ = (
        PrimaryKeyConstraint('id', name='event_pk'),
        {},
    )