import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="text-center p-4" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <div className="text-danger mb-3" style={{ fontSize: '4rem' }}>
            <i className="bi bi-shield-exclamation"></i>
          </div>
          <h2>Access Denied</h2>
          <p className="text-muted mb-4">
            You don't have permission to access this resource.
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button variant="outline-secondary" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button 
              as={Link} 
              to="/user-portal/dashboard" 
              variant="primary"
            >
              Return to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccessDenied;