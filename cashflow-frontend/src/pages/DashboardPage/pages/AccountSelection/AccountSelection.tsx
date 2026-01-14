import React, {useEffect, useState, useContext} from 'react'
import sDashboard from '../../DashboardPage.module.css'
import { useAccount } from '../../contexts/AccountContext'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContext } from '../../../../contexts/ToastContext';
import api from '../../../../api/api';
import { AuthContext } from '../../../../contexts/AuthContext';

interface Account {
    accountId: number;
    name: string;
    balance: number;
    currencyCode: string;
    photoUrl: string;
}

const AccountSelection: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const {addToast} = useContext(ToastContext);
    const { account, setAccount } = useAccount()
    const {logout} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = (path: string, options?: any) => {
        navigate(path, options);
    }

    useEffect(() => {
        handleGetAccounts();
    }, []);

    const handleGetAccounts = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/accounts-info');
            setAccounts(res.data);
            addToast('pobrano', 'info');
        } catch (error: any) {
            addToast('Nie udało się pobrać kont','error');
        } finally {
            setIsLoading(false);
        }
    }

    const handleAccountSelect = (account: Account) => {
        setAccount(account);
        routeChange('/dashboard/dashboard-home-page');
    }

    const handleAddAccount = () => {
        routeChange('account-creator', { state: { from: location.pathname } });
    }
    
    const handleCurrencyFormatting = (balance: number, format: string) => {
        return  new Intl.NumberFormat(navigator.language, { style: "currency", currency: format, useGrouping: true }).format(balance)
    }

    return (
        <>
            <div className='flex-grow-1 row justify-content-center my-auto'>
                {!isLoading && accounts.map((acc, index) => (
                    <div key={acc.accountId} className='col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4 mb-sm-3 h-100'>
                        <div className={`d-flex flex-column border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <div className='user-select-none'><i className={`bi ${acc.photoUrl ? acc.photoUrl : 'bi-coin' } fs-3`}></i></div>
                            <div className={`user-select-none fs-5 fw-bold ${sDashboard.textDarkPrimary}`}>{acc.name}</div>
                            <div className='user-select-none'><span className='text-gradient fw-bold'>{handleCurrencyFormatting(acc.balance, acc.currencyCode)}</span></div>
                            <div>
                                <button type='button' className={`btn ${acc.accountId == account?.accountId ? 'btn-primary': 'btn-outline-primary'} btn-sm mt-2 rounded-5`} onClick={() => handleAccountSelect(acc)}>
                                    {acc.accountId == account?.accountId ? 'Wybrane Konto': 'Zamień konto'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && Array.from({length: 3}).map((_, index) => (
                    <div key={index} className='col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4 mb-sm-3 h-100'>
                            <div className={`d-flex flex-column border half-blurred ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                                <div className='user-select-none full-blurred'><i className={`bi bi-coin fs-3`}></i></div>
                                <div className={`user-select-none fs-5 fw-bold full-blurred ${sDashboard.textDarkPrimary}`}>Placeholder</div>
                                <div className='user-select-none full-blurred'><span className='text-gradient fw-bold'>10000000,00</span></div>
                                <div>
                                    <button type='button' className='btn btn-primary btn-sm mt-2 rounded-5 full-blurred'>
                                        Wybierz
                                    </button>
                                </div>
                            </div>
                        </div>
                ))}

                <div className='col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3'>
                        <div className={`d-flex flex-column ${sDashboard.shadowDark} border ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 justify-content-center align-items-center point ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkPrimary}`} onClick={() => handleAddAccount()} role="button" tabIndex={0}>
                            <div className='fs-5'>
                                Dodaj Konto
                            </div>
                            <div>
                                <i className="bi bi-plus-lg fs-1"></i>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};

export default AccountSelection;