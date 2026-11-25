from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from typing import List

from api.utils.roles import role_required

from api.database import get_db

from api.models.user import User
from api.schemas.user import UserBaseSchema
from api.auth.oauth2 import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/service-companies", response_model=List[UserBaseSchema])
def read_service_companies(db: Session = Depends(get_db)):
    """
    Возвращает список всех пользователей с ролью 'service'
    """
    companies = db.query(User).filter(User.role == "service").all()
    if not companies:
        raise HTTPException(status_code=404, detail="Сервисные компании не найдены")

    return companies

@router.get("/", response_model=List[UserBaseSchema])
@role_required("manager")
def read_users(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    role: str = Query(None)
):
    """
    Получить список пользователей с фильтром по роли.
    Только менеджер может вызвать этот маршрут.
    """
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    users = query.all()

    if not users:
        raise HTTPException(status_code=404, detail="Пользователи не найдены")

    return users
