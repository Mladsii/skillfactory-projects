import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

// Компоненты
import MachineFilter from '../components/MachineFilter';
import MaintenanceFilter from '../components/MaintenanceFilter';
import ReclamationFilter from '../components/ReclamationFilter';

import MachineTable from '../components/MachineTable';
import MaintenanceTable from '../components/MaintenanceTable';
import ReclamationTable from '../components/ReclamationTable';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('machines');
    const [machines, setMachines] = useState([]);
    const [maintenances, setMaintenances] = useState([]);
    const [reclamations, setReclamations] = useState([]);

    // Фильтры
    const [machineFilters, setMachineFilters] = useState({
        machine_model_id: '',
        engine_model_id: '',
        transmission_model_id: '',
        steerable_axle_model_id: '',
        drive_axle_model_id: ''
    });

    const [maintenanceFilters, setMaintenanceFilters] = useState({
        maintenance_type_id: '',
        machine_factory_number: '',
        service_company_id: ''
    });

    const [reclamationFilters, setReclamationFilters] = useState({
        failure_node_id: '',
        repair_method_id: '',
        factory_number: ''
    });

    const navigate = useNavigate();

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            let params = {};

            if (activeTab === 'machines') {
                params = new URLSearchParams(machineFilters).toString();
                const res = await api.get(`/machines?${params}`);
                setMachines(res.data);
            }

            if (activeTab === 'maintenances') {
                params = new URLSearchParams(maintenanceFilters).toString();
                const res = await api.get(`/maintenances?${params}`);
                setMaintenances(res.data);
            }

            if (activeTab === 'reclamations') {
                params = new URLSearchParams(reclamationFilters).toString();
                const res = await api.get(`/reclamations?${params}`);
                setReclamations(res.data);
            }
        };

        fetchData();
    }, [activeTab, machineFilters, maintenanceFilters, reclamationFilters]);

    // Обработчики кликов по строкам
    const handleMachineClick = (machine) => {
        navigate(`/machines/${machine.id}`);
    };

    const handleMaintenanceClick = (maintenance) => {
        navigate(`/maintenances/${maintenance.id}`);
    };

    const handleReclamationClick = (reclamation) => {
        navigate(`/reclamations/${reclamation.id}`);
    };

    return (
        <div style={styles.container}>
            {/* Хедер */}
            <header style={styles.header}>
                <img src="/Frame_12.png" alt="Логотип Силант" style={styles.logo} />
                <div style={styles.contactInfo}>
                    <a href="tel:+7-8352-20-12-09" style={styles.contactLink}>+7-8352-20-12-09</a>
                    <a href="https://t.me/your_telegram_username " target="_blank" rel="noopener noreferrer" style={styles.contactLink}>Telegram</a>
                </div>
                <button onClick={() => navigate('/login')} style={styles.authButton}>
                    Выйти
                </button>
            </header>

            <main style={styles.main}>
                <h2 style={styles.title}>Главная</h2>

                {/* Вкладки */}
                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'machines' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('machines')}
                    >
                        Общая информация
                    </button>
                    <button
                        style={activeTab === 'maintenances' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('maintenances')}
                    >
                        Техническое обслуживание
                    </button>
                    <button
                        style={activeTab === 'reclamations' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('reclamations')}
                    >
                        Рекламации
                    </button>
                </div>

                {/* Фильтр */}
                {activeTab === 'machines' && (
                    <MachineFilter filters={machineFilters} setFilters={setMachineFilters} />
                )}
                {activeTab === 'maintenances' && (
                    <MaintenanceFilter filters={maintenanceFilters} setFilters={setMaintenanceFilters} />
                )}
                {activeTab === 'reclamations' && (
                    <ReclamationFilter filters={reclamationFilters} setFilters={setReclamationFilters} />
                )}

                {/* Таблицы */}
                {activeTab === 'machines' && (
                    <MachineTable data={machines} onRowClick={handleMachineClick} />
                )}
                {activeTab === 'maintenances' && (
                    <MaintenanceTable data={maintenances} onRowClick={handleMaintenanceClick} />
                )}
                {activeTab === 'reclamations' && (
                    <ReclamationTable data={reclamations} onRowClick={handleReclamationClick} />
                )}
            </main>

            {/* Футер */}
            <footer style={styles.footer}>
                <p><strong>Мой Силант 2022</strong></p>
                <p><a href="tel:+7-8352-20-12-09" style={styles.contactLink}>+7-8352-20-12-09</a></p>
                <p><a href="https://t.me/your_telegram_username " target="_blank" rel="noopener noreferrer" style={styles.contactLink}>Telegram</a></p>
            </footer>
        </div>
    );
};

// Адаптивные стили
const isMobile = window.innerWidth <= 768;

const baseStyle = {
    primaryColor: '#163E6C',
    secondaryColor: '#D20A11',
    accentColor: '#EBE6D6',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: isMobile ? '1rem' : '2rem',
    fontFamily: '"Segoe UI", sans-serif'
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: baseStyle.fontFamily,
        backgroundColor: '#f9f9f9'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        gap: '0.5rem'
    },
    logo: {
        height: isMobile ? '30px' : '40px'
    },
    contactInfo: {
        display: 'flex',
        gap: isMobile ? '0.75rem' : '1rem',
        fontSize: isMobile ? '0.9rem' : '1rem',
        flexWrap: 'wrap'
    },
    contactLink: {
        textDecoration: 'none',
        color: baseStyle.primaryColor,
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    authButton: {
        padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem',
        backgroundColor: baseStyle.secondaryColor,
        color: '#fff',
        border: 'none',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        marginLeft: isMobile ? 'auto' : '0'
    },
    main: {
        flex: 1,
        padding: baseStyle.padding,
        backgroundColor: baseStyle.accentColor,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    title: {
        textAlign: 'center',
        color: baseStyle.primaryColor,
        marginBottom: isMobile ? '1rem' : '1.5rem',
        fontSize: isMobile ? '1.2rem' : '1.5rem'
    },
    tabs: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '0.5rem' : '1rem',
        marginBottom: '1rem'
    },
    tab: {
        padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
        border: 'none',
        backgroundColor: baseStyle.secondaryColor,
        color: '#fff',
        cursor: 'pointer',
        borderRadius: baseStyle.borderRadius,
        width: isMobile ? '100%' : 'auto',
        textAlign: 'center'
    },
    activeTab: {
        padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
        border: 'none',
        backgroundColor: baseStyle.primaryColor,
        color: '#fff',
        cursor: 'pointer',
        borderRadius: baseStyle.borderRadius,
        width: isMobile ? '100%' : 'auto',
        textAlign: 'center'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: baseStyle.borderRadius
    },
    tableHeaderRow: {
        backgroundColor: baseStyle.primaryColor,
        color: '#fff'
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
        cursor: 'pointer'
    },
    tableCell: {
        padding: '0.75rem',
        fontSize: isMobile ? '0.9rem' : '1rem',
        wordBreak: 'break-word'
    },
    footer: {
        textAlign: 'center',
        padding: isMobile ? '0.75rem' : '1rem',
        backgroundColor: '#fff',
        borderTop: '1px solid #ccc',
        fontSize: isMobile ? '0.85rem' : '1rem'
    }
};

export default Dashboard;