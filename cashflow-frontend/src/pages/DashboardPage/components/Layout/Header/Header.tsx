import React, { useContext, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useWindowWidth } from "../../../../../hooks/useWindowWidth";
import s from './Header.module.css'
import sDashboard from '../../../DashboardPage.module.css'
import { useAccount } from "../../../contexts/AccountContext";
import { AuthContext } from "../../../../../contexts/AuthContext";

interface HeaderProps {
    isExpanded: boolean;
    onToggle: () => void;   
}

const Header: React.FC<HeaderProps> = ({onToggle}) => {
    const { logout } = useContext(AuthContext);
    const { account } = useAccount()
    const [ searchParams, setSearchParams ] = useSearchParams();
    const viewMode = searchParams.get('type') || 'expense';

    useEffect(() => {
        setSearchParams({type: 'expense'});
    },[]);

    const location = useLocation();


    const width = useWindowWidth();

    return (
        <>
            <div className={`d-flex align-items-center justify-content-center py-1 px-2 px-md-1 position-relative z-1 ${sDashboard.shadowDark} ${sDashboard.bgDarkSecondary}`}>
                <div className={`col-auto ${width >= 768 ? 'd-none' : ''}`}>
                    <button className={`btn px-0 py-0 border-0 ${sDashboard.bgDarkSecondary}`} type="button" onClick={onToggle}>
                        <span className={`${s.w60} text-center`}>
                            <i className="bi bi-list fs-3 text-gradient"></i>
                        </span>
                    </button>
                </div>

                <div className={`d-flex align-items-center justify-content-center col ${width < 768 ? '' : 'ps-5'}`}>
                    
                    {location['pathname'] != '/dashboard' && 
                    <div className={`rounded-4 px-3 py-2 my-1 mx-auto d-flex align-items-center border ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDark}`}>
                        <button className={`btn ${viewMode == 'expense' ? sDashboard.btnDarkOutlinePrimaryActive : sDashboard.btnDarkOutlinePrimary} rounded-5 py-1 px-1 px-sm-4 mx-2 fs-small`} onClick={() => setSearchParams({type: 'expense'})}>Wydatki</button>
                        <div className={`mx-2 ${sDashboard.textDarkAccentPrimary} ${sDashboard.textDarkUnderline} fs-5`}>{account?account.name:"Nie wybrano konta!"}</div>
                        <button className={`btn ${viewMode == 'income' ? sDashboard.btnDarkOutlinePrimaryActive : sDashboard.btnDarkOutlinePrimary} rounded-5 py-1 px-1 px-sm-4 mx-2 fs-small`} onClick={() => setSearchParams({type: 'income'})}>Dochody</button>
                    </div>
                    }
                
                </div>

                <div className={`col-auto text-end d-flex gap-3`}>
                    <button className={`btn btn-outline-primary px-2 py-1 rounded-4 fs-small ${sDashboard.btnDarkOutlineAccentPrimary}`} type="button" onClick={logout}>Wyloguj</button>
                </div>    
                    
            </div>
        </>
    );
}

export default Header;