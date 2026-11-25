import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Загружаем .env
load_dotenv()

# URL подключения к БД
SQLALCHEMY_DATABASE_URL =  os.getenv("DATABASE_URL")

# Создаём движок
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Создаём фабрику сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()


# 🆕 Функция зависимости для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔍 Тест подключения
def test_connection():
    from sqlalchemy.exc import OperationalError
    try:
        with engine.connect() as conn:
            print("✅ Успешно подключились к базе данных")
    except OperationalError as e:
        print("❌ Ошибка подключения к базе данных:")
        print(e)


if __name__ == "__main__":
    test_connection()