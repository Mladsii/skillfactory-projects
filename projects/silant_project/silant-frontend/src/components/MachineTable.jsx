import React from 'react';

const MachineTable = ({ data, onRowClick }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#163E6C', color: 'white' }}>
                    <th>Заводской №</th>
                    <th>Модель техники</th>
                    <th>Дата отгрузки</th>
                    <th>Грузополучатель</th>
                    <th>Адрес поставки</th>
                </tr>
            </thead>
            <tbody>
                {data.map((m, index) => (
                    <tr key={index} onClick={() => onRowClick(m)} style={{ cursor: 'pointer' }}>
                        <td>{m.factory_number}</td>
                        <td>{m.machine_model?.name || '-'}</td>
                        <td>{m.shipment_date}</td>
                        <td>{m.consignee}</td>
                        <td>{m.delivery_address}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MachineTable;