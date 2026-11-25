from pydantic import BaseModel
from typing import Optional


class SpravochnikBase(BaseModel):
    name: str


class MachineBase(BaseModel):
    factory_number: str


class UserBase(BaseModel):
    username: str
    role: str


class MaintenanceBase(BaseModel):
    id: int
    maintenance_type_id: int
    date_performed: str
    operating_hours: int
    order_number: str
    order_date: str
    machine_id: int
    service_company_id: int


class MaintenanceCreate(MaintenanceBase):
    pass


class MaintenanceUpdate(BaseModel):
    maintenance_type_id: Optional[int] = None
    date_performed: Optional[str] = None
    operating_hours: Optional[int] = None
    order_number: Optional[str] = None
    order_date: Optional[str] = None
    machine_id: Optional[int] = None
    service_company_id: Optional[int] = None


class MaintenanceResponse(MaintenanceBase):
    maintenance_type: SpravochnikBase
    machine: MachineBase
    service_company: UserBase

    class Config:
        from_attributes = True