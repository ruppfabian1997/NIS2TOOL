from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, validator


class Question(BaseModel):
    id: str
    text: str
    type: str


class Measure(BaseModel):
    id: str
    title: str
    priority: str = "medium"


class Domain(BaseModel):
    id: str
    title: str
    questions: List[Question]
    measures: List[Measure]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)  # Maximal 72 Zeichen

    @validator("password")
    def validate_password(cls, value):
        if len(value) > 72:
            raise ValueError("Password cannot exceed 72 characters.")
        return value


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[EmailStr] = None


class AnswerCreate(BaseModel):
    domain_id: str
    question_id: str
    value: int


class AnswerResponse(BaseModel):
    id: int
    domain_id: str
    question_id: str
    value: int

    class Config:
        orm_mode = True


class DomainScore(BaseModel):
    domain_id: str
    score_percent: float


class OverallScore(BaseModel):
    score_percent: float


class TaskCreate(BaseModel):
    domain_id: str
    measure_id: str
    title: str
    priority: str = "medium"
    status: str = "backlog"


class TaskResponse(BaseModel):
    id: int
    domain_id: str
    measure_id: str
    title: str
    priority: str
    status: str

    class Config:
        orm_mode = True


class TaskUpdate(BaseModel):
    priority: Optional[str]
    status: Optional[str]
