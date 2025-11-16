import React from 'react';
import Header from '../components/Header.tsx'

const HomePage: React.FC = () => {
    return (
        <>
            <div id='navbar-main' className='container-fluid'>
                <Header />
            </div>
            <div className='container'>
                <p>cwel</p>
            </div>
            <div className='container-fluid'>
                <p>cwel</p>
            </div>
        </>
    );
};

export default HomePage;