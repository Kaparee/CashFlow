import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import s from './ConfirmEmailChange.module.css';
import Header from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import { useLoading } from '../../hooks/useLoading';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/api';

const ConfirmEmailChange: React.FC = () => {
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { isLoading, setIsLoading } = useLoading();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { refreshUser } = useContext(AuthContext);

    useEffect(() => {
        handleConfirmEmail();
    }, [token]);

    useEffect(() => {
        const htmlTag = document.body;

        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }
    }, [isLoading]);

    const handleConfirmEmail = async () => {
        if (!token) return;

        setConfirmError(null);
        setSuccessMessage(null);

        try {
            setIsLoading(true);
            await api.post('/confirm-email-change', { 
                'token': token 
            })

            setSuccessMessage('Email został pomyślnie zmieniony! Za chwilę zostaniesz przekierowany do dashboardu...');
            console.log('cwel')

            await refreshUser();

            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (error: any) {
            console.log(error)
            if (error.response?.status === 400) {
                setConfirmError('Nieprawidłowy lub wygasły token potwierdzenia');
            } else if (error.response?.status === 404) {
                setConfirmError('Nie znaleziono użytkownika');
            } else if (error.response?.status === 500) {
                setConfirmError('Błąd serwera. Spróbuj później.');
            } else {
                setConfirmError('Wystąpił nieoczekiwany błąd');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const routeChange = (path: string) => {
        navigate(path);
    }

    return (
        <>
            <div id='navbar-main' className='container-fluid'>
                <Header />
            </div >
            <div className={`container-fluid pt-5 ${s.bgConfirmEmail}`} style={{ minHeight: '75vh' }}>
                <div className='row align-items-center justify-content-center pt-5 h-100'>
                    <div className='col-11 col-sm-10 col-md-7 col-lg-5 col-xl-4 p-4 rounded-5 shadow bg-white'>
                        <div className="text-center">
                            <div className='mb-4'>
                                {isLoading && !successMessage && !confirmError && (
                                    <>
                                        <div className="spinner-border text-primary mb-3" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <h4 className='fw-bold'>Potwierdzanie zmiany emaila...</h4>
                                        <p className='text-secondary small'>
                                            Proszę czekać
                                        </p>
                                    </>
                                )}

                                {successMessage && (
                                    <>
                                        <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                                        <h4 className='fw-bold text-success'>Sukces!</h4>
                                        <div className="alert alert-success mt-3" role="alert">
                                            {successMessage}
                                        </div>
                                    </>
                                )}

                                {confirmError && (
                                    <>
                                        <i className="bi bi-x-circle-fill text-danger fs-1 mb-3 d-block"></i>
                                        <h4 className='fw-bold text-danger'>Błąd</h4>
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {confirmError}
                                        </div>
                                        <div className='text-center small mt-3'>
                                            <a href="#" className='text-secondary text-decoration-none fst-italic' onClick={() => routeChange('/dashboard')}>
                                                <span className='text-decoration-underline fw-bold'>Wróć do dashboardu</span>
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${s.footerMargin}`}>
                    <Footer />
                </div>
            </div>
            {isLoading && <div className='position-fixed top-0 start-0 w-100 vh-100 z-3 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center overflow-hidden'>
                <div className="spinner-border text-dark fs-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
        </>
    );
};

export default ConfirmEmailChange;