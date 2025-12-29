import React from 'react'
import s from './SidebarControl.module.css'


interface SidebarControlProps {
    userName: string;
    balance: number | undefined;
    totalAmount: number;
    isExpense: boolean;
    onPeriodChange: (period: string) => void;
    startDate: string;
    endDate: string;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
}

const SidebarControl: React.FC<SidebarControlProps> = ({userName, balance, totalAmount, isExpense, onPeriodChange, startDate, endDate, setStartDate, setEndDate}) => {
    return (
        <div className={`col-md-6 d-flex flex-column text-white`}>
            <div className={`border-bottom`}>
                Witaj {userName}!
            </div>
            <div className={`border-bottom`}>
                Saldo: {balance}
            </div>
            <div className={`border-bottom`}>
                {isExpense ? 'Wydatki: -' : 'Przychody: +'}{totalAmount}
            </div>
            <div className={`border-bottom`}>
                <button className={`btn btn-outline-primary`} onClick={() => onPeriodChange('today')}>Dzis</button>
                <button className={`btn btn-outline-primary`} onClick={() => onPeriodChange('week')}>Tydzien</button>
                <button className={`btn btn-outline-primary`} onClick={() => onPeriodChange('month')}>Miesiac</button>
                <button className={`btn btn-outline-primary`} onClick={() => onPeriodChange('year')}>Rok</button>
                <div>
                    <span className='fs-3'>Własny</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(new Date(e.target.value))} />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(new Date(e.target.value))} />
                </div>
            </div>
            <div className={`border-bottom`}>
                <button className={`btn btn-primary`}>Nowa transakcja</button>
            </div>
        </div>
    );
}

export default SidebarControl;