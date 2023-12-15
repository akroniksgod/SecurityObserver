from sqlalchemy import Integer, String, Column, PrimaryKeyConstraint, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class EntrancesLogger(Base):
    __tablename__ = 'entrances_logger'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.id'))
    message = Column(String(1000), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('id', name='entrances_logger_pk'),
        {},
    )