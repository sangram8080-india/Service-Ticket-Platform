import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center ${fullPage ? 'vh-100' : ''}`}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {fullPage && <span className="ms-3">Loading...</span>}
    </div>
  );
};

export default LoadingSpinner;