import React from 'react'
import { useNavigate } from "react-router-dom"

const DashboardPage: React.FC = () => {
    
    const navigate = useNavigate();
    const routeChange = (path:string) => {
        navigate(path);
    }

    const wyloguj = () => {
        localStorage.removeItem('token');
        routeChange('/login');
    }

    return (
        <>
            <div>
                <button className='btn btn-danger' type='button' onClick={wyloguj}>Wyloguj</button>
            </div>
        </>
    );
};

export default DashboardPage