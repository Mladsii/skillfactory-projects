from fastapi import HTTPException, status
from api.models.user import User
from functools import wraps
from api.auth.oauth2 import get_current_user


def check_role(user: User, allowed_roles: list):
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа"
        )

def role_required(*allowed_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get("current_user") or args[0]  # зависит от контекста
            if user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Нет доступа"
                )
            return func(*args, **kwargs)
        return wrapper
    return decorator