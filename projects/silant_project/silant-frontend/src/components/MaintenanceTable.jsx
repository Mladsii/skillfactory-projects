import React from 'react';

const MaintenanceTable = ({ data, onRowClick }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#D20A11', color: 'white' }}>
                    <th>Вид ТО</th>
                    <th>Дата проведения</th>
                    <th>Наработка</th>
                    <th>Сервисная компания</th>
                </tr>
            </thead>
            <tbody>
                {data.map((m, i) => (
                    <tr key={i} onClick={() => onRowClick(m)} style={{ cursor: 'pointer' }}>
                        <td>{m.maintenance_type?.name}</td>
                        <td>{m.date_performed}</td>
                        <td>{m.operating_hours}</td>
                        <td>{m.service_company?.username || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MaintenanceTable;