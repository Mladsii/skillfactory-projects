import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MaintenanceFilter from '../components/MaintenanceFilter';
import MaintenanceTable from '../components/MaintenanceTable';

const MaintenancePage = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [filters, setFilters] = useState({
        maintenance_type_id: '',
        machine_factory_number: '',
        service_company_id: ''
    });

    useEffect(() => {
        const fetchMaintenances = async () => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const res = await api.get(`/maintenances?${params.toString()}`);
            setMaintenances(res.data);
        };

        fetchMaintenances();
    }, [filters]);

    const handleRowClick = (maintenance) => {
        window.location.href = `/maintenances/${maintenance.id}`;
    };

    return (
        <div>
            <MaintenanceFilter filters={filters} setFilters={setFilters} />
            <MaintenanceTable data={maintenances} onRowClick={handleRowClick} />
        </div>
    );
};

export default MaintenancePage;