from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserBaseSchema(BaseModel):
    id: int
    username: str
    role: Optional[str] = None

    class Config:
        from_attributes = True