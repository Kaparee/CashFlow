import axios from 'axios'
import {useState, useEffect} from 'react'

interface CurrencySelectProps {
    currency: string;
    code: string;
}

const CurrencyPlaceHolder: CurrencySelectProps[] = [
    {
        currency: 'Polski Złoty',
        code: 'PLN'
    },
    {
        currency: 'Dollar',
        code: 'USD'
    },
    {
        currency: 'Euro',
        code: 'EUR'
    }
]

export const useCurrencySelect = () => {

    const [currencies, setCurrencies] = useState<CurrencySelectProps[]>(CurrencyPlaceHolder);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleGetCurrency = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5205/api/NBP',{}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCurrencies(res.data);
        } catch (error: any) {
            console.log('Błąd serwera' + error.message)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        handleGetCurrency();
    },[]);

    return {currencies, isLoading};

}