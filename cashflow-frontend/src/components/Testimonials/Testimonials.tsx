import React, { useState, useEffect } from 'react'
import s from './Testimonials.module.css'
import ph from '../../assets/placeholder.png'

interface Testimonial {
    firstname: string;
    lastname: string;
    description: string;
    rating: number;
    avatarUrl: string;
}

const testimonialsList: Testimonial[] = [
    {
        firstname: 'Anna',
        lastname: 'Kowalska',
        description: 'Wreszcie ogarniam miesięczne wydatki. CashFlow robi robotę.',
        rating: 5,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Marek',
        lastname: 'Zieliński',
        description: 'Dobre wykresy i podsumowania. Brakuje tylko kilku filtrów.',
        rating: 4,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Katarzyna',
        lastname: 'Nowak',
        description: 'Fajna aplikacja, ale czasem gubi synchronizację z kontem.',
        rating: 3,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Paweł',
        lastname: 'Jabłoński',
        description: 'Błyskawiczne dodawanie transakcji. Idealna na co dzień.',
        rating: 5,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Julia',
        lastname: 'Wiśniewska',
        description: 'Powiadomienia o rachunkach nie zawsze działają. Szkoda.',
        rating: 2,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Tomasz',
        lastname: 'Wójcik',
        description: 'Pomaga trzymać budżet w ryzach. Raporty na duży plus.',
        rating: 4,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Magdalena',
        lastname: 'Kamińska',
        description: 'Dla freelancera jak znalazł. Eksport danych super wygodny.',
        rating: 5,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Kamil',
        lastname: 'Lewandowski',
        description: 'Ładny interfejs, ale cykliczne wydatki mogłyby być lepsze.',
        rating: 3,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Alicja',
        lastname: 'Sokołowska',
        description: 'Dużo funkcji w darmowej wersji. Sensowna aplikacja.',
        rating: 4,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Jakub',
        lastname: 'Mazur',
        description: 'Trochę zawiłe ustawienia na start. Przydałby się prostszy onboarding.',
        rating: 2,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Ewa',
        lastname: 'Kaczmarek',
        description: 'Świetna dla domowego budżetu. Wszystko czytelne i szybkie.',
        rating: 5,
        avatarUrl: '../../assets/placeholder.png'
    },
    {
        firstname: 'Mateusz',
        lastname: 'Czerwiński',
        description: 'Stabilna, przejrzysta i naprawdę pomaga oszczędzać.',
        rating: 5,
        avatarUrl: '../../assets/placeholder.png'
    },
];

const Testimonials: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => {
                return (current + 1) % (testimonialsList.length+1);
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            const ww = window.innerWidth;
            if (ww < 768) {
                setVisibleItems(1);
            } else {
                setVisibleItems(4);
            };
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const extendedList = [...testimonialsList, ...testimonialsList]

    const [isAnimated, setIsAnimated] = useState<boolean>(true);

    const handleTranistionEnd = () => {
        if (activeIndex == 12) {
            setIsAnimated(false);
            setActiveIndex(0);
            setTimeout(() => { 
                setIsAnimated(true);
            },50);
        }
    };



    return (
        <div className='overflow-hidden'>
            <div className={`row position-relative row-gap-3 flex-nowrap`} style={{ transform: `translateX(-${activeIndex * (100 / visibleItems)}%)`, transition: isAnimated ? 'transform 0.5s ease-out' : 'none' }} onTransitionEnd={handleTranistionEnd}>
                {extendedList.map((item, index) => (
                    <div key={index} className='col-12 col-md-3'>
                        <div className='card d-flex flex-column align-items-stretch border-0 shadow rounded-5 py-4'>
                            <div>
                                <img className={`img-fluid rounded-circle d-block mx-auto ${s.avatar}`} src={ph} />
                            </div>
                            <div className='card-body'>
                                <div className='h4 text-center'>{item.firstname} {item.lastname}</div>
                                <hr />
                                <p>
                                    <i className='bi bi-quote'></i>
                                    <br />
                                    {item.description}
                                    <br />
                                    <i className='bi bi-quote'></i>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;