import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MachineDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [machine, setMachine] = useState(null);

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const res = await api.get(`/machines/${id}`);
                setMachine(res.data);
            } catch (err) {
                console.error("Ошибка загрузки машины", err);
            }
        };

        if (id) {
            fetchMachine();
        }
    }, [id]);

    if (!machine) return <div style={styles.loading}>Загрузка данных...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Общая информация о машине</h2>

            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.label}>Заводской №:</td>
                        <td>{machine.factory_number}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Модель техники:</td>
                        <td>{machine.machine_model?.name || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Модель двигателя:</td>
                        <td>{machine.engine_model?.name || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Зав. № двигателя:</td>
                        <td>{machine.engine_serial}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Модель трансмиссии:</td>
                        <td>{machine.transmission_model?.name || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Зав. № трансмиссии:</td>
                        <td>{machine.transmission_serial}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Модель ведущего моста:</td>
                        <td>{machine.drive_axle_model?.name || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Зав. № ведущего моста:</td>
                        <td>{machine.drive_axle_serial}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Модель управляемого моста:</td>
                        <td>{machine.steerable_axle_model?.name || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Зав. № управляемого моста:</td>
                        <td>{machine.steerable_axle_serial}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Дата отгрузки:</td>
                        <td>{machine.shipment_date}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Покупатель:</td>
                        <td>{machine.buyer}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Грузополучатель:</td>
                        <td>{machine.consignee}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Адрес поставки:</td>
                        <td>{machine.delivery_address}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Комплектация:</td>
                        <td>{machine.equipment}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}>Сервисная компания:</td>
                        <td>{machine.service_company?.username || '-'}</td>
                    </tr>
                </tbody>
            </table>

            {/* Кнопки */}
            <div style={styles.buttonContainer}>
                <button
                    onClick={() => navigate(`/machines/edit/${id}`)}
                    style={styles.editButton}
                >
                    Редактировать
                </button>
                <button
                    onClick={() => navigate(-1)}
                    style={styles.backButton}
                >
                    Назад
                </button>
            </div>
        </div>
    );
};

/// Стили прямо внутри компонента (CSS-in-JS)
const isMobile = window.innerWidth <= 768;

const baseStyle = {
    primaryColor: '#163E6C',
    secondaryColor: '#D20A11',
    accentColor: '#EBE6D6',
    borderRadius: '8px',
    padding: isMobile ? '1rem' : '2rem'
};

const styles = {
    container: {
        maxWidth: isMobile ? '95%' : '600px',
        margin: '2rem auto',
        padding: baseStyle.padding,
        fontFamily: '"Segoe UI", sans-serif',
        backgroundColor: '#fff',
        borderRadius: baseStyle.borderRadius,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
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
        marginTop: '1rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        borderRadius: baseStyle.borderRadius,
        overflow: 'hidden'
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
        justifyContent: 'space-between',
        marginTop: '2rem'
    },
    editButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: baseStyle.secondaryColor,
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

export default MachineDetailsPage;
