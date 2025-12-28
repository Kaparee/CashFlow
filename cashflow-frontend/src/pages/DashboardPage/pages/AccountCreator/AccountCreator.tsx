import React, { useState, useContext } from 'react'
import sDashboard from '../../DashboardPage.module.css'
import Input from '../../../../components/UI/Input/Input'
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrencySelect } from '../../hooks/useCurrencySelect';
import CurrencySelect from '../../components/UI/CurrencySelect/CurrencySelect';
import s from './AccountCreator.module.css'
import { ToastContext } from '../../../../contexts/ToastContext';
import api from '../../../../api/api';

interface FormDataProps {
    name: string;
    balance: string;
    currency: string;
    photoUrl: string;
}

const iconsList = ['bi-cash', 'bi-cash-stack', 'bi-wallet', 'bi-wallet2', 'bi-wallet-fill', 'bi-cash-coin', 'bi-bank', 'bi-bank2', 'bi-coin', 'bi-piggy-bank', 'bi-piggy-bank-fill', 'bi-safe', 'bi-safe-fill', 'bi-safe2', 'bi-safe2-fill', 'bi-currency-bitcoin', 'bi-basket3-fill', 'bi-currency-dollar', 'bi-currency-euro', 'bi-currency-exchange', 'bi-currency-pound', 'bi-currency-rupee', 'bi-currency-yen', 'bi-credit-card', 'bi-credit-card-2-back', 'bi-credit-card-2-back-fill', 'bi-credit-card-2-front', 'bi-credit-card-2-front-fill', 'bi-credit-card-fill']; 

const AccountCreator: React.FC = () => {
    const location = useLocation();
    const previousPath = location.state?.from || '/dashboard'; 
    const {currencies, isLoading} = useCurrencySelect();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormDataProps>({ name: "", balance: "", currency: "", photoUrl: ""});
    const [isSending, setIsSending] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);
    
    const validateForm = () => {
            const err: {[key: string] : string} = {}

            if (formData.name.trim().length == 0) {
                err.name = 'Proszę wpisać nazwe'
            } else if (formData.name.trim().length > 30) {
                err.name = 'Nazwa musi być krótsza niż 30 znaków'
            }

            if (formData.balance.trim().length == 0) {
                err.balance = 'Proszę wprowadzić bazową kwotę'
            } else if (!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(formData.balance)) {
                err.balance = 'Kwota musi być wpisana w formacie 00000.00'
            }

            if (formData.currency.trim().length == 0) {
                err.currency = 'Proszę wybrać odpowiednią walutę konta'
            }
            
            if (formData.photoUrl.trim().length == 0) {
                err.photoUrl = 'Proszę wybrać ikonkę'
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

        const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
            const name = e.currentTarget.name as keyof  FormDataProps;
            const {value} = e.currentTarget;

            setFormData({ ...formData, [name]: value });
            
            const { [name]: _, ...remainingErrors } = errors;
            setErrors(remainingErrors);
        }

        const handleBalanceFormatting = (str: string) => {
            const parsedValue = parseFloat(str);
            if (isNaN(parsedValue)) {
                return;
            }
            setFormData({
                ...formData,
                balance: parsedValue.toFixed(2)
            });
        }

        const handleAddAccount = async () => {
            try{
                setIsSending(true);
                const res = await api.post('/create-new-account',{
                    "name": formData['name'],
                    "balance": parseFloat(parseFloat(formData['balance']).toFixed(2)),
                    "currencyCode": formData['currency'],
                    "photoUrl": formData['photoUrl']
                });
                addToast('Utworzono konto!', 'info');
                routeChange(previousPath);
            } catch (error: any) {
                if (error.message){
                    addToast('Coś poszło nie tak, spróbuj ponownie', 'error');
                }
            } finally {
                setIsSending(false);
            }
        }
        const handleValidateForm = (e: React.FormEvent) => {
            e.preventDefault();
    
            if (validateForm()) {
                handleAddAccount();
            }
        }


    return (
        <>
            <div className='row flex-grow-1'>
                <div className={`mx-auto my-auto rounded-5 col-11 col-md-6 d-flex flex-column p-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark} border ${sDashboard.borderDarkEmphasis}`}>
                    <form className='text-center' onSubmit={handleValidateForm}>
                        <div className={`fs-3 fw-bold ${sDashboard.textDarkPrimary}`}>Dodaj konto</div>
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='name' name='name' label='Nazwa' type='text' value={formData.name} onChange={handleChange} error={errors.name} />
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent} `} id='balance' name='balance' label='Kwota' type='text' value={formData.balance} onChange={handleChange} onBlur={() => handleBalanceFormatting(formData.balance)} error={errors.balance} />
                        <CurrencySelect currencies={currencies} isLoading={isLoading} selected={formData.currency} onChange={handleChange} error={errors.currency}/>
                        <div className='mb-3'>
                            <div className={`rounded-5 p-3 border ${sDashboard.bgDarkPrimary} ${errors.photoUrl ? 'is-invalid' : sDashboard.borderDarkEmphasis}`}>
                                {iconsList.map((icon, index) => (
                                    <button key={index} type='button' name='photoUrl' value={icon} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.photoUrl == icon ? s.selectedIcon : ''}`} onClick={handleChange}>
                                        <i className={`bi fs-5 ${icon}`}></i>
                                    </button>
                                ))}
                            </div>
                            {errors.photoUrl && <div className="d-block invalid-feedback text-start ps-2">{errors.photoUrl}</div>}
                        </div>
                        <button type='submit' className={`btn ${sDashboard.btnDarkOutlineAccentPrimary} py-2 px-4 rounded-5`} disabled={isSending}>
                            {isSending ? 'Dodawanie...': 'Dodaj'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccountCreator;