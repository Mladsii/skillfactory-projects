import { useEffect, useState } from 'react';
import api from '../services/api';


const useSpravochnik = (type) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                let res;

                if (type === 'service') {
                    // Загружаем сервисные компании
                    res = await api.get('/users/service-companies');
                } else {
                    // Иначе — стандартный справочник
                    res = await api.get(`/spravochnik/${type}`);
                }

                setOptions(res.data);
            } catch (err) {
                console.error(`Ошибка загрузки ${type}`, err.message);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [type]);

    return { options, loading };
};

export default useSpravochnik;