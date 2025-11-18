import React from 'react'

const RegisterPage: React.FC = () => {
    return (
        <form className="login-form">
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">E-mail</label>
                <input type="email" className="form-control" id="emailInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Has³o</label>
                <input type="password" className="form-control" id="passwordInput" />
            </div>
            <div className="mb-3">
                <label htmlFor="rePasswordInput" className="form-label">Powtórz Has³o</label>
                <input type="password" className="form-control" id="rePasswordInput" />
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-outline-primary">
                    Zarejestruj
                </button>
            </div>
        </form>
    );
};

export default RegisterPage