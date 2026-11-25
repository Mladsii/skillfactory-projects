from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from api.models.machine import Machine
from api.schemas.machine import MachineResponsePublic
from api.database import get_db

router = APIRouter(prefix="/public", tags=["Public"])

@router.get("/machines")
def get_public_machine(factory_number: str, db: Session = Depends(get_db)):
    """
    Поиск машины по заводскому номеру (для гостей)
    """

    machine = db.query(Machine).filter(Machine.factory_number == factory_number).first()

    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Машина с таким заводским номером не найдена"
        )

    return {
        "factory_number": machine.factory_number,
        "machine_model": {"name": machine.machine_model.name},
        "engine_model": {"name": machine.engine_model.name},
        "transmission_model": {"name": machine.transmission_model.name},
        "drive_axle_model": {"name": machine.drive_axle_model.name},
        "steerable_axle_model": {"name": machine.steerable_axle_model.name},
        "shipment_date": str(machine.shipment_date),
        "consignee": machine.consignee,
        "delivery_address": machine.delivery_address,
        "equipment": machine.equipment,
    }