import React from 'react'
import s from './Features.module.css'

interface Feature {
    title: string;
    description: string;
    icon: string;
};

const featuresList: Feature[] = [
    {
        title: 'Planowanie Budżetu',
        description: "Przejmij pełną kontrolę nad wydatkami. Ustalaj limity dla kategorii i trzymaj rękę na pulsie.",
        icon: 'calculator'
    },
    {
        title: 'Analiza Wydatków',
        description: "Zrozum, gdzie uciekają Twoje pieniądze dzięki przejrzystym, interaktywnym wykresom.",
        icon: 'pie-chart'
    },
    {
        title: 'Cele Oszczędnościowe',
        description: "Marzysz o wakacjach? Zdefiniuj cel, śledź postępy i osiągaj swoje finansowe marzenia szybciej.",
        icon: 'piggy-bank'
    },
    {
        title: 'Bezpieczeństwo Danych',
        description: "Twoje finanse są u nas bezpieczne. Stosujemy szyfrowanie klasy bankowej dla pełnej ochrony.",
        icon: 'shield-lock'
    }
];


const Features: React.FC = () => {
    return (
        <>
            <div className='row mb-4'>
                <div className='col-12 d-flex flex-column'>
                    <div id='home-page-features' className='h1 text-gradient fw-bold scroll-mt user-select-none'>Powerful tools to take control of your money</div>
                    <div className='fs-5 text-secondary user-select-none'>CashFlow helps you track, planm and understand your finances - all in one simple dashboard.</div>
                </div>
            </div>
            <div className={`${s.bgFeatures} row justify-content-center row-gap-3`}>
                {featuresList.map((item, index) => (
                    <div key={index} className='col-4'>
                        <div className='p-3 shadow rounded-4 d-flex align-items-center flex-column text-center bg-white'>
                            <div>
                                <div>
                                    <div className='h5 fw-bold text-gradient  user-select-none'>
                                        {item.title}
                                    </div>
                                </div>
                                <div className='user-select-none'>
                                    {item.description}
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <div>
                                    <i className={`fs-1 bi bi-${item.icon} text-gradient  user-select-none`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Features;