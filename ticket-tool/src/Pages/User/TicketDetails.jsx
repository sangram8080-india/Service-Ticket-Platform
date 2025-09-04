import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Card, Row, Col, Button, Badge, Spinner, 
  Form, Alert, Tab, Tabs, Modal
} from 'react-bootstrap';
import { 
  ArrowLeft, Ticket, Clock, PersonCircle, GeoAlt, 
  InfoCircle, Calendar, Chat, Telephone, Envelope, Paperclip
} from 'react-bootstrap-icons';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../../Styles/User/TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        const response = await axios.get(
          `http://localhost:8080/api/tickets/id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Fetch employee details if assigned
        if (response.data.assignedToId) {
          const employeeResponse = await axios.get(
            `http://localhost:8080/api/employees/${response.data.assignedToId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          response.data.assignedEmployee = employeeResponse.data;
        }
        
        setTicket(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch ticket:', err);
        setError('Failed to load ticket details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      // Setup WebSocket connection for real-time chat
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
        onConnect: () => {
          console.log('Connected to WebSocket for ticket chat');
          
          // Subscribe to chat messages for this ticket
          client.subscribe(`/topic/ticket/${id}/chat`, (message) => {
            const newMessage = JSON.parse(message.body);
            setTicket(prev => ({
              ...prev,
              comments: [...(prev.comments || []), newMessage]
            }));
          });
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
        }
      });
      
      client.activate();
      setStompClient(client);
      
      return () => {
        if (client.connected) {
          client.deactivate();
        }
      };
    }
  }, [ticket, id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName') || 'User';
      
      const newMessage = {
        content: message,
        senderId: userId,
        senderName: userName,
        ticketId: id,
        timestamp: new Date().toISOString()
      };
      
      // Send message via WebSocket if connected, otherwise fallback to HTTP
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify(newMessage)
        });
      } else {
        await axios.post(
          'http://localhost:8080/api/messages',
          newMessage,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update UI with the new message
        setTicket(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newMessage]
        }));
      }
      
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleContactEmployee = (method) => {
    if (method === 'call' && ticket.assignedEmployee.phone) {
      window.open(`tel:${ticket.assignedEmployee.phone}`);
    } else if (method === 'email' && ticket.assignedEmployee.email) {
      window.open(`mailto:${ticket.assignedEmployee.email}`);
    }
    setShowContactModal(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'OPEN': return <Badge bg="warning" className="text-dark">Open</Badge>;
      case 'IN_PROGRESS': return <Badge bg="primary">In Progress</Badge>;
      case 'RESOLVED': return <Badge bg="success">Resolved</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'HIGH': return <InfoCircle className="text-danger me-1" />;
      case 'MEDIUM': return <InfoCircle className="text-warning me-1" />;
      default: return <InfoCircle className="text-info me-1" />;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading ticket details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/user-portal/tickets')}>
              Back to Tickets
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="ticket-detail-page py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" onClick={() => navigate('/user-portal/tickets')} className="me-3">
          <ArrowLeft /> Back to Tickets
        </Button>
        <h2 className="mb-0">Ticket #{ticket.id}</h2>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="details" title="Details">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">{ticket.title}</h3>
                <div>
                  {getStatusBadge(ticket.status)}
                  <span className="ms-2 d-inline-block">
                    {getPriorityIcon(ticket.priority)}
                    <span className="text-capitalize">{ticket.priority.toLowerCase()}</span>
                  </span>
                </div>
              </div>
              
              <Row className="mb-4">
                <Col md={8}>
                  <h5 className="mb-3">Description</h5>
                  <p className="text-muted">{ticket.description}</p>
                  
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="mt-4">
                      <h6 className="mb-3">Attachments</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {ticket.attachments.map((file, index) => (
                          <Button key={index} variant="outline-secondary" className="d-flex align-items-center">
                            <Paperclip className="me-2" />
                            {file}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
                
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="mb-3">Ticket Information</h6>
                      
                      <div className="d-flex align-items-center mb-3">
                        <PersonCircle className="me-2 text-primary" />
                        <div>
                          <div className="text-muted small">Assigned To</div>
                          <div className="fw-medium">{ticket.assignedTo || 'Not assigned yet'}</div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <Calendar className="me-2 text-primary" />
                        <div>
                          <div className="text-muted small">Created On</div>
                          <div className="fw-medium">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <GeoAlt className="me-2 text-primary" />
                        <div>
                          <div className="text-muted small">Location</div>
                          <div className="fw-medium">{ticket.location || 'Not specified'}</div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <Clock className="me-2 text-primary" />
                        <div>
                          <div className="text-muted small">Last Updated</div>
                          <div className="fw-medium">
                            {new Date(ticket.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  {ticket.assignedEmployee && (
                    <Card className="mt-3">
                      <Card.Body>
                        <h6 className="mb-3">Assigned Employee</h6>
                        
                        <div className="d-flex align-items-center mb-2">
                          <PersonCircle className="me-2 text-primary" />
                          <span className="fw-medium">{ticket.assignedEmployee.name}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <Telephone className="me-2 text-primary" />
                          <span>{ticket.assignedEmployee.phone}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <Envelope className="me-2 text-primary" />
                          <span>{ticket.assignedEmployee.email}</span>
                        </div>
                        
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => setShowContactModal(true)}
                        >
                          Contact Employee
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="chat" title="Chat">
          <Card>
            <Card.Body>
              <div className="chat-container">
                <div className="chat-messages" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {(ticket.comments || []).length > 0 ? (
                    ticket.comments.map((comment, index) => (
                      <div key={index} className={`message mb-3 p-3 ${comment.senderId === localStorage.getItem('userId') ? 'user-message bg-primary text-white' : 'support-message bg-light'}`}>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="fw-bold">{comment.senderName}</span>
                          <span className="small">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div>{comment.content}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <Chat size={48} className="mb-3" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                
                <Form onSubmit={handleSendMessage} className="mt-4">
                  <Form.Group>
                    <Form.Label>Send a message</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="me-2"
                      />
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={sending || !message.trim()}
                        className="align-self-end"
                      >
                        {sending ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* Contact Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How would you like to contact {ticket.assignedEmployee?.name}?</p>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              onClick={() => handleContactEmployee('call')}
              disabled={!ticket.assignedEmployee?.phone}
            >
              <Telephone className="me-2" /> Call
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => handleContactEmployee('email')}
              disabled={!ticket.assignedEmployee?.email}
            >
              <Envelope className="me-2" /> Email
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TicketDetail;