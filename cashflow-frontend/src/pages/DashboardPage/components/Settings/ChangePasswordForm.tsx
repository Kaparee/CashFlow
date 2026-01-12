import React, { useContext, useRef, useState } from "react";
import sDashboard from '../../DashboardPage.module.css'
import { ToastContext } from "../../../../contexts/ToastContext";
import Input from "../../../../components/UI/Input/Input";

interface FormDataProps {
    oldPassword: string;
    newPassword: string;
    ReNewPassword: string;
}

interface ChangePasswordFormProps {
    isLoading: boolean;
    editFunction: (dataPack: FormDataProps) => Promise<void>;
    invalidOldPasswordMessage: string | null;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({isLoading, editFunction, invalidOldPasswordMessage}) => {
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    const [ errors, setErrors ] = useState<{ [key: string]: string }>({});
    const [ formData, setFormData ] = useState<FormDataProps>({ oldPassword: "", newPassword: "", ReNewPassword: ""});
    const [ isEditing, setIsEditing ] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);

    const validateForm = () => {
        const err: {[key: string] : string} = {};

        if (formData.newPassword.trim().length < 8) {
            err.newPassword = 'Hasło powinno mieć więcej niż 8 znaków'
        } else if (!/[A-Z]/.test(formData.newPassword.trim())) {
            err.newPassword = 'Hasło powinno mieć przynajmniej jedną dużą literę'
        } else if (!/[^a-zA-Z0-9]/.test(formData.newPassword.trim())) {
            err.newPassword = 'Hasło powinno mieć przynajmniej jeden znak specjalny'
        } else if (!/[0-9]/.test(formData.newPassword.trim())) {
            err.newPassword = 'Hasło powinno mieć przynajmniej jedna cyfre'
        }

        if (formData.newPassword.trim() != formData.ReNewPassword.trim()) {
            err.ReNewPassword = 'Nowe hasła nie są identyczne'
        }
            
        setErrors(err);
        
        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleEditPassword = async () => {
    
        setIsEditing(true);
    
        try {
            await editFunction(formData);
            modalCloseButtonEditFormRef.current?.click();
            addToast('Pomyślnie edytowano hasło', 'info');
        } catch (error: any) {
            addToast('Wystąpił błąd podczas zaminy hasła', 'error');
        } finally {
            setIsEditing(false);
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

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            handleEditPassword();
        }
    }

    return (
        <form onSubmit={handleValidateForm}>
            <div className="modal-body py-0">
                <div className={``}>
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordButtonClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordEyeClass={`${sDashboard.textDarkPrimary}`} id='oldPassword' name='oldPassword' label='Stare hasło' type='password' value={formData.oldPassword} onChange={handleChange} error={errors.oldPassword} />
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordButtonClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordEyeClass={`${sDashboard.textDarkPrimary}`} id='newPassword' name='newPassword' label='Nowe hasło' type='password' value={formData.newPassword} onChange={handleChange} error={errors.newPassword} />
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordButtonClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} passwordEyeClass={`${sDashboard.textDarkPrimary}`} id='ReNewPassword' name='ReNewPassword' label='Powtórz nowe hasło' type='password' value={formData.ReNewPassword} onChange={handleChange} error={errors.ReNewPassword} />

                    {invalidOldPasswordMessage && (
                        <div className="alert alert-danger mt-3 small py-2" role="alert">
                            {invalidOldPasswordMessage}
                        </div>
                     )}
                </div>
            </div>
            <div className="modal-footer justify-content-center border-0">
                <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold rounded-5"
                    disabled={isLoading || isEditing}
                >
                    Edytuj
                </button>
                <button
                    type="button"
                    className="btn btn-outline-primary rounded-5 w-100"
                    data-bs-dismiss="modal"
                    ref={modalCloseButtonEditFormRef}
                >
                    Zamknij
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
