import React, { useState, useEffect, useContext } from 'react';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';
import { useAccount } from '../../contexts/AccountContext';
import sDashboard from '../../DashboardPage.module.css';
import s from './RecurringTransactions.module.css';
import { format } from 'date-fns';
import Input from '../../../../components/UI/Input/Input';

interface Category {
    categoryId: number;
    name: string;
    color: string;
    type: string;
    icon: string;
}

export interface RecurringTransaction {
    recTransactionId: number;
    accountId: number;
    type: string;
    name: string;
    frequency: string;
    isTrue: boolean;
    startDate: string;
    endDate: string | null;
    categoryId: number;
    amount: number;
    description: string;
    nextPaymentDate: string;
    category?: Category;
}

interface EditFormData {
    recTransactionId: number;
    accountId: number;
    newType: string;
    newName: string;
    newFrequency: string;
    newIsTrue: boolean;
    newEndDate: string | null;
    newCategoryId: number;
    newAmount: string;
    newDescription: string;
    newNextPaymentDate: string;
    newStartDate: string;
}

const toApiDate = (dateString: string): string => {
    return `${dateString}T00:00:00.000Z`;
};

const RecurringTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<EditFormData | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { addToast } = useContext(ToastContext);
    const { account, handleRefreshData } = useAccount();

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories-info');
            setCategories(res.data);
        } catch (error: any) {
            addToast('Nie udało się pobrać kategorii', 'error');
        }
    };

    const fetchRecurringTransactions = async () => {
        if (!account?.accountId) return;
        
        try {
            setIsLoading(true);
            const res = await api.get('/rec-transaction-info', {
                params: { accountId: account.accountId }
            });
            const enrichedTransactions = res.data.map((t: RecurringTransaction) => ({
                ...t,
                category: categories.find(c => c.categoryId === t.categoryId)
            }));
            setTransactions(enrichedTransactions);
        } catch (error: any) {
            addToast('Nie udało się pobrać transakcji cyklicznych', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTransaction = async (transactionId: number, accountId: number) => {
        if (deletingId !== transactionId) {
            setDeletingId(transactionId);
            return;
        }

        try {
            await api.delete('/delete-rec-transaction', {
                params: {
                    transactionId: transactionId,
                    accountId: accountId
                }
            });
            
            setTransactions(prev => prev.filter(t => t.recTransactionId !== transactionId));
            setDeletingId(null);
            addToast('Transakcja cykliczna została usunięta', 'info');
            handleRefreshData();
        } catch (error: any) {
            addToast('Nie udało się usunąć transakcji cyklicznej', 'error');
            setDeletingId(null);
        }
    };

    const startEdit = (transaction: RecurringTransaction) => {
        setEditingId(transaction.recTransactionId);
        setErrors({});
        setDeletingId(null);
        setEditForm({
            recTransactionId: transaction.recTransactionId,
            accountId: transaction.accountId,
            newType: transaction.type,
            newName: transaction.name,
            newFrequency: transaction.frequency,
            newIsTrue: transaction.isTrue,
            newStartDate: transaction.startDate,
            newEndDate: transaction.endDate,
            newCategoryId: transaction.categoryId,
            newAmount: transaction.amount.toString(),
            newDescription: transaction.description,
            newNextPaymentDate: transaction.nextPaymentDate
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
        setErrors({});
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });

        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const validateForm = (): boolean => {
        const err: { [key: string]: string } = {};

        if (!editForm?.newName.trim()) {
            err.newName = 'Nazwa jest wymagana';
        } else if (editForm.newName.trim().length > 50) {
            err.newName = 'Nazwa musi być krótsza niż 50 znaków';
        }

        if (!editForm?.newAmount.trim()) {
            err.newAmount = 'Kwota jest wymagana';
        } else if (!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(editForm.newAmount)) {
            err.newAmount = 'Kwota musi być w formacie 00000.00';
        } else if (parseFloat(editForm.newAmount) <= 0) {
            err.newAmount = 'Kwota musi być większa od 0';
        }

        if (!editForm?.newCategoryId || editForm.newCategoryId === 0) {
            err.newCategoryId = 'Kategoria jest wymagana';
        }

        if (editForm?.newDescription && editForm.newDescription.trim().length > 100) {
            err.newDescription = 'Opis musi być krótszy niż 100 znaków';
        }

        if (editForm?.newEndDate && editForm?.newNextPaymentDate) {
            const nextPayment = new Date(editForm.newNextPaymentDate);
            const endDate = new Date(editForm.newEndDate);
            if (endDate <= nextPayment) {
                err.newEndDate = 'Data zakończenia musi być późniejsza niż data następnej płatności';
            }
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const updateTransaction = async () => {
        if (!editForm) return;

        if (!validateForm()) {
            addToast('Popraw błędy w formularzu', 'error');
            return;
        }

        const payload = {
            recTransactionId: editForm.recTransactionId,
            accountId: editForm.accountId,
            newType: editForm.newType,
            newName: editForm.newName,
            newFrequency: editForm.newFrequency,
            newIsTrue: editForm.newIsTrue ?? true,
            newEndDate: editForm.newEndDate,
            newCategoryId: Number(editForm.newCategoryId),
            newAmount: parseFloat(editForm.newAmount),
            newDescription: editForm.newDescription,
            newNextPaymentDate: editForm.newNextPaymentDate
        };

        console.log('Wysyłam payload:', payload);

        try {
            await api.patch('/update-rec-transaction', payload);
            
            setTransactions(prev =>
                prev.map(t =>
                    t.recTransactionId === editForm.recTransactionId
                        ? {
                            ...t,
                            type: editForm.newType,
                            name: editForm.newName,
                            frequency: editForm.newFrequency,
                            isTrue: editForm.newIsTrue,
                            endDate: editForm.newEndDate,
                            categoryId: Number(editForm.newCategoryId),
                            amount: parseFloat(editForm.newAmount),
                            description: editForm.newDescription,
                            nextPaymentDate: editForm.newNextPaymentDate,
                            category: categories.find(c => c.categoryId === Number(editForm.newCategoryId))
                        }
                        : t
                )
            );
            
            addToast('Transakcja cykliczna została zaktualizowana', 'info');
            cancelEdit();
            handleRefreshData();
        } catch (error: any) {
            console.error("Błąd edycji:", error.response?.data || error.message);
            console.error("Szczegóły błędów walidacji:", error.response?.data?.errors);

            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('; ');
                addToast(`Błędy walidacji: ${errorMessages}`, 'error');
            } else {
                addToast(
                    `Błąd: ${error.response?.data?.message || 'Nie udało się zaktualizować transakcji'}`, 
                    'error'
                );
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            fetchRecurringTransactions();
        }
    }, [account?.accountId, categories]);

    const formatFrequency = (frequency: string): string => {
        const frequencyMap: { [key: string]: string } = {
            'daily': 'Codziennie',
            'weekly': 'Co tydzień',
            'monthly': 'Co miesiąc',
            'yearly': 'Co rok'
        };
        return frequencyMap[frequency] || frequency;
    };

    const formatType = (type: string): string => {
        return type === 'income' ? 'Przychód' : 'Wydatek';
    };

    const formatDateForInput = (dateString: string | null): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    const formatDateForDisplay = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy-MM-dd');
        } catch {
            return dateString;
        }
    };

    const getFilteredCategories = (type: string): Category[] => {
        return categories.filter(c => c.type === type);
    };

    return (
        <div className="w-100 h-100 d-flex flex-column">
            <div className={`d-flex fs-3 px-2 py-1 ${sDashboard.textDarkPrimary} ${sDashboard.textDarkUnderline}`}>
                Transakcje cykliczne ({transactions.length})
            </div>

            <div className="p-2">
                <div className="row">
                    {isLoading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Ładowanie...</span>
                            </div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className={`col-12 text-center py-5 ${sDashboard.textDarkSecondary}`}>
                            <i className="bi bi-arrow-repeat fs-1 d-block mb-3 opacity-50"></i>
                            <p className="mb-0">Brak transakcji cyklicznych</p>
                        </div>
                    ) : (
                        transactions.map(transaction => (
                            <div key={transaction.recTransactionId} className="col-12 mb-3">
                                <div
                                    className={`${s.transactionCard} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDarkHover} p-3 rounded-4 border`}
                                >
                                    {editingId === transaction.recTransactionId && editForm ? (
                                        <div>
                                            <div className="row g-3 mb-3">
                                                <div className="col-md-6">
                                                    <Input
                                                        id={`edit-name-${transaction.recTransactionId}`}
                                                        name="newName"
                                                        label="Nazwa"
                                                        value={editForm.newName}
                                                        onChange={handleEditChange}
                                                        divClass={sDashboard.textDarkSecondary}
                                                        inputClass={`${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                                        error={errors.newName}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Typ</label>
                                                    <select
                                                        className={`form-control py-2 px-3 rounded-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                                        value={editForm.newType}
                                                        onChange={(e) => {
                                                            setEditForm({ ...editForm, newType: e.target.value, newCategoryId: 0 });
                                                            if (errors.newCategoryId) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.newCategoryId;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    >
                                                        <option value="income">Przychód</option>
                                                        <option value="expense">Wydatek</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <Input
                                                        id={`edit-amount-${transaction.recTransactionId}`}
                                                        name="newAmount"
                                                        label="Kwota"
                                                        type="text"
                                                        value={editForm.newAmount}
                                                        onChange={handleEditChange}
                                                        divClass={sDashboard.textDarkSecondary}
                                                        inputClass={`${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                                        error={errors.newAmount}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Kategoria</label>
                                                    <select
                                                        className={`form-control py-2 px-3 rounded-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis} ${errors.newCategoryId ? 'is-invalid' : ''}`}
                                                        value={editForm.newCategoryId}
                                                        onChange={(e) => {
                                                            setEditForm({ ...editForm, newCategoryId: parseInt(e.target.value, 10) });
                                                            if (errors.newCategoryId) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.newCategoryId;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    >
                                                        <option value={0}>Wybierz kategorię</option>
                                                        {getFilteredCategories(editForm.newType).map(cat => (
                                                            <option key={cat.categoryId} value={cat.categoryId}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.newCategoryId && <div className="invalid-feedback d-block ps-2">{errors.newCategoryId}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Częstotliwość</label>
                                                    <select
                                                        className={`form-control py-2 px-3 rounded-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                                        value={editForm.newFrequency}
                                                        onChange={(e) => setEditForm({ ...editForm, newFrequency: e.target.value })}
                                                    >
                                                        <option value="daily">Codziennie</option>
                                                        <option value="weekly">Co tydzień</option>
                                                        <option value="monthly">Co miesiąc</option>
                                                        <option value="yearly">Co rok</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Data następnej płatności</label>
                                                    <input
                                                        type="date"
                                                        className={`form-control py-2 px-3 rounded-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                                        value={formatDateForInput(editForm.newNextPaymentDate)}
                                                        onChange={(e) => {
                                                            if(e.target.value) {
                                                                setEditForm({ 
                                                                    ...editForm, 
                                                                    newNextPaymentDate: toApiDate(e.target.value) 
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <div className={`p-3 rounded-4 ${sDashboard.bgDarkSecondary} ${sDashboard.borderDarkEmphasis} border`}>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                id={`auto-add-${transaction.recTransactionId}`}
                                                                checked={!editForm.newIsTrue}
                                                                onChange={(e) => setEditForm({ ...editForm, newIsTrue: !e.target.checked })}
                                                                style={{ width: '3em', height: '1.5em' }}
                                                            />
                                                            <label className={`form-check-label ms-2 ${sDashboard.textDarkPrimary}`} htmlFor={`auto-add-${transaction.recTransactionId}`}>
                                                                <span className="fw-bold">Dodawaj automatycznie</span>
                                                                <small className={`d-block mt-1 ${sDashboard.textDarkSecondary}`}>
                                                                    {!editForm.newIsTrue 
                                                                        ? '✓ Transakcja zostanie automatycznie dodana do konta w dniu płatności' 
                                                                        : 'ⓘ Zostanie wysłane tylko powiadomienie - transakcję trzeba będzie dodać ręcznie'
                                                                    }
                                                                </small>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Data zakończenia (opcjonalna)</label>
                                                    <input
                                                        type="date"
                                                        className={`form-control py-2 px-3 rounded-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis} ${errors.newEndDate ? 'is-invalid' : ''}`}
                                                        value={formatDateForInput(editForm.newEndDate)}
                                                        onChange={(e) => {
                                                            const newEndDate = e.target.value ? toApiDate(e.target.value) : null;
                                                            setEditForm({ 
                                                                ...editForm, 
                                                                newEndDate 
                                                            });
                                                            if (errors.newEndDate) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.newEndDate;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    />
                                                    {errors.newEndDate && <div className="invalid-feedback d-block ps-2">{errors.newEndDate}</div>}
                                                </div>
                                                <div className="col-12">
                                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>Opis</label>
                                                    <textarea
                                                        className={`form-control py-2 px-3 rounded-4 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis} ${errors.newDescription ? 'is-invalid' : ''}`}
                                                        rows={2}
                                                        value={editForm.newDescription}
                                                        onChange={(e) => {
                                                            setEditForm({ ...editForm, newDescription: e.target.value });
                                                            if (errors.newDescription) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.newDescription;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    />
                                                    {errors.newDescription && <div className="invalid-feedback d-block ps-2">{errors.newDescription}</div>}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary rounded-3"
                                                    onClick={cancelEdit}
                                                >
                                                    Anuluj
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary rounded-3"
                                                    onClick={updateTransaction}
                                                >
                                                    Zapisz zmiany
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                                            {formatType(transaction.type)}
                                                        </span>
                                                        <h5 className={`mb-0 ${sDashboard.textDarkPrimary}`}>
                                                            {transaction.name}
                                                        </h5>
                                                        <span className={`ms-2 fw-bold ${sDashboard.textDarkPrimary}`}>
                                                            {transaction.amount.toFixed(2)} {account?.currencyCode || 'PLN'}
                                                        </span>
                                                    </div>
                                                    {transaction.description && (
                                                        <p className={`mb-2 ${sDashboard.textDarkSecondary}`}>
                                                            {transaction.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="d-flex gap-1 ms-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary rounded-3"
                                                        onClick={() => startEdit(transaction)}
                                                        title="Edytuj"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm rounded-3 ${deletingId === transaction.recTransactionId ? 'btn-danger' : 'btn-outline-danger'}`}
                                                        onClick={() => deleteTransaction(transaction.recTransactionId, transaction.accountId)}
                                                        title={deletingId === transaction.recTransactionId ? 'Kliknij ponownie aby potwierdzić' : 'Usuń'}
                                                    >
                                                        {deletingId === transaction.recTransactionId ? (
                                                            <>
                                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                                Potwierdź
                                                            </>
                                                        ) : (
                                                            <i className="bi bi-trash3"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="row g-3">
                                                <div className="col-md-3">
                                                    <small className={`d-block ${sDashboard.textDarkSecondary} opacity-75`}>Częstotliwość</small>
                                                    <span className={sDashboard.textDarkPrimary}>
                                                        {formatFrequency(transaction.frequency)}
                                                    </span>
                                                </div>
                                                <div className="col-md-3">
                                                    <small className={`d-block ${sDashboard.textDarkSecondary} opacity-75`}>Kategoria</small>
                                                    <span className={sDashboard.textDarkPrimary}>
                                                        {transaction.category ? (
                                                            <>
                                                                <i className={`bi ${transaction.category.icon} me-1`}></i>
                                                                {transaction.category.name}
                                                            </>
                                                        ) : (
                                                            'Brak kategorii'
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-md-3">
                                                    <small className={`d-block ${sDashboard.textDarkSecondary} opacity-75`}>Następna płatność</small>
                                                    <span className={sDashboard.textDarkPrimary}>
                                                        <i className="bi bi-calendar3 me-1"></i>
                                                        {formatDateForDisplay(transaction.nextPaymentDate)}
                                                    </span>
                                                </div>
                                                <div className="col-md-3">
                                                    <small className={`d-block ${sDashboard.textDarkSecondary} opacity-75`}>Data zakończenia</small>
                                                    <span className={sDashboard.textDarkPrimary}>
                                                        {transaction.endDate ? (
                                                            <>
                                                                <i className="bi bi-calendar-x me-1"></i>
                                                                {formatDateForDisplay(transaction.endDate)}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-infinity me-1"></i>
                                                                Brak daty zakończenia
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <div className={`p-2 rounded-3 d-inline-flex align-items-center ${!transaction.isTrue ? 'bg-success' : 'bg-info'} bg-opacity-10 border ${!transaction.isTrue ? 'border-success' : 'border-info'} border-opacity-25`}>
                                                        <i className={`bi ${!transaction.isTrue ? 'bi-check-circle-fill' : 'bi-bell-fill'} me-2 ${!transaction.isTrue ? 'text-success' : 'text-info'}`}></i>
                                                        <span className={`small ${sDashboard.textDarkPrimary}`}>
                                                            {!transaction.isTrue ? 'Dodawana automatycznie' : 'Tylko przypomnienie'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecurringTransactions;