from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from api.models.spravochnik import Spravochnik
from api.models.user import User
from api.database import Base
class Machine(Base):
    __tablename__ = "equipment_machine"

    id = Column(Integer, primary_key=True)
    factory_number = Column(String(50), unique=True)  # Заводской номер машины

    # Внешние ключи на справочники
    machine_model_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    engine_model_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    transmission_model_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    drive_axle_model_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))
    steerable_axle_model_id = Column(Integer, ForeignKey("equipment_spravochnik.id"))

    # Детали машины
    engine_serial = Column(String(100))  # Зав. № двигателя
    transmission_serial = Column(String(100))  # Зав. № трансмиссии
    drive_axle_serial = Column(String(100))  # Зав. № ведущего моста
    steerable_axle_serial = Column(String(100))  # Зав. № управляемого моста

    supply_contract = Column(String(100))  # Договор поставки
    shipment_date = Column(Date)  # Дата отгрузки
    consignee = Column(String(255))  # Грузополучатель
    delivery_address = Column(String(255))  # Адрес поставки
    equipment = Column(String(255))  # Комплектация
    buyer = Column(String(255))  # Покупатель

    # Внешние ключи на пользователя
    client_id = Column(Integer, ForeignKey("users_user.id"))
    service_company_id = Column(Integer, ForeignKey("users_user.id"))

    # Relationships — важно указать явно
    machine_model = relationship(
        "Spravochnik",
        foreign_keys=[machine_model_id],
        primaryjoin="Spravochnik.id == Machine.machine_model_id"
    )
    engine_model = relationship(
        "Spravochnik",
        foreign_keys=[engine_model_id],
        primaryjoin="Spravochnik.id == Machine.engine_model_id"
    )
    transmission_model = relationship(
        "Spravochnik",
        foreign_keys=[transmission_model_id],
        primaryjoin="Spravochnik.id == Machine.transmission_model_id"
    )
    drive_axle_model = relationship(
        "Spravochnik",
        foreign_keys=[drive_axle_model_id],
        primaryjoin="Spravochnik.id == Machine.drive_axle_model_id"
    )
    steerable_axle_model = relationship(
        "Spravochnik",
        foreign_keys=[steerable_axle_model_id],
        primaryjoin="Spravochnik.id == Machine.steerable_axle_model_id"
    )

    client = relationship(
        "User",
        foreign_keys=[client_id]
    )
    service_company = relationship(
        "User",
        foreign_keys=[service_company_id]
    )