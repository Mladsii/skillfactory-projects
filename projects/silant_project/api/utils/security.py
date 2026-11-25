from passlib.hash import django_pbkdf2_sha256 as hasher


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Проверяет plain_password с хэшем из Django
    """
    return hasher.verify(plain_password, hashed_password)