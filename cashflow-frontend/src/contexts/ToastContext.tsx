import React, { useState } from 'react'

interface Toast {
    id: number;
    message: string;
    type: 'error' | 'info';
    source?: string;
}

interface ToastContext {
    toast: Toast[];
    setToast: (tt: Toast[]) => void;
    addToast: (message: string, type: 'error' | 'info', source?: string) => void;
    removeToast: (id: number) => void;
}

interface ToastProvider {
    children: React.ReactNode;
}


export const ToastContext = React.createContext<ToastContext>({toast: [], setToast: () => {}, addToast: () => {}, removeToast: () => {}});

const ToastProvider: React.FC<ToastProvider> = ({children}) => {

    const [toast, setToast] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'error' | 'info', source?: string) => {
        const id = Date.now();
        const newToast: Toast = {id, message, type, source};

        setToast((prevToasts) => [...prevToasts, newToast]);
        setTimeout(() => {
            removeToast(id)
        },5000);
    };
    const removeToast = (id: number) => {
        setToast((prevToasts) => prevToasts.filter(toast => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{toast, setToast, addToast, removeToast}}>
            {children}
        </ToastContext.Provider>
    )
};

export default ToastProvider;