import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './RegisterPage.module.css';
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
        <form className="login-form">
            <div className="mb-3">
                <label htmlFor="firstNameInput" className="form-label">Imie</label>
                <input onChange={e => setFirstName(e.target.value)} type="firstName" className="form-control" id="firstNameInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="lastNameInput" className="form-label">Nazwisko</label>
                <input onChange={e => setLastName(e.target.value)} type="lastName" className="form-control" id="lastNameInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">E-mail</label>
                <input onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="emailInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="nicknameInput" className="form-label">Login</label>
                <input onChange={e => setNickname(e.target.value)} type="nickname" className="form-control" id="nicknameInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Hasło</label>
                <input onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="passwordInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="rePasswordInput" className="form-label">Powtórz Hasło</label>
                <input onChange={e => setRePassword(e.target.value)} type="password" className="form-control" id="rePasswordInput" />
            </div>
            <div className="text-center">
                <button onClick={registerSubmit} type="submit" className="btn btn-outline-primary">
                    Zarejestruj
                </button>
            </div>
            <div className='text-center'>
                <a href="#" onClick={() => routeChange('/login')}>zaloguj się jeśli posiadasz konto</a>
            </div>
        </form>
    );
};

export default RegisterPage