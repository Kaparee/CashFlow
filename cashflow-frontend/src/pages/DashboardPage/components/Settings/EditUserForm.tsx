import React, { useContext, useRef, useState } from "react";
import sDashboard from '../../DashboardPage.module.css'
import { ToastContext } from "../../../../contexts/ToastContext";
import Input from "../../../../components/UI/Input/Input";
import type { User } from '../../../../types/user'

interface FormDataProps {
    newFirstName: string;
    newLastName: string;
    newNickname: string;
    newPhotoUrl: string;
}

interface EditUserFormProps {
    isLoading: boolean;
    user: User;
    editFunction: (dataPack: FormDataProps) => Promise<void>;
}

const EditUserForm: React.FC<EditUserFormProps> = ({isLoading, editFunction, user}) => {
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    const [ errors, setErrors ] = useState<{ [key: string]: string }>({});
    const [ formData, setFormData ] = useState<FormDataProps>({ newFirstName: user?.firstName || "", newLastName: user?.lastName || "", newNickname: user?.nickname || "", newPhotoUrl: user?.photoUrl || ""});
    const [ isEditing, setIsEditing ] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);

    const validateForm = () => {
        const err: {[key: string] : string} = {};

        if (formData.newFirstName.trim().length == 0) {
            err.newFirstName = 'Proszę wpisać nowe imię'
        }

        if (formData.newLastName.trim().length == 0) {
            err.newLastName = 'Proszę wpisać nowe nazwisko'
        }
        
        if (formData.newNickname.trim().length == 0) {
            err.newNickname = 'Proszę wpisać nowy nickname'
        }

        if (formData.newPhotoUrl.trim().length == 0) {
            err.newPhotoUrl = 'Proszę wprowadzic nowe zdjecie'
        }
            
        setErrors(err);
        
        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleEditUser = async () => {
    
        setIsEditing(true);
    
        try {
            modalCloseButtonEditFormRef.current?.click();
            await editFunction(formData);
        } catch (error: any) {
            addToast('Wystąpił błąd podczas edycji danych', 'error');
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
            handleEditUser();
        }
    }

    return (
        <form onSubmit={handleValidateForm}>
            <div className="modal-body py-0">
                <div className={``}>
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='newFirstName' name='newFirstName' label='Nowe imię' type='text' value={formData.newFirstName} onChange={handleChange} error={errors.newFirstName} />
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='newLastName' name='newLastName' label='Nowe nazwisko' type='text' value={formData.newLastName} onChange={handleChange} error={errors.newLastName} />
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='newNickname' name='newNickname' label='Nowy nickname' type='text' value={formData.newNickname} onChange={handleChange} error={errors.newNickname} />
                    <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='newPhotoUrl' name='newPhotoUrl' label='Nowy obrazek' type='text' value={formData.newPhotoUrl} onChange={handleChange} error={errors.newPhotoUrl} />
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

export default EditUserForm;
