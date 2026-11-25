from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship

from api.database import Base


class Maintenance(Base):
    __tablename__ = "equipment_maintenance"

    id = Column(Integer, primary_key=True)
    maintenance_type_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    date_performed = Column(Date)
    operating_hours = Column(Integer)
    order_number = Column(String(50))
    order_date = Column(Date)
    machine_id = Column(Integer, ForeignKey("equipment_machine.id"))
    service_company_id = Column(Integer, ForeignKey("users_user.id"))

    # Связи
    maintenance_type = relationship("Spravochnik", foreign_keys=[maintenance_type_id])
    machine = relationship("Machine", foreign_keys=[machine_id])
    service_company = relationship("User", foreign_keys=[service_company_id])