import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import s from './DashboardHomePage.module.css'
import sDashboard from '../../DashboardPage.module.css'
import SidebarControl from '../../components/HomePage/SidebarControl/SidebarControl';
import MainDisplay from '../../components/HomePage/MainDisplay/MainDisplay';
import { useSearchParams } from 'react-router-dom';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, addYears, differenceInDays} from 'date-fns'
import { useTransactions } from '../../hooks/useTransactions';
import { useAccount } from '../../contexts/AccountContext';
import api from '../../../../api/api';
import { ToastContext } from '../../../../contexts/ToastContext';
import Input from '../../../../components/UI/Input/Input';
import CustomSelect from '../../components/UI/CustomSelect/CustomSelect';

interface KeyWords {
    wordId: number;
    word: string;
}

interface Category {
    categoryId: number;
    name: string;
    color: string;
    type: string;
    limitAmount: number;
    icon: string;
    keyWords: KeyWords[];
}

interface Transaction {
    transactionId: number;
    amount: number;
    description: string;
    date: Date;
    type: string;
    category: Category;
}

interface User {
    userId: number;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    photoUrl: string;
    isActive: true;
    isAdmin: true;
    isVerified: true;
    createdAt: string;
    updatedAt: string;
}

interface FormDataProps {
    accountId: number | undefined;
    categoryId: string;
    amount: string;
    description: string;
    date:   string;
    type: 'expense' | 'income';
}

interface SelectItem {
    value: string | number;
    dName: string;
}

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
    recurringTransactionId: number;
    accountId: number;
    categoryId: number;
    amount: number;
    description: string;
    type: 'expense' | 'income';
    frequency: FrequencyType;
    isTrue: boolean;
    startDate: string;
    endDate: string;
    nextPaymentDate: string;
}

const typeOfCategory = [{dName: 'Przychody', type: 'income', value: 'income'}, {dName: 'Wydatki', type: 'expense', value: 'expense'}]

const DashboardHomePage: React.FC = () => {
    const [ isExpense, setIsExpense ] = useState<boolean>(true);
    const { account, handleRefreshData } = useAccount();
    const [searchParams] = useSearchParams();
    const viewMode = searchParams.get('type') || 'expense';
    const [ startDate, setStartDate ] = useState<Date>(startOfDay(new Date()));
    const [ endDate, setEndDate ] = useState<Date>(endOfDay(new Date()));
    const {transactions, isLoading, handleFetchTransactions} = useTransactions(account?.accountId, startDate, endDate, isExpense);
    const currentPeriod = `${format(startDate,'dd.MM.yyyy')} - ${format(endDate,'dd.MM.yyyy')}`;
    const [ isLooking, setIsLooking] = useState<boolean>(true);
    const [ user, setUser] = useState<User>({userId: 0, firstName: "", lastName: "", nickname: "", email: "", photoUrl: "", isActive: true, isAdmin: true, isVerified: true, createdAt: "", updatedAt: ""});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [recurringErrors, setRecurringErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<FormDataProps>({ accountId: account?.accountId, categoryId: "", amount: "", description: "", date: "", type: "expense"});
    const {addToast} = useContext(ToastContext);
    const selectedTypeObject = typeOfCategory.find(item => item.value === formData.type);
    const displayValue = selectedTypeObject ? selectedTypeObject.dName : "";
    const [ categories, setCategories ] = useState<Category[]>([]);
    const selectedCategory = categories.find(cat => cat.categoryId === Number(formData.categoryId));
    const categoryDisplayValue = selectedCategory ? selectedCategory.name : 'Wybierz kategorię';
    const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    const recurringModalCloseButtonRef = useRef<HTMLButtonElement | null>(null);
    const [selectedTransactionOptions, setSelectedTransactionOptions] = useState<Transaction | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    const [recurringFormData, setRecurringFormData] = useState({
        accountId: account?.accountId,
        categoryId: "",
        amount: "",
        name: "",
        description: "",
        type: "expense" as 'expense' | 'income',
        frequency: "monthly" as FrequencyType,
        isTrue: true,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: ""
    });

    useEffect(() => {
        const htmlTag = document.body;
        const shouldBlockScroll = isLooking || isLoading;

        if (shouldBlockScroll) {
            htmlTag.style.overflow = 'hidden';
        } else {
            htmlTag.style.overflow = '';
        }

        return () => {
            htmlTag.style.overflow = ''; 
        };
    }, [isLooking, isLoading]);

    const periodOfTime = useMemo (() => {
        const daysDiff = differenceInDays(endDate, startDate);
        if (daysDiff === 0) return 'day';
        if (daysDiff === 6) return 'week';
        if (daysDiff >= 27 && daysDiff <= 30) return 'month';
        if (daysDiff >= 364) return 'year';

        return 'custom';
    }, [startDate, endDate]);

    const handleUserInfo = async () => {
        try {
            setIsLooking(true);
            const res = await api.get('/login-info');
            setUser(res.data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLooking(false);
        }
    }

    const handleChangeTime = (period: string) => {
        switch (period) {
            case 'today':
                setStartDate(startOfDay(new Date()));
                setEndDate(endOfDay(new Date()));
                break;
            case 'week':
                setStartDate(startOfWeek(new Date(),{ weekStartsOn: 1 }));
                setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
                break;
            case 'month':
                setStartDate(startOfMonth(new Date()));
                setEndDate(endOfMonth(new Date()));
                break;
            case 'year':
                setStartDate(startOfYear(new Date()));
                setEndDate(endOfYear(new Date()));
                break;
        }
    }

    const handleSetStartDate = (date: Date) => {
        if (date > endDate) {
            setEndDate(endOfDay(date));
        }
        setStartDate(startOfDay(date));
    }

    const handleSetEndDate = (date: Date) => {
        if (startDate && date < startDate) {
            setStartDate(startOfDay(date));
        }
        setEndDate(endOfDay(date));
    }
    
    const handleShift = (i: number) => {

        switch (periodOfTime) {
            case 'day':
                {
                    const newDate = addDays(startDate, i);
                    setStartDate(startOfDay(newDate));
                    setEndDate(endOfDay(newDate));
                }
                break;
            case 'week':
                {
                    const newDate = addWeeks(startDate, i);
                    setStartDate(startOfWeek(newDate, {weekStartsOn: 1}));
                    setEndDate(endOfWeek(newDate, {weekStartsOn: 1}));
                }
                break;
            case 'month':
                {
                    const newDate = addMonths(startDate, i);
                    setStartDate(startOfMonth(newDate));
                    setEndDate(endOfMonth(newDate));
                }
                break;
            case 'year':
                {
                    const newDate = addYears(startDate, i);
                    setStartDate(startOfYear(newDate));
                    setEndDate(endOfYear(newDate));
                }
                break;
            case 'custom':
                {
                    const diff = differenceInDays(endDate, startDate) + 1;
                    setStartDate(addDays(startDate, diff * i));
                    setEndDate(addDays(endDate, diff * i));
                }
                break;
        }
    }

    const handleCurrencyFormatting = (balance: number, format: string) => {
        return  new Intl.NumberFormat(navigator.language, { style: "currency", currency: format, useGrouping: true }).format(balance)
    }

    const validateForm = () => {
        const err: {[key: string] : string} = {};

        if (formData.amount.trim().length == 0) {
            err.amount = 'Proszę wprowadzić kwotę'
        } else if (!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(formData.amount)) {
            err.amount = 'Kwota musi być wpisana w formacie 00000.00'
        }

        if (formData.type.trim().length == 0) {
            err.type = 'Proszę wybrać odpowiedni typ transakcji'
        }
            
        const hasCategory = formData.categoryId && formData.categoryId.trim().length > 0 && formData.categoryId !== '0';
        const hasDescription = formData.description && formData.description.trim().length > 0;

        if (!hasCategory && hasDescription) {
            const descriptionLower = formData.description.toLowerCase();

            const foundKeyword = categories.some(cat => 
                cat.keyWords.some(kw => 
                    descriptionLower.includes(kw.word.toLowerCase())
                )
            );

            if (!foundKeyword) {
                err.description = 'Opis nie zawiera słowa kluczowego przypisanego dla kategorii!';
            }
        }
        
        if (!hasCategory && !hasDescription) {
            err.categoryId = 'Wybierz kategorię lub uzupełnij opis';
            err.description = 'Wybierz kategorię lub uzupełnij opis';
        }
        
        if (formData.description.trim().length > 30) {
            err.description = 'Opis musi być krótszy niż 30 znaków'
        }

        if (formData.date.trim().length == 0) {
            err.date = 'Data musi być wybrana'
        }
    
        setErrors(err);
    
        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const validateRecurringForm = () => {
        const err: { [key: string]: string } = {};

        if (recurringFormData.amount.trim().length === 0) {
            err.amount = 'Proszę wprowadzić kwotę';
        } else if (!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(recurringFormData.amount)) {
            err.amount = 'Kwota musi być wpisana w formacie 00000.00';
        }

        if (recurringFormData.type.trim().length === 0) {
            err.type = 'Proszę wybrać odpowiedni typ transakcji';
        }

        if (!recurringFormData.categoryId || recurringFormData.categoryId === '0') {
            err.categoryId = 'Proszę wybrać kategorię';
        }

        if (!recurringFormData.name.trim()) {
            err.name = 'Proszę podać nazwę transakcji cyklicznej';
        }

        if (recurringFormData.name.trim().length > 50) {
            err.name = 'Nazwa musi być krótsza niż 50 znaków';
        }

        if (recurringFormData.description.trim().length > 100) {
            err.description = 'Opis musi być krótszy niż 100 znaków';
        }

        if (!recurringFormData.startDate) {
            err.startDate = 'Proszę wybrać datę rozpoczęcia';
        }

        if (recurringFormData.endDate && recurringFormData.startDate) {
            const start = new Date(recurringFormData.startDate);
            const end = new Date(recurringFormData.endDate);
            if (end <= start) {
                err.endDate = 'Data zakończenia musi być późniejsza niż data rozpoczęcia';
            }
        }

        setRecurringErrors(err);

        return Object.keys(err).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name as keyof  FormDataProps;
        const {value} = e.currentTarget;

        const nextData = {...formData, [name]: value};

        if (name == 'type') {
            nextData.categoryId = '';
        }

        setFormData(nextData);

        const { [name]: _ , ...remainingErrors } = errors;
        if (name == 'type') {
            delete remainingErrors.categoryId;
        }
        setErrors(remainingErrors);
    }

    const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name;
        const { value } = e.currentTarget;

        const nextData = { ...recurringFormData, [name]: value };

        if (name === 'type') {
            nextData.categoryId = '';
        }

        setRecurringFormData(nextData);

        const { [name]: _ , ...remainingErrors } = recurringErrors;
        if (name === 'type') {
            delete remainingErrors.categoryId;
        }
        setRecurringErrors(remainingErrors);
    };

    const handleClearFormData = () => {
        setFormData({accountId: account?.accountId, categoryId: "", amount: "", description: "", date: "", type: "expense"});
    }

    const handleClearRecurringFormData = () => {
        setRecurringFormData({
            accountId: account?.accountId,
            categoryId: "",
            amount: "",
            name: "",
            description: "",
            type: "expense",
            frequency: "monthly",
            isTrue: true,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: ""
        });
        setRecurringErrors({});
    };

    const handleAddTransaction = async () => {
        try {
            setIsLooking(true);
            await api.post('/create-new-transaction', {
                "accountId": account?.accountId,
                "categoryId": parseInt(formData.categoryId, 10),
                "amount": parseFloat(formData.amount),
                "description": formData.description,
                "type": formData.type as 'expense' | 'income'
            });
            addToast('Utworzono transakcje', 'info');
            handleClearFormData();
            modalCloseButtonRef.current?.click();
            handleFetchTransactions();
            handleRefreshData();
        } catch (error: any) {
            if (error.response) {
                console.log("Dane błędu:", error.response.data);
                console.log("Status błędu:", error.response.status);
            } else if (error.request) {
                console.log("Brak odpowiedzi od serwera:", error.request);
            } else {
                console.log("Błąd konfiguracji:", error.message);
            }
        } finally {
            setIsLooking(false);
        }
    }

    const frequencyOptions = [
        { dName: 'Codziennie', value: 'daily' },
        { dName: 'Co tydzień', value: 'weekly' },
        { dName: 'Co miesiąc', value: 'monthly' },
        { dName: 'Co rok', value: 'yearly' }
    ];

    const handleAddRecurringTransaction = async () => {
        try {
            setIsLooking(true);

            const startDateTime = `${recurringFormData.startDate}T00:00:00.000Z`;
            const endDateTime = recurringFormData.endDate 
                ? `${recurringFormData.endDate}T23:59:59.999Z`
                : null;

            await api.post('/create-new-rec-transaction', {
                accountId: recurringFormData.accountId,
                categoryId: parseInt(recurringFormData.categoryId, 10),
                amount: parseFloat(recurringFormData.amount),
                name: recurringFormData.name,
                description: recurringFormData.description,
                type: recurringFormData.type,
                frequency: recurringFormData.frequency,
                isTrue: true,
                startDate: startDateTime,
                endDate: endDateTime,
                nextPaymentDate: startDateTime
            });
            
            addToast('Utworzono transakcję cykliczną', 'info');
            handleClearRecurringFormData();
            recurringModalCloseButtonRef.current?.click();
            handleRefreshData();
        } catch (error: any) {
            addToast('Nie udało się utworzyć transakcji cyklicznej', 'error');
            console.error('Error creating recurring transaction:', error.response?.data || error.message);
        } finally {
            setIsLooking(false);
        }
    };

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();
    
        if (validateForm()) {
            if (selectedTransactionOptions) {
                handleEditTransaction();
            } else {
                handleAddTransaction();
            }
        }
    }

    const handleValidateRecurringForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateRecurringForm()) {
            handleAddRecurringTransaction();
        }
    };

    const handleFetchCategories = async () => {
        try {
            setIsLooking(true);
            const res = await api.get('/categories-info');
            setCategories(res.data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLooking(false);
        }
    }

    const handleGroupCategories = (t: string) => {
        const groupedCategories = categories.reduce((categoriesGroup, element) => {
            if (element.type == t) {
                const newItem = {
                    dName: element.name, 
                    value: element.categoryId
                }
                categoriesGroup = [...categoriesGroup, newItem]
            }
            return categoriesGroup;
        }, [] as SelectItem[]);
        return groupedCategories;
    }

    const handleBalanceFormatting = (str: string) => {
        const parsedValue = parseFloat(str);
        if (isNaN(parsedValue)) {
            return;
        }
        setFormData({
            ...formData,
            amount: parsedValue.toFixed(2)
        });
    }

    const handleRecurringBalanceFormatting = (str: string) => {
        const parsedValue = parseFloat(str);
        if (isNaN(parsedValue)) {
            return;
        }
        setRecurringFormData({
            ...recurringFormData,
            amount: parsedValue.toFixed(2)
        });
    };

    
    const openOptionsModal = (t: Transaction) => {
        setIsClosing(false);
        setIsConfirmingDelete(false)
        setSelectedTransactionOptions(t);
    }

    const closeOptionsModal = () => {
        setIsClosing(true);
        handleClearFormData();

        setTimeout(() => {
            setSelectedTransactionOptions(null);
            setIsClosing(false);
            setIsConfirmingDelete(false)
        }, 300);
    }

    const handleDeleteTransaction = async () => {
        if (!selectedTransactionOptions) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true)
            return;
        }

        try {
            setIsDeleting(true);
            await api.delete(`/delete-transaction`, {
                 params: {
                    'transactionId': selectedTransactionOptions.transactionId,
                    'accountId': account?.accountId,
                } 
            });
            
            handleFetchTransactions();
            handleRefreshData();
            addToast('Transakcja została usunięta pomyślnie', 'info');
            closeOptionsModal();
        } catch (error: any) {
            addToast('Nie udało się usunąć transakcji', 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleFillEditForm = () => {
        const newItem: FormDataProps = {
            ['accountId']: account?.accountId,
            ['categoryId']: String(selectedTransactionOptions?.category.categoryId),
            ['amount']: String(selectedTransactionOptions?.amount),
            ['description']: selectedTransactionOptions?.description || '',
            ['type']: (selectedTransactionOptions?.category.type || 'expense') as 'expense' | 'income'
            
        }
        setFormData({...formData, ...newItem});
    }

    const handleEditTransaction = async () => {
        try {
            setIsLooking(true);
            await api.patch('/update-transaction', {
                transactionId: selectedTransactionOptions?.transactionId,
                accountId: account?.accountId,
                newCategoryId: parseInt(formData.categoryId,10),
                newAmount: parseFloat(formData.amount),
                newDescription: formData.description,
                newType: formData.type,
                newDate: new Date().toISOString(),
            });
            addToast('Edytowano transakcje', 'info');
            handleClearFormData();
            modalCloseButtonEditFormRef.current?.click();
            handleFetchTransactions();
            handleRefreshData();
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLooking(false);
        }
    }

    useEffect(() => {
        if(viewMode == 'expense') {
            setIsExpense(true);
        } else {
            setIsExpense(false);
        }
    },[viewMode])

    useEffect(() => {
        handleUserInfo();
        handleFetchCategories();
    },[]);

    const totalSum = useMemo(() => {
        return transactions.reduce((acc, t) => acc + t.amount, 0)
    }, [transactions]);

    const pieData = useMemo(() => {
        const raw = transactions.reduce((piggyBank, element) => {
            if (!piggyBank[element.category.name]){
                piggyBank[element.category.name] = {sum: element.amount, color: element.category.color};
            } else {
                piggyBank[element.category.name]['sum'] += element.amount;
            }
            return piggyBank;
        }, {} as Record<string, {sum: number, color: string}>);

        const entries = Object.entries(raw);

        const finalData = entries.map(([name, {sum, color}], index) => {
            return {
                id: index,
                value: sum,
                label: name,
                color: color
            }
        });

        return finalData;
    },[transactions])


    return (
        <>
            <div className='row w-100 mx-auto'>
                <SidebarControl userName={user?.firstName} balance={handleCurrencyFormatting(account?.balance || 0, account?.currencyCode || 'PLN')} totalAmount={handleCurrencyFormatting(totalSum || 0, account?.currencyCode || 'PLN')} isExpense={isExpense} onPeriodChange={handleChangeTime} startDate={format(startDate, 'yyyy-MM-dd')} endDate={format(endDate, 'yyyy-MM-dd')} setStartDate={handleSetStartDate} setEndDate={handleSetEndDate} setPeriodOfTime={handleShift} />
                <MainDisplay transactions={transactions} isLoading={isLoading} date={currentPeriod} currency={account?.currencyCode} pieData={pieData} showModal={(t) => openOptionsModal(t)} />
            </div>
            <div className="modal fade" id="addTransactionModal" tabIndex={-1} aria-labelledby="addTransactionModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <form onSubmit={handleValidateForm}>
                            <div className="modal-header border-0">
                                <span className={`modal-title fs-5 fw-bold ${sDashboard.textDarkPrimary}`} id="addTransactionModalLabel">Dodawanie transakcji</span>
                            </div>
                            <div className="modal-body py-0">
                                <Input id={'amount'} divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} name={'amount'} label={'Kwota'} value={formData.amount} onChange={handleChange} error={errors.amount} onBlur={() => handleBalanceFormatting(formData.amount)} />
                                <CustomSelect table={typeOfCategory} isLoading={isLooking} label='Typ' name={'type'} selected={displayValue} onChange={handleChange} error={errors.type}/>
                                <CustomSelect table={handleGroupCategories(formData.type)} isLoading={isLooking} label='Kategorie' name={'categoryId'} selected={categoryDisplayValue} onChange={handleChange} error={errors.categoryId} />
                                
                                <div  className='mb-3'>
                                    <label htmlFor="disabledTextInput" className={`form-label ${sDashboard.textDarkSecondary} fw-bold small`}>Data</label>
                                    <input className={`form-control px-3 py-2 rounded-5 ${s.date} ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.borderDarkEmphasis}`} value={formData.date} name='date' type="date" onChange={handleChange}/>
                                    <div className="invalid-feedback ps-2 opacity-100">{errors.date ? errors.date : ''}</div>
                                </div>
                                <Input id={'description'} divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} name={'description'} label={'Opis'} value={formData.description} onChange={handleChange} error={errors.description} />
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <button type="submit" className="btn btn-primary w-100 fw-bold rounded-5" disabled={isLooking || isLoading}>Dodaj</button>
                                <button type="button" className="btn btn-outline-primary rounded-5 w-100" data-bs-dismiss="modal" ref={modalCloseButtonRef}>Zamknij</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {selectedTransactionOptions && (
                <div 
                    className={`${s.modalOverlay} ${isClosing ? s.modalOverlayClosing : ''}`} 
                    onClick={!isClosing ? closeOptionsModal : undefined}
                >
                    <div 
                        className={`${s.bottomSheet} ${isClosing ? s.bottomSheetClosing : ''} ${sDashboard.bgDarkSecondary} border-top ${sDashboard.borderDarkEmphasis} p-4`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className={sDashboard.textDarkPrimary}>Zarządzanie Transakcją</h4>
                            <button type="button" className="btn-close btn-close-white" onClick={closeOptionsModal}></button>
                        </div>

                        <div className="text-center mb-4">
                            <h5 className="text-white mb-2">Wybrana transakcja:</h5>
                            <h3 className="text-white fw-bold"><i className={`bi ${selectedTransactionOptions.category.icon}`}></i> {selectedTransactionOptions.category.name}</h3>
                            <p className="text-gradient fw-bold fs-4">
                                {handleCurrencyFormatting(selectedTransactionOptions.amount, account?.currencyCode || 'PLN')}
                            </p>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                className="btn btn-outline-danger btn-lg rounded-5 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleDeleteTransaction}
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
                                        Usuń trwale tą transakcje
                                    </>
                                )}
                                
                            </button>

                            <button 
                                className={`btn btn-outline-primary btn-lg rounded-5 mt-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#editTransactionModal"
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
            <div className="modal fade" id="editTransactionModal" tabIndex={-1} aria-labelledby="editTransactionModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <form onSubmit={handleValidateForm}>
                            <div className="modal-header border-0">
                                <span className={`modal-title fs-5 fw-bold ${sDashboard.textDarkPrimary}`} id="editTransactionModalLabel">Edytowanie transakcji</span>
                            </div>
                            <div className="modal-body py-0">
                                <Input id={'amount'} divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} name={'amount'} label={'Kwota'} value={formData.amount} onChange={handleChange} error={errors.amount} onBlur={() => handleBalanceFormatting(formData.amount)} />
                                <CustomSelect table={typeOfCategory} isLoading={isLooking} label='Typ' name={'type'} selected={displayValue} onChange={handleChange} error={errors.type} />
                                <CustomSelect table={handleGroupCategories(formData.type)} isLoading={isLooking} label='Kategorie' name={'categoryId'} selected={categoryDisplayValue} onChange={handleChange} error={errors.categoryId} />
                                <Input id={'description'} divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} name={'description'} label={'Opis'} value={formData.description} onChange={handleChange} error={errors.description} />
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <button type="submit" className="btn btn-primary w-100 fw-bold rounded-5" disabled={isLooking || isLoading}>Edytuj</button>
                                <button type="button" className="btn btn-outline-primary rounded-5 w-100" data-bs-dismiss="modal" ref={modalCloseButtonEditFormRef}>Zamknij</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="addRecTransactionModal" tabIndex={-1} aria-labelledby="addRecTransactionModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <form onSubmit={handleValidateRecurringForm}>
                            <div className="modal-header border-0">
                                <span className={`modal-title fs-5 fw-bold ${sDashboard.textDarkPrimary}`}>
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Dodawanie transakcji cyklicznej
                                </span>
                            </div>
                            
                            <div className="modal-body py-0">
                                <Input 
                                    id={'rec-amount'} 
                                    divClass={sDashboard.textDarkSecondary} 
                                    inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} 
                                    name={'amount'} 
                                    label={'Kwota'} 
                                    value={recurringFormData.amount} 
                                    onChange={handleRecurringChange}
                                    error={recurringErrors.amount}
                                    onBlur={() => handleRecurringBalanceFormatting(recurringFormData.amount)}
                                />

                                <CustomSelect 
                                    table={typeOfCategory} 
                                    isLoading={isLooking} 
                                    label='Typ' 
                                    name={'type'} 
                                    selected={typeOfCategory.find(t => t.value === recurringFormData.type)?.dName || ''} 
                                    onChange={handleRecurringChange}
                                    error={recurringErrors.type}
                                />

                                <CustomSelect 
                                    table={handleGroupCategories(recurringFormData.type)} 
                                    isLoading={isLooking} 
                                    label='Kategoria' 
                                    name={'categoryId'} 
                                    selected={categories.find(c => c.categoryId === Number(recurringFormData.categoryId))?.name || 'Wybierz kategorię'} 
                                    onChange={handleRecurringChange}
                                    error={recurringErrors.categoryId}
                                />

                                <Input 
                                    id={'rec-name'} 
                                    divClass={sDashboard.textDarkSecondary} 
                                    inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} 
                                    name={'name'} 
                                    label={'Nazwa transakcji cyklicznej'} 
                                    value={recurringFormData.name} 
                                    onChange={handleRecurringChange}
                                    error={recurringErrors.name}
                                />

                                <Input 
                                    id={'rec-description'} 
                                    divClass={sDashboard.textDarkSecondary} 
                                    inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} 
                                    name={'description'} 
                                    label={'Opis (opcjonalny)'} 
                                    value={recurringFormData.description} 
                                    onChange={handleRecurringChange}
                                    error={recurringErrors.description}
                                />

                                <CustomSelect 
                                    table={frequencyOptions} 
                                    isLoading={isLooking} 
                                    label='Częstotliwość' 
                                    name={'frequency'} 
                                    selected={frequencyOptions.find(f => f.value === recurringFormData.frequency)?.dName || ''} 
                                    onChange={handleRecurringChange}
                                />

                                <div className="mb-3">
                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>
                                        Data rozpoczęcia
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        className={`form-control rounded-4 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis} ${recurringErrors.startDate ? 'is-invalid' : ''}`}
                                        value={recurringFormData.startDate}
                                        onChange={handleRecurringChange}
                                    />
                                    {recurringErrors.startDate && (
                                        <div className="invalid-feedback d-block">
                                            {recurringErrors.startDate}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className={`form-label fw-bold small ${sDashboard.textDarkSecondary}`}>
                                        Data zakończenia (opcjonalna)
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className={`form-control rounded-4 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis} ${recurringErrors.endDate ? 'is-invalid' : ''}`}
                                        value={recurringFormData.endDate}
                                        onChange={handleRecurringChange}
                                        min={recurringFormData.startDate}
                                    />
                                    {recurringErrors.endDate && (
                                        <div className="invalid-feedback d-block">
                                            {recurringErrors.endDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer justify-content-center border-0">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 fw-bold rounded-5" 
                                    disabled={isLooking || isLoading}
                                >
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Utwórz transakcję cykliczną
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-primary rounded-5 w-100" 
                                    data-bs-dismiss="modal"
                                    ref={recurringModalCloseButtonRef}
                                >
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isLooking && <div className='position-fixed top-0 start-0 w-100 vh-100 z-3 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center overflow-hidden'>
                <div className="spinner-border text-dark fs-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
        </>
    );
};

export default DashboardHomePage;