import { useState } from 'react';

const useFilters = () => {
    const [filters, setFilters] = useState({
        machine_model_id: '',
        engine_model_id: '',
        transmission_model_id: '',
        steerable_axle_model_id: '',
        drive_axle_model_id: '',
        factory_number: '',
        maintenance_type_id: '',
        failure_node_id: '',
        repair_method_id: '',
        service_company_id: ''
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value
        }));
    };

    return { filters, updateFilter };
};

export default useFilters;