import React from 'react'
import s from './SidebarControl.module.css'
import sDashboard from '../../../DashboardPage.module.css'


interface SidebarControlProps {
    userName: string;
    balance: string;
    totalAmount: string;
    isExpense: boolean;
    onPeriodChange: (period: string) => void;
    startDate: string;
    endDate: string;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    setPeriodOfTime: (i: number) => void;
}

const SidebarControl: React.FC<SidebarControlProps> = ({userName, balance, totalAmount, isExpense, onPeriodChange, startDate, endDate, setStartDate, setEndDate, setPeriodOfTime}) => {
    return (
        <div className={`col-lg-6 d-flex flex-column ${sDashboard.textDarkSecondary}`}>
            <div className={`border mb-3 px-3 py-2 rounded-5 fs-3 ${sDashboard.shadowDark} ${sDashboard.borderDarkEmphasis}`}>
                Witaj <span className='fw-bold'>{userName}</span>!
            </div>
            <div className={`border mb-3 px-3 py-2 rounded-5 fs-5 ${sDashboard.shadowDark} ${sDashboard.borderDarkEmphasis}`}>
                Saldo: <span className='text-gradient fw-bold'>{balance}</span>
            </div>
            <div className={`border mb-3 px-3 py-2 rounded-5 fs-5 ${sDashboard.shadowDark} ${sDashboard.borderDarkEmphasis}`}>
                {isExpense ? <>Wydatki: <span className={`text-danger`}>-</span></> : <>Przychody: <span className={`${sDashboard.textDarkAccentPrimary}`}>+</span></>} <span className={`${isExpense ? 'text-danger' : `sDashboard.textDarkAccentPrimary`} fw-bold`}>{totalAmount}</span>
            </div>
            <div className={`row mx-0 border mb-3 px-3 py-2 rounded-5 fs-5 ${sDashboard.shadowDark} ${sDashboard.borderDarkEmphasis}`}>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => setPeriodOfTime(-1)}>
                    <i className="bi bi-caret-left"></i>
                </button>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => onPeriodChange('today')}>Dziś</button>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => onPeriodChange('week')}>Tydzień</button>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => onPeriodChange('month')}>Miesiąc</button>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => onPeriodChange('year')}>Rok</button>
                <button className={`col-auto btn btn-outline-primary m-1 px-3 py-1 rounded-5`} onClick={() => setPeriodOfTime(1)}>
                    <i className="bi bi-caret-right"></i>
                </button>
            </div>
            <div className={`border input-group mb-3 px-3 py-2 rounded-5 fs-5 row mx-0 align-items-center ${sDashboard.shadowDark} ${sDashboard.borderDarkEmphasis}`}>
                    <div className='col-12 col-xl-auto mb-2 mb-xl-0'>
                        <span className={`me-3`}>Własny Przedział: </span>
                    </div>
                    <div className='col-12 col-lg-6 col-xl-auto mb-2 mb-lg-0'>
                        <input className={`form-control px-3 py-2 rounded-5 ${s.date} ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.borderDarkEmphasis}`} type="date" value={startDate} onChange={(e) => setStartDate(new Date(e.target.value))} />
                    </div>
                    <div className='col-12 col-lg-6 col-xl-auto mb-2 mb-lg-0'>
                        <input className={`form-control px-3 py-2 rounded-5 ${s.date} ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkSecondary} ${sDashboard.borderDarkEmphasis}`} type="date" value={endDate} onChange={(e) => setEndDate(new Date(e.target.value))} min={startDate}/>
                    </div>
            </div>
            <div className={`mb-3 px-3 py-2 rounded-5`}>
                <button className={`btn btn-primary rounded-5 px-5 fs-5 py-2`}>Nowa transakcja</button>
            </div>
        </div>
    );
}

export default SidebarControl;