import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center p-5 shadow rounded-3 bg-white">
        <div className="mb-4">
          <div className="position-relative">
            <div className="bg-danger opacity-25 rounded-circle position-absolute top-50 start-50 translate-middle" style={{ width: '200px', height: '200px' }}></div>
            <i className="bi bi-shield-lock-fill text-danger display-1 position-relative"></i>
          </div>
        </div>
        
        <h1 className="fw-bold mb-3">Access Denied</h1>
        <p className="lead mb-4">
          You don't have permission to access this resource.
          <br />
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Go Back
          </Button>
          <Button variant="outline-primary" as={Link} to="/">
            <i className="bi bi-house-door me-2"></i>Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;