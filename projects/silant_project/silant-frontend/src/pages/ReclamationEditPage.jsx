import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ReclamationEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        failure_date: '',
        operating_hours: '',
        failure_node_id: '',
        failure_description: '',
        repair_method_id: '',
        spare_parts_used: '',
        repair_date: '',
        downtime: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Справочники
    const [failureNodes, setFailureNodes] = useState([]);
    const [repairMethods, setRepairMethods] = useState([]);

    // Загрузка данных рекламации
    useEffect(() => {
        const fetchReclamation = async () => {
            try {
                const res = await api.get(`/reclamations/${id}`);
                setFormData({
                    failure_date: res.data.failure_date,
                    operating_hours: res.data.operating_hours,
                    failure_node_id: res.data.failure_node_id || '',
                    failure_description: res.data.failure_description || '',
                    repair_method_id: res.data.repair_method_id || '',
                    spare_parts_used: res.data.spare_parts_used || '',
                    repair_date: res.data.repair_date || '',
                    downtime: res.data.downtime || ''
                });
            } catch (err) {
                console.error("Ошибка загрузки рекламации", err);
                setError("Не удалось загрузить данные");
            }
        };

        const fetchSpravochniki = async () => {
            try {
                const [nodesRes, methodsRes] = await Promise.all([
                    api.get('/spravochnik/FailureNode'),
                    api.get('/spravochnik/RepairMethod')
                ]);

                setFailureNodes(nodesRes.data);
                setRepairMethods(methodsRes.data);
            } catch (err) {
                console.error("Ошибка загрузки справочников", err);
                setError("Не удалось загрузить справочники");
            }
        };

        fetchReclamation();
        fetchSpravochniki();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (
            name === 'failure_node_id' ||
            name === 'repair_method_id'
        ) {
            newValue = value ? parseInt(value) : undefined;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/reclamations/${id}`, formData);
            setSuccess(true);
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            console.error("Ошибка редактирования рекламации", err.response?.data || err.message);
            setError("Не удалось сохранить изменения");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Редактировать рекламацию</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>✅ Изменения успешно сохранены</p>}

            <form onSubmit={handleSubmit} style={styles.form}>

                {/* Дата отказа */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Дата отказа:</label>
                    <input
                        type="date"
                        name="failure_date"
                        value={formData.failure_date}
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
                        value={formData.operating_hours || ''}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Например: 123"
                        required
                    />
                </div>

                {/* Узел отказа */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Узел отказа:</label>
                    <select
                        name="failure_node_id"
                        value={formData.failure_node_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Выберите узел</option>
                        {failureNodes.map(node => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Описание отказа */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Описание отказа:</label>
                    <textarea
                        name="failure_description"
                        value={formData.failure_description || ''}
                        onChange={handleChange}
                        style={styles.textarea}
                    />
                </div>

                {/* Способ восстановления */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Способ восстановления:</label>
                    <select
                        name="repair_method_id"
                        value={formData.repair_method_id || ''}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Выберите способ</option>
                        {repairMethods.map(method => (
                            <option key={method.id} value={method.id}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Использованные запчасти */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Использованные запчасти:</label>
                    <input
                        type="text"
                        name="spare_parts_used"
                        value={formData.spare_parts_used || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Дата восстановления */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Дата восстановления:</label>
                    <input
                        type="date"
                        name="repair_date"
                        value={formData.repair_date || ''}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Время простоя */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Время простоя:</label>
                    <input
                        type="number"
                        name="downtime"
                        value={formData.downtime || ''}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Например: 5"
                    />
                </div>

                {/* Кнопки */}
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.submitButton}>
                        Сохранить изменения
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={styles.cancelButton}>
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
    padding: isMobile ? '1rem' : '2rem'
};

const styles = {
    container: {
        maxWidth: isMobile ? '95%' : '600px',
        margin: '2rem auto',
        padding: baseStyle.padding,
        backgroundColor: '#fff',
        borderRadius: baseStyle.borderRadius,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: '"Segoe UI", sans-serif'
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
    textarea: {
        width: '100%',
        minHeight: '80px',
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: baseStyle.borderRadius,
        resize: 'vertical',
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

export default ReclamationEditPage;