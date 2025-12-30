import React, { useContext, useEffect, useState } from 'react'
import api from '../../../../api/api'
import { ToastContext } from '../../../../contexts/ToastContext';
import sDashboard from '../../DashboardPage.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import s from './Categories.module.css'

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



const Categories: React.FC = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const { addToast } = useContext(ToastContext);
    const [ categories, setCategories ] = useState<CategoriesTable[] | null>(null);
    const [searchParams] = useSearchParams();
    const viewMode = searchParams.get('type') || 'expense';


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

    const handleEditCategory = () => {
        routeChange('edit-category');
    }

    const handleCreateCategory = () => {
        routeChange('create-category');
    }

    useEffect(() => {
        handleFetchCategories();
    },[])

    return (
        <div className={`w-100 h-100 d-flex flex-column`}>
            <div className={`d-flex fs-3 px-2 py-1 ${sDashboard.textDarkPrimary} ${sDashboard.textDarkUnderline}`}>
                Twoje kategorie
            </div>
            <div className='p-2 row'>
                {isLoading && Array.from({length: 10}).map((_, index) => (
                    <div className={`col-auto my-2`}>
                        <button key={index} className={`px-3 py-1 half-blurred rounded-5 border-0 d-flex align-items-center ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark}`}>
                            <span className='full-blurred'>
                                <i className={`bi bi-android fs-5 ${sDashboard.textDarkPrimary}`}></i>
                            </span>
                            <span className={`mx-2 full-blurred ${sDashboard.textDarkPrimary}`}>Placeholder</span>
                        </button>
                    </div>
                ))}

                {!isLoading && categories?.filter(item => viewMode.includes(item.type))?.map((cat, index) => (
                    <div className={`col-auto my-2`}>
                        <button key={cat.categoryId} className={`px-3 py-1 rounded-5 border-0 d-flex align-items-center`} style={{backgroundColor: cat.color,boxShadow: `0 0.3rem 1rem ${cat.color}`, color: getContrastColor(cat.color)}}>
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
        </div>
    );
};

export default Categories;