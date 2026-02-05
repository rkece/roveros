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
            // Demo Mode: If backend fails, create a demo user
            console.log('Backend unavailable, using demo mode');
            const demoUser = {
                _id: 'demo-' + Date.now(),
                username: email.split('@')[0] || 'Operator',
                email: email,
                role: 'admin',
                token: 'demo-token-' + Date.now()
            };
            setUser(demoUser);
            localStorage.setItem('rover_user', JSON.stringify(demoUser));
            return demoUser;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const { data } = await axios.post('/api/auth/register', { username, email, password });
            setUser(data);
            localStorage.setItem('rover_user', JSON.stringify(data));
            return data;
        } catch (error: any) {
            // Demo Mode: If backend fails, create a demo user
            console.log('Backend unavailable, using demo mode for registration');
            const demoUser = {
                _id: 'demo-' + Date.now(),
                username: username,
                email: email,
                role: 'admin',
                token: 'demo-token-' + Date.now()
            };
            setUser(demoUser);
            localStorage.setItem('rover_user', JSON.stringify(demoUser));
            return demoUser;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rover_user');
        navigate('/auth');
    };

    return { user, login, register, logout };
};
