import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const routeChange = (path: string) => {
        navigate(path);
    } 

    const logout = () => {
        localStorage.removeItem('token');
        routeChange('/login');
    }
    return (
        <>
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col text-start">
                    <a href="#"><i className="bi bi-list fs-1 text-gradient"></i></a>
                </div>
                <div className="col-9">

                </div>
                <div className="col-2 dropdown-center dropdown text-end">
                    <a className="btn dropdown-toggle no-after outline-0 " data-bs-toggle='dropdown' aria-expanded='false'>
                        <i className="bi bi-person-circle fs-1"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="#" className="dropdown-item" onClick={logout}>Wyloguj</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Header;