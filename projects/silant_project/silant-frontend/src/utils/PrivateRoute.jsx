// src/utils/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../utils/authContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { token, logout } = useContext(AuthContext);

    // Пример простого декодирования токена (если нужно)
    const user = token ? { role: 'manager' } : null;

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#D20A11'
            }}>
                <h2>Доступ запрещён</h2>
                <p>У вас нет прав для просмотра этой страницы.</p>
                <button onClick={logout} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#D20A11',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Выйти
                </button>
            </div>
        );
    }

    return <Outlet />;
};

export default PrivateRoute;