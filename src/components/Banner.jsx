import React from 'react';

const Banner = () => {
  return (
    <>
      <div 
        className="position-relative text-center text-white py-5"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat`
        }}
      >
        <h1 className="display-3 fw-bold">Thời sự</h1>
      </div>
      <nav className="bg-dark bg-opacity-100">
        <ul className="nav justify-content-center">
          <li className="nav-item" style={{ margin: '0 15px' }}>
            <a 
              className="nav-link active text-white" 
              style={{ padding: '10px 15px' }} 
              href="../subcategory/thoisutrongnuoc.html"
            >
              Trong nước
            </a>
          </li>
          <li className="nav-item" style={{ margin: '0 15px' }}>
            <a 
              className="nav-link text-white" 
              style={{ padding: '10px 15px' }} 
              href="../subcategory/thoisuquocte.html"
            >
              Quốc tế
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Banner;