import React, { use, useState } from 'react'
import sDashboard from '../../DashboardPage.module.css'
import Input from '../../../../components/UI/Input/Input'
import { useNavigate, useLocation } from 'react-router-dom';

const AccountCreator: React.FC = () => {

    const location = useLocation();
    const previousPath = location.state?.from || '/dashboard'; 


    const navigate = useNavigate();
    const routeChange = (path: string) => {
        navigate(path);
    } 

    const [formData, setFormData] = useState<{ [key: string]: string }>({ name: "", balance: "", currencyCode: "", photoUrl: ""});
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
            const err: {[key: string] : string} = {}

            if (formData.name.trim().length == 0) {
                err.name = 'Proszę wpisać nazwe'
            }

            if (formData.balance.trim().length == 0) {
                err.balance = 'Proszę wprowadzić poprawna kwote'
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
    
        const handleValidateForm = (e: React.FormEvent) => {
            e.preventDefault();
    
            if (validateForm()) {
                routeChange(previousPath);
            }
        }

    return (
        <>
            <div className='row flex-grow-1 justify-content-center'>
                <div className={`rounded-5 col-6 d-flex flex-column p-3 ${sDashboard.bgDarkSecondary, sDashboard.shadowDark}`}>
                    <form className='text-center' onSubmit={handleValidateForm}>
                        <div className={`fs-3 fw-bold ${sDashboard.textDarkPrimary}`}>Dodaj konto</div>
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`text-white ${sDashboard.textDarkSecondary, sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis}`} id='name' name='name' label='Nazwa' type='text' value={formData.name} onChange={handleChange} error={errors.name} />
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`text-white ${sDashboard.textDarkSecondary, sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} `} id='balance' name='balance' label='Kwota' type='text' value={formData.balance} onChange={handleChange} error={errors.balance} />
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`text-white ${sDashboard.textDarkSecondary, sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} `} id='currencyCode' name='currencyCode' label='Waluta' type='text' value={formData.currencyCode} onChange={handleChange} error={errors.currencyCode} />
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`text-white ${sDashboard.textDarkSecondary, sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} `} id='photoUrl' name='photoUrl' label='Zdjęcie' type='text' value={formData.photoUrl} onChange={handleChange} error={errors.photoUrl} />
                        <button type='submit' className={`btn ${sDashboard.btnDarkOutlinePrimary} py-2 px-4 rounded-5`}>
                            Dodaj
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccountCreator;