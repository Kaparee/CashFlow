import React from 'react'

const Footer: React.FC = () => {
    return (
        <div className='container-md pb-5'>
            <div className='row border border-2 bg-white rounded-4 shadow p-3 border-primary'>
                <div className="col-12 col-md-6 col-lg-4 user-select-none">
                    <h4 className="fw-bold mb-2 text-gradient">CashFlow</h4>
                    <p className=" mb-3">
                        Przejmij kontrolę nad swoimi finansami. <br />
                        Planuj, oszczędzaj i realizuj cele bez stresu.
                    </p>
                </div>
                <div className={`col-12 col-md-6 col-lg-4 d-flex flex-column text-center`}>
                    <a href='#' className='text-dark text-decoration-none'>Regulamin</a>
                    <a href='#' className='text-dark text-decoration-none'>Prywatność</a>
                    <a href='#' className='text-dark text-decoration-none'>Cookies</a>
                    <a href='#' className='text-dark text-decoration-none'>RODO</a>
                </div>
                <div className={`col-12 col-lg-4 d-flex justify-content-center`}>
                    <a href='#' className='fs-2 text-gradient me-3 text-decoration-none'><i className="bi bi-facebook"></i></a>
                    <a href='#' className='fs-2 text-gradient me-3 text-decoration-none'><i className="bi bi-linkedin"></i></a>
                    <a href='#' className='fs-2 text-gradient me-3 text-decoration-none'><i className="bi bi-instagram"></i></a>
                    <a href='#' className='fs-2 text-gradient me-3 text-decoration-none'><i className="bi bi-twitter-x"></i></a>
                </div>
                <hr className='border-gradient border-2 mt-3' />
                <div className='text-center small text-opacity-50 col-12 user-select-none'>&copy; {new Date().getFullYear()} CashFlow Wszystkie prawa zastrzeżone.</div>
            </div>
        </div>
    );
};

export default Footer;