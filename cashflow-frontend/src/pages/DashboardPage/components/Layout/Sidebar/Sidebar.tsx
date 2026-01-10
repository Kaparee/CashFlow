import s from './Sidebar.module.css'
import sDashboard from '../../../DashboardPage.module.css'
import { useWindowWidth } from '../../../../../hooks/useWindowWidth';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
        isExpanded: boolean;
        onToggle: () => void;   
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle}) => {
    const location = useLocation();

    const menuItems = [
        { icon: 'bi-house', label: 'Strona Główna', path: 'dashboard-home-page' },
        { icon: 'bi-person-lines-fill', label: 'Konta', path: 'accounts' },
        { icon: 'bi-graph-up', label: 'Wykresy', path: 'charts' },
        { icon: 'bi-bell', label: 'Powiadomienia', path: 'notifications' },
        { icon: 'bi-bookmarks', label: 'Kategorie', path: 'categories' },
        { icon: 'bi-gear', label: 'Ustawienia', path: 'settings' }
    ]

    const width = useWindowWidth(); 

    const sidebarStyle = width >= 768 
    ? { 
        width: isExpanded ? '200px' : '60px', 
        transition: 'width 0.3s' 
      }
    : { 
        visibility: isExpanded ? 'visible' : 'hidden',
        width: '100%', 
        transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)',
        top: 0,
        transition: 'all 0.3s ease-in-out'
    };

    const isActive = (path: string) => {
        return location.pathname.includes(path);
    }

    return (
        <>
            <div className={`position-absolute row px-2 pt-1 pb-2 flex-column text-white h-100 justify-content-start align-items-start z-2 ${sDashboard.bgDarkSecondary} ${sDashboard.shadowDark} overflow-hidden ${width < 768 ? 'mx-0' : '' }`} style={sidebarStyle}>
                <div className=''>
                    <button className={`btn px-0 py-0 border-0 ${sDashboard.bgDarkSecondary}`} type="button" onClick={onToggle}>
                        <span className={`${s.w60} text-center`}>
                            <i className="bi bi-list fs-3 text-gradient"></i>
                        </span>
                    </button>
                </div>
                {menuItems.map((item, index) => (
                    <div className={`${item.icon == 'bi-gear' ? 'mt-auto' : 'mb-2'}`} key={index}>
                        <Link to={item.path} className={`d-flex align-items-center justify-content-start text-decoration-none transition ${sDashboard.textDarkPrimary}`}>
                            <span className={`${s.linkTransition} ${s.w60} d-flex align-items-start`}> 
                                <i className={`bi ${item.icon} fs-4 ${isActive(item.path) ? 'text-gradient' : ''}`}></i>
                            </span>
                            <span className='text-nowrap text-start w-100 ms-md-4'>
                                {item.label}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Sidebar;