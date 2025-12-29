import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import sDashboard from '../../DashboardPage.module.css';
import {useAccount, AccountContextProps } from '../../contexts/AccountContext';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';

const Accounts: React.FC = () => {
    const context = useAccount();
    const [accounts, setAccounts] = useState<AccountContextProps[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const {addToast} = useContext(ToastContext);

    const navigate = useNavigate();
    const routeChange = (path: string, options?: any) => {
        navigate(path, options);
    }

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/accounts-info');
                setAccounts(res.data);
            } catch (error: any) { 
                addToast('Wystąpił błąd podczas ładowania kont', 'info') 
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if (!context) return null;
    const { account: selectedAccount, setAccount } = context;

    const handleAddAccount = () => {
        routeChange('/dashboard/account-creator');
    }

    const handleSetAccount = (acc: AccountContextProps) => {
        setAccount(acc);
        routeChange('/dashboard/dashboard-home-page');
    }

    const handleCurrencyFormatting = (balance: number, format: string) => {
        return  new Intl.NumberFormat(navigator.language, { style: "currency", currency: format, useGrouping: true }).format(balance)
    }

    return (
        <div className="container-fluid p-4">
            <h2 className={sDashboard.textDarkPrimary}>Twoje Konta</h2>
            <div className="row mt-4">
                {isLoading && Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4 mb-sm-3 h-100">
                        <div className={`d-flex flex-column border half-blurred ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <h5 className={`full-blurred ${sDashboard.textDarkPrimary}`}>Placeholder</h5>
                            <p className="text-gradient fw-bold fs-4 full-blurred ">
                                Placeholder
                            </p>
                            <button 
                                className={`btn w-100 rounded-5 btn-outline-primary full-blurred `}>
                                Wybierz
                            </button>
                        </div>
                    </div>
                ))}

                {!isLoading && accounts.map((account, index) => (
                    <div key={account.accountId} className="col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4 mb-sm-3 h-100">
                        <div className={`d-flex flex-column border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <h5 className={sDashboard.textDarkPrimary}>{account.name}</h5>
                            <p className="text-gradient fw-bold fs-4">
                                {handleCurrencyFormatting(account.balance, account.currencyCode)}
                            </p>
                            <button 
                                className={`btn w-100 rounded-5 ${selectedAccount?.accountId === account.accountId ? 'btn-success' : 'btn-outline-primary'}`}
                                onClick={() => handleSetAccount(account)}
                            >
                                {selectedAccount?.accountId === account.accountId ? 'Aktywne' : 'Przełącz na to konto'}
                            </button>
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
        </div>
    );
};

export default Accounts;