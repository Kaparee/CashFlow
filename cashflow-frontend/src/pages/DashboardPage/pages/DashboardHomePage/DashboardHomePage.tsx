import React, { useEffect, useMemo, useState } from 'react'
import s from './DashboardHomePage.module.css'
import sDashboard from '../../DashboardPage.module.css'
import SidebarControl from '../../components/HomePage/SidebarControl/SidebarControl';
import MainDisplay from '../../components/HomePage/MainDisplay/MainDisplay';
import { useSearchParams } from 'react-router-dom';
import { format, formatDistance, formatRelative, subDays, startOfDay, endOfDay, startOfDecade, startOfToday, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns'
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
            default:

        }
    }

    const handleSetStartDate = (date: Date) => {
        setStartDate(startOfDay(date));
    }

    const handleSetEndDate = (date: Date) => {
        setEndDate(endOfDay(date));
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


    return (
        <div className='row w-100 mx-auto'>
            <SidebarControl userName={user?.firstName} balance={account?.balance} totalAmount={totalSum} isExpense={isExpense} onPeriodChange={handleChangeTime} startDate={format(startDate, 'yyyy-MM-dd')} endDate={format(endDate, 'yyyy-MM-dd')} setStartDate={handleSetStartDate} setEndDate={handleSetEndDate} />
            <MainDisplay transactions={transactions} isLoading={isLoading} date={currentPeriod} currency={account?.currencyCode} />
        </div>
    );
};

export default DashboardHomePage;