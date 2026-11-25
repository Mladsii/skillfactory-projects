import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';


const MaintenanceEditPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        date_performed: '',
        operating_hours: '',
        order_number: '',
        order_date: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Загрузка данных при открытии
    useEffect(() => {
        const fetchTO = async () => {
            try {
                const res = await api.get(`/maintenances/${id}`);
                setFormData({
                    date_performed: res.data.date_performed,
                    operating_hours: res.data.operating_hours,
                    order_number: res.data.order_number,
                    order_date: res.data.order_date
                });
            } catch (err) {
                setError("Ошибка загрузки данных");
            }
        };

        fetchTO();
    }, [id]);

    // Изменение полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'operating_hours' ? parseInt(value) || '' : value
        }));
    };

    // Отправка изменений
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/maintenances/${id}`, formData);
            setSuccess(true);
            setTimeout(() => window.history.back(), 1500);
        } catch (err) {
            setError("Не удалось сохранить изменения. Проверьте введённые данные.");
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Редактирование ТО</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>✅ Изменения успешно сохранены</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Дата проведения */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Дата проведения:</label>
                    <input
                        type="date"
                        name="date_performed"
                        value={formData.date_performed}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {/* Наработка */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Наработка (м/час):</label>
                    <input
                        type="number"
                        name="operating_hours"
                        value={formData.operating_hours}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Например: 405"
                        required
                    />
                </div>

                {/* Номер заказ-наряда */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Номер заказ-наряда:</label>
                    <input
                        type="text"
                        name="order_number"
                        value={formData.order_number}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Введите номер"
                    />
                </div>

                {/* Дата заказ-наряда */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Дата заказ-наряда:</label>
                    <input
                        type="date"
                        name="order_date"
                        value={formData.order_date}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {/* Кнопки */}
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.submitButton}>
                        Сохранить изменения
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        style={styles.cancelButton}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

// Стили прямо внутри компонента
const isMobile = window.innerWidth <= 768;

const baseStyle = {
    primaryColor: '#D20A11',
    accentColor: '#EBE6D6',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: isMobile ? '1rem' : '2rem',
    fontFamily: '"Segoe UI", sans-serif'
};

const styles = {
    container: {
        maxWidth: isMobile ? '95%' : '600px',
        margin: '2rem auto',
        padding: baseStyle.padding,
        backgroundColor: '#fff',
        borderRadius: baseStyle.borderRadius,
        boxShadow: baseStyle.boxShadow,
        fontFamily: baseStyle.fontFamily,
        boxSizing: 'border-box'
    },
    title: {
        textAlign: 'center',
        color: baseStyle.primaryColor,
        marginBottom: '1.5rem',
        fontSize: isMobile ? '1.2rem' : '1.5rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    label: {
        fontWeight: 'bold',
        fontSize: isMobile ? '0.9rem' : '0.95rem',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    textarea: {
        width: '100%',
        minHeight: '80px',
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        resize: 'vertical',
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1rem',
        marginTop: '1.5rem'
    },
    submitButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: baseStyle.primaryColor,
        color: '#fff',
        border: 'none',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        flex: isMobile ? '1 1 100%' : '1 1 45%'
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: baseStyle.accentColor,
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        flex: isMobile ? '1 1 100%' : '1 1 45%'
    },
    error: {
        color: '#d32f2f',
        textAlign: 'center',
        backgroundColor: '#ffebee',
        padding: '0.75rem',
        borderRadius: baseStyle.borderRadius,
        fontWeight: 'bold'
    },
    success: {
        color: '#388e3c',
        textAlign: 'center',
        backgroundColor: '#e8f5e9',
        padding: '0.75rem',
        borderRadius: baseStyle.borderRadius,
        fontWeight: 'bold'
    }
};

export default MaintenanceEditPage;