from django.contrib import admin
from .models import Spravochnik, Machine, Maintenance, Reclamation


@admin.register(Spravochnik)
class SpravochnikAdmin(admin.ModelAdmin):
    list_display = ('entity_name', 'name', 'description')
    list_filter = ('entity_name',)
    search_fields = ('name', 'description')


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = (
        'factory_number',
        'machine_model',
        'engine_model',
        'transmission_model',
        'shipment_date',
        'consignee',
        'client',
        'service_company'
    )
    list_filter = ('machine_model', 'client', 'service_company')
    search_fields = ('factory_number',)
    raw_id_fields = ('client', 'service_company')

    fieldsets = (
        ("Общие сведения", {
            'fields': (
                'factory_number',
                'machine_model',
                'engine_model',
                'engine_serial',
                'transmission_model',
                'transmission_serial',
                'drive_axle_model',
                'drive_axle_serial',
                'steerable_axle_model',
                'steerable_axle_serial'
            )
        }),
        ("Детали поставки", {
            'fields': (
                'supply_contract',
                'shipment_date',
                'consignee',
                'delivery_address',
                'equipment',
                'buyer',
                'client',
                'service_company'
            )
        })
    )


@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = (
        'machine',
        'maintenance_type',
        'date_performed',
        'operating_hours',
        'order_number',
        'order_date',
        'service_company'
    )
    list_filter = ('maintenance_type', 'date_performed', 'service_company')
    search_fields = ('machine__factory_number',)
    autocomplete_fields = ['machine', 'maintenance_type', 'service_company']


@admin.register(Reclamation)
class ReclamationAdmin(admin.ModelAdmin):
    list_display = (
        'failure_date',
        'machine',
        'failure_node',
        'repair_method',
        'downtime',
        'service_company'
    )
    list_filter = ('failure_node', 'repair_method', 'failure_date', 'machine__machine_model')
    search_fields = ('machine__factory_number', 'failure_description')
    autocomplete_fields = ['machine', 'failure_node', 'repair_method', 'service_company']

    fieldsets = (
        ("Информация о рекламации", {
            'fields': (
                'machine',
                'failure_date',
                'operating_hours',
                'failure_node',
                'failure_description',
                'repair_method',
                'spare_parts_used',
                'repair_date',
                'service_company'
            )
        }),
    )