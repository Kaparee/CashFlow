import {useState, useEffect, useContext} from 'react'
import { ToastContext } from '../../../contexts/ToastContext';
import api from '../../../api/api';

interface CurrencySelectProps {
    currencyCode: string;
    name: string;
    symbol: string;
}

const CurrencyPlaceHolder: CurrencySelectProps[] = [
    {
        currencyCode: 'PLN',
        name: 'Polski Złoty',
        symbol: 'zł'
    },
    {
        currencyCode: 'USD',
        name: 'Dollar',
        symbol: '$'
    },
    {
        currencyCode: 'EUR',
        name: 'Euro',
        symbol: '€'
    }
]

export const useCurrencySelect = () => {

    const [currencies, setCurrencies] = useState<CurrencySelectProps[]>(CurrencyPlaceHolder);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);

    const handleGetCurrency = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/currencies-info');
            setCurrencies(res.data);
        } catch (error: any) {
            addToast('Nie udało się załadować aktualnych walut, korzystasz z wersji offline', 'error')
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        handleGetCurrency();
    },[]);

    return {currencies, isLoading};

}