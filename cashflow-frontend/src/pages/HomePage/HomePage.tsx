import React from 'react';
import Header from '../../components/Header/Header.tsx'
import Hero from '../../components/Hero/Hero.tsx'
import Features from '../../components/Features/Features.tsx'
import Testimonials from '../../components/Testimonials/Testimonials.tsx'
import s from './HomePage.module.css'


const HomePage: React.FC = () => {
    return (
        <div className={`${s.smoothScroll}`}>
            <div id='navbar-main' className='container-fluid pb-3'>
                <Header />
                <div className='invisible'>.</div>
            </div>

            <Hero />

            <div className={`container-fluid ${s.bgFeatures} d-flex flex-column justify-content-center`}>
                <Features />
            </div>

            <div className={`container-fluid ${s.bgTestimonials} px-0`}>
                <div className={`${s.bgTestimonials2} w-100 h-100`}>
                    <Testimonials />
                </div>
            </div>

            <div className='container-fluid'>
                footer
            </div>

        </div>
    );
};

export default HomePage;