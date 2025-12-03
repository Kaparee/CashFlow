import React from 'react';
import { useNavigate } from "react-router-dom";
import s from './LoginPage.module.css';
import Header from '../../components/Layout/Header/Header.tsx'
import Footer from '../../components/Layout/Footer/Footer.tsx'
import Input from '../../components/UI/Input/Input.tsx';

const LoginPage: React.FC = () => {

    let navigate = useNavigate()
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
                        <form className="login-form row">

                            <div className='col-12'>
                                <Input id='nicknameInput' label='Login' type='text' value='nick' onChange={function(e: React.ChangeEvent<HTMLInputElement>): void {
                                    throw new Error('Function not implemented.');
                                } } />

                                <Input id='passwordInput' label='Hasło' type='password' value='passw' onChange={function(e: React.ChangeEvent<HTMLInputElement>): void {
                                    throw new Error('Function not implemented.');
                                } } />
                            </div>
                            

                            <div className='col-12 mt-3'>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary rounded-5 fw-bold px-4 py-2">
                                        Zaloguj
                                    </button>
                                </div>
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

        </>
    );
};

export default LoginPage