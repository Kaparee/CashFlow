import React, { useContext, useEffect, useRef, useState } from 'react'
import api from '../../../../api/api'
import { ToastContext } from '../../../../contexts/ToastContext';
import sDashboard from '../../DashboardPage.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import s from './Categories.module.css'
import Input from '../../../../components/UI/Input/Input';
import CustomSelect from '../../components/UI/CustomSelect/CustomSelect';

interface KeyWords {
    wordId: number;
    word: string;
}

interface CategoriesTable {
    categoryId: number;
    name: string;
    color: string;
    type: string;
    limitAmount?: number;
    icon: string;
    keyWords: KeyWords[];
}

interface FormDataProps {
    categoryId: string;
    newName: string;
    newColor: string;
    newIcon: string;
    newType: string;
}

const expenseCategoryIcons: string[] = ["bi-egg-fried", "bi-cup-hot", "bi-cup-straw", "bi-apple", "bi-cake", "bi-cookie", "bi-basket", "bi-cart", "bi-bag", "bi-shop", "bi-handbag", "bi-car-front", "bi-fuel-pump", "bi-bus-front", "bi-bicycle", "bi-airplane", "bi-train-front", "bi-house", "bi-lightbulb", "bi-droplet", "bi-lightning-charge", "bi-wifi", "bi-thermometer-half", "bi-heart-pulse", "bi-capsule", "bi-bandaid", "bi-hospital", "bi-scissors", "bi-controller", "bi-film", "bi-music-note", "bi-ticket-perforated", "bi-camera", "bi-cash-stack", "bi-credit-card", "bi-bank", "bi-piggy-bank", "bi-wallet2", "bi-gift", "bi-mortarboard"];
const incomeCategoryIcons: string[] = ["bi-cash", "bi-cash-coin", "bi-cash-stack", "bi-coin", "bi-wallet2", "bi-piggy-bank", "bi-bank", "bi-graph-up-arrow", "bi-briefcase", "bi-gift", "bi-gem", "bi-bar-chart-line", "bi-pie-chart", "bi-currency-exchange", "bi-laptop", "bi-tools", "bi-house-heart", "bi-check-circle", "bi-trophy", "bi-award", "bi-arrow-down-left-circle", "bi-journal-check", "bi-lightning-fill", "bi-star-fill"];
const typeOfCategory = [{dName: 'Przychody', type: 'income', value: 'income'}, {dName: 'Wydatki', type: 'expense', value: 'expense'}]

const Categories: React.FC = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const { addToast } = useContext(ToastContext);
    const [ categories, setCategories ] = useState<CategoriesTable[] | null>(null);
    const [searchParams] = useSearchParams();
    const viewMode = searchParams.get('type') || 'expense';

    const [formData, setFormData] = useState<FormDataProps>({ categoryId: "", newName: "", newColor: "", newIcon: "", newType: ""});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const modalCloseButtonEditFormRef = useRef<HTMLButtonElement | null>(null);
    
    const [currentCategory, setCurrentCategory] = useState<CategoriesTable | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const [isClosing, setIsClosing] = useState<boolean>(false);

    const selectedTypeObject = typeOfCategory.find(item => item.value === formData.newType);
    const displayValue = selectedTypeObject ? selectedTypeObject.dName : "";
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [ currentPage, setCurrentPage] = useState(0);
    const iconsPerPage = 10;
    const currentIconsList = formData.newType === 'income' ? incomeCategoryIcons : expenseCategoryIcons;
    const totalPages = Math.ceil(currentIconsList.length / iconsPerPage);

    const [newKeyword, setNewKeyword] = useState<string>("");
    const [isAddingKeyword, setIsAddingKeyword] = useState<boolean>(false);


    const handleFetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/categories-info');
            setCategories(res.data);
        } catch (error: any) {
            addToast('Nie udało się pobrać kategorii', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const getContrastColor = (hexColor: string): 'white' | 'black' => {
        const cleanHex = hexColor.replace('#','');

        const r = parseInt(cleanHex.substring(0,2),16);
        const g = parseInt(cleanHex.substring(2,4),16);
        const b = parseInt(cleanHex.substring(4,6),16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    }


    const navigate = useNavigate();
    const routeChange = (path: string) => {
        navigate(path);
    }

    const handleCreateCategory = () => {
        routeChange('create-category');
    }

    const handleClearErrors = () => {
        setErrors({});
    }

    const openOptionsModal = (cat: CategoriesTable) => {
        setIsClosing(false);
        setIsConfirmingDelete(false)
        setCurrentCategory(cat);
    }

    const closeOptionsModal = () => {
        setIsClosing(true);

        setTimeout(() => {
            setCurrentCategory(null);
            setIsClosing(false);
            setIsConfirmingDelete(false)
        }, 300);
        handleClearErrors();
        handleClearFormData();
    }

    const validateForm = () => {
        const err: {[key: string] : string} = {};

        if (formData.newName.trim().length == 0) {
            err.newName = 'Proszę wpisać nazwe'
        } else if (formData.newName.trim().length > 30) {
            err.newName = 'Nazwa musi być krótsza niż 30 znaków'
        }
            
        if (formData.newIcon.trim().length == 0) {
            err.newIcon = 'Proszę wybrać ikonkę'
        }

        if (formData.newColor.trim().length == 0) {
             err.newColor = 'Proszę wybrać kolor'
        }

        if (formData.newType.trim().length == 0) {
             err.newType = 'Proszę wybrać typ'
        }
        
        setErrors(err);
    
        if (Object.keys(err).length === 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name as keyof  FormDataProps;
        const {value} = e.currentTarget;
    
        const nextData = {...formData, [name]: value};
    
        setFormData(nextData);
    
        const { [name]: _ , ...remainingErrors } = errors;
        setErrors(remainingErrors);
    }

    const handleClearFormData = () => {
        setFormData({ categoryId: "", newName: "", newColor: "", newIcon: "", newType: ""});
    }

    const handleEditCategory = async () => {
        try {
            const catId = parseInt(formData.categoryId,10);
            if (isNaN(catId)){
                addToast('Wystąpił błąd przy wyborze kategorii', 'error');
                return;
            }
            setIsLoading(true);
            const res = await api.patch('/update-category', {
                "categoryId": catId,
                "newName": formData.newName,
                "newColor": formData.newColor,
                "newIcon": formData.newIcon,
                "newType": formData.newType
            });
            addToast('Edytowano kategorię', 'info');
            handleClearFormData();
            modalCloseButtonEditFormRef.current?.click();
            handleFetchCategories();
            closeOptionsModal();
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFillEditForm = () => {
        const newItem: FormDataProps = {
            ['categoryId']: String(currentCategory?.categoryId),
            ['newName']: String(currentCategory?.name),
            ['newColor']: String(currentCategory?.color),
            ['newIcon']: String(currentCategory?.icon),
            ['newType']: String(currentCategory?.type)
        }
        setFormData({...formData, ...newItem});
    }

    const handleValidateForm = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            handleEditCategory();
        }
    }

    const handleDeleteCategory = async () => {
        if (!currentCategory) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true)
            return;
        }

        try {
            setIsDeleting(true);
            const res = await api.delete(`/delete-category`, { 
                params: { 
                    'categoryId': currentCategory.categoryId
                } 
            });

            addToast('Kategoria została usunięta pomyślnie', 'info');
            handleFetchCategories();
            closeOptionsModal();
        } catch (error: any) {
            addToast('Nie udało się usunąć kategorii', 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleColorClick = () => {
        colorInputRef.current?.click();
    }

    useEffect(() => {
        handleFetchCategories();
    },[])

    useEffect(() => {
        setFormData(prev => {
            const currentIconsList = prev.newType === 'income'
                ? incomeCategoryIcons
                : expenseCategoryIcons;
            
            const isIconValid = currentIconsList.includes(prev.newIcon);

            return {
                ...prev,
                newIcon: isIconValid ? prev.newIcon : ""
            };
        });
        setCurrentPage(0);
    },[formData.newType]);

    const handleAddKeyword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyword.trim() || !currentCategory) return;

        const wordExists = currentCategory.keyWords.some(
            kw => kw.word.toLowerCase() === newKeyword.trim().toLowerCase()
        );

        if (wordExists) {
            addToast('To słowo kluczowe już istnieje', 'error');
            return;
        }

        try {
            setIsAddingKeyword(true);
            await api.post('/create-new-key-word', {
                categoryId: currentCategory.categoryId,
                word: newKeyword.trim()
            });

            addToast('Dodano słowo kluczowe', 'info');
            setNewKeyword("");

            const res = await api.get('/categories-info');
            setCategories(res.data);

            const updatedCategory = res.data.find(
                (cat: CategoriesTable) => cat.categoryId === currentCategory.categoryId
            );
            
            if (updatedCategory) {
                setCurrentCategory(updatedCategory);
            }

        } catch (error: any) {
            addToast('Nie udało się dodać słowa', 'error');
        } finally {
            setIsAddingKeyword(false);
        }
    }

    const handleDeleteKeyword = async (wordId: number) => {
        try {
            await api.delete(`/delete-key-word`, { params: { keyWordId: wordId } });
            addToast('Słowo kluczowe usunięte', 'info');
        
            setCurrentCategory(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    keyWords: prev.keyWords.filter(k => k.wordId !== wordId)
                };
            });
            handleFetchCategories();
        } catch (error) {
            addToast('Błąd podczas usuwania', 'error');
        }
    }

    return (
        <div className={`w-100 h-100 d-flex flex-column`}>
            <div className={`d-flex fs-3 px-2 py-1 ${sDashboard.textDarkPrimary} ${sDashboard.textDarkUnderline}`}>
                Twoje kategorie
            </div>
            <div className='p-2 row'>
                {isLoading && Array.from({length: 10}).map((_, index) => (
                    <div key={index} className={`col-auto my-2`}>
                        <button className={`px-3 py-1 half-blurred rounded-5 border-0 d-flex align-items-center ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                            <span className='full-blurred'>
                                <i className={`bi bi-android fs-5 ${sDashboard.textDarkPrimary}`}></i>
                            </span>
                            <span className={`mx-2 full-blurred ${sDashboard.textDarkPrimary}`}>Placeholder</span>
                        </button>
                    </div>
                ))}

                {!isLoading && categories?.filter(item => viewMode.includes(item.type))?.map((cat, index) => (
                    <div key={cat.categoryId} className={`col-auto my-2`}>
                        <button className={`px-3 py-1 rounded-5 border-0 d-flex align-items-center`} style={{backgroundColor: cat.color,boxShadow: `0 0.3rem 1rem ${cat.color}`, color: getContrastColor(cat.color)}} onClick={() => openOptionsModal(cat)}>
                            <span>
                                <i className={`bi ${cat.icon} fs-5`}></i>
                            </span>
                            <span className='mx-2'>{cat.name}</span>
                            {cat.limitAmount && cat.limitAmount > 0 ? <span className={`small`}>Limit: {cat.limitAmount}</span> : ''}
                        </button>
                    </div>
                ))}

                <div className={`col-auto my-2`}>
                        <button className={`px-3 py-1 rounded-5 d-flex align-items-center border ${sDashboard.borderDarkEmphasis} ${sDashboard.btnDarkOutlinePrimary} ${sDashboard.shadowDark}`} onClick={handleCreateCategory}>
                            <span className=''>
                                <i className={`bi bi-plus-lg fs-5`}></i>
                            </span>
                            <span className={`mx-2`}>Dodaj</span>
                        </button>
                </div>
            </div>
            {currentCategory && (
                <div
                    className={`${s.modalOverlay} ${isClosing ? s.modalOverlayClosing : ''}`} 
                    onClick={!isClosing ? closeOptionsModal : undefined}
                >
                    <div 
                        className={`${s.bottomSheet} ${isClosing ? s.bottomSheetClosing : ''} ${sDashboard.bgDarkSecondary} border-top ${sDashboard.borderDarkEmphasis} p-4`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className={sDashboard.textDarkPrimary}>Zarządzanie kategorią</h4>
                            <button type="button" className="btn-close btn-close-white" onClick={closeOptionsModal}></button>
                        </div>

                        <div className="text-center mb-4">
                            <h5 className="text-white mb-2">Wybrana kategoria:</h5>
                            <h3 className="text-white fw-bold"><i className={`bi ${currentCategory.icon}`}></i> {currentCategory.name}</h3>
                            <p className="text-gradient fw-bold fs-4">
                                Typ: {currentCategory.type == 'expense' ? 'Wydatki' : 'Przychody'}
                            </p>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                className="btn btn-outline-danger btn-lg rounded-5 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleDeleteCategory}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : isConfirmingDelete ? (
                                    <>
                                        <i className='bi bi-exclamation-triangle fill'></i>
                                        Na pewno? Kliknij aby potwierdzić
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Usuń trwale tą kategorię
                                    </>
                                )}
                                
                            </button>

                            <button 
                                className={`btn btn-outline-primary btn-lg rounded-5 mt-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#editCategoryModal"
                                type='button'
                                onClick={handleFillEditForm}
                            >
                                Edytuj
                            </button>

                            <button 
                                className={`btn btn-outline-primary  btn-lg rounded-5 mt-2`}
                                data-bs-toggle="modal" 
                                data-bs-target="#keywordsModal"
                                type='button'
                            >
                                Słowa kluczowe
                            </button>

                            <button 
                                className="btn btn-dark btn-lg rounded-5 mt-2" 
                                onClick={closeOptionsModal}
                            >
                                Anuluj
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <div className="modal fade" id="editCategoryModal" tabIndex={-1} aria-labelledby="editCategoryModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                        <form onSubmit={handleValidateForm}>
                            <div className="modal-header border-0">
                                <span className={`modal-title fs-5 fw-bold ${sDashboard.textDarkPrimary}`} id="editCategoryModalLabel">Edytowanie kategorii</span>
                            </div>
                            <div className="modal-body py-0">
                                <Input divClass={sDashboard.textDarkSecondary} inputClass={`${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.borderDarkFocusAccent}`} id='newName' name='newName' label='Nazwa' type='text' value={formData.newName} onChange={handleChange} error={errors.newName} />
                                <CustomSelect table={typeOfCategory} isLoading={isLoading} label='Typ' name='newType' selected={displayValue} onChange={handleChange} />
                                <div className={`fw-bold small form-label ${sDashboard.textDarkSecondary} text-start`}>Kolor</div>
                                <div className='text-start'>
                                    <button type='button' className={`rounded-5 border`} style={{backgroundColor: formData.newColor || '#3b82f6', height: '40px', width: '80px'}} onClick={handleColorClick}></button>
                                    <input className='invisible' type="color" ref={colorInputRef} name='newColor' value={formData.newColor} onChange={handleChange}/>
                                </div>
                                <div className={`fw-bold small form-label ${sDashboard.textDarkSecondary} text-start`}>Ikona</div>
                                <div className='mb-3'>
                                    <div className={`rounded-5 p-3 text-center border ${sDashboard.bgDarkPrimary} ${errors.newIcon ? 'is-invalid' : sDashboard.borderDarkEmphasis}`}>
                                        {formData.newType != 'income' && expenseCategoryIcons.slice(currentPage * iconsPerPage, currentPage * iconsPerPage + iconsPerPage).map((ic, index) => (
                                            <button key={index} type='button' name='newIcon' value={ic} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.newIcon == ic ? s.selectedIcon : ''}`} onClick={handleChange}>
                                                <i className={`bi fs-5 ${ic}`}></i>
                                            </button>
                                        ))}

                                        {formData.newType == 'income' && incomeCategoryIcons.slice(currentPage * iconsPerPage, currentPage * iconsPerPage + iconsPerPage).map((ic, index) => (
                                            <button key={index} type='button' name='newIcon' value={ic} className={`btn bg-transparent m-1 ${s.btnIcons} ${formData.newIcon == ic ? s.selectedIcon : ''}`} onClick={handleChange}>
                                                <i className={`bi fs-5 ${ic}`}></i>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.newIcon && <div className="d-block invalid-feedback text-start ps-2">{errors.newIcon}</div>}
                                </div>
                                <div className={`d-flex align-items-center justify-content-center mb-3 ${s.dotBox}`}>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <span key={index} onClick={() => setCurrentPage(index)} className={`point fs-5 mx-1 ${currentPage === index ? s.activeDot : s.dot}`}>
                                            ●
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <button type="submit" className="btn btn-primary w-100 fw-bold rounded-5" disabled={isLoading}>{isLoading ? 'Edytowanie...': 'Edytuj'}</button>
                                <button type="button" className="btn btn-outline-primary rounded-5 w-100" data-bs-dismiss="modal" ref={modalCloseButtonEditFormRef}>Zamknij</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            

            <div className="modal fade" id="keywordsModal" tabIndex={-1} aria-labelledby="keywordsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content rounded-5 py-2 px-3 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark} border-0`}>
                        <div className="modal-header border-0">
                            <div>
                                <h5 className={`modal-title fw-bold ${sDashboard.textDarkPrimary}`} id="keywordsModalLabel">
                                    Słowa kluczowe
                                </h5>
                                <small className={sDashboard.textDarkSecondary}>
                                    Kategoria: <span className="fw-bold" style={{color: currentCategory?.color}}>{currentCategory?.name}</span>
                                </small>
                            </div>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleAddKeyword} className="mb-4">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className={`form-control rounded-start-5 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkEmphasis}`}
                                        placeholder="np. Biedronka, Przelew..."
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        maxLength={50}
                                    />
                                    <button 
                                        className="btn btn-primary rounded-end-5 px-4 fw-bold" 
                                        type="submit"
                                        disabled={isAddingKeyword || !newKeyword.trim()}
                                    >
                                        {isAddingKeyword ? <span className="spinner-border spinner-border-sm"></span> : 'Dodaj'}
                                    </button>
                                </div>
                            </form>
                            <div className="d-flex flex-wrap gap-2" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                {currentCategory?.keyWords && currentCategory.keyWords.length > 0 ? (
                                    currentCategory.keyWords.map((kw) => (
                                        <div 
                                            key={kw.wordId} 
                                            className={`d-flex align-items-center px-3 py-2 rounded-5 border ${sDashboard.borderDarkEmphasis} ${sDashboard.bgDarkPrimary}`}
                                        >
                                            <span className={`me-2 ${sDashboard.textDarkPrimary}`}>{kw.word}</span>
                                            <button 
                                                type="button" 
                                                className="btn-close btn-close-white small" 
                                                style={{fontSize: '0.6rem'}}
                                                onClick={() => handleDeleteKeyword(kw.wordId)}
                                            ></button>
                                        </div>
                                    ))
                                ) : (
                                    <div className={`text-center w-100 py-4 ${sDashboard.textDarkSecondary} opacity-50`}>
                                        <i className="bi bi-tag fs-2 d-block mb-2"></i>
                                        Brak przypisanych słów kluczowych
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-outline-primary rounded-5 w-100" data-bs-dismiss="modal">
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;