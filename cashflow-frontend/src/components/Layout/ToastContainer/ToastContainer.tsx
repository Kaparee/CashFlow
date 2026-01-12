import React, { useContext } from 'react'
import {ToastContext} from '../../../contexts/ToastContext.tsx';
import sDashboard from '../../../pages/DashboardPage/DashboardPage.module.css'

const ToastContainer: React.FC = () => {
    const { toast, removeToast } = useContext(ToastContext);
    return (
        <div className={`text-white position-absolute z-3 d-flex flex-column small`} style={{top: '3rem',right: '0.5rem' , maxWidth: '250px'}}>
                {toast.map((tt) => (
                    <div key={tt.id} className={`rounded-3 py-1 px-3 mb-3 ${tt.type == 'error' ? sDashboard.alertDarkRed : sDashboard.alertDarkAccent}`}>
                        <div className='d-flex align-items-center border-bottom border-dark mb-1'>
                            <i className={`bi ${tt.type == 'error' ? 'bi-exclamation-triangle' : 'bi-info-circle'}`}></i> <span className='ms-2'>{tt.type == 'error' ? 'Ostrzeżenie' : 'Informacja'}</span> <button className='btn ms-auto p-0 text-dark' type='button' onClick={() => removeToast(tt.id)}><i className="bi bi-x fs-4"></i></button>
                        </div>
                        <div>
                            {tt.source && <>{tt.source}<br/></>}
                            {tt.message} 
                        </div>
                    </div>
                ))}
        </div>
    )
};

export default ToastContainer;