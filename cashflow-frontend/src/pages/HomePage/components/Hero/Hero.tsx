import React from 'react'
import staszek from '../../../../assets/staszek.avif'
import money from '../../../../assets/money.gif'
import s from './Hero.module.css'
import AnimatedContent from '../../../../components/UI/ReactBits/AnimatedContent/AnimatedContent.tsx'

const Hero: React.FC = () => {
    return (
        <div id='home-page-home' className={`container-fluid ${s.bgHero} d-flex scroll-mt`}>
            <div className='d-flex flex-column mt-md-5 px-md-4 col-12 col-xl-6'>
                <div>
                    <AnimatedContent
                        distance={100}
                        direction="horizontal"
                        reverse={true}
                        duration={1.5}
                        ease="power3.out"
                        initialOpacity={0.2}
                        animateOpacity
                        scale={1.1}
                        threshold={0.2}
                        delay={0}
                    >
                        <div>
                            <div className={`display-1 text-gradient fw-bold user-select-none`}>Save money with CashFlow.</div>
                        </div>
                        <div>
                            <div className='fs-5 text-secondary w-70 user-select-none'>
                                Tracks expenses, organizes your budget, and visualizes your spending to help you stay in control of your finanses
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
                <div className='mt-4 d-flex text-secondary'>
                    <AnimatedContent
                        distance={100}
                        direction="horizontal"
                        reverse={true}
                        duration={1.5}
                        ease="power3.out"
                        initialOpacity={0.2}
                        animateOpacity
                        scale={1.1}
                        threshold={0.2}
                        delay={0}
                    >
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
                                    {[...Array(5)].map(() => (
                                        <i className="bi bi-star-fill fs-5 text-gradient me-1"></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
            </div>

            <div className='d-none col-xl-6 d-lg-flex align-items-center justify-content-center'>
                <AnimatedContent
                    distance={150}
                    direction="horizontal"
                    reverse={false}
                    duration={1.5}
                    ease="power3.out"
                    initialOpacity={0.2}
                    animateOpacity
                    scale={1.1}
                    threshold={0.2}
                    delay={0}
                >
                    <img src={money} alt='money' className='img-fluid' style={{ height: '250px', width: '250px' }} />
                </AnimatedContent>
            </div>

        </div>
    );
};

export default Hero;