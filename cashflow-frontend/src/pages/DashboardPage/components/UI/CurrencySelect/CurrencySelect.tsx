import React, {useEffect, useRef, useState} from 'react'
import sDashboard from '../../../DashboardPage.module.css'
import s from './CurrencySelect.module.css'

interface CurrencyData {
    currency: string;
    code: string;
}

interface CurrencySelectProps {
    currencies: CurrencyData[];
    isLoading: boolean;
    selected: string;
    onChange: (code: string) => void;
    error?: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({currencies, isLoading, selected, onChange, error}) => {
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

    const handleChange = (code: string) => {
        onChange(code);
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
                htmlFor="currencySelect" 
                className={`fw-bold small form-label ${sDashboard.textDarkSecondary}`}
            >
                Waluta
            </label>
            <div 
                id='currencySelect' 
                className={`position-relative rounded-5 py-2 px-3 border point ${sDashboard.textDarkPrimary} ${sDashboard.bgDarkPrimary} ${error ? 'is-invalid' : sDashboard.borderDarkEmphasis} `} 
                onClick={isLoading ? undefined : handleShow} 
                ref={dropdownRef}
                role="button" 
                tabIndex={0}
                onKeyDown={isLoading ? undefined : handleKeyDown}
                aria-expanded={isShown}
                aria-haspopup='listbox'
            >
                {isLoading ? 'Ładowanie ... ' : selected ? selected : 'Wybierz walutę...'}
                <div 
                    className={`position-absolute py-2 px-3 top-0 w-100 start-0 rounded-5 d-flex flex-column border ${isShown && !isLoading ? 'visible opacity-100': 'invisible opacity-0'} ${s.transitionPopUp} ${sDashboard.bgDarkPrimary} ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDark} ${s.currecnySelectHeight}`} 
                    style={isShown && !isLoading ? {transform: 'translate(0%,22%)'} : {transform: 'translate(0%,30%)'}}
                >
                    {currencies.map((item, index) => (
                        <div key={item.code}>
                            <button type='button' className={`btn ${sDashboard.textDarkSecondary} ${s.textSelection}`} onClick={ () => handleChange(item.code)} ref={index === 0 ? firstItemRef : undefined}>{item.currency} {item.code}</button>
                        </div>
                    ))}
                </div>
            </div>
            {error && <div className="d-block invalid-feedback ps-2">{error}</div>}
        </div>
    );
};

export default CurrencySelect;