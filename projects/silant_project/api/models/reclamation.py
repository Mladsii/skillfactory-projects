from sqlalchemy import Column, Integer, Date, String, ForeignKey, Float
from sqlalchemy.orm import relationship

from api.database import Base


class Reclamation(Base):
    __tablename__ = "equipment_reclamation"

    id = Column(Integer, primary_key=True)
    failure_date = Column(Date)
    operating_hours = Column(Integer)
    failure_node_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    failure_description = Column(String(255))
    repair_method_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    spare_parts_used = Column(String(255))
    repair_date = Column(Date)
    downtime = Column(Float)
    machine_id = Column(Integer, ForeignKey("equipment_machine.id"))
    service_company_id = Column(Integer, ForeignKey("users_user.id"))

    # Связи
    failure_node = relationship("Spravochnik", foreign_keys=[failure_node_id])
    repair_method = relationship("Spravochnik", foreign_keys=[repair_method_id])
    machine = relationship("Machine", foreign_keys=[machine_id])
    service_company = relationship("User", foreign_keys=[service_company_id])