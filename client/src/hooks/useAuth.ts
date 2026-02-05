import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const useAuth = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string, email: string, role: string, token: string } | null>(() => {
        const stored = localStorage.getItem('rover_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email: string, password: string) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('rover_user', JSON.stringify(data));
            return data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const { data } = await axios.post('/api/auth/register', { username, email, password });
            setUser(data);
            localStorage.setItem('rover_user', JSON.stringify(data));
            return data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rover_user');
        navigate('/auth');
    };

    return { user, login, register, logout };
};
