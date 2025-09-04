// Simple TicketDetails component example
import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';

const TicketDetails = ({ ticket }) => {
  if (!ticket) return <div>No ticket selected</div>;

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h4>{ticket.title || 'No Title'}</h4>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <strong>Status:</strong> 
          <Badge bg="primary" className="ms-2">
            {ticket.status || 'Unknown'}
          </Badge>
        </Col>
        <Col md={6}>
          <strong>Priority:</strong> 
          <Badge bg="warning" className="ms-2">
            {ticket.priority || 'Unknown'}
          </Badge>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <strong>Description:</strong>
          <Card className="mt-2">
            <Card.Body>
              {ticket.description || 'No description provided'}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <strong>Created:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
        </Col>
        <Col md={6}>
          <strong>Last Updated:</strong> {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'N/A'}
        </Col>
      </Row>
    </div>
  );
};

export default TicketDetails;