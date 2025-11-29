import React, { useState, useRef, useEffect, useCallback } from 'react'
import {useWindowWidth} from '../../hooks/useWindowWidth.ts'
import logo from '../../assets/logo.svg'
import s from './Header.module.css'
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {

    let navigate = useNavigate(); 
    const routeChange = (path:string) =>{ 
        navigate(path);
    }

    const windowWidth = useWindowWidth();

    // main menu w headerze
    const [activeLink, setActiveLink] = useState<string>('Home');

    const sliderRef = useRef<HTMLSpanElement | null>(null);

    const handleClick = (linkName: string) => {
        setActiveLink(linkName);
    }

    useEffect(() => {
        const activeElement = document.querySelector(`.${s.navGroupElement}.active`);

        if (activeElement && sliderRef.current) {
            const rect = activeElement.getBoundingClientRect();
            const containerRect = activeElement.parentElement?.getBoundingClientRect();


            if (containerRect) {
                const newLeft = rect.left - containerRect.left;

                sliderRef.current.style.width = `${Math.min(rect.width + 26, containerRect.width)}px`;
                sliderRef.current.style.left = `${newLeft - 12}px`;
            }
        }

    }, [activeLink]); 

    // przezroczyste tło jak zjezdzamy
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const handleScroll = useCallback(() => {
        const offset = window.scrollY;
        setIsScrolled(offset > 100)
    },[])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    },[])

    return (
        <div className={`row align-items-center text-center px-1 pt-2 p-sm-3 ${windowWidth > 768 ? 'fixed-top' : ''} transition ${isScrolled && (windowWidth > 768) ? `${s.scrolledHeader} mx-3 mt-2 shadow rounded-4` : 'bg-white'}`}>
            <div className='col-6 col-md-3 order-1 d-flex justify-content-start justify-content-md-center align-items-center'>
                <a href='/'><img src={logo} className='img-fluid' alt='Logo CashFlow' /></a>
            </div>
            <div className={`col-12 col-md-6 order-3 order-md-2 mt-md-0 d-none d-md-flex align-items-end align-items-md-center justify-content-center transition`}>

                <div className={`nav-group bg-secondary rounded-5 px-2 py-1 position-relative d-flex`}>
                    <a className={`${s.navGroupElement} mx-1 px-sm-3 py-1 rounded-5 ${activeLink === 'Home' ? 'active text-white' : ''}`} onClick={() => handleClick('Home')} href='#home-page-home'>Home</a>
                    <a className={`${s.navGroupElement} mx-1 px-sm-3 py-1 rounded-5 ${activeLink === 'Features' ? 'active text-white' : ''}`} onClick={() => handleClick('Features')} href='#home-page-features'>Features</a>
                    <a className={`${s.navGroupElement} mx-1 px-sm-3 py-1 rounded-5 ${activeLink === 'Testimonial' ? 'active text-white' : ''}`} onClick={() => handleClick('Testimonial')} href='#home-page-testimonial'>Testimonial</a>
                    <span ref={sliderRef} className={`${s.navSlider} position-absolute rounded-5 shadow`}></span>
                </div>

            </div>
            <div className='col-6 col-md-3 order-2 order-md-3 d-flex align-items-center justify-content-end justify-content-md-center'>
                <button onClick={() => routeChange('/register')} type='button' className='btn btn-primary rounded-5 px-4 py-2'>
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default Header