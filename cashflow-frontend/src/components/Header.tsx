import React, { useState, useRef, useEffect, useCallback } from 'react'
import logo from '../assets/logo.svg'
import './Header.css'
import { Link } from 'react-router-dom';

const Header: React.FC = () => {

    // main menu w headerze
    const [activeLink, setActiveLink] = useState<string>('Home');

    const sliderRef = useRef<HTMLSpanElement | null>(null);

    const handleClick = (linkName: string) => {
        setActiveLink(linkName);
    }

    useEffect(() => {
        const activeElement = document.querySelector(`.nav-group-element.active`);

        if (activeElement && sliderRef.current) {
            const rect = activeElement.getBoundingClientRect();
            const containerRect = activeElement.parentElement?.getBoundingClientRect();

            const style = window.getComputedStyle(activeElement);


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
        <div className={`row align-items-center text-center p-3 fixed-top transition ${isScrolled ? 'scrolled-header mx-3 mt-2 shadow rounded-4' : 'bg-white'}`}>
            <div className='offset-1 col-2 d-flex justify-content-center align-items-center'>
                <a href='/'><img src={logo} className='img-fluid' alt='Logo CashFlow' /></a>
            </div>
            <div className='col-6 d-flex align-items-end justify-content-center'>

                <div className='nav-group bg-secondary rounded-5 px-2 py-1 position-relative d-flex'>
                    <a className={`nav-group-element mx-1 px-3 py-1 rounded-5 ${activeLink === 'Home' ? 'active' : ''}`} onClick={() => handleClick('Home')} href='#home-page-home'>Home</a>
                    <a className={`nav-group-element mx-1 px-3 py-1 rounded-5 ${activeLink === 'Features' ? 'active' : ''}`} onClick={() => handleClick('Features')} href='#home-page-features'>Features</a>
                    <a className={`nav-group-element mx-1 px-3 py-1 rounded-5 ${activeLink === 'Help' ? 'active' : ''}`} onClick={() => handleClick('Help')} href='#home-page-help'>Help</a>
                    <span ref={sliderRef} className='nav-slider position-absolute rounded-5 shadow'></span>
                </div>

            </div>
            <div className='col-3'>
                <button type='button' className='btn btn-primary rounded-5 px-4 py-2'>
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default Header