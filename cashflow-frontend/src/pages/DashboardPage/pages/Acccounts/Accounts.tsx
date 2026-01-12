import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sDashboard from '../../DashboardPage.module.css';
import s from './Accounts.module.css'
import {useAccount, type AccountContextProps } from '../../contexts/AccountContext';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';
import Input from '../../../../components/UI/Input/Input';

interface FormDataProps {
    accountId: string;
    newName: string;
    newPhotoUrl: string;
}

const iconsList = ['bi-cash', 'bi-cash-stack', 'bi-wallet', 'bi-wallet2', 'bi-wallet-fill', 'bi-cash-coin', 'bi-bank', 'bi-bank2', 'bi-coin', 'bi-piggy-bank', 'bi-piggy-bank-fill', 'bi-safe', 'bi-safe-fill', 'bi-safe2', 'bi-safe2-fill', 'bi-currency-bitcoin', 'bi-basket3-fill', 'bi-currency-dollar', 'bi-currency-euro', 'bi-currency-exchange', 'bi-currency-pound', 'bi-currency-rupee', 'bi-currency-yen', 'bi-credit-card', 'bi-credit-card-2-back', 'bi-credit-card-2-back-fill', 'bi-credit-card-2-front', 'bi-credit-card-2-front-fill', 'bi-credit-card-fill']; 

const Accounts: React.FC = () => {
    const [accounts, setAccounts] = useState<AccountContextProps[]>([]);
    const { account, setAccount, handleRefreshData } = useAccount();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const [formData, setFormData] = useState<FormDataProps>({ accountId: "", newName: "", newPhotoUrl: ""});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);

    const [selectedAccountOptions, setSelectedAccountOptions] = useState<AccountContextProps | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [isClosing, setIsClosing] = useState<boolean>(false);

    const {addToast} = useContext(ToastContext);

    const navigate = useNavigate();
    const routeChange = (path: string, options?: any) => {
        navigate(path, options);
    }

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

    useEffect(() => {
        fetchAccounts();
    }, []);

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

    const validateForm = () => {
        const err: {[key: string] : string} = {};

        if (formData.newName.trim().length == 0) {
            err.newName = 'Proszę wpisać nazwę'
        } else if (formData.newName.trim().length > 50) {
            err.newName = 'Nazwa powinna być krótsza niż 50 znaków'
        }

        if (formData.newPhotoUrl.trim().length == 0) {
            err.newPhotoUrl = 'Proszę wybrać ikonkę'
        }
        
        setErrors(err);
    
        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name as keyof  FormDataProps;
        const {value} = e.currentTarget;
    
        const nextData = {...formData, [name]: value};
    
        setFormData(nextData);
    
        const { [name]: _ , ...remainingErrors } = errors;
        setErrors(remainingErrors);
    }

    const handleClearFormData = () => {
        setFormData({ accountId: "", newName: "", newPhotoUrl: ""});
    }

    const handleEditAccount = async () => {
        try {
            const accId = parseInt(formData.accountId,10);
            if (isNaN(accId)){
                addToast('Wystąpił błąd przy wyborze konta', 'error');
                return;
            }
            setIsLoading(true);
            await api.patch('/update-account', {
                "accountId": accId,
                "newName": formData.newName,
                "newPhotoUrl": formData.newPhotoUrl
            });
            addToast('Edytowano konto', 'info');
            handleClearFormData();
            modalCloseButtonEditFormRef.current?.click();
            handleRefreshData();
            fetchAccounts();
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFillEditForm = () => {
        const newItem: FormDataProps = {

            ['accountId']: String(selectedAccountOptions?.accountId),
            ['newName']: String(selectedAccountOptions?.name),
            ['newPhotoUrl']: String(selectedAccountOptions?.photoUrl), 
        }
        setFormData({...formData, ...newItem});
    }

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            handleEditAccount();
        }
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
            
            if (account?.accountId === selectedAccountOptions.accountId) {
                setAccount(null as any); 
            }

            addToast('Konto zostało usunięte pomyślnie', 'info');
            closeOptionsModal();
            handleRefreshData();
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

                {!isLoading && accounts.map((acc, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4 mb-sm-3 h-100">
                        <div className={`d-flex flex-column justify-content-between border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkSecondary} ${sDashboard.textDarkSecondary} ${sDashboard.shadowDarkAccentPrimaryHover} ${sDashboard.squareBox} rounded-5 p-3 text-center h-100 ${sDashboard.shadowDark}`}>
                            <div className={`bi ${acc.photoUrl ? acc.photoUrl : 'bi-coin' } fs-1`}></div>
                            <div>
                                <h5 className={sDashboard.textDarkPrimary}>{acc.name}</h5>
                                <p className="text-gradient fw-bold fs-4">
                                    {handleCurrencyFormatting(acc.balance, acc.currencyCode)}
                                </p>
                            </div>
                            <div className={`d-flex gap-1`}>
                                <button 
                                    className={`btn w-100 rounded-5 ${account?.accountId === acc.accountId ? 'btn-success' : 'btn-outline-primary'}`}
                                    onClick={() => handleSetAccount(acc)}
                                >
                                    {account?.accountId === acc.accountId ? 'Aktywne' : 'Przełącz'}
                                </button>
                                <button className={`btn rounded-5 bi bi-gear ${s.accoutSettingsButton}`} onClick={() => openOptionsModal(acc)}>

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
                                className={`btn btn-outline-primary btn-lg rounded-5 mt-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#editAccountModal"
                                type='button'
                                onClick={handleFillEditForm}
                            >
                                Edytuj
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
            <div className="modal fade" id="editAccountModal" tabIndex={-1} aria-labelledby="editAccountModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <form onSubmit={handleValidateForm}>
                            <div className="modal-header border-0">
                                <span className={`modal-title fs-5 fw-bold ${sDashboard.textDarkPrimary}`} id="editAccountModalLabel">Edytowanie konta</span>
                            </div>
                            <div className="modal-body py-0">
                                <Input id={'name'} divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} name={'newName'} label={'Nazwa'} value={formData.newName} onChange={handleChange} error={errors.newName} />
                                <div className='mb-3'>
                                    <div className={`rounded-5 p-3 border ${sDashboard.bgDarkPrimary} ${errors.newPhotoUrl ? 'is-invalid' : sDashboard.borderDarkEmphasis}`}>
                                        {iconsList.map((icon, index) => (
                                            <button key={index} type='button' name='newPhotoUrl' value={icon} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.newPhotoUrl == icon ? s.selectedIcon : ''}`} onClick={handleChange}>
                                                <i className={`bi fs-5 ${icon}`}></i>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.newPhotoUrl && <div className="d-block invalid-feedback text-start ps-2">{errors.newPhotoUrl}</div>}
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <button type="submit" className="btn btn-primary w-100 fw-bold rounded-5" disabled={isLoading}>{isLoading ? 'Edytowanie...': 'Edytuj'}</button>
                                <button type="button" className="btn btn-outline-primary rounded-5 w-100" data-bs-dismiss="modal" ref={modalCloseButtonEditFormRef}>Zamknij</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accounts;