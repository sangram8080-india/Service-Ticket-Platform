import React, { useState } from 'react';
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaSearch, FaTicketAlt, FaEye } from 'react-icons/fa';

const Tickets = () => {
  const [tickets, setTickets] = useState([
    { 
      id: 'TKT-001', 
      subject: 'Unable to access company portal', 
      status: 'Open', 
      priority: 'High', 
      created: '2023-06-15', 
      updated: '2023-06-18',
      description: 'I cannot access the employee portal with my credentials'
    },
    { 
      id: 'TKT-002', 
      subject: 'Software installation request', 
      status: 'In Progress', 
      priority: 'Medium', 
      created: '2023-06-10', 
      updated: '2023-06-17',
      description: 'Need Adobe Creative Suite installed on my workstation'
    },
    { 
      id: 'TKT-003', 
      subject: 'Password reset needed', 
      status: 'Resolved', 
      priority: 'Low', 
      created: '2023-06-05', 
      updated: '2023-06-08',
      description: 'My domain password needs to be reset'
    },
    { 
      id: 'TKT-004', 
      subject: 'Monitor not working', 
      status: 'Open', 
      priority: 'High', 
      created: '2023-06-18', 
      updated: '2023-06-18',
      description: 'My secondary monitor is not displaying anything'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Open': return 'warning';
      case 'In Progress': return 'info';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority) => {
    switch(priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleCreateTicket = () => {
    // Implementation for creating a new ticket
    console.log('Create new ticket clicked');
  };

  const handleViewTicket = (ticketId) => {
    // Implementation for viewing ticket details
    console.log('View ticket:', ticketId);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-between align-items-center mb-4">
        <Col md={6}>
          <h2 className="h4"><FaTicketAlt className="me-2" />My Support Tickets</h2>
          <p className="text-muted mb-0">View and manage your support requests</p>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleCreateTicket}>
            <FaPlus className="me-1" /> New Ticket
          </Button>
        </Col>
      </Row>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <Form.Group>
                <div className="input-group">
                  <span className="input-group-text"><FaSearch /></span>
                  <Form.Control 
                    type="text" 
                    placeholder="Search tickets..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created Date</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="fw-semibold">{ticket.id}</td>
                  <td>
                    <div>{ticket.subject}</div>
                    <small className="text-muted">{ticket.description}</small>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getPriorityVariant(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td>{ticket.created}</td>
                  <td>{ticket.updated}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewTicket(ticket.id)}
                    >
                      <FaEye className="me-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <p className="text-muted mb-0">No tickets found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Tickets;