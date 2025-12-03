import React, { useState, useEffect } from 'react'
import s from './Testimonials.module.css'
import ph from '../../../../assets/placeholder.avif'

const avatars = import.meta.glob('../../../../assets/testimonial/*', { eager: true, import: 'default', query: '?url' });
interface Testimonial {
    firstname: string;
    lastname: string;
    description: string;
    rating: number;
    fileName: string;
}

const testimonialsList: Testimonial[] = [
    {
        firstname: 'Anna',
        lastname: 'Kowalska',
        description: 'Wreszcie ogarniam miesięczne wydatki. CashFlow robi robotę.',
        rating: 5,
        fileName: 'w1.avif'
    },
    {
        firstname: 'Marek',
        lastname: 'Zieliński',
        description: 'Dobre wykresy i podsumowania. Brakuje tylko kilku filtrów.',
        rating: 4,
        fileName: 'm1.avif'
    },
    {
        firstname: 'Katarzyna',
        lastname: 'Nowak',
        description: 'Fajna aplikacja, ale czasem gubi synchronizację z kontem.',
        rating: 3,
        fileName: 'w2.avif'
    },
    {
        firstname: 'Paweł',
        lastname: 'Jabłoński',
        description: 'Błyskawiczne dodawanie transakcji. Idealna na co dzień.',
        rating: 5,
        fileName: 'm2.avif'
    },
    {
        firstname: 'Julia',
        lastname: 'Wiśniewska',
        description: 'Powiadomienia o rachunkach nie zawsze działają. Szkoda.',
        rating: 2,
        fileName: 'w3.avif'
    },
    {
        firstname: 'Tomasz',
        lastname: 'Wójcik',
        description: 'Pomaga trzymać budżet w ryzach. Raporty na duży plus.',
        rating: 4,
        fileName: 'm3.avif'
    },
    {
        firstname: 'Magdalena',
        lastname: 'Kamińska',
        description: 'Dla freelancera jak znalazł. Eksport danych super wygodny.',
        rating: 5,
        fileName: 'w4.avif'
    },
    {
        firstname: 'Kamil',
        lastname: 'Lewandowski',
        description: 'Ładny interfejs, ale cykliczne wydatki mogłyby być lepsze.',
        rating: 3,
        fileName: 'm4.avif'
    },
    {
        firstname: 'Alicja',
        lastname: 'Sokołowska',
        description: 'Dużo funkcji w darmowej wersji. Sensowna aplikacja.',
        rating: 4,
        fileName: 'w5.avif'
    },
    {
        firstname: 'Jakub',
        lastname: 'Mazur',
        description: 'Trochę zawiłe ustawienia na start. Przydałby się prostszy onboarding.',
        rating: 2,
        fileName: 'm5.avif'
    },
    {
        firstname: 'Ewa',
        lastname: 'Kaczmarek',
        description: 'Świetna dla domowego budżetu. Wszystko czytelne i szybkie.',
        rating: 5,
        fileName: 'w6.avif'
    },
    {
        firstname: 'Mateusz',
        lastname: 'Czerwiński',
        description: 'Stabilna, przejrzysta i naprawdę pomaga oszczędzać.',
        rating: 5,
        fileName: 'm6.avif'
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
            if (ww < 576) {
                setVisibleItems(1);
            } else if (ww >= 576 && ww < 768) {
                setVisibleItems(2);
            } else if (ww >= 768 && ww < 992) {
                setVisibleItems(3);
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

    const handleTranstionEnd = () => {
        if (activeIndex == 12) {
            setIsAnimated(false);
            setActiveIndex(0);
            setTimeout(() => { 
                setIsAnimated(true);
            },50);
        }
    };



    return (
        <>
            <div className='d-flex flex-column px-5 user-select-none mt-5'>
                <div id='home-page-testimonial' className='text-gradient display-1 fw-bold' style={{scrollMarginTop: '7rem'}}>
                    Testimonials
                </div>
                <div className='col-12'>
                    <div className='fs-5 text-secondary'>
                        What customers think about us? Let's find out!
                    </div>
                </div>
            </div>
            <div className='overflow-hidden p-5 user-select-none'>
                <div className={`row position-relative row-gap-3 flex-nowrap`} style={{ transform: `translateX(-${activeIndex * (100 / visibleItems)}%)`, transition: isAnimated ? 'transform 0.5s ease-out' : 'none' }} onTransitionEnd={handleTranstionEnd}>
                    {extendedList.map((item, index) => (
                        <div key={index}
                            className='px-3'
                            style={{
                                flex: '0 0 auto',
                                width: `${100 / visibleItems}%`
                            }}>
                            <div className={`h-100 w-100 d-flex flex-column align-items-stretch shadow rounded-5 p-4 bg-white ${s.bgRadial}`}>
                                <div className='mb-3'>
                                    <img className={`img-fluid rounded-circle p-1 d-block mx-auto ${s.avatar}`} src={avatars[`../../../../assets/testimonial/${item.fileName}`] as string || ph} />
                                </div>
                                <div className='h4 text-center'>
                                    <div className='h4 text-center'>{item.firstname} {item.lastname}</div>
                                </div>
                                <div className='d-flex justify-content-center w-100 mb-2'>
                                    {[...Array(5)].map((_, index) => (
                                        <i
                                            key={index}
                                            className={`bi ${index < item.rating ? 'bi-star-fill' : 'bi-star'} me-1 fs-5 text-gradient`}
                                        ></i>
                                    ))}
                                </div>
                                <div className='text-center my-auto'>
                                    <i className='bi bi-quote'></i>
                                    <div className='w-100'></div>
                                    {item.description}
                                    <div className='w-100'></div>
                                    <i className='bi bi-quote'></i>
                                </div>
                            </div>
                        </div>
                ))}
            </div>
            </div>
        </>
    );
};

export default Testimonials;