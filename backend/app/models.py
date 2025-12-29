from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"
    __table_args__ = (UniqueConstraint("company_id", "question_id", name="uq_company_question"),)

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, index=True, nullable=False)
    domain_id = Column(String, index=True, nullable=False)
    question_id = Column(String, index=True, nullable=False)
    value = Column(Integer, nullable=False)


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (UniqueConstraint("company_id", "measure_id", name="uq_company_measure"),)

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, index=True, nullable=False)
    domain_id = Column(String, index=True, nullable=False)
    measure_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="medium")
    status = Column(String, nullable=False, default="backlog")
