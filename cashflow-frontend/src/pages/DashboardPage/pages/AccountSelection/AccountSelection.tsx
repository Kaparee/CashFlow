import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios';
import sDashboard from '../../DashboardPage.module.css'
import { AccountContext } from '../../contexts/AccountContext'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContext } from '../../../../contexts/ToastContext';

interface AccountSelectionProps {
    accountId: number;
    name: string;
    balance: number;
    currencyCode: string;
    photoUrl: string;
}

const AccountSelection: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {account, setAccount} = useContext(AccountContext);
    const [accounts, setAccounts] = useState<AccountSelectionProps[]>([]);
    const {addToast} = useContext(ToastContext);
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = (path: string, options?: any) => {
        navigate(path, options);
    }

    useEffect(() => {
        handleGetAccounts();
    }, []);

    const handleGetAccounts = async () => {
        const token = localStorage.getItem('token');
        try {
            setIsLoading(true);
            const res = await axios.get('http://localhost:5205/api/accounts-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAccounts(res.data);
        } catch (error: any) {
            addToast('Nie udało się pobrać kont','error');
        } finally {
            setIsLoading(false);
        }
    }

    const handleAccountSelect = (account: AccountSelectionProps) => {
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
                {!isLoading && accounts.map((account, index) => (
                    <div key={account.accountId} className='col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4 mb-sm-3 h-100'>
                        <div className={`d-flex flex-column border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <div className='user-select-none'><i className={`bi ${account.photoUrl ? account.photoUrl : 'bi-coin' } fs-3`}></i></div>
                            <div className={`user-select-none fs-5 fw-bold ${sDashboard.textDarkPrimary}`}>{account.name}</div>
                            <div className='user-select-none'><span className='text-gradient fw-bold'>{handleCurrencyFormatting(account.balance, account.currencyCode)}</span></div>
                            <div>
                                <button type='button' className='btn btn-primary btn-sm mt-2 rounded-5' onClick={() => handleAccountSelect(account)}>
                                    Wybierz
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

export default AccountSelection