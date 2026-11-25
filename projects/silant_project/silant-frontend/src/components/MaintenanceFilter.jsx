// src/components/MaintenanceFilter.jsx
import React from 'react';
import SelectFilter from './SelectFilter';


const MaintenanceFilter = ({ filters, setFilters }) => {
    const handleFilterChange = (key) => (value) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>Фильтр ТО</h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    name="machine_factory_number"
                    placeholder="Зав. № машины"
                    onChange={(e) => setFilters({ ...filters, machine_factory_number: e.target.value })}
                    value={filters.machine_factory_number || ''}
                    style={{ padding: '0.5rem', minWidth: '150px' }}
                />

                <SelectFilter
                    label="Вид ТО"
                    entityType="MaintenanceType"
                    selectedValue={filters.maintenance_type_id}
                    onChange={handleFilterChange('maintenance_type_id')}
                />

                <SelectFilter
                    label="Сервисная компания"
                    entityType="service"
                    selectedValue={filters.service_company_id}
                    onChange={handleFilterChange('service_company_id')}
                />
            </div>
        </div>
    );
};

export default MaintenanceFilter;