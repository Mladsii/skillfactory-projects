from sqlalchemy import Column, Integer, String, Enum as SqlEnum
from sqlalchemy.orm import relationship

from api.database import Base


class User(Base):
    __tablename__ = "users_user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True)
    email = Column(String(254))
    role = Column(SqlEnum('guest', 'client', 'service', 'manager', name='user_role'), nullable=False)
    password = Column(String(128))
    is_active = Column(Integer)