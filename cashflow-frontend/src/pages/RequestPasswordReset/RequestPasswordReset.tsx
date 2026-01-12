import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import s from './RequestPasswordReset.module.css';
import Header from '../../components/Layout/Header/Header.tsx'
import Footer from '../../components/Layout/Footer/Footer.tsx'
import Input from '../../components/UI/Input/Input.tsx';
import { useLoading } from '../../hooks/useLoading.ts';
import api from '../../api/api.ts';

const RequestPasswordReset: React.FC = () => {
    const [requestError, setRequestError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { isLoading, setIsLoading } = useLoading();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const htmlTag = document.body;

        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }
    }, [isLoading]);

    const [formData, setFormData] = useState<{ [key: string]: string }>({ email: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        const { [e.target.name]: _, ...remainingErrors } = errors;
        setErrors(remainingErrors);
    }

    const validateForm = () => {
        const err: { [key: string]: string } = {}
        
        if (formData.email.trim().length === 0) {
            err.email = 'Wpisz swój email'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            err.email = 'Popraw swój email'
        }

        setErrors(err);

        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            handleRequestReset();
        }
    }

    const handleRequestReset = async () => {
        setRequestError(null);
        setSuccessMessage(null);
        
        try {
            setIsLoading(true);
            await api.post('/request-password-reset', {
                email: formData.email
            });

            setSuccessMessage('Jeśli wpisany adres istnieje to link do resetowania hasła został wysłany na Twój adres email. Sprawdź swoją skrzynkę.');
            setFormData({ email: "" });
        } catch (error: any) {
            if (error.response?.status === 500) {
                setRequestError('Błąd serwera. Spróbuj później.');
            } else {
                console.log(error)
                setRequestError('Wystąpił nieoczekiwany błąd');
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
            <div className={`container-fluid pt-5 ${s.bgReset}`} style={{ minHeight: '75vh' }}>
                <div className='row align-items-center justify-content-center pt-5 h-100'>
                    <div className='col-11 col-sm-10 col-md-7 col-lg-5 col-xl-4 p-4 rounded-5 shadow bg-white'>
                        <form className="reset-form row" onSubmit={handleValidateForm}>
                            <div className='col-12 mb-3'>
                                <h4 className='text-center fw-bold'>Resetowanie hasła</h4>
                                <p className='text-center text-secondary small'>
                                    Podaj adres email powiązany z Twoim kontem
                                </p>
                            </div>

                            <div className='col-12'>
                                <Input 
                                    id='email' 
                                    name='email' 
                                    label='Email' 
                                    type='text' 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    error={errors.email} 
                                />
                            </div>

                            <div className='col-12 mt-3'>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary rounded-5 fw-bold px-4 py-2">
                                        Wyślij link resetujący
                                    </button>
                                </div>

                                {successMessage && (
                                    <div className="alert alert-success mt-3 small py-2" role="alert">
                                        {successMessage}
                                    </div>
                                )}

                                {requestError && (
                                    <div className="alert alert-danger mt-3 small py-2" role="alert">
                                        {requestError}
                                    </div>
                                )}

                                <div className='text-center small mt-2 d-flex flex-column gap-1'>
                                    <a href="#" className='text-secondary text-decoration-none fst-italic' onClick={() => routeChange('/login')}>
                                        <span className='text-decoration-underline fw-bold'>Wróć do logowania</span>
                                    </a>
                                    <a href="#" className='text-secondary text-decoration-none fst-italic' onClick={() => routeChange('/register')}>
                                        <span className='text-decoration-underline fw-bold'>Zarejestruj się</span> jeśli nie posiadasz konta
                                    </a>
                                </div>
                            </div>
                        </form>
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

export default RequestPasswordReset;