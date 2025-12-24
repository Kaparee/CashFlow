import React from "react";
import { useNavigate } from "react-router-dom";
import { useWindowWidth } from "../../../../../hooks/useWindowWidth";
import s from './Header.module.css'

interface HeaderProps {
    isExpanded: boolean;
    onToggle: () => void;   
}

const Header: React.FC<HeaderProps> = ({isExpanded, onToggle}) => {

    const navigate = useNavigate();

    const routeChange = (path: string) => {
        navigate(path);
    } 

    const logout = () => {
        localStorage.removeItem('token');
        routeChange('/login');
    }

    const width = useWindowWidth();

    return (
        <>
            <div className={`d-flex align-items-center justify-content-center py-1 bg-dark px-2 px-md-1`}>
                <div className={`col-auto ${width >= 768 ? 'd-none' : ''}`}>
                    <button className={`btn px-0 py-0 border-0 bg-dark`} type="button" onClick={onToggle}>
                        <span className={`${s.w60} text-center`}>
                            <i className="bi bi-list fs-3 text-gradient"></i>
                        </span>
                    </button>
                </div>
                <div className={`d-flex align-items-center justify-content-center col ${width < 768 ? '' : 'ps-5'}`}>
                    <div className='rounded-4 px-3 py-1 ps-5'>
                        <button className="btn btn-outline-white rounded-5 py-1 px-1 px-sm-4 mx-2 fs-small">Wydatki</button>
                        <button className="btn btn-outline-white rounded-5 py-1 px-1 px-sm-4 mx-2 fs-small">Dochody</button>
                    </div>
                </div>
                <div className={`col-auto text-end`}>
                    <button className="btn btn-outline-primary px-2 py-1 rounded-4 fs-small" type="button" onClick={logout}>Wyloguj</button>
                </div>    
                    
            </div>
        </>
    );
}

export default Header;