// src/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ filters, setFilters, options }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>Фильтр</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    name="machine_model"
                    placeholder="Модель техники"
                    onChange={handleChange}
                    value={filters.machine_model || ''}
                />
                <input
                    name="engine_model"
                    placeholder="Модель двигателя"
                    onChange={handleChange}
                    value={filters.engine_model || ''}
                />
                <input
                    name="transmission_model"
                    placeholder="Модель трансмиссии"
                    onChange={handleChange}
                    value={filters.transmission_model || ''}
                />
                <input
                    name="steerable_axle_model"
                    placeholder="Управляемый мост"
                    onChange={handleChange}
                    value={filters.steerable_axle_model || ''}
                />
                <input
                    name="drive_axle_model"
                    placeholder="Ведущий мост"
                    onChange={handleChange}
                    value={filters.drive_axle_model || ''}
                />
            </div>
        </div>
    );
};

export default FilterBar;