import React, { useState, useEffect, useRef, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  Container,
  Card,
  Table,
  Form,
  Button,
  Spinner,
  Badge,
  Pagination,
  Row,
  Col,
  Alert,
  Modal,
  InputGroup,
  ListGroup
} from "react-bootstrap";
import {
  Ticket,
  SortDown,
  SortUp,
  Search,
  Clock,
  ExclamationCircle,
  Chat,
  PersonCircle,
  Send,
  Filter,
  ThreeDotsVertical,
  ArrowRepeat,
  XCircle,
  FileEarmark,
  Calendar,
  Person,
  Telephone,
  Envelope,
  InfoCircle
} from "react-bootstrap-icons";
import { AuthContext } from '../../context/AuthContext';
import { Link } from "react-router-dom";
import "../../Styles/User/Tickets.css";

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "ALL", priority: "ALL", search: "" });
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);

  // Chat-related states
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [employees, setEmployees] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [typingUsers, setTypingUsers] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const ticketsPerPage = 8;
  const API_BASE = "http://localhost:8080/api";

  // Get userId from AuthContext
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchTickets();
      fetchEmployees();
    }
    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    filterAndSortTickets();
  }, [filters, tickets, sortConfig]);

  // API call function with authentication
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication token is missing or invalid. Please login again.");
          localStorage.removeItem("token");
          window.location.href = '/login';
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      setError(error.message || "Failed to fetch data");
      throw error;
    }
  };

  const filterAndSortTickets = () => {
    let result = [...tickets];

    if (filters.status !== "ALL") {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== "ALL") {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term)) ||
          (t.assignedTo && t.assignedTo.toLowerCase().includes(term))
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredTickets(result);
    setCurrentPage(1);
  };

  const fetchTickets = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!userId) {
        throw new Error("User not authenticated. Please login again.");
      }
      
      const data = await apiCall(`/tickets/user/${userId}`);
      if (data) {
        setTickets(data);
        setFilteredTickets(data);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Failed to fetch tickets. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await apiCall("/employees/all");
      if (data) {
        const map = {};
        data.forEach((emp) => (map[emp.id] = emp));
        setEmployees(map);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      setLoadingMessages(true);
      const data = await apiCall(`/messages/${ticketId}`);
      if (data) {
        setMessages(data);
      }
    } catch (err) {
      setError("Failed to load chat messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const setupWebSocket = (ticketId) => {
    setConnectionStatus("connecting");
    
    const token = localStorage.getItem("token");
    const socket = new SockJS(`${API_BASE}/ws?token=${token}`);
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        setConnectionStatus("connected");
        console.log("WebSocket connected successfully");

        client.subscribe(`/topic/chat.${ticketId}`, (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });

        client.subscribe(`/topic/chat.typing.${ticketId}`, (notif) => {
          const data = JSON.parse(notif.body);
          if (data.typing) {
            setTypingUsers((prev) => [...new Set([...prev, data.senderName])]);
            setTimeout(() => setTypingUsers((prev) => prev.filter((u) => u !== data.senderName)), 3000);
          } else {
            setTypingUsers((prev) => prev.filter((u) => u !== data.senderName));
          }
        });
      },
      onDisconnect: () => {
        setConnectionStatus("disconnected");
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        setConnectionStatus("error");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
      }
    });
    
    client.activate();
    setStompClient(client);
    return client;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTicket || !stompClient) return;
    
    const msg = {
      content: newMessage.trim(),
      senderId: userId,
      senderName: user?.name || "User",
      senderType: user?.role || "USER",
      ticketId: selectedTicket.id,
      messageType: "TEXT",
    };
    
    stompClient.publish({
      destination: `/app/chat.send.${selectedTicket.id}`,
      body: JSON.stringify(msg),
      headers: { 
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    setNewMessage("");
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  const openChat = async (ticket) => {
    setSelectedTicket(ticket);
    setShowChatModal(true);
    if (stompClient) stompClient.deactivate();
    await fetchMessages(ticket.id);
    setupWebSocket(ticket.id);
  };

  const closeChat = () => {
    setShowChatModal(false);
    setSelectedTicket(null);
    setMessages([]);
    setTypingUsers([]);
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
    setConnectionStatus("disconnected");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(true);
    setTimeout(() => {
      const msg = {
        content: `File: ${file.name}`,
        senderId: userId,
        senderName: user?.name || "User",
        senderType: user?.role || "USER",
        ticketId: selectedTicket.id,
        messageType: "FILE",
        attachments: { fileName: file.name, fileType: file.type, fileSize: file.size },
      };
      stompClient.publish({
        destination: `/app/chat.send.${selectedTicket.id}`,
        body: JSON.stringify(msg),
        headers: { 
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      setUploadingFile(false);
      fileInputRef.current.value = "";
    }, 1500);
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ThreeDotsVertical className="ms-1 text-muted" />;
    return sortConfig.direction === "asc" ? 
      <SortUp className="ms-1" /> : <SortDown className="ms-1" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN": return <Badge bg="warning" className="text-dark">Open</Badge>;
      case "IN_PROGRESS": return <Badge bg="primary">In Progress</Badge>;
      case "RESOLVED": 
      case "RESOLVE": return <Badge bg="success">Resolved</Badge>;
      case "CLOSED": return <Badge bg="secondary">Closed</Badge>;
      case "REJECTED": return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH": return <ExclamationCircle className="text-danger me-1" />;
      case "MEDIUM": return <ExclamationCircle className="text-warning me-1" />;
      case "LOW": return <ExclamationCircle className="text-info me-1" />;
      default: return <ExclamationCircle className="text-secondary me-1" />;
    }
  };

  const getConnectionStatusBadge = () => {
    switch(connectionStatus) {
      case "connected": return <Badge bg="success">Connected</Badge>;
      case "connecting": return <Badge bg="warning">Connecting...</Badge>;
      case "error": return <Badge bg="danger">Connection Error</Badge>;
      default: return <Badge bg="secondary">Disconnected</Badge>;
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination
  const idxLast = currentPage * ticketsPerPage;
  const idxFirst = idxLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(idxFirst, idxLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading tickets...</span>
      </div>
    );
  }

  return (
    <Container className="tickets-page py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">My Support Tickets</h2>
          <p className="text-muted">Manage and track all your support requests</p>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Button variant="primary" as={Link} to="/user-portal/new-ticket">
            <Ticket className="me-2" /> New Ticket
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <ExclamationCircle className="me-2" />
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchTickets}>
              <ArrowRepeat className="me-1" /> Try Again
            </Button>
          </div>
        </Alert>
      )}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="RESOLVE">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredTickets.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>
                        <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('id')}>
                          <span>ID</span>
                          {renderSortIcon('id')}
                        </div>
                      </th>
                      <th>Title</th>
                      <th>
                        <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('status')}>
                          <span>Status</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>
                      <th>
                        <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('priority')}>
                          <span>Priority</span>
                          {renderSortIcon('priority')}
                        </div>
                      </th>
                      <th>Assigned To</th>
                      <th>
                        <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                          <span>Created</span>
                          {renderSortIcon('createdAt')}
                        </div>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>
                          <div className="d-flex align-items-start">
                            <div>
                              <div className="fw-semibold">{ticket.title}</div>
                              <small className="text-muted">{ticket.category || 'No category'}</small>
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {getPriorityIcon(ticket.priority)}
                            <span>{ticket.priority}</span>
                          </div>
                        </td>
                        <td>
                          {ticket.assignedTo ? (
                            <div className="d-flex align-items-center">
                              <PersonCircle className="text-primary me-2" />
                              <span>{ticket.assignedTo}</span>
                            </div>
                          ) : (
                            <Badge bg="secondary">Unassigned</Badge>
                          )}
                        </td>
                        <td>
                          <div>{formatDate(ticket.createdAt)}</div>
                          <small className="text-muted">
                            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openChat(ticket)}
                          >
                            <Chat className="me-1" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="text-muted">
                      Showing {idxFirst + 1} to {Math.min(idxLast, filteredTickets.length)} of {filteredTickets.length} tickets
                    </span>
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.Prev 
                      disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === totalPages} 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <Ticket size={48} className="text-muted mb-3" />
              <h5>No tickets found</h5>
              <p className="text-muted">
                {filters.search || filters.status !== "ALL" || filters.priority !== "ALL" 
                  ? 'Try adjusting your search or filters' 
                  : 'You haven\'t created any tickets yet'
                }
              </p>
              {!filters.search && filters.status === "ALL" && filters.priority === "ALL" && (
                <Button as={Link} to="/user-portal/new-ticket" variant="primary" className="mt-2">
                  Create Your First Ticket
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Chat Modal */}
      <Modal show={showChatModal} onHide={closeChat} size="lg" className="chat-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Ticket #{selectedTicket?.id} - {selectedTicket?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {selectedTicket && (
            <div className="ticket-details mb-4">
              <Row>
                <Col md={6}>
                  <h6>Ticket Information</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Status</span>
                      {getStatusBadge(selectedTicket.status)}
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Priority</span>
                      <span>
                        {getPriorityIcon(selectedTicket.priority)}
                        {selectedTicket.priority}
                      </span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <h6>Details</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Created</span>
                      <span>{formatDate(selectedTicket.createdAt)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Category</span>
                      <span>{selectedTicket.category || 'N/A'}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              
              <h6 className="mt-4">Description</h6>
              <Card>
                <Card.Body>
                  {selectedTicket.description || 'No description provided.'}
                </Card.Body>
              </Card>
            </div>
          )}

          <div className="chat-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Conversation</h6>
              <div className="d-flex align-items-center">
                {getConnectionStatusBadge()}
                {connectionStatus !== 'connected' && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setupWebSocket(selectedTicket.id)}
                    className="ms-2"
                  >
                    <ArrowRepeat size={14} className="me-1" />
                    Reconnect
                  </Button>
                )}
              </div>
            </div>
            
            <div className="chat-messages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {loadingMessages ? (
                <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <p className="mt-2 small text-muted">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message mb-3 p-3 ${message.senderType === 'USER' ? 'user-message bg-primary text-white' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold">{message.senderName}</span>
                      <span className="small">{formatMessageTime(message.timestamp)}</span>
                    </div>
                    <div className="message-body">
                      {message.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  No messages yet. Start the conversation!
                </div>
              )}
              
              {typingUsers.length > 0 && (
                <div className="typing-indicator mb-2">
                  <small className="text-muted">
                    {typingUsers.join(', ')} 
                    {typingUsers.length === 1 ? ' is ' : ' are '}
                    typing...
                  </small>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-3">
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message here..."
                    disabled={connectionStatus !== 'connected'}
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                  >
                    <Send size={16} />
                  </Button>
                </InputGroup>
                {connectionStatus !== 'connected' && (
                  <div className="text-muted small mt-1">
                    <XCircle size={14} className="me-1" />
                    Cannot send messages while disconnected
                  </div>
                )}
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tickets;