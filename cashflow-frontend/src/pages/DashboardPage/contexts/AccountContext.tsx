import React, { useState } from 'react'

interface AccountContextProps {
    accountId: number;
    name: string;
    balance: number;
    currencyCode: string;
    photoUrl: string;
}

interface AccountContextType {
    account: AccountContextProps | null;
    setAccount: (acc: AccountContextProps | null) => void;
}

interface AccountProviderProps {
    children: React.ReactNode;
}

export const AccountContext = React.createContext<AccountContextType | undefined>(undefined);

const AccountProvider: React.FC<AccountProviderProps> = ({children}) => {
    const [ account, setAccountState] = useState<AccountContextProps | null>(() => {
        const savedAccount = localStorage.getItem('selectedAccount');
        return savedAccount ? JSON.parse(savedAccount) : null
    }) 

    const setAccount = (acc: AccountContextProps | null) => {
        setAccountState(acc)
        if (acc) {
            localStorage.setItem('selectedAccount', JSON.stringify(acc));
        } else {
            localStorage.removeItem('selectedAccount');
        }
    }
    
    return (
        <AccountContext.Provider value={{account, setAccount}}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountProvider

export const useAccount = () => {
    const context = React.useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};