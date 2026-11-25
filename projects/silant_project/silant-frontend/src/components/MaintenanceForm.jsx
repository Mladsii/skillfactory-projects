// src/components/MaintenanceForm.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useSpravochnik from '../hooks/useSpravochnik';
import { useNavigate, useParams } from 'react-router-dom';


const MaintenanceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // если редактируем существующее ТО

    const [formData, setFormData] = useState({
        maintenance_type_id: '',
        date_performed: '',
        operating_hours: '',
        order_number: '',
        order_date: '',
        machine_id: ''
    });

    const { options: machines, loading: machinesLoading } = useSpravochnik('machine-factory-number');
    const { options: types, loading: typesLoading } = useSpravochnik('MaintenanceType');


    // Если пользователь на странице редактирования
    useEffect(() => {
        if (id) {
            api.get(`/maintenances/${id}`).then(res => {
                setFormData({
                    maintenance_type_id: res.data.maintenance_type_id,
                    date_performed: res.data.date_performed,
                    operating_hours: res.data.operating_hours,
                    order_number: res.data.order_number,
                    order_date: res.data.order_date,
                    machine_id: res.data.machine_id
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await api.put(`/maintenances/${id}`, formData);
            } else {
                await api.post('/maintenances', formData);
            }

            navigate('/machines');
        } catch (err) {
            console.error("Ошибка при сохранении ТО", err);
        }
    };


    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
            <h3>{id ? 'Редактировать ТО' : 'Добавить новое ТО'}</h3>

            {/* Выбор машины */}
            <div>
                <label>Машина</label>
                <select name="machine_id" value={formData.machine_id} onChange={handleChange}>
                    <option value="">Выберите машину</option>
                    {machines.map(m => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Вид ТО */}
            <div>
                <label>Вид ТО</label>
                <select name="maintenance_type_id" value={formData.maintenance_type_id} onChange={handleChange}>
                    <option value="">Выберите тип ТО</option>
                    {types.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Дата проведения */}
            <div>
                <label>Дата проведения ТО</label>
                <input type="date" name="date_performed" value={formData.date_performed} onChange={handleChange} />
            </div>

            {/* Наработка */}
            <div>
                <label>Наработка (м/час)</label>
                <input
                    type="number"
                    name="operating_hours"
                    value={formData.operating_hours}
                    onChange={handleChange}
                />
            </div>

            {/* Номер заказ-наряда */}
            <div>
                <label>Номер заказ-наряда</label>
                <input
                    type="text"
                    name="order_number"
                    value={formData.order_number}
                    onChange={handleChange}
                />
            </div>

            {/* Дата заказ-наряда */}
            <div>
                <label>Дата заказ-наряда</label>
                <input
                    type="date"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">
                {id ? 'Обновить' : 'Сохранить'}
            </button>
        </form>
    );
};

export default MaintenanceForm;