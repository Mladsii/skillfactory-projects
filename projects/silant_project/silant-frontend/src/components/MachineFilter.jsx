// src/components/MachineFilter.jsx
import React from 'react';
import SelectFilter from './SelectFilter';


const MachineFilter = ({ filters, setFilters }) => {
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
            <h3>Фильтр по машине</h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <SelectFilter
                    label="Модель техники"
                    entityType="ModelTechnique"
                    selectedValue={filters.machine_model_id}
                    onChange={handleFilterChange('machine_model_id')}
                />

                <SelectFilter
                    label="Модель двигателя"
                    entityType="ModelEngine"
                    selectedValue={filters.engine_model_id}
                    onChange={handleFilterChange('engine_model_id')}
                />

                <SelectFilter
                    label="Модель трансмиссии"
                    entityType="ModelTransmission"
                    selectedValue={filters.transmission_model_id}
                    onChange={handleFilterChange('transmission_model_id')}
                />

                <SelectFilter
                    label="Управляемый мост"
                    entityType="ModelSteerableAxle"
                    selectedValue={filters.steerable_axle_model_id}
                    onChange={handleFilterChange('steerable_axle_model_id')}
                />

                <SelectFilter
                    label="Ведущий мост"
                    entityType="ModelDriveAxle"
                    selectedValue={filters.drive_axle_model_id}
                    onChange={handleFilterChange('drive_axle_model_id')}
                />
            </div>
        </div>
    );
};

export default MachineFilter;