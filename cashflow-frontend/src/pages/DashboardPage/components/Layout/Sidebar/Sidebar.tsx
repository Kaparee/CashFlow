import s from './Sidebar.module.css'
import { useWindowWidth } from '../../../../../hooks/useWindowWidth';

interface SidebarProps {
        isExpanded: boolean;
        onToggle: () => void;   
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle}) => {

    const menuItems = [
        { icon: 'bi-house', label: 'Strona Główna', path: '#' },
        { icon: 'bi-person-lines-fill', label: 'Konta', path: '#' },
        { icon: 'bi-graph-up', label: 'Wykresy', path: '#' },
        { icon: 'bi-bell', label: 'Powiadomienia', path: '#' },
        { icon: 'bi-gear', label: 'Ustawienia', path: '#' },
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

    return (
        <>
            <div className={`position-absolute row px-2 py-1 flex-column text-white h-100 justify-content-start align-items-start z-1 bg-dark overflow-hidden ${width < 768 ? 'mx-0' : '' }`} style={sidebarStyle}>
                <div className=''>
                    <button className={`btn px-0 py-0 border-0 bg-dark`} type="button" onClick={onToggle}>
                        <span className={`${s.w60} text-center`}>
                            <i className="bi bi-list fs-3 text-gradient"></i>
                        </span>
                    </button>
                </div>
                {menuItems.map((item, index) => (
                    <div className={`${item.icon == 'bi-gear' ? 'mt-auto' : 'mb-2'}`} key={index}>
                        <a className={`d-flex align-items-center justify-content-start text-decoration-none transition text-white`} href={item.path}>
                            <span className={`${s.linkTransition} ${s.w60} d-flex align-items-start`}> 
                                <i className={`bi ${item.icon} fs-4`}></i>
                            </span>
                            <span className='text-nowrap text-start w-100 ms-md-4'>
                                {item.label}
                            </span>
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Sidebar;