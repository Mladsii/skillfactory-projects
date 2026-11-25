from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from api.models.machine import Machine
from api.models.maintenance import Maintenance
from api.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceResponse
from api.auth.oauth2 import get_current_user
from api.utils.roles import check_role, role_required
from api.database import get_db


router = APIRouter(prefix="/maintenances", tags=["Maintenances"])


# GET ALL — доступ зависит от роли
@router.get("/", response_model=list[MaintenanceResponse])
def read_maintenances(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),

    # Используем str вместо int
    maintenance_type_id: Optional[str] = None,
    machine_factory_number: Optional[str] = None,
    service_company_id: Optional[str] = None
):
    query = db.query(Maintenance)

    if current_user.role == "manager":
        pass
    elif current_user.role == "client":
        query = query.join(Machine).filter(Machine.client_id == current_user.id)
    elif current_user.role == "service":
        query = query.filter(Maintenance.service_company_id == current_user.id)
    else:
        raise HTTPException(status_code=403, detail="Нет доступа")

    # Фильтрация
    if maintenance_type_id:
        mtid = int(maintenance_type_id) if maintenance_type_id.isdigit() else None
        if mtid is not None:
            query = query.filter(Maintenance.maintenance_type_id == mtid)

    if machine_factory_number:
        query = query.filter(Maintenance.machine.has(factory_number=machine_factory_number))

    if service_company_id:
        scid = int(service_company_id) if service_company_id.isdigit() else None
        if scid is not None:
            query = query.filter(Maintenance.service_company_id == scid)

    maintenances = query.order_by(Maintenance.date_performed.desc()).all()
    return [
        {
            "id": m.id,
            "maintenance_type_id": m.maintenance_type_id,
            "maintenance_type": {"name": m.maintenance_type.name},
            "date_performed": str(m.date_performed),
            "operating_hours": m.operating_hours,
            "order_number": m.order_number,
            "order_date": str(m.order_date),
            "machine_id": m.machine_id,
            "machine": {"factory_number": m.machine.factory_number},
            "service_company_id": m.service_company_id,
            "service_company": {
                "username": m.service_company.username,
                "role": m.service_company.role
            }
        }
        for m in maintenances
    ]


@router.get("/{maintenance_id}", response_model=MaintenanceResponse)
def read_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()

    if not db_maintenance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    # Проверка прав
    if current_user.role == "manager":
        pass
    elif current_user.role == "client" and db_maintenance.machine.client_id == current_user.id:
        pass
    elif current_user.role == "service" and db_maintenance.service_company_id == current_user.id:
        pass
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    # Явное преобразование объектов в словари
    return {
        "id": db_maintenance.id,
        "maintenance_type_id": db_maintenance.maintenance_type_id,
        "maintenance_type": {"name": db_maintenance.maintenance_type.name},
        "date_performed": str(db_maintenance.date_performed),  # ← datetime -> str
        "operating_hours": db_maintenance.operating_hours,
        "order_number": db_maintenance.order_number,
        "order_date": str(db_maintenance.order_date),  # ← datetime -> str
        "machine_id": db_maintenance.machine_id,
        "machine": {
            "factory_number": db_maintenance.machine.factory_number,
            "shipment_date": str(db_maintenance.machine.shipment_date)
        },
        "service_company_id": db_maintenance.service_company_id,
        "service_company": {
            "username": db_maintenance.service_company.username,
            "role": db_maintenance.service_company.role
        }
    }


# CREATE — только manager и service
@router.post("/", response_model=MaintenanceResponse)
@role_required("manager", "service")
def create_maintenance(
    maintenance: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Если сервисная компания не указана — ставим текущего пользователя
    service_company_id = maintenance.service_company_id or current_user.id

    db_maintenance = Maintenance(**maintenance.dict(), service_company_id=service_company_id)
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    return db_maintenance


# FastAPI
@router.put("/{maintenance_id}")
@role_required("manager", "service", "client")
def update_maintenance(
    maintenance_id: int,
    updated_data: MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()

    if not db_maintenance:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    # Клиент может редактировать ТО только своих машин
    if current_user.role == "client":
        if db_maintenance.machine.client_id != current_user.id:
            raise HTTPException(status_code=403, detail="Нет доступа")

    # Сервисник может редактировать только свои ТО
    elif current_user.role == "service" and db_maintenance.service_company_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")

    # Обновляем только переданные поля
    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(db_maintenance, key, value)

    db.commit()
    db.refresh(db_maintenance)
    return db_maintenance

# DELETE — только manager
@router.delete("/{maintenance_id}")
@role_required("manager")
def delete_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()

    if not db_maintenance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    db.delete(db_maintenance)
    db.commit()
    return {"message": "Запись удалена"}