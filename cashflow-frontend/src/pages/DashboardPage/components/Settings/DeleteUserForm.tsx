import React, { useRef, useState, useContext } from "react";
import sDashboard from '../../DashboardPage.module.css'
import { ToastContext } from "../../../../contexts/ToastContext";

interface DeleteUserFormProps {
    isLoading: boolean;
    deleteFunction: () => Promise<void>;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({isLoading, deleteFunction}) => {
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);

    const handleDeleteUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true)
            return;
        }

        setIsDeleting(true);

        try {
            await deleteFunction();
            modalCloseButtonEditFormRef.current?.click();
        } catch (error: any) {
            addToast('Wystąpił błąd podczas usuwania konta użytkownika', 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <form onSubmit={handleDeleteUser}>
            <div className="modal-body py-0">
                <div className={`fs-3 text-center ${sDashboard.textDarkPrimary}`}>
                    Czy na pewno chcesz usunąć konto użytkownika?
                </div>
            </div>
            <div className="modal-footer justify-content-center border-0">
                <button
                    type="submit"
                    className="btn btn-outline-danger btn-lg rounded-5 d-flex align-items-center justify-content-center gap-2 w-100"
                    disabled={isDeleting || isLoading}
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
                    type="button"
                    className="btn btn-outline-primary rounded-5 w-100"
                    data-bs-dismiss="modal"
                    ref={modalCloseButtonEditFormRef}
                >
                    Anuluj
                </button>
            </div>
        </form>
    );
};

export default DeleteUserForm;
