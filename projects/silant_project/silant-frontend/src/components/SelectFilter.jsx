import React from 'react';
import useSpravochnik from '../hooks/useSpravochnik';


const SelectFilter = ({ label, entityType, selectedValue, onChange }) => {
    const { options, loading } = useSpravochnik(entityType);

    if (loading) return <select disabled>Загрузка...</select>;

    return (
        <div style={{ marginRight: '1rem', minWidth: '150px' }}>
            <label><strong>{label}</strong></label>
            <select
                value={selectedValue || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
                <option value="">Все</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name || opt.username || 'Неизвестная компания'}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;