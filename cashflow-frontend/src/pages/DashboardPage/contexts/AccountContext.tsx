import React, { useEffect, useCallback, useState, useRef } from 'react'
import api from '../../../api/api';
import { useLocation } from 'react-router-dom';

export interface AccountContextProps {
    accountId: number;
    name: string;
    balance: number;
    currencyCode: string;
    photoUrl: string;
}

interface AccountContextType {
    account: AccountContextProps | null;
    setAccount: (acc: AccountContextProps | null) => void;
    handleRefreshData: () => Promise<void>;
}

interface AccountProviderProps {
    children: React.ReactNode;
}

const fetchAccountsData = async (): Promise<AccountContextProps[] | null> => {
    try {
        const res = await api.get('/accounts-info');
        return res.data;
    } catch (error: any) {
        console.log(error.message);
         return null;
    }
}

export const AccountContext = React.createContext<AccountContextType | undefined>(undefined);

const AccountProvider: React.FC<AccountProviderProps> = ({children}) => {
    const location = useLocation();
    const accountRef = useRef<number | undefined>(undefined);

    const [ account, setAccountState] = useState<AccountContextProps | null>(() => {
        const savedAccount = localStorage.getItem('selectedAccount');
        return savedAccount ? JSON.parse(savedAccount) : null
    }) 

    const setAccount = useCallback((acc: AccountContextProps | null) => {
        setAccountState(acc)
        if (acc) {
            localStorage.setItem('selectedAccount', JSON.stringify(acc));
        } else {
            localStorage.removeItem('selectedAccount');
        }
    },[]);

    const handleRefreshData = useCallback(async (): Promise<void> => {
        const freshAccounts = await fetchAccountsData();
        if (freshAccounts) {
            const currentId = accountRef.current;
            const found = freshAccounts.find(item => item.accountId === currentId);
            setAccount(found || null);
        }
    },[setAccount]);

    useEffect(() => {
        if (location.pathname === '/dashboard/accounts' || location.pathname === '/dashboard' ||  location.pathname === '/dashboard/dashboard-home-page') {
            handleRefreshData();
        }
    },[location, handleRefreshData])

    useEffect(() => {
        accountRef.current = account?.accountId;
    }, [account])
    
    return (
        <AccountContext.Provider value={{account, setAccount, handleRefreshData}}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountProvider;

export const useAccount = () => {
    const context = React.useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};