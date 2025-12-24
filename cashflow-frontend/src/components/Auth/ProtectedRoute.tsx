import React, { useEffect, useState } from 'react'
import { useLoading } from '../../hooks/useLoading.ts'
import { useNavigate, useLocation, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, requireAuth}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { isLoading, setIsLoading } = useLoading();
    useEffect(() => {
        const htmlTag = document.body;
        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }
    }, [isLoading]);

    const handleRequest = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('token');

            if (!token) {
                setIsLoggedIn(false);
                setIsLoading(false);
                return;
            }

            const res = await axios.get('http://localhost:5205/api/login-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsLoggedIn(true);
        } catch (error: any) {
            setIsLoggedIn(false);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token')

                if (requireAuth) {
                    alert('Sesja Wygasła, zaloguj się ponownie');
                    routeChange('/login');
                }

            } else {
                console.error('Błąd połączenia z serwerem: ', error.message);
            }
        }
        setIsLoading(false);
    }

    const location = useLocation();

    useEffect(() => {
        handleRequest();
    }, [location]);

    let navigate = useNavigate();
    const routeChange = (path: string) => {
        navigate(path);
    }

    return (
        <>
            {isLoading ? (
                <div className='position-fixed top-0 start-0 w-100 vh-100 z-3 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center overflow-hidden'>
                    <div className="spinner-border text-dark fs-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : requireAuth ? (
                    isLoggedIn ? children : <Navigate to='/login' />
            ) : (
                    isLoggedIn ? <Navigate to='/dashboard' /> : children
            )}
        </>
    );
}

export default ProtectedRoute;