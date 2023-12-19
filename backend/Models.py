from dataclasses import dataclass

from sqlalchemy import Table, Index, Integer, String, Column, Text, \
    DateTime, Boolean, PrimaryKeyConstraint, \
    UniqueConstraint, ForeignKeyConstraint, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import config
from sqlalchemy import inspect
from re import sub
import re

engine = create_engine(config.DB_CONNECTION_STR)

Base = declarative_base()


def to_snake_case(name):
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()


# Define a function to convert a string to camel case
def to_camel_case(s):
    # Use regular expression substitution to replace underscores and hyphens with spaces,
    # then title case the string (capitalize the first letter of each word), and remove spaces
    s = sub(r"(_|-)+", " ", s).title().replace(" ", "")

    # Join the string, ensuring the first letter is lowercase
    return ''.join([s[0].lower(), s[1:]])


@dataclass
class EventCode(Base):
    __tablename__ = 'event_code'
    id = Column(Integer, primary_key=True)
    event_name = Column(String(250), nullable=False)
    is_successful_event = Column(Boolean(), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='event_code_pk'),
        {},
    )

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


@dataclass
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

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}



@dataclass
class EntrancesLogger(Base):
    __tablename__ = 'entrances_logger'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.id'))
    message = Column(String(1000), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrances_logger_pk'),
        {},
    )

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}



@dataclass
class EntranceCode(Base):
    __tablename__ = 'entrance_code'
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employee.id'))
    code = Column(String(150), nullable=False)
    creation_date = Column(DateTime(), default=datetime.now)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrance_code_pk'),
        {},
    )

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}



@dataclass
class Employee(Base):
    __tablename__ = 'employee'
    id = Column(Integer, primary_key=True)
    surname = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    patronymic = Column(String(100), nullable=False)
    birth_date = Column(DateTime(), default=datetime.now)
    address = Column(String(250), nullable=False)
    position = Column(String(100), nullable=False)
    phone_number = Column(String(13), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='employee_pk'),
        UniqueConstraint('phone_number')
    )

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}



@dataclass
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

    def to_dict(self):
        return {to_camel_case(c.key): getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


def create_db():
    Base.metadata.create_all(engine)
