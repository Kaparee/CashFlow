import React, { useState, useEffect, useContext, useCallback} from 'react'
import { ToastContext } from './ToastContext';
import { useNavigate, } from 'react-router-dom';
import api from '../api/api';
import type { User } from '../types/user'


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User, path?: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface AuthPriovider {
    children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextType>({user: null, isAuthenticated: false, isLoading: false, login: (token: string, userData: User, path?: string) => {}, logout: () => {}, refreshUser: async () => {}});

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

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            return; 
        }

        try{
            setIsLoading(true);
            const res = await api.get('/login-info');
            setUser(res.data);
        } catch (error: any) {
            console.error("Błąd odświeżania użytkownika:", error);
        } finally {
            setIsLoading(false);
        }
    },[setUser]);

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
                }
                return Promise.reject(error);
            }
        );

        refreshUser();

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    },[]);

    return (
        <AuthContext.Provider value={{user, isAuthenticated, isLoading, login, logout, refreshUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;