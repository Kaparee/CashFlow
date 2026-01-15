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
        if (!searchParams.get('type')) {
            setSearchParams({type: 'expense'});
        }
    }, [searchParams, setSearchParams]);
    
    const location = useLocation();
    const width = useWindowWidth();
    
    return (
        <div className={`w-100 py-2 px-4`}>
            <div className={`d-flex align-items-center justify-content-between py-1 px-2 px-md-3 position-relative z-1 ${sDashboard.bgDarkSecondary}`}>
                {width < 768 && (
                    <div className="col-auto">
                        <button 
                            className={`btn px-0 py-0 border-0 ${sDashboard.bgDarkSecondary}`} 
                            type="button" 
                            onClick={onToggle}
                            aria-label="Toggle menu"
                        >
                            <span className={s.w60}>
                                <i className="bi bi-list fs-3 text-gradient"></i>
                            </span>
                        </button>
                    </div>
                )}
                
                <div className={`d-flex align-items-center justify-content-center flex-grow-1 ${width >= 768 ? 'ps-5' : ''}`}>
                    {location.pathname !== '/dashboard' && (
                        <div className={`rounded-4 px-2 px-sm-3 py-2 my-1 d-flex align-items-center flex-wrap justify-content-center border ${sDashboard.borderDarkEmphasis}`}>
                            <button 
                                className={`btn ${viewMode === 'expense' ? sDashboard.btnDarkOutlinePrimaryActive : sDashboard.btnDarkOutlinePrimary} rounded-5 py-1 px-2 px-sm-4 m-1 fs-small`} 
                                onClick={() => setSearchParams({type: 'expense'})}
                            >
                                <span className="d-none d-sm-inline">Wydatki</span>
                                <span className="d-inline d-sm-none">Wyd.</span>
                            </button>
                            
                            <div className={`mx-1 mx-sm-2 ${sDashboard.textDarkAccentPrimary} ${sDashboard.textDarkUnderline} fs-6 fs-sm-5 text-center text-nowrap overflow-hidden text-truncate`} style={{maxWidth: '150px'}}>
                                {account ? account.name : "Brak konta"}
                            </div>
                            
                            <button 
                                className={`btn ${viewMode === 'income' ? sDashboard.btnDarkOutlinePrimaryActive : sDashboard.btnDarkOutlinePrimary} rounded-5 py-1 px-2 px-sm-4 m-1 fs-small`} 
                                onClick={() => setSearchParams({type: 'income'})}
                            >
                                <span className="d-none d-sm-inline">Dochody</span>
                                <span className="d-inline d-sm-none">Doch.</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="col-auto">
                    <button 
                        className={`btn btn-outline-primary px-2 px-sm-3 py-1 rounded-4 fs-small ${sDashboard.btnDarkOutlineAccentPrimary}`} 
                        type="button" 
                        onClick={logout}
                    >
                        <span className="d-none d-sm-inline">Wyloguj</span>
                        <span className="d-inline d-sm-none">
                            <i className="bi bi-box-arrow-right"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;