import React from 'react'
import ratingStar from '../../assets/star.svg'
import staszek from '../../assets/staszek.jpg'
import money from '../../assets/money.gif'
import s from './Hero.module.css'

const Hero: React.FC = () => {
    return (
        <div id='home-page-home' className={`container-fluid ${s.bgHero} d-flex scroll-mt`}>
            <div className='d-flex flex-column mt-5 px-4 col-6'>
                <div>
                    <div>
                        <div className={`display-1 text-gradient fw-bold user-select-none`}>Save money with CashFlow.</div>
                    </div>
                    <div>
                        <div className='fs-5 text-secondary w-70 user-select-none'>
                            Tracks expenses, organizes your budget, and visualizes your spending to help you stay in control of your finanses
                        </div>
                    </div>
                </div>
                <div className='mt-4 d-flex text-secondary'>
                    <div className='shadow bg-white p-4 rounded-4 d-flex flex-column'>
                        <div>
                            <div className='fs-4 user-select-none'>Staszek</div>
                        </div>
                        <div className='row align-items-center'>
                            <div className='col-8 user-select-none'>
                                "Jeszcze gdy chodziłem do podstawówki to był tam taki Paweł i ja jechałem na rowerze i go spotkałem i potem jeszcze pojechałem do biedronki na lody i po drodze do domu wtedy jeszcze, już do domu pojechałem"
                            </div>
                            <div className='col d-flex align-items-center justify-content-center'>
                                <img src={staszek} className={`img-fluid rounded-circle ${s.staszekTemp}`} />
                            </div>
                        </div>
                        <div>
                            <div className='d-inline-flex mt-2'>
                                <img src={ratingStar} alt='rating' className='img-fluid me-1' />
                                <img src={ratingStar} alt='rating' className='img-fluid me-1' />
                                <img src={ratingStar} alt='rating' className='img-fluid me-1' />
                                <img src={ratingStar} alt='rating' className='img-fluid me-1' />
                                <img src={ratingStar} alt='rating' className='img-fluid me-1' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-6 d-flex align-items-center justify-content-center'>
                <img src={money} alt='money' className='img-fluid temp' />
            </div>

        </div>
    );
};

export default Hero;