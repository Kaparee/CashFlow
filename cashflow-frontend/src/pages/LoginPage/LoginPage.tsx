import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import s from './LoginPage.module.css';
import Header from '../../components/Layout/Header/Header.tsx'
import Footer from '../../components/Layout/Footer/Footer.tsx'
import Input from '../../components/UI/Input/Input.tsx';
import { useLoading } from '../../hooks/useLoading.ts';
import api from '../../api/api.ts';
import { AuthContext } from '../../contexts/AuthContext.tsx';

const LoginPage: React.FC = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const { isLoading, setIsLoading } = useLoading();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const {login} = useContext(AuthContext);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate()

    useEffect(() => {
        const htmlTag = document.body;

        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }

    }, [isLoading]);

    const [formData, setFormData] = useState<{ [key: string]: string }>({ nicknameOrEmail: "", password: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const validateForm = () => {
        const err: {[key: string] : string} = {}
        if (formData.nicknameOrEmail.trim().length == 0) {
            err.nicknameOrEmail = 'Proszę wpisać login/email'
        }

        if (formData.password.trim().length == 0) {
            err.password  = 'Prosze wpisać hasło'
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
            handleLogin();
        }
    }

    const handleLogin = async () => {
        setLoginError(null);
        try {
            setIsLoading(true);
            const resToken = await api.post('/login', {
                emailOrNickname: formData.nicknameOrEmail,
                password: formData.password
            });
            const myToken = resToken.data.token;
            
            localStorage.setItem('token', myToken);

            const resUser = await api.get('/login-info');
            const userData = resUser.data;


            login(myToken,userData,from);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setLoginError('Niepoprawny login lub hasło');
            } else if (error.response?.status === 500) {
                setLoginError('Błąd serwera. Spróbuj później.');
            } else {
                setLoginError('Konto jest niezweryfikowane');
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
            <div className={`container-fluid pt-5 ${s.bgLogin}`} style={{ minHeight: '75vh' }}>
                <div className='row align-items-center justify-content-center pt-5 h-100'>
                    <div className='col-11 col-sm-10 col-md-7 col-lg-5 col-xl-4 p-4 rounded-5 shadow bg-white'>
                        <form className="login-form row" onSubmit={handleValidateForm}>

                            <div className='col-12'>
                                <Input id='nicknameOrEmail' name='nicknameOrEmail' label='Login' type='text' value={formData.nicknameOrEmail} onChange={handleChange} error={errors.nicknameOrEmail} />

                                <Input id='password' name='password' label='Hasło' type='password' value={formData.password} onChange={handleChange} error={errors.password} />
                            </div>

                            <div className='col-12 mt-3'>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary rounded-5 fw-bold px-4 py-2">
                                        Zaloguj
                                    </button>
                                </div>

                                {loginError && (
                                    <div className="alert alert-danger mt-3 small py-2" role="alert">
                                        {loginError}
                                    </div>
                                )}

                                <div className='text-center small mt-2'>
                                    <a href="#" className='text-secondary text-decoration-none fst-italic' onClick={() => routeChange('/register')}><span className='text-decoration-underline fw-bold'>Zarejestruj się</span> jeśli nie posiadasz konta</a>
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

export default LoginPage