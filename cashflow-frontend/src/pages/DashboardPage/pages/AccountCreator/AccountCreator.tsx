import React, { use, useState } from 'react'
import sDashboard from '../../DashboardPage.module.css'
import Input from '../../../../components/UI/Input/Input'
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrencySelect } from '../../hooks/useCurrencySelect';
import CurrencySelect from '../../components/UI/CurrencySelect/CurrencySelect';
import s from './AccountCreator.module.css'

const AccountCreator: React.FC = () => {
    const location = useLocation();
    const previousPath = location.state?.from || '/dashboard'; 
    const {currencies, isLoading} = useCurrencySelect();
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ [key: string]: string }>({ name: "", balance: "", photoUrl: ""});
    
    const iconsList = ['bi-cash', 'bi-cash-stack', 'bi-wallet', 'bi-wallet2', 'bi-wallet-fill', 'bi-cash-coin', 'bi-bank', 'bi-bank2', 'bi-coin', 'bi-piggy-bank', 'bi-piggy-bank-fill', 'bi-safe', 'bi-safe-fill', 'bi-safe2', 'bi-safe2-fill', 'bi-currency-bitcoin', 'bi-basket3-fill', 'bi-currency-dollar', 'bi-currency-euro', 'bi-currency-exchange', 'bi-currency-pound', 'bi-currency-rupee', 'bi-currency-yen', 'bi-credit-card', 'bi-credit-card-2-back', 'bi-credit-card-2-back-fill', 'bi-credit-card-2-front', 'bi-credit-card-2-front-fill', 'bi-credit-card-fill']; 

    const validateForm = () => {
            const err: {[key: string] : string} = {}

            if (formData.name.trim().length == 0) {
                err.name = 'Proszę wpisać nazwe'
            } else if (formData.name.trim().length > 30) {
                err.name = 'Nazwa musi być krótsz niż 30 znaków'
            }

            if (formData.balance.trim().length == 0) {
                err.balance = 'Proszę wprowadzić bazową kwotę'
            } else if (BigInt(formData.balance.trim()) < 0 ) {
                err.balance = 'Kwota nie może być mniejsza od 0'
            }
            
            if (formData.currencyCode.trim().length == 0) {
                err.currencyCode = 'Proszę wybrać odpowiednia walutę'
            }

            setErrors(err);
    
            if (Object.keys(err).length === 0) {
                return true;
            } else {
                return false;
            }
        }
        const routeChange = (path: string) => {
            navigate(path);
        } 
        const handleValidateForm = (e: React.FormEvent) => {
            e.preventDefault();
    
            if (validateForm()) {
                routeChange(previousPath);
            }
        }
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }


    return (
        <>
            <div className='row flex-grow-1 justify-content-center'>
                <div className={`rounded-5 col-6 d-flex flex-column p-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark} border ${sDashboard.borderDarkEmphasis}`}>
                    <form className='text-center' onSubmit={handleValidateForm}>
                        <div className={`fs-3 fw-bold ${sDashboard.textDarkPrimary}`}>Dodaj konto</div>
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='name' name='name' label='Nazwa' type='text' value={formData.name} onChange={handleChange} error={errors.name} />
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} id='balance' name='balance' label='Kwota' type='text' value={formData.balance} onChange={handleChange} error={errors.balance} />
                        <CurrencySelect currencies={currencies} isLoading={isLoading} selected={selectedCurrency} onChange={setSelectedCurrency}/>
                        <div className={`rounded-5 p-3 mb-3 ${sDashboard.bgDarkPrimary}`}>
                            {iconsList.map((icon, index) => (
                                <button key={index} type='button' className={`btn bg-transparent m-1 ${s.btnIcons}`}>
                                    <i className={`bi fs-4 ${icon}`}></i>
                                </button>
                            ))}
                        </div>
                        <button type='submit' className={`btn ${sDashboard.btnDarkOutlineAccentPrimary} py-2 px-4 rounded-5`}>
                            Dodaj
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccountCreator;