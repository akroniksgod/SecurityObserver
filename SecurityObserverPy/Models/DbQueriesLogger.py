from sqlalchemy import Integer, String, Column, DateTime, Boolean, PrimaryKeyConstraint
from sqlalchemy.orm import declarative_base
from datetime import datetime


Base = declarative_base()


class DbQueriesLogger(Base):
    __tablename__ = 'db_queries_logger'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime(), default=datetime.now)
    tableName = Column(String(250), nullable=False)
    isAdmin = Column(Boolean(), nullable=False)
    propertyName = Column(String(250), nullable=False)
    oldValue = Column(String(250), nullable=False)
    newValue = Column(String(250), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='db_queries_logger_pk'),
        {},
    )