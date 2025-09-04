// src/Components/DashboardFooter.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const DashboardFooter = () => {
  return (
    <footer className="dashboard-footer bg-light py-3 border-top">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            <span className="text-muted small">
              Service Ticket System v1.0.0
            </span>
          </Col>
          <Col md={6} className="text-md-end">
            <span className="text-muted small">
              © {new Date().getFullYear()} ServiceHub. All rights reserved.
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default DashboardFooter;