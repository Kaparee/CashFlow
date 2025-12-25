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
    const [ account, setAccount] = useState<AccountContextProps | null>(null) 
    
    return (
        <AccountContext.Provider value={{account, setAccount}}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountProvider