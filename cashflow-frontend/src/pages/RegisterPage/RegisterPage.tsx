import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import s from './RegisterPage.module.css';
import Header from '../../components/Layout/Header/Header.tsx'
import Footer from '../../components/Layout/Footer/Footer.tsx'
import Input from '../../components/UI/Input/Input.tsx';
import axios from 'axios';

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    let navigate = useNavigate()
    const routeChange = (path:string) => {
        navigate(path);
    }

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:5205/api/register', {
                firstName,
                lastName,
                nickname,
                email,
                password
            });

            alert("Zarejestrowano!")

        } catch (error: any) {
            console.log(error.response?.data);
            alert("Błąd: " + JSON.stringify(error.response?.data));
        }
    }

    const registerSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if(password != rePassword) { throw new Error("Podane hasła nie są jednakowe.") }

            handleRegister()

        } catch (error) {
            alert("Błąd: " + error)
        }
    }

    return (
        <>
            <div id='navbar-main' className='container-fluid'>
                <Header />
            </div >
            <div className={`container-fluid pt-5 ${s.bgRegister}`} style={{ minHeight : '75vh' }}>
                <div className='row align-items-center justify-content-center pt-5 h-100'>
                    <div className='col-11 col-sm-10 col-md-7 col-lg-5 col-xl-4 p-4 rounded-5 shadow bg-white'>
                        <form className="login-form row">

                            <div className='col-12 col-sm-6'>
                                <Input id='fistNameInput' label='Imie' onChange={e => setFirstName(e.target.value)} type='text' value={firstName} />

                                <Input id='lastNameInput' label='Nazwisko' onChange={e => setLastName(e.target.value)} type='text' value={lastName} />

                                <Input id='emailInput' label='Email' onChange={e => setEmail(e.target.value)} type='text' value={email} />
                            </div>

                            <div className='col-12 col-sm-6'>
                                <Input id='nicknameInput' label='Login' onChange={e => setNickname(e.target.value)} type='text' value={nickname} />

                                <Input id='passwordInput' label='Hasło' onChange={e => setPassword(e.target.value)} type='password' value={password} />

                                <Input id='rePassowrdInput' label='Powtórz Hasło' onChange={e => setRePassword(e.target.value)} type='password' value={rePassword} />
                            </div>

                            <div className='col-12 mt-3'>
                                <div className="text-center">
                                    <button onClick={registerSubmit} type="submit" className="btn btn-primary rounded-5 fw-bold px-4 py-2">
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

        </>
    );
};

export default RegisterPage