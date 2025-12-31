import React, {useEffect, useRef, useState} from 'react'
import sDashboard from '../../../DashboardPage.module.css'
import s from './CustomSelect.module.css'


interface SelectItem {
    value: string | number;
    dName: string;         
}

interface CustomSelectProps {
    table: SelectItem[];
    isLoading: boolean;
    label: string;
    name: string;
    selected: string;
    onChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
    error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({table, isLoading, label, name, selected, onChange, error}) => {
    const [isShown, setIsShown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const firstItemRef = useRef<HTMLButtonElement>(null);
    const prevIsShownRef = useRef(isShown);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current != null && !dropdownRef.current.contains(event.target as Node)) {
                setIsShown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[])

    useEffect(() => {
        if (isShown) {
            firstItemRef.current?.focus()
        } else if (prevIsShownRef.current && !isShown) {
            dropdownRef.current?.focus()
        }
        prevIsShownRef.current = isShown;
    },[isShown]);

    const handleShow = () => setIsShown(!isShown);

    const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        onChange(e);
        handleShow();
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleShow();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            setIsShown(false);
        }
    }

    return (
        <div className='mb-3 text-start'>
            <label 
                htmlFor="CustomSelect" 
                className={`fw-bold small form-label ${sDashboard.textDarkSecondary}`}
            >
                {label}
            </label>
            <div 
                id='CustomSelect' 
                className={`position-relative rounded-5 py-2 px-3 border point ${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${error ? 'is-invalid' : sDashboard.borderDarkEmphasis} `} 
                onClick={isLoading ? undefined : handleShow} 
                ref={dropdownRef}
                role="button" 
                tabIndex={0}
                onKeyDown={isLoading ? undefined : handleKeyDown}
                aria-expanded={isShown}
                aria-haspopup='listbox'
            >
                {isLoading ? 'Ładowanie ... ' : selected ? selected : 'Wybierz...'}
                <div 
                    className={`position-absolute py-2 px-3 top-0 w-100 start-0 rounded-5 d-flex flex-column border ${isShown && !isLoading ? 'visible opacity-100': 'invisible opacity-0'} ${s.transitionPopUp} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDark} ${s.currecnySelectHeight}`} 
                    style={isShown && !isLoading ? {transform: 'translate(0rem,2.5rem)'} : {transform: 'translate(0%,30%)'}}
                >
                    {table.map((item, index) => (
                        <div key={item.value || index}>
                            <button type='button' name={name} value={item.value} className={`btn ${sDashboard.textDarkSecondary} ${s.textSelection} ${selected == item.dName ? s.selectedItem : ''}`} onClick={(e) => handleChange(e)} ref={index === 0 ? firstItemRef : undefined}>{item.dName}</button>
                        </div>
                    ))}
                </div>
            </div>
            {error && <div className="d-block invalid-feedback ps-2">{error}</div>}
        </div>
    );
};

export default CustomSelect;