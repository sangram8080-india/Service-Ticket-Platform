// src/pages/TicketManagement.js
import React, { useState, useEffect } from 'react';
import { 
  Button, Spinner, Alert, Badge, Card, Form, Row, Col, 
  Modal, Table, Dropdown
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaPlus, 
  FaDownload, FaEllipsisV, FaCheck, FaTimes
} from 'react-icons/fa';
// Example fix for TaskManagement.jsx
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Pagination from '../../Components/Pagination';
import TicketForm from './TicketForm';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = async (page = currentPage) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = {
        page: page - 1,
        size: itemsPerPage,
        search: searchTerm,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        priority: filterPriority !== 'ALL' ? filterPriority : undefined
      };
      
      const response = await axios.get('http://localhost:8080/api/tickets/all', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTickets(response.data.content);
      setTotalItems(response.data.totalElements);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError('Failed to fetch tickets. Please try again later.');
      setLoading(false);
      setRefreshing(false);
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, filterStatus, filterPriority, refreshing]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:8080/api/tickets/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTickets();
      } catch (err) {
        setError('Failed to delete ticket.');
        console.error('Error deleting ticket:', err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:8080/api/tickets/${id}/status-update`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket status.');
      console.error('Error updating ticket status:', err);
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:8080/api/tickets/${id}/priority`, 
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket priority.');
      console.error('Error updating ticket priority:', err);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setRefreshing(true);
  };

  const openDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const exportTickets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:8080/api/reports/excel', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tickets_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export tickets.');
      console.error('Error exporting tickets:', err);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3">
      <h1 className="h2 my-3">Ticket Management</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {/* Filters and Actions */}
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            
            <Col md={3}>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>
                <Form.Select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </Form.Select>
              </div>
            </Col>
            
            <Col md={3}>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>
                <Form.Select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Form.Select>
              </div>
            </Col>
            
            <Col md={2} className="d-flex gap-2">
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <FaPlus className="me-1" /> Create
              </Button>
              <Button variant="outline-secondary" onClick={exportTickets}>
                <FaDownload />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tickets Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Requester</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.ticketNumber}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.createdBy.name}</td>
                      <td>{ticket.assignedTo?.name || 'Unassigned'}</td>
                      <td>
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" id="actions-dropdown">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openDetails(ticket)}>
                              <FaEye className="me-2" /> View Details
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/admin/tickets/edit/${ticket.id}`)}>
                              <FaEdit className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(ticket.id)}>
                              <FaTrash className="me-2" /> Delete
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Change Status</Dropdown.Header>
                            <Dropdown.Item onClick={() => handleStatusChange(ticket.id, 'OPEN')}>
                              <FaCheck className="me-2 text-primary" /> Open
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')}>
                              <FaCheck className="me-2 text-warning" /> In Progress
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(ticket.id, 'RESOLVED')}>
                              <FaCheck className="me-2 text-success" /> Resolved
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(ticket.id, 'CLOSED')}>
                              <FaTimes className="me-2 text-secondary" /> Closed
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Change Priority</Dropdown.Header>
                            <Dropdown.Item onClick={() => handlePriorityChange(ticket.id, 'LOW')}>
                              <Badge bg="success" className="me-2">Low</Badge> 
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePriorityChange(ticket.id, 'MEDIUM')}>
                              <Badge bg="warning" className="me-2">Medium</Badge>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePriorityChange(ticket.id, 'HIGH')}>
                              <Badge bg="danger" className="me-2">High</Badge>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePriorityChange(ticket.id, 'CRITICAL')}>
                              <Badge bg="dark" className="me-2">Critical</Badge>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchTickets(page);
            }}
          />
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TicketForm 
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Ticket Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="xl">
        {selectedTicket && (
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Modal.Title>
                Ticket #{selectedTicket.ticketNumber} - {selectedTicket.title}
              </Modal.Title>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
            
            <div className="row mb-4">
              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="card-title">Details</h5>
                    <div className="mb-2">
                      <strong>Status:</strong> <StatusBadge status={selectedTicket.status} />
                    </div>
                    <div className="mb-2">
                      <strong>Priority:</strong> <PriorityBadge priority={selectedTicket.priority} />
                    </div>
                    <div className="mb-2">
                      <strong>Category:</strong> {selectedTicket.category || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <strong>Last Updated:</strong> {new Date(selectedTicket.updatedAt).toLocaleString()}
                    </div>
                  </Card.Body>
                </Card>
                
                <Card>
                  <Card.Body>
                    <h5 className="card-title">Description</h5>
                    <p>{selectedTicket.description}</p>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="card-title">People</h5>
                    <div className="mb-2">
                      <strong>Created By:</strong> {selectedTicket.createdBy.name} ({selectedTicket.createdBy.email})
                    </div>
                    <div className="mb-2">
                      <strong>Assigned To:</strong> {selectedTicket.assignedTo ? 
                        `${selectedTicket.assignedTo.name} (${selectedTicket.assignedTo.email})` : 'Unassigned'}
                    </div>
                  </Card.Body>
                </Card>
                
                <Card>
                  <Card.Body>
                    <h5 className="card-title">Actions</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Button 
                        variant="outline-primary"
                        onClick={() => navigate(`/admin/tickets/edit/${selectedTicket.id}`)}
                      >
                        <FaEdit className="me-1" /> Edit Ticket
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(selectedTicket.id)}
                      >
                        <FaTrash className="me-1" /> Delete Ticket
                      </Button>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Change Status</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                          <Button
                            key={status}
                            variant="outline-secondary"
                            className={selectedTicket.status === status ? 'active' : ''}
                            onClick={() => handleStatusChange(selectedTicket.id, status)}
                          >
                            <StatusBadge status={status} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h6>Change Priority</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(priority => (
                          <Button
                            key={priority}
                            variant="outline-secondary"
                            className={selectedTicket.priority === priority ? 'active' : ''}
                            onClick={() => handlePriorityChange(selectedTicket.id, priority)}
                          >
                            <PriorityBadge priority={priority} />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
};

export default TicketManagement;