from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from api.routers import machines
from fastapi.middleware.cors import CORSMiddleware
from api.routers.public import router as public_router
from api.routers import machines, maintenances, reclamations, public, spravochnik

from api.database import SessionLocal, Base, engine
from api.routers.auth import router as auth_router
from api.routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Silant API",
    description="Сервис для управления техникой, ТО и рекламациями",
    version="0.1.0",
    openapi_url="/api/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
origins = [
    "http://localhost:5173",  # Разрешаем только localhost:5173
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(machines.router)
app.include_router(public_router)
app.include_router(maintenances.router)
app.include_router(reclamations.router)
app.include_router(spravochnik.router)
app.include_router(users.router)
# Зависимость для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/hello")
def read_hello(db: Session = Depends(get_db)):
    return {"message": "Hello from Silant API!"}