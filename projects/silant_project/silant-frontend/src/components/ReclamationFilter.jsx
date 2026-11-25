// src/components/ReclamationFilter.jsx
import React from 'react';
import SelectFilter from './SelectFilter';


const ReclamationFilter = ({ filters, setFilters }) => {
    const handleFactoryNumberChange = (e) => {
        setFilters({ ...filters, factory_number: e.target.value });
    };

    return (
        <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>Фильтр рекламаций</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    name="factory_number"
                    placeholder="Зав. № машины"
                    value={filters.factory_number || ''}
                    onChange={handleFactoryNumberChange}
                    style={{ minWidth: '150px', padding: '0.5rem' }}
                />

                <SelectFilter
                    label="Узел отказа"
                    entityType="FailureNode"
                    selectedValue={filters.failure_node_id}
                    onChange={(value) => setFilters({ ...filters, failure_node_id: value })}
                />

                <SelectFilter
                    label="Способ восстановления"
                    entityType="RepairMethod"
                    selectedValue={filters.repair_method_id}
                    onChange={(value) => setFilters({ ...filters, repair_method_id: value })}
                />

                <SelectFilter
                    label="Сервисная компания"
                    entityType="service"
                    selectedValue={filters.service_company_id}
                    onChange={(value) => setFilters({ ...filters, service_company_id: value })}
                />
            </div>
        </div>
    );
};

export default ReclamationFilter;