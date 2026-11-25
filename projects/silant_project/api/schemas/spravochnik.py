from pydantic import BaseModel


class SpravochnikBase(BaseModel):
    name: str


class SpravochnikResponse(SpravochnikBase):
    id: int
    entity_name: str

    class Config:
        from_attributes = True