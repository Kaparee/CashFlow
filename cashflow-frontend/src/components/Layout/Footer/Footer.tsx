import React from 'react'

const Footer: React.FC = () => {
    return (
        <div className='container-md pb-5 px-4'>
            <div className='row bg-white rounded-4 shadow-lg p-3'>
                <div className="col-12 col-sm-6 col-lg-4 user-select-none">
                    <h4 className="fw-bold mb-2 text-gradient">CashFlow</h4>
                    <p className=" mb-3">
                        Przejmij kontrolę nad swoimi finansami. <br />
                        Planuj, oszczędzaj i realizuj cele bez stresu.
                    </p>
                </div>
                <div className={`col-12 col-sm-6 col-lg-4 row flex-sm-column text-start text-sm-end text-lg-center justify-content-center justify-content-md-end justify-content-lg-center `}>
                    <a href='#' className='text-dark text-decoration-none me-2 me-sm-0'>Regulamin</a>
                    <a href='#' className='text-dark text-decoration-none me-2 me-sm-0'>Prywatność</a>
                    <a href='#' className='text-dark text-decoration-none me-2 me-sm-0'>Cookies</a>
                    <a href='#' className='text-dark text-decoration-none me-2 me-sm-0'>RODO</a>
                </div>
                <div className={`col-12 col-lg-4 d-flex justify-content-start justify-content-sm-center justify-content-lg-end align-items-center`}>
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