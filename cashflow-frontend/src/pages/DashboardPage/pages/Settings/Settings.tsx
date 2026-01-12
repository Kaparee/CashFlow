import React, { useState, useContext, useEffect, useRef } from "react";
import sDashboard from '../../DashboardPage.module.css';
import DeleteUserForm from "../../components/Settings/DeleteUserForm";
import EditUserForm from '../../components/Settings/EditUserForm';
import ChangePasswordForm from '../../components/Settings/ChangePasswordForm';
import ChangeEmailForm from '../../components/Settings/ChangeEmailForm';
import api from "../../../../api/api";
import { AuthContext } from "../../../../contexts/AuthContext";
import { ToastContext } from "../../../../contexts/ToastContext";

interface EditDataFromProps {
    newFirstName: string;
    newLastName: string;
    newNickname: string;
    newPhotoUrl: string;
}

interface ChangePasswordFormProps {
    oldPassword: string;
    newPassword: string;
    ReNewPassword: string;
}

const Settings: React.FC = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ tittleModal, setTittleModal ] = useState<string>('test');
    const [ display, setDisplay ] = useState<string>('');
    const { logout, refreshUser, user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const modalRef = useRef<HTMLDivElement>(null);
    const [ editPasswordError, setEditPasswordError ] = useState<string | null>(null);
    const [ emailChangeError, setEmailChangeError ] = useState<string | null>(null);

    useEffect(() => {
        const currentModal = modalRef.current;

        const handleHide = () => {
            setDisplay('');
            setEditPasswordError('');
            setEmailChangeError('');
        };

        currentModal?.addEventListener('hidden.bs.modal', handleHide);
        return () => {
            currentModal?.removeEventListener('hidden.bs.modal', handleHide);
        }
    },[]);

    const handleChangeDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name;
        setDisplay(name);
        switch (name) {
            case 'accountDelete': {
                setTittleModal('Usuwanie konta');
                break;
            }
            case 'accountEdit': {
                setTittleModal('Edytowanie danych');
                break;
            }
            case 'accountEditPassword': {
                setTittleModal('Zmiana hasła');
                break;
            }
            case 'emailChange': {
                setTittleModal('Zmiana adresu email');
                break;
            }
        }
    }

    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            await api.delete('/delete-user');
            addToast('Pomyślnie usunięto konto użytkownika', 'info')
            logout();
        } catch (error: any) {
            addToast('Wystąpił błąd podczas usuwania konta użytkownika','error');
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditAccount = async (dataPack : EditDataFromProps) => {
        try {
            setIsLoading(true);
            await api.patch('/update-user', {
                newFirstName: dataPack.newFirstName,
                newLastName: dataPack.newLastName,
                newNickname: dataPack.newNickname,
                newPhotoUrl: dataPack.newPhotoUrl
            })
            await refreshUser();
            addToast('Pomyślnie edytowano dane', 'info')
        } catch (error: any) {
            addToast('Wystąpił błąd podczas edycji danych', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditPassword = async (dataPack : ChangePasswordFormProps) => {
        setEditPasswordError(null);
        try {
            setIsLoading(true);
            await api.patch('/modify-password', {
                oldPassword: dataPack.oldPassword,
                newPassword: dataPack.newPassword 
            });
        } catch (error: any) {
            if (error.response?.status === 400) {
                setEditPasswordError('Stare hasło jest niepoprawne');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleRequestEmailChange = async (newEmail: string) => {
        setEmailChangeError(null);
        try {
            setIsLoading(true);
            await api.post('/request-email-change', {
                newEmail: newEmail
            });
        } catch (error: any) {
            if (error.response?.status === 400) {
                setEmailChangeError('Ten email jest już używany przez inne konto');
            } else if (error.response?.status === 409) {
                setEmailChangeError('Ten email jest już używany');
            } else {
                throw error;
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="w-100 h-100 d-flex flex-column">
                <div className={`d-flex fs-3 px-2 py-1 ${sDashboard.textDarkPrimary} ${sDashboard.textDarkUnderline}`}>
                    Ustawienia
                </div>
                <div className={`p-2 row`}>
                    <div className="col-6 d-flex flex-column">
                        <div className={`fs-4 mb-2 ${sDashboard.textDarkSecondary}`}>
                            Konto:
                        </div>
                        <div>
                            <button 
                                className={`btn btn-outline-danger mb-2 rounded-5 d-flex align-items-center justify-content-center gap-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#modalSettings"
                                type='button'
                                name="accountDelete"
                                disabled={isLoading}
                                onClick={handleChangeDisplay}
                            >
                                {isLoading ? 'Ładowanie opcji' : "Usuń konto"}
                            </button>

                            <button 
                                className={`btn btn-outline-primary mb-2 rounded-5 d-flex align-items-center justify-content-center gap-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#modalSettings"
                                type='button'
                                name="accountEdit"
                                onClick={handleChangeDisplay}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Ładowanie opcji' : "Edytuj dane konta"}
                            </button>

                            <button 
                                className={`btn btn-outline-primary mb-2 rounded-5 d-flex align-items-center justify-content-center gap-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#modalSettings"
                                type='button'
                                name="accountEditPassword"
                                onClick={handleChangeDisplay}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Ładowanie opcji' : "Edytuj hasło"}
                            </button>

                            <button
                                className={`btn btn-outline-primary mb-2 rounded-5 d-flex align-items-center justify-content-center gap-2`}
                                data-bs-toggle="modal"
                                data-bs-target="#modalSettings"
                                type='button'
                                name="emailChange"
                                onClick={handleChangeDisplay}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Ładowanie opcji' : "Zmień email"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="modalSettings" ref={modalRef} tabIndex={-1} aria-labelledby="modalSettingsLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <div className={`modal-header border-0`}>
                            <span
                                className={`modal-title fs-4 fw-bold ${sDashboard.textDarkPrimary}`}
                                id="modalSettingsLabel"
                            >
                                {tittleModal}
                            </span>
                        </div>
                        {display === 'accountDelete' ? <DeleteUserForm isLoading={isLoading} deleteFunction={handleDeleteAccount} /> : ''}
                        {user != null && display === 'accountEdit' ? <EditUserForm isLoading={isLoading} editFunction={handleEditAccount} user={user} /> : '' }
                        {display === 'accountEditPassword' ? <ChangePasswordForm isLoading={isLoading} editFunction={handleEditPassword} invalidOldPasswordMessage={editPasswordError} /> : ''}
                        {display === 'emailChange' ? <ChangeEmailForm isLoading={isLoading} changeFunction={handleRequestEmailChange} errorMessage={emailChangeError} /> : ''}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;