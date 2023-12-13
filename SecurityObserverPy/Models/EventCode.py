from sqlalchemy import Integer, String, Column, Boolean, PrimaryKeyConstraint
from sqlalchemy.orm import declarative_base

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
