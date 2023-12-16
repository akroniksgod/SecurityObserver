from sqlalchemy import Integer, String, Column, DateTime, Boolean, PrimaryKeyConstraint
from sqlalchemy.orm import declarative_base
from datetime import datetime


Base = declarative_base()


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