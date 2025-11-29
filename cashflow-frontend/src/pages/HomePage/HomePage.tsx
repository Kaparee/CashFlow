import React from 'react';
import Header from '../../components/Header/Header.tsx'
import Hero from '../../components/Hero/Hero.tsx'
import Features from '../../components/Features/Features.tsx'
import Testimonials from '../../components/Testimonials/Testimonials.tsx'
import Footer from '../../components/Footer/Footer.tsx'
import s from './HomePage.module.css'


const HomePage: React.FC = () => {
    return (
        <div className={`${s.smoothScroll}`}>
            <div id='navbar-main' className='container-fluid pb-4'>
                <Header />
            </div>

            <Hero />

            <div className={`container-fluid ${s.bgFeatures} d-flex flex-column justify-content-center pt-5 mt-md-0`}>
                <Features />
            </div>

            <div className={`container-fluid ${s.bgTestimonials} p-0`}>
                <Testimonials />

                <div className='w-100 my-5'></div>

                <Footer />
            </div>
            
        </div>
    );
};

export default HomePage;