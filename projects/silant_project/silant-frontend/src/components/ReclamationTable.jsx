// src/components/ReclamationTable.jsx
import React from 'react';

const ReclamationTable = ({ data, onRowClick }) => {
    return (
        <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem'
        }}>
            <thead>
                <tr style={{
                    backgroundColor: '#D20A11',
                    color: 'white'
                }}>
                    <th>Дата отказа</th>
                    <th>Наработка</th>
                    <th>Узел отказа</th>
                    <th>Способ восстановления</th>
                    <th>Время простоя</th>
                </tr>
            </thead>
            <tbody>
                {data.map((r, i) => (
                    <tr key={i} onClick={() => onRowClick(r)} style={{ cursor: 'pointer' }}>
                        <td>{r.failure_date}</td>
                        <td>{r.operating_hours}</td>
                        <td>{r.failure_node?.name || '-'}</td>
                        <td>{r.repair_method?.name || '-'}</td>
                        <td>{r.downtime} дней</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ReclamationTable;