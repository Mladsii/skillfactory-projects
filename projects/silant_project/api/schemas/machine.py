from pydantic import BaseModel
from typing import Optional

class SpravochnikBase(BaseModel):
    name: str

    class Config:
        from_attributes = True


# Схема для публичного ответа (гости)
class MachineResponsePublic(BaseModel):
    id: int
    factory_number: str
    machine_model: SpravochnikBase
    engine_model: SpravochnikBase
    transmission_model: SpravochnikBase
    drive_axle_model: SpravochnikBase
    steerable_axle_model: SpravochnikBase
    shipment_date: str
    consignee: str
    delivery_address: str
    equipment: str
    engine_serial: str
    transmission_serial: str
    drive_axle_serial: str
    steerable_axle_serial: str

    class Config:
        from_attributes = True


# Полная схема для авторизованных пользователей
class MachineResponse(MachineResponsePublic):
    client_id: int
    service_company_id: int

    class Config:
        from_attributes = True


# Схема для создания машины
class MachineCreate(BaseModel):
    factory_number: str
    machine_model_id: int
    engine_model_id: int
    transmission_model_id: int
    drive_axle_model_id: int
    steerable_axle_model_id: int
    supply_contract: str
    shipment_date: str
    consignee: str
    delivery_address: str
    equipment: str
    client_id: int
    service_company_id: int
    engine_serial: str
    transmission_serial: str
    drive_axle_serial: str
    steerable_axle_serial: str

    class Config:
        from_attributes = True


# Схема для обновления машины
class MachineUpdate(BaseModel):
    machine_model_id: Optional[int] = None
    engine_model_id: Optional[int] = None
    transmission_model_id: Optional[int] = None
    drive_axle_model_id: Optional[int] = None
    steerable_axle_model_id: Optional[int] = None

    # Детали
    engine_serial: Optional[str] = None
    transmission_serial: Optional[str] = None
    drive_axle_serial: Optional[str] = None
    steerable_axle_serial: Optional[str] = None

    # Пользователи
    client_id: Optional[int] = None
    service_company_id: Optional[int] = None
