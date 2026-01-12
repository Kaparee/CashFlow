import React, { useContext, useRef, useState } from "react";
import sDashboard from '../../DashboardPage.module.css'
import { ToastContext } from "../../../../contexts/ToastContext";
import Input from "../../../../components/UI/Input/Input";

interface FormDataProps {
    newEmail: string;
}

interface EmailChangeFormProps {
    isLoading: boolean;
    changeFunction: (newEmail: string) => Promise<void>;
    errorMessage: string | null;
}

const ChangeEmailForm: React.FC<EmailChangeFormProps> = ({ isLoading, changeFunction, errorMessage }) => {
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<FormDataProps>({ newEmail: "" });
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);

    const validateForm = () => {
        const err: { [key: string]: string } = {};

        if (formData.newEmail.trim().length === 0) {
            err.newEmail = 'Wpisz nowy adres email'
        } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) {
            err.newEmail = 'Popraw adres email'
        }

        setErrors(err);

        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleChangeEmail = async () => {
        setIsChanging(true);

        try {
            await changeFunction(formData.newEmail);
            modalCloseButtonEditFormRef.current?.click();
            addToast('Link potwierdzający został wysłany na nowy adres email', 'info');
        } catch (error: any) {
            addToast('Wystąpił błąd podczas zmiany emaila', 'error');
        } finally {
            setIsChanging(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name as keyof FormDataProps;
        const { value } = e.currentTarget;

        const nextData = { ...formData, [name]: value };

        setFormData(nextData);

        const { [name]: _, ...remainingErrors } = errors;
        setErrors(remainingErrors);
    }

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            handleChangeEmail();
        }
    }

    return (
        <form onSubmit={handleValidateForm}>
            <div className="modal-body py-0">
                <div className={`alert alert-info rounded-4 mb-3 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} border-0`}>
                    <i className="bi bi-info-circle me-2"></i>
                    Link potwierdzający zostanie wysłany na nowy adres email
                </div>

                <div className={``}>
                    <Input 
                        divClass={sDashboard.textDarkSecondary} 
                        inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} 
                        id='newEmail' 
                        name='newEmail' 
                        label='Nowy adres email' 
                        type='email' 
                        value={formData.newEmail} 
                        onChange={handleChange} 
                        error={errors.newEmail} 
                    />

                    {errorMessage && (
                        <div className="alert alert-danger mt-3 small py-2" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
            <div className="modal-footer justify-content-center border-0">
                <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold rounded-5"
                    disabled={isLoading || isChanging}
                >
                    {isChanging ? 'Wysyłanie...' : 'Wyślij link potwierdzający'}
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

export default ChangeEmailForm;