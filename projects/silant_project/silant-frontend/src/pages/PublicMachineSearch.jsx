import React, { useState } from 'react';
import api from '../services/api';

const PublicMachineSearch = () => {
    const [factoryNumber, setFactoryNumber] = useState('');
    const [machine, setMachine] = useState(null);
    const [error, setError] = useState('');

    const isMobile = window.innerWidth <= 768;

    const baseStyle = {
        primaryColor: '#D20A11',
        accentColor: '#EBE6D6',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: isMobile ? '1rem' : '2rem'
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '100vh',
            backgroundColor: baseStyle.accentColor,
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            padding: baseStyle.padding
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
            backgroundColor: '#fff',
            marginBottom: '2rem'
        },
        logo: {
            height: isMobile ? '30px' : '40px'
        },
        contactInfo: {
            display: 'flex',
            gap: isMobile ? '0.75rem' : '1rem',
            fontSize: isMobile ? '0.9rem' : '1rem'
        },
        contactLink: {
            textDecoration: 'none',
            color: '#163E6C',
            fontWeight: 'bold'
        },
        authButton: {
            padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem',
            backgroundColor: baseStyle.primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: baseStyle.borderRadius,
            cursor: 'pointer',
            fontSize: isMobile ? '0.95rem' : '1rem'
        },
        main: {
            maxWidth: '800px',
            width: '100%',
            padding: baseStyle.padding,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: baseStyle.borderRadius
        },
        input: {
            width: '100%',
            padding: isMobile ? '0.6rem' : '0.75rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: isMobile ? '0.95rem' : '1rem'
        },
        searchButton: {
            width: '100%',
            padding: isMobile ? '0.6rem' : '0.75rem',
            backgroundColor: baseStyle.primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: baseStyle.borderRadius,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.1rem'
        },
        resultTableContainer: {
            marginTop: '2rem',
            padding: baseStyle.padding,
            backgroundColor: '#fff',
            borderRadius: baseStyle.borderRadius,
            boxShadow: baseStyle.boxShadow,
            width: '100%'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableRow: {
            borderBottom: '1px solid #ddd'
        },
        tableLabel: {
            fontWeight: 'bold',
            textAlign: 'left',
            padding: '0.75rem',
            backgroundColor: '#f9f9f9',
            minWidth: isMobile ? '120px' : '200px'
        },
        tableValue: {
            textAlign: 'left',
            padding: '0.75rem'
        },
        footer: {
            marginTop: isMobile ? '2rem' : 'auto',
            padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            borderTop: '1px solid #eee'
        }
    };

    const handleSearch = async () => {
        if (!factoryNumber.trim()) {
            setError('Введите заводской номер');
            return;
        }

        try {
            const res = await api.get(`/public/machines?factory_number=${factoryNumber}`);
            console.log("Ответ от API:", res.data);

            if (res.data && typeof res.data === 'object') {
                setMachine(res.data);
                setError('');
            } else {
                setMachine(null);
                setError('Машина не найдена');
            }
        } catch (err) {
            console.error("Ошибка поиска машины", err);
            setError('Произошла ошибка при поиске');
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <img
                    src="/Frame_12.png"
                    alt="Логотип Мой Силант"
                    style={styles.logo}
                />
                <div style={styles.contactInfo}>
                    <a href="tel:+7-8352-20-12-09" style={styles.contactLink}>+7-8352-20-12-09</a>
                    <a href="https://t.me/your_telegram_username " target="_blank" rel="noopener noreferrer" style={styles.contactLink}>Telegram</a>
                </div>
                <button onClick={() => window.location.href = '/login'} style={styles.authButton}>
                    Авторизация
                </button>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                <h2>Проверьте комплектацию и технические характеристики техники Силант</h2>

                <input
                    type="text"
                    value={factoryNumber}
                    onChange={(e) => setFactoryNumber(e.target.value)}
                    placeholder="Введите заводской номер"
                    style={styles.input}
                />

                <button onClick={handleSearch} style={styles.searchButton}>
                    Поиск
                </button>

                {/* Ошибка */}
                {error && <p style={{ ...styles.contactLink, color: 'red', marginTop: '1rem' }}>{error}</p>}

                {/* Результат поиска */}
                {machine && (
                    <div style={styles.resultTableContainer}>
                        <h3>Результат поиска:</h3>
                        <table style={styles.table}>
                            <tbody>
                                <tr>
                                    <td style={styles.tableLabel}>Заводской номер:</td>
                                    <td style={styles.tableValue}>{machine.factory_number}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Модель техники:</td>
                                    <td style={styles.tableValue}>{machine.machine_model?.name || '-'}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Модель двигателя:</td>
                                    <td style={styles.tableValue}>{machine.engine_model?.name || '-'}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Дата отгрузки:</td>
                                    <td style={styles.tableValue}>{machine.shipment_date}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Грузополучатель:</td>
                                    <td style={styles.tableValue}>{machine.consignee}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Адрес поставки:</td>
                                    <td style={styles.tableValue}>{machine.delivery_address}</td>
                                </tr>
                                <tr>
                                    <td style={styles.tableLabel}>Комплектация:</td>
                                    <td style={styles.tableValue}>{machine.equipment}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
                <a href="tel:+7-8352-20-12-09" style={styles.contactLink}>+7-8352-20-12-09</a>
                <br />
                <a href="https://t.me/your_telegram_username " target="_blank" rel="noopener noreferrer" style={styles.contactLink}>Telegram</a>
                <br />
                <span style={{ color: '#666' }}>Мой Силант 2022</span>
            </footer>
        </div>
    );
};

export default PublicMachineSearch;