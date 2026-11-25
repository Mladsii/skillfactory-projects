from fastapi import APIRouter, Depends, HTTPException, status,Query
from sqlalchemy.orm import Session
from typing import Optional,List
from api.models.machine import Machine
from api.models.reclamation import Reclamation
from api.schemas.reclamation import ReclamationCreate, ReclamationUpdate, ReclamationResponse
from api.auth.oauth2 import get_current_user
from api.utils.roles import check_role, role_required
from api.database import get_db


router = APIRouter(prefix="/reclamations", tags=["Reclamations"])


# GET ALL — доступ зависит от роли
def format_reclamations(reclamations):
    result = []
    for r in reclamations:
        result.append({
            "id": r.id,
            "failure_date": str(r.failure_date),
            "operating_hours": r.operating_hours,
            "failure_node_id": r.failure_node_id,
            "failure_description": r.failure_description,
            "repair_method_id": r.repair_method_id,
            "spare_parts_used": r.spare_parts_used,
            "repair_date": str(r.repair_date) if r.repair_date else None,
            "downtime": r.downtime,

            "machine_id": r.machine_id,
            "service_company_id": r.service_company_id,

            "failure_node": {"name": r.failure_node.name} if r.failure_node else None,
            "repair_method": {"name": r.repair_method.name} if r.repair_method else None,
            "machine": {
                "factory_number": r.machine.factory_number,
                "shipment_date": str(r.machine.shipment_date)
            } if r.machine else None,
            "service_company": {
                "username": r.service_company.username,
                "role": r.service_company.role
            } if r.service_company else None
        })
    return result


@router.get("/", response_model=List[ReclamationResponse])
@role_required("manager", "client", "service")
def read_reclamations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),

    # Поля фильтрации
    failure_node_id: Optional[str] = Query(None),
    repair_method_id: Optional[str] = Query(None),
    factory_number: Optional[str] = Query(None)
):
    query = db.query(Reclamation)

    # Защита по ролям
    if current_user.role == "manager":
        pass  # менеджер видит всё

    elif current_user.role == "client":
        # клиент видит рекламации по своим машинам
        query = query.join(Reclamation.machine).filter(Machine.client_id == current_user.id)

    elif current_user.role == "service":
        # сервисник видит рекламации, созданные им самим
        query = query.filter(Reclamation.service_company_id == current_user.id)

    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    # Применяем фильтры
    if failure_node_id and failure_node_id.isdigit():
        query = query.filter(Reclamation.failure_node_id == int(failure_node_id))

    if repair_method_id and repair_method_id.isdigit():
        query = query.filter(Reclamation.repair_method_id == int(repair_method_id))

    if factory_number:
        query = query.join(Reclamation.machine).filter(Machine.factory_number.ilike(f"%{factory_number}%"))

    reclamations = query.order_by(Reclamation.failure_date.desc()).all()
    return format_reclamations(reclamations)


# GET ONE — по ID
@router.get("/{reclamation_id}", response_model=ReclamationResponse)
def read_reclamation(
    reclamation_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_reclamation = db.query(Reclamation).filter(Reclamation.id == reclamation_id).first()

    if not db_reclamation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    # Проверка прав
    if current_user.role == "manager":
        pass
    elif current_user.role == "client" and db_reclamation.machine.client_id == current_user.id:
        pass
    elif current_user.role == "service" and db_reclamation.service_company_id == current_user.id:
        pass
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    # Явное преобразование
    return {
        "id": db_reclamation.id,
        "failure_date": str(db_reclamation.failure_date),
        "operating_hours": db_reclamation.operating_hours,
        "failure_node_id": db_reclamation.failure_node_id,
        "failure_description": db_reclamation.failure_description,
        "repair_method_id": db_reclamation.repair_method_id,
        "spare_parts_used": db_reclamation.spare_parts_used,
        "repair_date": str(db_reclamation.repair_date) if db_reclamation.repair_date else None,
        "downtime": db_reclamation.downtime,
        "machine_id": db_reclamation.machine_id,
        "service_company_id": db_reclamation.service_company_id,

        "failure_node": {"name": db_reclamation.failure_node.name},
        "repair_method": {"name": db_reclamation.repair_method.name},
        "machine": {
            "factory_number": db_reclamation.machine.factory_number,
            "shipment_date": str(db_reclamation.machine.shipment_date)
        },
        "service_company": {
            "username": db_reclamation.service_company.username,
            "role": db_reclamation.service_company.role
        }
    }


# CREATE — только manager и service
@router.post("/", response_model=ReclamationResponse)
@role_required("manager", "service")
def create_reclamation(
    reclamation: ReclamationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service_company_id = reclamation.service_company_id or current_user.id

    db_reclamation = Reclamation(**reclamation.dict(), service_company_id=service_company_id)
    db.add(db_reclamation)
    db.commit()
    db.refresh(db_reclamation)
    return db_reclamation


# UPDATE — только manager и service
@router.put("/{reclamation_id}")
@role_required("manager", "service")
def update_reclamation(
    reclamation_id: int,
    updated_data: ReclamationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_reclamation = db.query(Reclamation).filter(Reclamation.id == reclamation_id).first()

    if not db_reclamation:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    if current_user.role == "service" and db_reclamation.service_company_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")

    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(db_reclamation, key, value)

    db.commit()
    db.refresh(db_reclamation)
    return db_reclamation


# DELETE — только manager
@router.delete("/{reclamation_id}")
@role_required("manager")
def delete_reclamation(
    reclamation_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_reclamation = db.query(Reclamation).filter(Reclamation.id == reclamation_id).first()

    if not db_reclamation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    db.delete(db_reclamation)
    db.commit()
    return {"message": "Запись удалена"}
