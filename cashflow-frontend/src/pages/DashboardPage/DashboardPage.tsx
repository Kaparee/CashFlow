import React from 'react'
import { useNavigate } from "react-router-dom"
import Header from './components/Header/Header.tsx'
import Sidebar from './components/Sidebar/Sidebar.tsx'

const DashboardPage: React.FC = () => {
    
    const navigate = useNavigate();
    const routeChange = (path:string) => {
        navigate(path);
    }

    return (
        <>
            <div className='container-fluid shadow'>
                <Header />
            </div>
            <div className="container-fluid">
                <div className='row'>
                    <div className='col-11'>
                        content
                    </div>
                </div>
            </div>
            <aside>
                <Sidebar />
            </aside>
        </>
    );
};

export default DashboardPage