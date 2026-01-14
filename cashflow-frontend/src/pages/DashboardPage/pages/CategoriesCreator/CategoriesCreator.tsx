import React, { useState, useContext, useRef, useEffect } from 'react'
import sDashboard from '../../DashboardPage.module.css'
import Input from '../../../../components/UI/Input/Input'
import { useNavigate } from 'react-router-dom';
import s from './CategoriesCreator.module.css'
import { ToastContext } from '../../../../contexts/ToastContext';
import api from '../../../../api/api';
import CustomSelect from '../../components/UI/CustomSelect/CustomSelect';

interface FormDataProps {
    name: string;
    color: string;
    icon: string;
    type: string;
}

const expenseCategoryIcons: string[] = ["bi-egg-fried", "bi-cup-hot", "bi-cup-straw", "bi-apple", "bi-cake", "bi-cookie", "bi-basket", "bi-cart", "bi-bag", "bi-shop", "bi-handbag", "bi-car-front", "bi-fuel-pump", "bi-bus-front", "bi-bicycle", "bi-airplane", "bi-train-front", "bi-house", "bi-lightbulb", "bi-droplet", "bi-lightning-charge", "bi-wifi", "bi-thermometer-half", "bi-heart-pulse", "bi-capsule", "bi-bandaid", "bi-hospital", "bi-scissors", "bi-controller", "bi-film", "bi-music-note", "bi-ticket-perforated", "bi-camera", "bi-cash-stack", "bi-credit-card", "bi-bank", "bi-piggy-bank", "bi-wallet2", "bi-gift", "bi-mortarboard"];
const incomeCategoryIcons: string[] = ["bi-cash", "bi-cash-coin", "bi-cash-stack", "bi-coin", "bi-wallet2", "bi-piggy-bank", "bi-bank", "bi-graph-up-arrow", "bi-briefcase", "bi-gift", "bi-gem", "bi-bar-chart-line", "bi-pie-chart", "bi-currency-exchange", "bi-laptop", "bi-tools", "bi-house-heart", "bi-check-circle", "bi-trophy", "bi-award", "bi-arrow-down-left-circle", "bi-journal-check", "bi-lightning-fill", "bi-star-fill"];
const typeOfCategory = [{dName: 'Przychody', type: 'income', value: 'income'}, {dName: 'Wydatki', type: 'expense', value: 'expense'}]

const CategoriesCreator: React.FC = () => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormDataProps>({ name: "", color: "", icon: "", type: ""});
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isLoading] = useState<boolean>(false);
    const { addToast } = useContext(ToastContext);
    const selectedTypeObject = typeOfCategory.find(item => item.value === formData.type);
    const displayValue = selectedTypeObject ? selectedTypeObject.dName : "";
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [ currentPage, setCurrentPage] = useState(0);
    const iconsPerPage = 10;
    const currentIconsList = formData.type === 'income' ? incomeCategoryIcons : expenseCategoryIcons;
    const totalPages = Math.ceil(currentIconsList.length / iconsPerPage);
    
    const validateForm = () => {
            const err: {[key: string] : string} = {}

            if (formData.name.trim().length == 0) {
                err.name = 'Proszę wpisać nazwe'
            } else if (formData.name.trim().length > 30) {
                err.name = 'Nazwa musi być krótsza niż 30 znaków'
            }
            
            if (formData.icon.trim().length == 0) {
                err.icon = 'Proszę wybrać ikonkę'
            }

            if (formData.color.trim().length == 0) {
                err.color = 'Proszę wybrać kolor'
            }

            setErrors(err);
            console.log(err)
    
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

        const handleColorClick = () => {
            colorInputRef.current?.click();
        }

        const handleAddCategory = async () => {
            console.log("dupa")
            try{
                setIsSending(true);
                await api.post('/create-new-category',{
                    "name": formData['name'],
                    "color": formData['color'],
                    "icon": formData['icon'],
                    "type": formData['type'],
                });
                addToast('Utworzono kategorie', 'info');
                routeChange('/dashboard/categories');
            } catch (error: any) {
                if (error.response && error.response?.status === 409) {
                    addToast('Podobna kategoria już istnieje', 'info');
                } else {
                    addToast('Wystąpił błąd, spróbuj ponownie', 'info');
                }
            } finally {
                setIsSending(false);
            }
        }
        const handleValidateForm = (e: React.FormEvent) => {
            console.log(validateForm())
            e.preventDefault();
    
            if (validateForm()) {
                handleAddCategory();
            }
        }

        useEffect(() => {
            setFormData(prev => ({...prev, icon: ""}));
            setCurrentPage(0);
        },[formData.type]);


    return (
        <>
            <div className='row flex-grow-1'>
                <div className={`mx-auto my-auto rounded-5 col-11 col-md-6 d-flex flex-column p-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark} border ${sDashboard.borderDarkEmphasis}`}>
                    <form className='text-center' onSubmit={handleValidateForm}>
                        <div className={`fs-3 fw-bold ${sDashboard.textDarkPrimary}`}>Dodaj Kategorie</div>
                        <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='name' name='name' label='Nazwa' type='text' value={formData.name} onChange={handleChange} error={errors.name} />
                        <CustomSelect table={typeOfCategory} isLoading={isLoading} label='Typ' name='type' selected={displayValue} onChange={handleChange} />
                        <div className={`fw-bold small form-label ${sDashboard.textDarkSecondary} text-start`}>Kolor</div>
                        <div className='text-start'>
                            <button type='button' className={`rounded-5 ${errors.color?'border-danger':'border'}`} style={{backgroundColor: formData.color || '#3b82f6', height: '40px', width: '80px'}} onClick={handleColorClick}></button>
                            <input className='invisible' type="color" ref={colorInputRef} name='color' value={formData.color} onChange={handleChange}/>
                            <div className="invalid-feedback ps-2 opacity-100">{errors.color ? errors.color : ''}</div>
                        </div>
                        <div className={`fw-bold small form-label ${sDashboard.textDarkSecondary} text-start`}>Ikona</div>
                        <div className='mb-3'>
                            <div className={`rounded-5 p-3 border ${sDashboard.bgDarkPrimary} ${errors.icon ? 'is-invalid' : sDashboard.borderDarkEmphasis}`}>
                                {formData.type != 'income' && expenseCategoryIcons.slice(currentPage * iconsPerPage, currentPage * iconsPerPage + iconsPerPage).map((ic, index) => (
                                    <button key={index} type='button' name='icon' value={ic} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.icon == ic ? s.selectedIcon : ''}`} onClick={handleChange}>
                                        <i className={`bi fs-5 ${ic}`}></i>
                                    </button>
                                ))}

                                {formData.type == 'income' && incomeCategoryIcons.slice(currentPage * iconsPerPage, currentPage * iconsPerPage + iconsPerPage).map((ic, index) => (
                                    <button key={index} type='button' name='icon' value={ic} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.icon == ic ? s.selectedIcon : ''}`} onClick={handleChange}>
                                        <i className={`bi fs-5 ${ic}`}></i>
                                    </button>
                                ))}
                            </div>
                            {errors.icon && <div className="d-block invalid-feedback text-start ps-2">{errors.icon}</div>}
                        </div>
                        <div className={`d-flex align-items-center justify-content-center mb-3 ${s.dotBox}`}>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <span key={index} onClick={() => setCurrentPage(index)} className={`point fs-5 mx-1 ${currentPage === index ? s.activeDot : s.dot}`}>
                                            ●
                                        </span>
                                    ))}
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

export default CategoriesCreator;