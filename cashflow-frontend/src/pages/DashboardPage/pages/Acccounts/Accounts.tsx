import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import sDashboard from '../../DashboardPage.module.css';
import s from './Accounts.module.css'
import {useAccount, AccountContextProps } from '../../contexts/AccountContext';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';

const Accounts: React.FC = () => {
    const context = useAccount();
    const [accounts, setAccounts] = useState<AccountContextProps[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const [selectedAccountOptions, setSelectedAccountOptions] = useState<AccountContextProps | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [isClosing, setIsClosing] = useState<boolean>(false);

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

    const openOptionsModal = (acc: AccountContextProps) => {
        setIsClosing(false);
        setIsConfirmingDelete(false)
        setSelectedAccountOptions(acc);
    }

    const closeOptionsModal = () => {
        setIsClosing(true);

        setTimeout(() => {
            setSelectedAccountOptions(null);
            setIsClosing(false);
            setIsConfirmingDelete(false)
        }, 300);
    }

    const handleDeleteAccount = async () => {
        if (!selectedAccountOptions) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true)
            return;
        }

        try {
            setIsDeleting(true);
            await api.delete(`/delete-account`, { params: { 'accountId': selectedAccountOptions.accountId } } );
            
            setAccounts(prev => prev.filter(a => a.accountId !== selectedAccountOptions.accountId));
            
            if (selectedAccount?.accountId === selectedAccountOptions.accountId) {
                setAccount(null as any); 
            }

            addToast('Konto zostało usunięte pomyślnie', 'info');
            closeOptionsModal();
        } catch (error: any) {
            addToast('Nie udało się usunąć konta', 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="container-fluid p-4">
            <h2 className={sDashboard.textDarkPrimary}>Twoje Konta</h2>
            <div className="row mt-4">
                {isLoading && Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4 mb-sm-3 h-100">
                        <div className={`d-flex flex-column border half-blurred ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.squareBox} ${sDashboard.shadowDarkAccentPrimaryHover} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <div className={`bi bi-person-circle fs-1`}></div>
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
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4 mb-sm-3 h-100">
                        <div className={`d-flex flex-column justify-content-between border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} ${sDashboard.squareBox} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <div className={`bi ${account.photoUrl ? account.photoUrl : 'bi-coin' } fs-1`}></div>
                            <div>
                                <h5 className={sDashboard.textDarkPrimary}>{account.name}</h5>
                                <p className="text-gradient fw-bold fs-4">
                                    {handleCurrencyFormatting(account.balance, account.currencyCode)}
                                </p>
                            </div>
                            <div className={`d-flex gap-1`}>
                                <button 
                                    className={`btn w-100 rounded-5 ${selectedAccount?.accountId === account.accountId ? 'btn-success' : 'btn-outline-primary'}`}
                                    onClick={() => handleSetAccount(account)}
                                >
                                    {selectedAccount?.accountId === account.accountId ? 'Aktywne' : 'Przełącz'}
                                </button>
                                <button className={`btn rounded-5 bi bi-gear ${s.accoutSettingsButton}`} onClick={() => openOptionsModal(account)}>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className='col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4 mb-sm-3 h-100'>
                    <div className={`d-flex flex-column ${sDashboard.shadowDark} border ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDarkAccentPrimaryHover} ${sDashboard.squareBox} rounded-5 p-3 text-center h-100 justify-content-center align-items-center point ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkPrimary}`} onClick={() => handleAddAccount()} role="button" tabIndex={0}>
                        <div className='fs-5'>
                            Dodaj Konto
                        </div>
                        <div>
                            <i className="bi bi-plus-lg fs-1"></i>
                        </div>
                    </div>
                </div>
            </div>
            {selectedAccountOptions && (
                <div 
                    className={`${s.modalOverlay} ${isClosing ? s.modalOverlayClosing : ''}`} 
                    onClick={!isClosing ? closeOptionsModal : undefined}
                >
                    <div 
                        className={`${s.bottomSheet} ${isClosing ? s.bottomSheetClosing : ''} ${sDashboard.bgDarkSecondary} border-top ${sDashboard.borderDarkEmphasis} p-4`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className={sDashboard.textDarkPrimary}>Zarządzanie kontem</h4>
                            <button type="button" className="btn-close btn-close-white" onClick={closeOptionsModal}></button>
                        </div>

                        <div className="text-center mb-4">
                            <h5 className="text-white mb-2">Wybrane konto:</h5>
                            <h3 className="text-white fw-bold">{selectedAccountOptions.name}</h3>
                            <p className="text-gradient fw-bold fs-4">
                                {handleCurrencyFormatting(selectedAccountOptions.balance, selectedAccountOptions.currencyCode)}
                            </p>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                className="btn btn-outline-danger btn-lg rounded-5 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : isConfirmingDelete ? (
                                    <>
                                        <i className='bi bi-exclamation-triangle fill'></i>
                                        Na pewno? Kliknij aby potwierdzić
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Usuń trwale to konto
                                    </>
                                )}
                                
                            </button>
                            
                            <button 
                                className="btn btn-dark btn-lg rounded-5 mt-2" 
                                onClick={closeOptionsModal}
                            >
                                Anuluj
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;