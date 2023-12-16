from sqlalchemy import Integer, String, Column, DateTime, PrimaryKeyConstraint, UniqueConstraint
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


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
        UniqueConstraint('phone_number'),
        {},
    )

    def __repr__(self):
        return f"<Employee(id={self.id}, surname={self.surname}, name={self.name}, patronymic={self.patronymic}, " \
               f"birthdate={self.birthdate}, address={self.address}, position={self.position}, " \
               f"phone_number={self.phone_number})>"
