import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Header from './components/Layout/Header/Header.tsx'
import Sidebar from './components/Layout/Sidebar/Sidebar.tsx'
import { useWindowWidth } from '../../hooks/useWindowWidth.ts'

const DashboardPage: React.FC = () => {
    
    const navigate = useNavigate();
    const routeChange = (path:string) => {
        navigate(path);
    }

    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
    const width = useWindowWidth();



    return (
        <>
            <div className='container-fluid d-flex px-0 vh-100'>
                <div className={`px-md-2 bg-dark flex-shrink-0 ${width >= 768 ? 'position-relative container-fluid' :  ''} ${width < 768 && !isSidebarExpanded ? '' : ''}`} style={width < 768 ? {width: '0px'} : {width: '60px'}}>
                    <Sidebar 
                        isExpanded={isSidebarExpanded}
                        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    />
                </div>
                <div className='flex-grow-1'>
                    <div className='container-fluid px-0 shadow'>
                        <Header 
                            isExpanded={isSidebarExpanded}
                            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        />
                    </div>
                    <div className='container-fluid'>
                        content
                    </div>
                </div>        
            </div>
        </>
    );
};

export default DashboardPage