import { useEffect, useMemo, useState } from 'react'
import api from '../../../api/api'

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

export const useTransactions = (accId: number | undefined, startDate: Date, endDate: Date, isExpense: boolean) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ allTransactions, setAllTransactions ] = useState<Transaction[]>([]);

    const handleFetchTransactions = async () => {
        try {
            if (accId == undefined) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const res = await api.get('/transactions-info', {
                params: {
                    accountId: accId
                }
            });

            const mappedData = res.data.map((t: any) => ({
                ...t, 
                date: new Date(t.date)
            }));

            setAllTransactions(mappedData);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const transactions = useMemo(() => {
        return allTransactions.filter(t => t.date >= startDate && t.date <= endDate && t.type == (isExpense ? 'expense': 'income'));

    },[startDate, endDate, allTransactions, isExpense]);

    useEffect(() => {
        setAllTransactions([]);
        handleFetchTransactions();
    },[accId]);

    return {transactions, isLoading, handleFetchTransactions};
}
