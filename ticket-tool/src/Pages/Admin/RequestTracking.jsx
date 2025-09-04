// src/Pages/User/RequestTracking.jsx
import React, { useState } from 'react';
import { Container, Card, Table, Form, Button } from 'react-bootstrap';
import { FaSearch, FaPlus, FaTicketAlt } from 'react-icons/fa';

const RequestTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([
    { id: 'REQ-001', title: 'Software Installation', status: 'Open', date: '2023-06-15', priority: 'High' },
    { id: 'REQ-002', title: 'Hardware Replacement', status: 'In Progress', date: '2023-06-10', priority: 'Medium' },
    { id: 'REQ-003', title: 'Network Access', status: 'Completed', date: '2023-06-05', priority: 'Low' },
    { id: 'REQ-004', title: 'Account Setup', status: 'Open', date: '2023-06-18', priority: 'High' },
  ]);

  const filteredRequests = requests.filter(request => 
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaTicketAlt className="me-2" />Request Tracking</h2>
          <p className="text-muted">Manage and track your support requests</p>
        </div>
        <Button variant="primary">
          <FaPlus className="me-1" /> New Request
        </Button>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Form.Group className="mb-0" style={{ width: '300px' }}>
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <Form.Control 
                  type="text" 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Form.Group>
            
            <div>
              <Form.Select size="sm">
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.title}</td>
                  <td>
                    <span className={`badge bg-${
                      request.status === 'Open' ? 'warning' : 
                      request.status === 'In Progress' ? 'info' : 
                      'success'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{request.date}</td>
                  <td>
                    <span className={`badge bg-${
                      request.priority === 'High' ? 'danger' : 
                      request.priority === 'Medium' ? 'warning' : 
                      'secondary'
                    }`}>
                      {request.priority}
                    </span>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequestTracking;