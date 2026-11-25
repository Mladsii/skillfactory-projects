from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session

from api.schemas.user import UserCreate, UserResponse
from api.models.user import User
from api.auth.jwt import create_access_token
from api.auth.oauth2 import get_current_user
from api.database import get_db
from api.utils.security import verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user