import React, { useState } from 'react'
import Header from './components/Layout/Header/Header.tsx'
import Sidebar from './components/Layout/Sidebar/Sidebar.tsx'
import { useWindowWidth } from '../../hooks/useWindowWidth.ts'
import { Outlet } from 'react-router-dom'
import s from './DashboardPage.module.css'
import AccountProvider from './contexts/AccountContext.tsx'

const DashboardPage: React.FC = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
    const width = useWindowWidth();

    return (
        <>
            <AccountProvider>
                <div className={`container-fluid d-flex px-0 vh-100 overflow-hidden ${s.scrollStyle}`}>
                    <div className={`px-md-2 ${s.bgDarkSecondary} align-items-stretch flex-shrink-0 ${width >= 768 ? 'position-relative container-fluid' :  ''} ${width < 768 && !isSidebarExpanded ? '' : ''}`} style={width < 768 ? {width: '0px'} : {width: '60px'}}>
                        <Sidebar 
                            isExpanded={isSidebarExpanded}
                            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        />
                    </div>
                    <div className='flex-grow-1 d-flex flex-column'>
                        <div className={`container-fluid px-0 shadow ${s.bgDarkSecondary}`}>
                            <Header 
                                isExpanded={isSidebarExpanded}
                                onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            />
                        </div>
                        <div className={`container-fluid overflow-x-hidden overflow-y-auto ${s.minHeight0} ${s.bgDarkPrimary} py-2 flex-grow-1 d-flex`}>
                            <Outlet />
                        </div>
                    </div>        
                </div>
            </AccountProvider>
        </>
    );
};

export default DashboardPage