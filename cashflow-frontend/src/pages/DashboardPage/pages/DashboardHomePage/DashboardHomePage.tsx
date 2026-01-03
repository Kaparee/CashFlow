import React, { useEffect, useMemo, useState } from 'react'
import s from './DashboardHomePage.module.css'
import sDashboard from '../../DashboardPage.module.css'
import SidebarControl from '../../components/HomePage/SidebarControl/SidebarControl';
import MainDisplay from '../../components/HomePage/MainDisplay/MainDisplay';
import { useSearchParams } from 'react-router-dom';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears, differenceInDays} from 'date-fns'
import { pl } from 'date-fns/locale';
import { useTransactions } from '../../hooks/useTransactions';
import { AccountContext, useAccount } from '../../contexts/AccountContext';
import api from '../../../../api/api';

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


const DashboardHomePage: React.FC = () => {
    const [ isExpense, setIsExpense ] = useState<boolean>(true);
    const { account } = useAccount();
    const [searchParams] = useSearchParams();
    const viewMode = searchParams.get('type') || 'expense';
    const [ startDate, setStartDate ] = useState<Date>(startOfDay(new Date()));
    const [ endDate, setEndDate ] = useState<Date>(endOfDay(new Date()));
    const {transactions, isLoading} = useTransactions(account?.accountId, startDate, endDate, isExpense);
    const currentPeriod = `${format(startDate,'dd.MM.yyyy')} - ${format(endDate,'dd.MM.yyyy')}`;
    const [ isLooking, setIsLooking] = useState<boolean>(true);
    const [ user, setUser] = useState<User>({userId: 0, firstName: "", lastName: "", nickname: "", email: "", photoUrl: "", isActive: true, isAdmin: true, isVerified: true, createdAt: "", updatedAt: ""});

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

    useEffect(() => {
        if(viewMode == 'expense') {
            setIsExpense(true);
        } else {
            setIsExpense(false);
        }
    },[viewMode])

    useEffect(() => {
        handleUserInfo();
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
        <div className='row w-100 mx-auto'>
            <SidebarControl userName={user?.firstName} balance={handleCurrencyFormatting(account?.balance || 0, account?.currencyCode || 'PLN')} totalAmount={handleCurrencyFormatting(totalSum || 0, account?.currencyCode || 'PLN')} isExpense={isExpense} onPeriodChange={handleChangeTime} startDate={format(startDate, 'yyyy-MM-dd')} endDate={format(endDate, 'yyyy-MM-dd')} setStartDate={handleSetStartDate} setEndDate={handleSetEndDate} setPeriodOfTime={handleShift} />
            <MainDisplay transactions={transactions} isLoading={isLoading} date={currentPeriod} currency={account?.currencyCode} pieData={pieData} />
        </div>
    );
};

export default DashboardHomePage;