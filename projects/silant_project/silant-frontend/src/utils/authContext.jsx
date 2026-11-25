// src/utils/authContext.jsx
import React, { createContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', new URLSearchParams({
                username,
                password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = response.data;
            setToken(access_token);
            localStorage.setItem('token', access_token);
            setUser({ token: access_token });
            return true;
        } catch (error) {
            console.error("Ошибка авторизации", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
export default AuthProvider;