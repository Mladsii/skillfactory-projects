import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const EditMachinePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        factory_number: '',
        buyer: '',
        supply_contract: '',
        shipment_date: '',
        consignee: '',
        delivery_address: '',
        equipment: '',
        machine_model_id: '',
        engine_model_id: '',
        transmission_model_id: '',
        drive_axle_model_id: '',
        steerable_axle_model_id: '',
        engine_serial: '',
        transmission_serial: '',
        drive_axle_serial: '',
        steerable_axle_serial: '',
        client_id: '',
        service_company_id: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Справочники
    const [machineModels, setMachineModels] = useState([]);
    const [engineModels, setEngineModels] = useState([]);
    const [transmissionModels, setTransmissionModels] = useState([]);
    const [driveAxleModels, setDriveAxles] = useState([]);
    const [steerableAxleModels, setSteerableAxles] = useState([]);

    const [clients, setClients] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);


    // Загрузка данных машины
    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const res = await api.get(`/machines/${id}`);
                setFormData({
                    factory_number: res.data.factory_number,
                    buyer: res.data.buyer,
                    supply_contract: res.data.supply_contract,
                    shipment_date: res.data.shipment_date,
                    consignee: res.data.consignee,
                    delivery_address: res.data.delivery_address,
                    equipment: res.data.equipment,

                    // ID справочников
                    machine_model_id: res.data.machine_model_id,
                    engine_model_id: res.data.engine_model_id,
                    transmission_model_id: res.data.transmission_model_id,
                    drive_axle_model_id: res.data.drive_axle_model_id,
                    steerable_axle_model_id: res.data.steerable_axle_model_id,

                    // Серийные номера
                    engine_serial: res.data.engine_serial || '',
                    transmission_serial: res.data.transmission_serial || '',
                    drive_axle_serial: res.data.drive_axle_serial || '',
                    steerable_axle_serial: res.data.steerable_axle_serial || '',

                    // Пользователи
                    client_id: res.data.client_id,
                    service_company_id: res.data.service_company_id
                });
            } catch (err) {
                console.error("Ошибка загрузки машины", err.response?.data || err.message);
                setError("Не удалось загрузить данные");
            }
        };

        const fetchSpravochniki = async () => {
            try {
                const types = ['ModelTechnique', 'ModelEngine', 'ModelTransmission', 'ModelDriveAxle', 'ModelSteerableAxle'];
                const spravRes = await Promise.all(
                    types.map(type => api.get(`/spravochnik/${type}`))
                );

                setMachineModels(spravRes[0].data);
                setEngineModels(spravRes[1].data);
                setTransmissionModels(spravRes[2].data);
                setDriveAxles(spravRes[3].data);
                setSteerableAxles(spravRes[4].data);
            } catch (err) {
                console.error("Ошибка загрузки справочников", err.response?.data || err.message);
                setError("Не удалось загрузить справочники");
            }
        };

        const fetchUsers = async () => {
            try {
                const clientsRes = await api.get('/users?role=client');
                const serviceCompaniesRes = await api.get('/users?role=service');

                setClients(clientsRes.data);
                setServiceCompanies(serviceCompaniesRes.data);
            } catch (err) {
                console.error("Ошибка загрузки пользователей", err.response?.data || err.message);
            }
        };

        fetchMachine();
        fetchSpravochniki();
        fetchUsers();
    }, [id]);

    // Изменение полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (
            name === 'machine_model_id' ||
            name === 'engine_model_id' ||
            name === 'transmission_model_id' ||
            name === 'drive_axle_model_id' ||
            name === 'steerable_axle_model_id' ||
            name === 'client_id' ||
            name === 'service_company_id'
        ) {
            newValue = value ? parseInt(value) : undefined;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // Отправка изменений
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/machines/${id}`, formData);
            setSuccess(true);
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            console.error("Ошибка редактирования машины", err.response?.data || err.message);
            setError("Не удалось сохранить изменения");
        }
    };


    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Редактировать данные машины</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>✅ Изменения успешно сохранены</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Заводской номер */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Заводской №:</label>
                    <input
                        type="text"
                        name="factory_number"
                        value={formData.factory_number}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {/* Модель техники */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Модель техники:</label>
                    <select
                        name="machine_model_id"
                        value={formData.machine_model_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Выберите модель</option>
                        {machineModels.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Модель двигателя */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Модель двигателя:</label>
                    <select
                        name="engine_model_id"
                        value={formData.engine_model_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Выберите двигатель</option>
                        {engineModels.map(engine => (
                            <option key={engine.id} value={engine.id}>
                                {engine.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Модель трансмиссии */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Модель трансмиссии:</label>
                    <select
                        name="transmission_model_id"
                        value={formData.transmission_model_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите трансмиссию</option>
                        {transmissionModels.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ведущий мост */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Ведущий мост:</label>
                    <select
                        name="drive_axle_model_id"
                        value={formData.drive_axle_model_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите мост</option>
                        {driveAxleModels.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Управляемый мост */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Управляемый мост:</label>
                    <select
                        name="steerable_axle_model_id"
                        value={formData.steerable_axle_model_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите мост</option>
                        {steerableAxleModels.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Клиент */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Клиент:</label>
                    <select
                        name="client_id"
                        value={formData.client_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите клиента</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Сервисная компания */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Сервисная компания:</label>
                    <select
                        name="service_company_id"
                        value={formData.service_company_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите организацию</option>
                        {serviceCompanies.map(sc => (
                            <option key={sc.id} value={sc.id}>
                                {sc.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Дата отгрузки */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Дата отгрузки:</label>
                    <input
                        type="date"
                        name="shipment_date"
                        value={formData.shipment_date || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Покупатель */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Покупатель:</label>
                    <input
                        type="text"
                        name="buyer"
                        value={formData.buyer || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Грузополучатель */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Грузополучатель:</label>
                    <input
                        type="text"
                        name="consignee"
                        value={formData.consignee || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Адрес поставки */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Адрес поставки:</label>
                    <input
                        type="text"
                        name="delivery_address"
                        value={formData.delivery_address || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Комплектация */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Комплектация:</label>
                    <textarea
                        name="equipment"
                        value={formData.equipment || ''}
                        onChange={handleChange}
                        style={styles.textarea}
                    />
                </div>

                {/* Серийный номер двигателя */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Серийный № двигателя:</label>
                    <input
                        type="text"
                        name="engine_serial"
                        value={formData.engine_serial || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Серийный номер трансмиссии */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Серийный № трансмиссии:</label>
                    <input
                        type="text"
                        name="transmission_serial"
                        value={formData.transmission_serial || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Серийный номер ведущего моста */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Серийный № ведущего моста:</label>
                    <input
                        type="text"
                        name="drive_axle_serial"
                        value={formData.drive_axle_serial || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Серийный номер управляемого моста */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Серийный № управляемого моста:</label>
                    <input
                        type="text"
                        name="steerable_axle_serial"
                        value={formData.steerable_axle_serial || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Кнопки */}
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.submitButton}>
                        Сохранить изменения
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={styles.cancelButton}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

// Адаптивные стили внутри компонента
const isMobile = window.innerWidth <= 768;

const baseStyle = {
    primaryColor: '#D20A11',
    accentColor: '#EBE6D6',
    borderRadius: '8px',
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: baseStyle.fontFamily
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
        fontSize: isMobile ? '0.95rem' : '1rem',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: isMobile ? '0.6rem' : '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    textarea: {
        width: '100%',
        minHeight: '80px',
        padding: isMobile ? '0.6rem' : '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        resize: 'vertical',
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    select: {
        width: '100%',
        padding: isMobile ? '0.6rem' : '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        fontSize: isMobile ? '0.95rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1rem',
        justifyContent: 'space-between',
        marginTop: '1.5rem'
    },
    submitButton: {
        padding: isMobile ? '0.6rem 1.2rem' : '0.75rem 1.5rem',
        backgroundColor: baseStyle.primaryColor,
        color: '#fff',
        border: 'none',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        flex: 1
    },
    cancelButton: {
        padding: isMobile ? '0.6rem 1.2rem' : '0.75rem 1.5rem',
        backgroundColor: baseStyle.accentColor,
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        cursor: 'pointer',
        fontSize: isMobile ? '1rem' : '1.1rem',
        flex: 1
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
export default EditMachinePage;