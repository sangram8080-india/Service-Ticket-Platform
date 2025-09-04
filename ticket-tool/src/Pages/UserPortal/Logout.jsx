// src/Pages/UserPortal/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all user-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    // Redirect after a short delay to show spinner
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;