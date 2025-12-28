import React, { useState, useEffect, useContext} from 'react'
import { ToastContext } from './ToastContext';
import { useNavigate, } from 'react-router-dom';
import api from '../api/api';

interface User {
    userID: number;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    photoUrl: string;
    isActive: boolean;
    isAdmin: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User, path?: string) => void;
    logout: () => void;
}

interface AuthPriovider {
    children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextType>({user: null, isAuthenticated: false, isLoading: false, login: (token: string, userData: User, path?: string) => {}, logout: () => {}});

const AuthProvider: React.FC<AuthPriovider> = ({children}) => {
    const { addToast } = useContext(ToastContext);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const isAuthenticated = !!user;
    
    const routeChange = (path: string) => {
        navigate(path);
    }

    const login = (token: string, u: User, path: string = '/dashboard') => {
        localStorage.setItem('token', token);
        setUser(u);
        routeChange(path);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        routeChange('/login');
    }

    const handleTokenVerification = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            return; 
        }

        try{
            setIsLoading(true);
            const res = await api.get('/accounts-info');
            setUser(res.data);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const interceptor = api.interceptors.response.use (
            (response) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    addToast('Sesja wygasła, zaloguj się ponownie', 'info');
                    logout();
                } else if (error.response?.status === 403) {
                    addToast('Brak uprawnień', 'info');
                    logout();
                } else if (error.response?.status === 500) {
                    addToast('Serwer jest aktualnie nie dostępny', 'error')
                } else {
                    addToast('Brak internetu', 'error');
                }
                return Promise.reject(error);
            }
        );

        handleTokenVerification();

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    },[]);

    return (
        <AuthContext.Provider value={{user, isAuthenticated, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;