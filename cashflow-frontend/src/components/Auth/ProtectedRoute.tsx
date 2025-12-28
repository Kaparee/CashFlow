import React, { useEffect, useContext } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext.tsx'

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, requireAuth}) => {
    const {isAuthenticated, isLoading} = useContext(AuthContext);
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';


    useEffect(() => {
        const htmlTag = document.body;
        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }
    }, [isLoading]);


    return (
        <>
            {isLoading ? (
                <div className='position-fixed top-0 start-0 w-100 vh-100 z-3 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center overflow-hidden'>
                    <div className="spinner-border text-dark fs-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : requireAuth ? (
                    isAuthenticated ? children : <Navigate to='/login'  state={{from: location}}/>
            ) : (
                    isAuthenticated ? <Navigate to={from} /> : children
            )}
        </>
    );
}

export default ProtectedRoute;