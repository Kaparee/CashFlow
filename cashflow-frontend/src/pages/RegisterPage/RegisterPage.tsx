import React, { useState, useEffect } from 'react'
import { Form, useNavigate } from "react-router-dom";
import s from './RegisterPage.module.css';
import Header from '../../components/Layout/Header/Header.tsx'
import Footer from '../../components/Layout/Footer/Footer.tsx'
import Input from '../../components/UI/Input/Input.tsx';
import axios from 'axios';
import { useLoading } from '../../hooks/useLoading.ts'
 
const RegisterPage: React.FC = () => {
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        const htmlTag = document.body;
        if (isLoading) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }
    },[isLoading]);


    const [formData, setFormData] = useState<{ [key: string]: string }>({ firstName: "", lastName: "", email: "", nickname: "", password: "", rePassword : "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name] : e.target.value}); 
    }

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const err: { [key: string]: string } = {};

        if (formData.firstName.trim().length == 0) {
            err.firstName = 'Wpisz swoje imię'
        } else if (/[^a-zA-Z\sąęźćżśółńĄĘŹĆŻŚÓŁŃ]/.test(formData.firstName)) {
            err.firstName = 'Popraw swoje imię'
        }

        if (formData.lastName.trim().length == 0) {
            err.lastName = 'Wpisz swoje nazwisko'
        } else if (/[^a-zA-Z\sąęźćżśółńĄĘŹĆŻŚÓŁŃ-]/.test(formData.lastName)) {
            err.lastName = 'Popraw swoje nazwisko'
        }

        if (formData.email.trim().length == 0) {
            err.email = 'Wpisz swój email'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            err.email = 'Popraw swój email'
        }

        if (formData.nickname.trim().length == 0) {
            err.nickname = 'Wpisz swój nickname'
        }

        if (formData.password.trim().length < 8) {
            err.password = 'Hasło powinno mieć więcej niż 8 znaków'
        } else if (!/[A-Z]/.test(formData.password.trim())) {
            err.password = 'Hasło powinno mieć przynajmniej jedną dużą literę'
        } else if (!/[^a-zA-Z0-9]/.test(formData.password.trim())) {
            err.password = 'Hasło powinno mieć przynajmniej jeden znak specjalny'
        } else if (!/[0-9]/.test(formData.password.trim())) {
            err.password = 'Hasło powinno mieć przynajmniej jedna cyfre'
        }

        if (formData.rePassword.trim().length == 0) {
            err.rePassword = 'Powtórz swoje hasło'
        }

        if (formData.password.trim() != formData.rePassword.trim()) {
            err.rePassword = 'Hasła nie są identyczne'
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
            handleRegister();
        }
    }

    let navigate = useNavigate()
    const routeChange = (path:string) => {
        navigate(path);
    }

    const handleRegister = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post('http://localhost:5205/api/register', {
                firstName: formData['firstName'],
                lastName: formData['lastName'],
                nickname: formData['nickname'],
                email: formData['email'],
                password: formData['password'] 
            });

            alert("Zarejestrowano!");

            routeChange('/login');

        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                const serverMessage = error.response.data.message;
                const err: { [key: string]: string } = { ...errors };

                if (serverMessage.includes('nickname')) {
                    err.nickname = 'Ten login jest już zajęty';
                }
                if (serverMessage.includes('email')) {
                    err.email = 'Ten email jest już zajęty';
                }
                setErrors(err);
            } else {
                alert('Wystąpił nieoczekiwany błąd serwera.')
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <div id='navbar-main' className='container-fluid'>
                <Header />
            </div >
            <div className={`container-fluid pt-5 ${s.bgRegister}`} style={{ minHeight : '75vh' }}>
                <div className='row align-items-center justify-content-center pt-5 h-100'>
                    <div className='col-11 col-sm-10 col-md-7 col-lg-5 col-xl-4 p-4 rounded-5 shadow bg-white'>
                        <form className="login-form row" onSubmit={handleValidateForm}>

                            <div className='col-12 col-sm-6'>
                                <Input id='firstName' name='firstName' label='Imie' onChange={handleChange} type='text' value={formData.firstName} error={errors.firstName} />
                            </div>
                            <div className='col-12 col-sm-6'>
                                <Input id='lastName' name='lastName' label='Nazwisko' onChange={handleChange} type='text' value={formData.lastName} error={errors.lastName} />
                            </div>
                            <div className='col-12 col-sm-6'>
                                <Input id='email' name='email' label='Email' onChange={handleChange} type='text' value={formData.email} error={errors.email} />
                            </div>
                            <div className='col-12 col-sm-6'>
                                <Input id='nickname' name='nickname' label='Login' onChange={handleChange} type='text' value={formData.nickname} error={errors.nickname} />
                            </div>
                            <div className='col-12 col-sm-6'>
                                <Input id='password' name='password' label='Hasło' onChange={handleChange} type='password' value={formData.password} error={errors.password} />
                            </div>
                            <div className='col-12 col-sm-6'>
                                <Input id='rePassword' name='rePassword' label='Powtórz Hasło' onChange={handleChange} type='password' value={formData.rePassword} error={errors.rePassword} />
                            </div>

                            <div className='col-12 mt-3'>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary rounded-5 fw-bold px-4 py-2">
                                        Zarejestruj
                                    </button>
                                </div>
                                <div className='text-center small mt-2'>
                                    <a href="#" className='text-secondary text-decoration-none fst-italic' onClick={() => routeChange('/login')}><span className='text-decoration-underline fw-bold'>Zaloguj się</span> jeśli posiadasz konto</a>
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

export default RegisterPage