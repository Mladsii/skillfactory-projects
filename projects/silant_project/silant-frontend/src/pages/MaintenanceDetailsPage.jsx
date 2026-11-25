import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const MaintenanceDetails = () => {
    const { id } = useParams();
    const [to, setTo] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/maintenances/${id}`);
                setTo(res.data);
            } catch (err) {
                console.error("Ошибка загрузки ТО", err.response?.data || err.message);
            }
        };
        fetch();
    }, [id]);

    if (!to) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Детали ТО</h3>

            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.label}>Машина:</td>
                        <td>{to.machine?.factory_number}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Вид ТО:</td>
                        <td>{to.maintenance_type?.name}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Дата проведения:</td>
                        <td>{to.date_performed}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Наработка:</td>
                        <td>{to.operating_hours} м/час</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Номер заказ-наряда:</td>
                        <td>{to.order_number}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Дата заказ-наряда:</td>
                        <td>{to.order_date}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Сервисная компания:</td>
                        <td>{to.service_company?.username}</td>
                    </tr>
                </tbody>
            </table>

            {/* Кнопки */}
            <div style={styles.buttonContainer}>
                <button onClick={() => window.location.href = `/maintenances/edit/${to.id}`} style={styles.editButton}>
                    Редактировать
                </button>
                <button onClick={() => window.history.back()} style={styles.backButton}>
                    Назад
                </button>
            </div>
        </div>
    );
};

// Адаптивные стили внутри компонента
const isMobile = window.innerWidth <= 768;

const baseStyle = {
    primaryColor: '#D20A11',
    accentColor: '#EBE6D6',
    borderRadius: '8px',
    padding: isMobile ? '1rem' : '2rem'
};

const styles = {
    container: {
        maxWidth: isMobile ? '95%' : '600px',
        margin: '2rem auto',
        padding: baseStyle.padding,
        backgroundColor: '#fff',
        borderRadius: baseStyle.borderRadius,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Segoe UI", sans-serif'
    },
    title: {
        textAlign: 'center',
        color: baseStyle.primaryColor,
        marginBottom: '1.5rem',
        fontSize: isMobile ? '1.2rem' : '1.5rem'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem'
    },
    label: {
        fontWeight: 'bold',
        minWidth: isMobile ? '150px' : '200px',
        padding: '0.75rem',
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #ddd',
        verticalAlign: 'top'
    },
    value: {
        padding: '0.75rem',
        borderBottom: '1px solid #ddd',
        wordBreak: 'break-word',
        fontSize: isMobile ? '0.95rem' : '1rem'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1rem',
        marginTop: '2rem'
    },
    editButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: baseStyle.primaryColor,
        color: '#fff',
        border: 'none',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        transition: 'background-color 0.3s ease'
    },
    backButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: baseStyle.accentColor,
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        transition: 'background-color 0.3s ease'
    },
    loading: {
        padding: '2rem',
        textAlign: 'center',
        fontSize: isMobile ? '1rem' : '1.2rem',
        color: '#555'
    }
};

export default MaintenanceDetails;