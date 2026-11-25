from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User


class Spravochnik(models.Model):
    """
    Общий справочник для разных сущностей
    """
    ENTITY_TYPES = (
        ('ModelTechnique', _('Модель техники')),
        ('ModelEngine', _('Модель двигателя')),
        ('ModelTransmission', _('Модель трансмиссии')),
        ('ModelSteerableAxle', _('Модель управляемого моста')),
        ('ModelDriveAxle', _('Модель ведущего моста')),
        ('MaintenanceType', _('Вид ТО')),
        ('FailureNode', _('Узел отказа')),
        ('RepairMethod', _('Способ восстановления')),
    )

    entity_name = models.CharField(max_length=50, choices=ENTITY_TYPES, verbose_name=_('Наименование справочника'))
    name = models.CharField(max_length=100, verbose_name=_('Значение'))
    description = models.TextField(blank=True, null=True, verbose_name=_('Описание'))

    def __str__(self):
        return f"{self.get_entity_name_display()} - {self.name}"

    class Meta:
        verbose_name = _("Справочник")
        verbose_name_plural = _("Справочники")


class Machine(models.Model):
    factory_number = models.CharField(_("Заводской номер"), max_length=50, unique=True)
    buyer = models.CharField("Покупатель", max_length=255)
    supply_contract = models.CharField(_("Договор поставки"), max_length=100)
    shipment_date = models.DateField(_("Дата отгрузки"))
    consignee = models.CharField(_("Грузополучатель"), max_length=255)
    delivery_address = models.TextField(_("Адрес поставки"))
    equipment = models.TextField(_("Комплектация"))

    # Модели техники из справочника
    machine_model = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='machine_models',
        limit_choices_to={'entity_name': 'ModelTechnique'},
        verbose_name=_("Модель техники")
    )
    engine_model = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='engine_models',
        limit_choices_to={'entity_name': 'ModelEngine'},
        verbose_name=_("Модель двигателя")
    )
    transmission_model = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='transmission_models',
        limit_choices_to={'entity_name': 'ModelTransmission'},
        verbose_name=_("Модель трансмиссии")
    )
    drive_axle_model = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='drive_axle_models',
        limit_choices_to={'entity_name': 'ModelDriveAxle'},
        verbose_name=_("Модель ведущего моста")
    )
    steerable_axle_model = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='steerable_axle_models',
        limit_choices_to={'entity_name': 'ModelSteerableAxle'},
        verbose_name=_("Модель управляемого моста")
    )


    engine_serial = models.CharField(_("Зав. № двигателя"), max_length=100, blank=True, null=True)
    transmission_serial = models.CharField(_("Зав. № трансмиссии"), max_length=100, blank=True, null=True)
    drive_axle_serial = models.CharField(_("Зав. № ведущего моста"), max_length=100, blank=True, null=True)
    steerable_axle_serial = models.CharField(_("Зав. № управляемого моста"), max_length=100, blank=True, null=True)

    # Владелец и сервисная компания
    client = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='owned_machines',
        limit_choices_to={'role': 'client'},
        verbose_name=_("Клиент")
    )
    service_company = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='serviced_machines',
        limit_choices_to={'role': 'service'},
        verbose_name=_("Сервисная компания")
    )

    def __str__(self):
        return f"Машина {self.factory_number}"

    class Meta:
        verbose_name = "Машина"
        verbose_name_plural = "Машины"


class Maintenance(models.Model):
    MAINTENANCE_TYPES = Spravochnik.objects.filter(entity_name='MaintenanceType')

    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='maintenances')
    maintenance_type = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='maintenance_types',
        limit_choices_to={'entity_name': 'MaintenanceType'}
    )
    date_performed = models.DateField(_("Дата проведения ТО"))
    operating_hours = models.PositiveIntegerField(_("Наработка, м/час"))
    order_number = models.CharField(_("Номер заказ-наряда"), max_length=50)
    order_date = models.DateField(_("Дата заказ-наряда"))
    service_company = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='maintenance_service',
        limit_choices_to={'role': 'service'}
    )

    def __str__(self):
        return f"ТО {self.maintenance_type} на {self.machine.factory_number}"

    class Meta:
        verbose_name = "ТО"
        verbose_name_plural = "ТО"


class Reclamation(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='reclamations')
    failure_date = models.DateField(_("Дата отказа"))
    operating_hours = models.PositiveIntegerField(_("Наработка, м/час"))
    failure_node = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='failure_nodes',
        limit_choices_to={'entity_name': 'FailureNode'}
    )
    failure_description = models.TextField(_("Описание отказа"))
    repair_method = models.ForeignKey(
        Spravochnik,
        on_delete=models.CASCADE,
        related_name='repair_methods',
        limit_choices_to={'entity_name': 'RepairMethod'}
    )
    spare_parts_used = models.TextField(_("Использованные запчасти"), blank=True, null=True)
    repair_date = models.DateField(_("Дата восстановления"), blank=True, null=True)
    downtime = models.FloatField(_("Время простоя (дни)"), blank=True, null=True)
    service_company = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reclamation_service',
        limit_choices_to={'role': 'service'}
    )

    def save(self, *args, **kwargs):
        if self.repair_date and self.failure_date:
            self.downtime = (self.repair_date - self.failure_date).days
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Рекламация {self.machine.factory_number} от {self.failure_date}"

    class Meta:
        verbose_name = "Рекламация"
        verbose_name_plural = "Рекламации"