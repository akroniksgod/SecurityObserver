from sqlalchemy import Integer, Column, DateTime, PrimaryKeyConstraint, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class EntranceCode(Base):
    __tablename__ = 'entrance_code'
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employee.id'))
    creation_date = Column(DateTime(), default=datetime.now)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrance_code_pk'),
        {},
    )