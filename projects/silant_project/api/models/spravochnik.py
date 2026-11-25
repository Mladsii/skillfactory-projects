from sqlalchemy import Column, Integer, String, Text
from api.database import Base


class Spravochnik(Base):
    __tablename__ = "equipment_spravochnik"

    id = Column(Integer, primary_key=True)
    entity_name = Column(String(50))
    name = Column(String(100))
    description = Column(Text)