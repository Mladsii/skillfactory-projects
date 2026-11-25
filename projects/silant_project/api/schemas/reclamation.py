from pydantic import BaseModel
from typing import Optional

class SpravochnikBase(BaseModel):
    name: str


class ReclamationBase(BaseModel):
    failure_date: str
    operating_hours: int
    failure_node_id: int
    failure_description: str
    repair_method_id: int
    spare_parts_used: Optional[str] = None
    repair_date: Optional[str] = None
    downtime: Optional[float] = None
    machine_id: int
    service_company_id: int


class ReclamationCreate(ReclamationBase):
    pass




class ReclamationUpdate(BaseModel):
    failure_date: Optional[str] = None
    operating_hours: Optional[int] = None
    failure_node_id: Optional[int] = None
    failure_description: Optional[str] = None
    repair_method_id: Optional[int] = None
    spare_parts_used: Optional[str] = None
    repair_date: Optional[str] = None
    downtime: Optional[int] = None



class ReclamationResponse(ReclamationBase):
    id: int
    failure_node: SpravochnikBase
    repair_method: SpravochnikBase
    machine: dict  # можно использовать кастомную схему позже
    service_company: dict

    class Config:
        from_attributes = True