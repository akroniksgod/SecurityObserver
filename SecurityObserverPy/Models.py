from sqlalchemy import Table, Index, Integer, String, Column, Text, \
    DateTime, Boolean, PrimaryKeyConstraint, \
    UniqueConstraint, ForeignKeyConstraint, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

engine = create_engine("postgresql+psycopg2://postgres:123321@localhost:5432/SecurityObserverDB")

Base = declarative_base()


class EventCode(Base):
    __tablename__ = 'event_code'
    id = Column(Integer, primary_key=True)
    event_name = Column(String(250), nullable=False)
    is_successful_event = Column(Boolean(), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='event_code_pk'),
        {},
    )


class Event(Base):
    __tablename__ = 'event'
    id = Column(Integer, primary_key=True)
    event_code_id = Column(Integer, ForeignKey('event_code.id'))
    date = Column(DateTime(), default=datetime.now)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='event_pk'),
        {},
    )


class EntrancesLogger(Base):
    __tablename__ = 'entrances_logger'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.id'))
    message = Column(String(1000), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrances_logger_pk'),
        {},
    )


class EntranceCode(Base):
    __tablename__ = 'entrance_code'
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employee.id'))
    creation_date = Column(DateTime(), default=datetime.now)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrance_code_pk'),
        {},
    )


class Employee(Base):
    __tablename__ = 'employee'
    id = Column(Integer, primary_key=True)
    surname = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    patronymic = Column(String(100), nullable=False)
    birthdate = Column(DateTime(), default=datetime.now)
    address = Column(String(250), nullable=False)
    position = Column(String(100), nullable=False)
    phone_number = Column(String(13), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='employee_pk'),
        UniqueConstraint('phone_number')
    )


class DbQueriesLogger(Base):
    __tablename__ = 'db_queries_logger'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime(), default=datetime.now)
    table_name = Column(String(250), nullable=False)
    is_admin = Column(Boolean(), nullable=False)
    property_name = Column(String(250), nullable=False)
    old_value = Column(String(250), nullable=False)
    new_value = Column(String(250), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='db_queries_logger_pk'),
        {},
    )

def create():
    Base.metadata.create_all(engine)

