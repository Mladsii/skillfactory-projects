from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from api.schemas.machine import MachineCreate, MachineUpdate, MachineResponse
from api.models.machine import Machine
from api.auth.oauth2 import get_current_user
from api.utils.roles import role_required
from api.database import get_db


router = APIRouter(prefix="/machines", tags=["Machines"])


@router.post("/", response_model=MachineResponse)
@role_required("manager")
def create_machine(
    machine: MachineCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_machine = Machine(**machine.model_dump())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


@router.get("/", response_model=list[MachineResponse])
def read_machines(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),

    # Поля фильтрации
    factory_number: Optional[str] = None,
    machine_model_id: Optional[str] = None,
    engine_model_id: Optional[str] = None,
    transmission_model_id: Optional[str] = None,
    steerable_axle_model_id: Optional[str] = None,
    drive_axle_model_id: Optional[str] = None
):
    query = db.query(Machine)

    # Защита по ролям
    if current_user.role == "client":
        query = query.filter(Machine.client_id == current_user.id)
    elif current_user.role == "service":
        query = query.filter(Machine.service_company_id == current_user.id)
    elif current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Нет доступа")

    # Применяем фильтры
    if factory_number:
        query = query.filter(Machine.factory_number.ilike(f"%{factory_number}%"))  # поиск по части номера

    def safe_int(value):
        return int(value) if value and value.isdigit() else None

    if machine_model_id:
        mmi = safe_int(machine_model_id)
        if mmi is not None:
            query = query.filter(Machine.machine_model_id == mmi)
    if engine_model_id:
        emi = safe_int(engine_model_id)
        if emi is not None:
            query = query.filter(Machine.engine_model_id == emi)
    if transmission_model_id:
        tmi = safe_int(transmission_model_id)
        if tmi is not None:
            query = query.filter(Machine.transmission_model_id == tmi)
    if steerable_axle_model_id:
        sami = safe_int(steerable_axle_model_id)
        if sami is not None:
            query = query.filter(Machine.steerable_axle_model_id == sami)
    if drive_axle_model_id:
        dami = safe_int(drive_axle_model_id)
        if dami is not None:
            query = query.filter(Machine.drive_axle_model_id == dami)

    # Сортировка по умолчанию
    machines = query.order_by(Machine.shipment_date.desc()).all()

    result = []
    for m in machines:
        result.append({
            "id": m.id,
            "factory_number": m.factory_number,

            "machine_model": {"name": m.machine_model.name},
            "engine_model": {"name": m.engine_model.name},
            "transmission_model": {"name": m.transmission_model.name},
            "drive_axle_model": {"name": m.drive_axle_model.name},
            "steerable_axle_model": {"name": m.steerable_axle_model.name},

            "engine_serial": m.engine_serial,
            "transmission_serial": m.transmission_serial,
            "drive_axle_serial": m.drive_axle_serial,
            "steerable_axle_serial": m.steerable_axle_serial,

            "shipment_date": str(m.shipment_date),
            "consignee": m.consignee,
            "delivery_address": m.delivery_address,
            "equipment": m.equipment,
            "buyer": m.buyer,

            "client_id": m.client_id,
            "service_company_id": m.service_company_id,
            "service_company": {"username": m.service_company.username}
        })

    return result


@router.get("/{machine_id}", response_model=MachineResponse)
def read_machine(machine_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not db_machine:
        raise HTTPException(status_code=404, detail="Машина не найдена")

    if current_user.role == "manager":
        pass
    elif current_user.role == "client" and db_machine.client_id == current_user.id:
        pass
    elif current_user.role == "service" and db_machine.service_company_id == current_user.id:
        pass
    else:
        raise HTTPException(status_code=403, detail="Нет доступа")

    return {
        "id": db_machine.id,
        "factory_number": db_machine.factory_number,

        "machine_model": {"name": db_machine.machine_model.name},
        "engine_model": {"name": db_machine.engine_model.name},
        "transmission_model": {"name": db_machine.transmission_model.name},
        "drive_axle_model": {"name": db_machine.drive_axle_model.name},
        "steerable_axle_model": {"name": db_machine.steerable_axle_model.name},

        "engine_serial": db_machine.engine_serial,
        "transmission_serial": db_machine.transmission_serial,
        "drive_axle_serial": db_machine.drive_axle_serial,
        "steerable_axle_serial": db_machine.steerable_axle_serial,

        "shipment_date": str(db_machine.shipment_date),
        "consignee": db_machine.consignee,
        "delivery_address": db_machine.delivery_address,
        "equipment": db_machine.equipment,
        "buyer": db_machine.buyer,
        "client_id": db_machine.client_id,
        "service_company_id": db_machine.service_company_id,
        "service_company": {"username": db_machine.service_company.username}
    }



@router.put("/{machine_id}", response_model=MachineResponse)
@role_required("manager")
def update_machine(
    machine_id: int,
    updated_data: MachineUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not db_machine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Машина не найдена")

    for key, value in updated_data.model_dump().items():
        setattr(db_machine, key, value)

    db.commit()
    db.refresh(db_machine)
    return {
        "id": db_machine.id,
        "factory_number": db_machine.factory_number,

        "machine_model": {"name": db_machine.machine_model.name},
        "engine_model": {"name": db_machine.engine_model.name},
        "transmission_model": {"name": db_machine.transmission_model.name},
        "drive_axle_model": {"name": db_machine.drive_axle_model.name},
        "steerable_axle_model": {"name": db_machine.steerable_axle_model.name},

        "engine_serial": db_machine.engine_serial,
        "transmission_serial": db_machine.transmission_serial,
        "drive_axle_serial": db_machine.drive_axle_serial,
        "steerable_axle_serial": db_machine.steerable_axle_serial,

        "shipment_date": str(db_machine.shipment_date),
        "consignee": db_machine.consignee,
        "delivery_address": db_machine.delivery_address,
        "equipment": db_machine.equipment,
        "buyer": db_machine.buyer,
        "client_id": db_machine.client_id,
        "service_company_id": db_machine.service_company_id,
        "service_company": {"username": db_machine.service_company.username}
    }


@router.delete("/{machine_id}")
@role_required("manager")
def delete_machine(
    machine_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not db_machine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Машина не найдена")

    db.delete(db_machine)
    db.commit()
    return {"message": "Машина удалена"}