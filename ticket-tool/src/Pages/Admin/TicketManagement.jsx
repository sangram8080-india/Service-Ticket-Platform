import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Table, Badge, 
  Spinner, Alert, Modal, ListGroup, InputGroup, Tabs, Tab,
  Dropdown, Pagination, ButtonGroup, Toast, ToastContainer
} from 'react-bootstrap';
import { 
  FaTicketAlt, FaSearch, FaFilter, FaSync, FaEye, FaTrash, 
  FaUserCircle, FaExclamationCircle, FaCheckCircle, FaSort, 
  FaSortUp, FaSortDown, FaClock, FaFileExport, FaCheck,
  FaPlus, FaCog, FaPaperPlane, FaUserPlus, FaComments, FaUserCheck
} from 'react-icons/fa';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../../Styles/Admin/TicketManagement.css';

const TicketManagement = () => {
  // State management
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assigned: 'all',
    category: 'all'
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [webSocketStatus, setWebSocketStatus] = useState('disconnected');
  const [toasts, setToasts] = useState([]);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedTicketRef = useRef(selectedTicket);

  // API base URL
  const API_BASE = "http://localhost:8080/api";

  // Add a toast message
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Update the ref when selectedTicket changes
  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  // Function to make API calls with authentication
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem("authToken");
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
          setError("Authentication token is missing or invalid. Please log in again.");
          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          // Redirect to login
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

  // Fetch employees for assignment
  const fetchEmployees = useCallback(async () => {
    try {
      const data = await apiCall('/employees/available');
      if (data) {
        // Filter out admins and only show employees
        const employeeList = data.filter(emp => 
          emp.role && emp.role.toUpperCase() === 'EMPLOYEE'
        );
        setEmployees(employeeList);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees for assignment');
    }
  }, []);

  // WebSocket connection for chat - Fixed authentication
  const connectWebSocket = useCallback((ticketId) => {
    try {
      setWebSocketStatus('connecting');
      
      // Get the authentication token
      const token = localStorage.getItem("authToken");
      
      // Create SockJS with proper authentication
      const socket = new SockJS(`${API_BASE}/ws`);
      
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        onConnect: () => {
          console.log('WebSocket connected successfully');
          setWebSocketStatus('connected');
          addToast('Chat connected successfully', 'success');
          
          // Subscribe to chat messages
          stompClient.current.subscribe(`/topic/chat.${ticketId}`, (message) => {
            try {
              const newMessage = JSON.parse(message.body);
              setMessages(prev => [...prev, newMessage]);
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          });
          
          // Subscribe to typing indicators
          stompClient.current.subscribe(`/topic/chat.typing.${ticketId}`, (typing) => {
            try {
              const typingData = JSON.parse(typing.body);
              if (typingData.typing) {
                setTypingUsers(prev => [...prev.filter(u => u.senderId !== typingData.senderId), typingData]);
              } else {
                setTypingUsers(prev => prev.filter(u => u.senderId !== typingData.senderId));
              }
            } catch (e) {
              console.error('Error parsing typing indicator:', e);
            }
          });
          
          // Request chat history
          if (stompClient.current.connected) {
            stompClient.current.publish({
              destination: `/app/chat.history.${ticketId}`,
              body: JSON.stringify({}),
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        },
        onDisconnect: () => {
          setWebSocketStatus('disconnected');
          addToast('Chat disconnected', 'warning');
        },
        onStompError: (error) => {
          console.error('WebSocket error:', error);
          
          // Check if it's an authentication error
          if (error.headers && error.headers.message && error.headers.message.includes('401')) {
            setError('Authentication failed. Please log in again.');
            // Clear invalid token and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          } else {
            setError('Failed to connect to chat');
          }
          
          setWebSocketStatus('error');
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (selectedTicketRef.current) {
              connectWebSocket(selectedTicketRef.current.id);
            }
          }, 5000);
        }
      });
      
      stompClient.current.activate();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setError('Failed to connect to chat service');
      setWebSocketStatus('error');
    }
  }, [API_BASE]);

  const disconnectWebSocket = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setWebSocketStatus('disconnected');
  }, []);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !stompClient.current || !stompClient.current.connected || !selectedTicket) return;
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem("authToken");
    const chatMessage = {
      content: newMessage,
      senderId: userData.id,
      senderName: userData.name,
      senderType: userData.role === 'USER' ? 'USER' : 'EMPLOYEE',
      ticketId: selectedTicket.id,
      messageType: 'TEXT'
    };
    
    try {
      stompClient.current.publish({
        destination: `/app/chat.send.${selectedTicket.id}`,
        body: JSON.stringify(chatMessage),
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage('');
      setTyping(false);
      
      // Send stop typing notification
      if (stompClient.current.connected) {
        stompClient.current.publish({
          destination: `/app/chat.typing.${selectedTicket.id}`,
          body: JSON.stringify({
            senderId: userData.id,
            senderName: userData.name,
            typing: false
          }),
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  }, [newMessage, selectedTicket]);

  const handleTyping = useCallback(() => {
    if (!stompClient.current || !stompClient.current.connected || !selectedTicket) return;
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem("authToken");
    
    if (!typing) {
      setTyping(true);
      stompClient.current.publish({
        destination: `/app/chat.typing.${selectedTicket.id}`,
        body: JSON.stringify({
          senderId: userData.id,
          senderName: userData.name,
          typing: true
        }),
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    
    // Reset typing indicator after 2 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: `/app/chat.typing.${selectedTicket.id}`,
          body: JSON.stringify({
            senderId: userData.id,
            senderName: userData.name,
            typing: false
          }),
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    }, 2000);
  }, [typing, selectedTicket]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Utility functions
  const getStatusDisplay = (status) => {
    const statusMap = {
      'OPEN': 'Open', 
      'IN_PROGRESS': 'In Progress', 
      'RESOLVE': 'Resolved',
      'CLOSED': 'Closed',
      'ASSIGNED': 'Assigned',
      'REJECTED': 'Rejected'
    };
    return statusMap[status] || status;
  };

  const getPriorityDisplay = (priority) => {
    const priorityMap = {
      'LOW': 'Low', 
      'MEDIUM': 'Medium', 
      'HIGH': 'High', 
      'URGENT': 'Urgent'
    };
    return priorityMap[priority] || priority;
  };

  const getBadgeVariant = (type, value) => {
    const variants = {
      status: { 
        'OPEN': 'warning', 
        'IN_PROGRESS': 'primary', 
        'RESOLVE': 'success',
        'CLOSED': 'secondary',
        'ASSIGNED': 'info',
        'REJECTED': 'danger'
      },
      priority: { 
        'LOW': 'info', 
        'MEDIUM': 'primary', 
        'HIGH': 'warning', 
        'URGENT': 'danger'
      }
    };
    return variants[type][value] || 'secondary';
  };

  const formatDate = (dateString) => {
    return dateString ? format(parseISO(dateString), 'PPpp') : 'N/A';
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = parseISO(dateString);
    const now = new Date();
    const diffMinutes = differenceInMinutes(now, date);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    
    return format(date, 'MMM d');
  };

  // Data fetching
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const userData = JSON.parse(localStorage.getItem('userData'));
      let endpoint = '/tickets/all';
      
      if (userData.role === 'EMPLOYEE') {
        endpoint = `/tickets/employee/${userData.id}`;
      } else if (userData.role === 'USER') {
        endpoint = `/tickets/user/${userData.id}`;
      }
      
      const data = await apiCall(endpoint);
      if (data) {
        setTickets(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (tickets) => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'OPEN').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVE').length,
      closed: tickets.filter(t => t.status === 'CLOSED').length
    };
    setStats(stats);
  };

  // Initial data loading
  useEffect(() => {
    fetchTickets();
    fetchEmployees();
  }, [fetchTickets, fetchEmployees]);

  // Filter and search tickets
  useEffect(() => {
    let result = tickets;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title?.toLowerCase().includes(term) || 
        ticket.description?.toLowerCase().includes(term) ||
        (ticket.assignedTo && ticket.assignedTo.name?.toLowerCase().includes(term)) ||
        (ticket.createdBy && ticket.createdBy.toLowerCase().includes(term)) ||
        ticket.id?.toString().includes(term)
      );
    }
    
    if (filters.status !== 'all') {
      result = result.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(ticket => ticket.priority === filters.priority);
    }
    
    if (filters.assigned !== 'all') {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (filters.assigned === 'me') {
        result = result.filter(ticket => ticket.assignedTo && ticket.assignedTo.id === userData.id);
      } else if (filters.assigned === 'unassigned') {
        result = result.filter(ticket => !ticket.assignedTo);
      }
    }
    
    setFilteredTickets(result);
    setCurrentPage(1);
  }, [tickets, searchTerm, filters]);

  // Handle ticket selection and WebSocket connection
  const handleTicketSelect = (ticket) => {
    disconnectWebSocket();
    
    setSelectedTicket(ticket);
    setShowDetails(true);
    setMessages([]);
    
    if (ticket) {
      connectWebSocket(ticket.id);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedTicket(null);
    disconnectWebSocket();
  };

  // Event handlers
  const handleRefresh = async () => {
    await fetchTickets();
    await fetchEmployees();
    setSuccess('Data refreshed successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await apiCall(`/tickets/${ticketId}/status/${newStatus}`, {
        method: 'PUT'
      });
      
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: newStatus } : t
      ));
      
      setSuccess('Status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const handleAssignTicket = async (ticketId, employeeId) => {
    try {
      await apiCall(`/tickets/${ticketId}/assign?employeeId=${employeeId}`, {
        method: 'PUT'
      });
      
      // Refetch the ticket to get updated data
      const updatedTicket = await apiCall(`/tickets/id/${ticketId}`);
      if (updatedTicket) {
        setTickets(prev => prev.map(t => 
          t.id === ticketId ? updatedTicket : t
        ));
      }
      
      addToast('Ticket assigned successfully', 'success');
    } catch (error) {
      console.error('Error assigning ticket:', error);
      addToast('Failed to assign ticket', 'danger');
    }
  };

  const handleUnassignTicket = async (ticketId) => {
    try {
      await apiCall(`/tickets/${ticketId}/assign?employeeId=null`, {
        method: 'PUT'
      });
      
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, assignedTo: null, status: 'OPEN' } : t
      ));
      
      addToast('Ticket unassigned successfully', 'success');
    } catch (error) {
      console.error('Error unassigning ticket:', error);
      addToast('Failed to unassign ticket', 'danger');
    }
  };

  const handleDeleteTicket = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await apiCall(`/tickets/delete/${ticketToDelete}/${userData.id}`, {
        method: 'DELETE'
      });
      
      setTickets(prev => prev.filter(t => t.id !== ticketToDelete));
      setShowDeleteModal(false);
      setTicketToDelete(null);
      
      addToast('Ticket deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      addToast('Failed to delete ticket', 'danger');
    }
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = sortedTickets.slice(startIndex, startIndex + itemsPerPage);

  // Render functions
  const renderStatusBadge = (status) => (
    <Badge bg={getBadgeVariant('status', status)}>
      {getStatusDisplay(status)}
    </Badge>
  );

  const renderPriorityBadge = (priority) => (
    <Badge bg={getBadgeVariant('priority', priority)}>
      {getPriorityDisplay(priority)}
    </Badge>
  );

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1 text-muted" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  const renderStatsCard = (title, count, variant, icon) => (
    <Card className="stats-card h-100">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className={`mb-0 text-${variant}`}>{count}</h3>
          </div>
          <div className={`icon-circle bg-${variant}`}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderTicketsTable = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="me-2" />
          <span>Loading tickets...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="text-center">
          <FaExclamationCircle className="me-2" />
          <span>{error}</span>
          <div className="mt-3">
            <Button variant="outline-primary" onClick={fetchTickets}>
              Try Again
            </Button>
          </div>
        </Alert>
      );
    }

    if (filteredTickets.length === 0) {
      return (
        <div className="text-center py-5">
          <FaTicketAlt size={48} className="text-muted mb-3" />
          <h5>No tickets found</h5>
          <p className="text-muted">
            {searchTerm || Object.values(filters).some(f => f !== 'all') 
              ? 'Try adjusting your search or filters' 
              : 'No tickets available'
            }
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="table-responsive">
          <Table hover className="tickets-table">
            <thead className="table-light">
              <tr>
                <th>
                  <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('id')}>
                    <span>ID</span>
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>
                  <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <span>Created</span>
                    {renderSortIcon('createdAt')}
                  </div>
                </th>
                <th>Assigned To</th>
                <th>Created By</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map(ticket => (
                <tr key={ticket.id} className="ticket-row">
                  <td>#{ticket.id}</td>
                  <td>
                    <div className="d-flex align-items-start">
                      <div>
                        <div className="fw-semibold">{ticket.title}</div>
                        <small className="text-muted">{ticket.category || 'No category'}</small>
                      </div>
                    </div>
                  </td>
                  <td>{renderStatusBadge(ticket.status)}</td>
                  <td>{renderPriorityBadge(ticket.priority)}</td>
                  <td>
                    <div>{formatRelativeTime(ticket.createdAt)}</div>
                    <small className="text-muted">{formatDate(ticket.createdAt)}</small>
                  </td>
                  <td>
                    {ticket.assignedTo ? (
                      <div className="d-flex align-items-center">
                        <FaUserCircle className="text-primary me-2" />
                        <span>{ticket.assignedTo.name}</span>
                      </div>
                    ) : (
                      <Badge bg="secondary">Unassigned</Badge>
                    )}
                  </td>
                  <td>
                    {ticket.createdBy || 'Unknown'}
                  </td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => handleTicketSelect(ticket)}
                        title="View details"
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        onClick={() => { setTicketToDelete(ticket.id); setShowDeleteModal(true); }}
                        title="Delete ticket"
                      >
                        <FaTrash />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
            <div>
              <span className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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
    );
  };

  const renderChatTab = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    return (
      <div className="chat-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>Chat</h6>
          <Badge bg={
            webSocketStatus === 'connected' ? 'success' : 
            webSocketStatus === 'connecting' ? 'warning' : 
            'danger'
          }>
            {webSocketStatus === 'connected' ? 'Connected' : 
             webSocketStatus === 'connecting' ? 'Connecting...' : 
             'Disconnected'}
          </Badge>
        </div>
        
        <div className="chat-messages" style={{ height: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #dee2e6', borderRadius: '5px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-muted py-4">
              <FaComments size={32} className="mb-2" />
              <p>No messages yet. Start the conversation.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`d-flex mb-3 ${message.senderId === userData.id ? 'justify-content-end' : ''}`}
              >
                <div 
                  className={`p-3 rounded ${message.senderId === userData.id ? 
                    'bg-primary text-white' : 'bg-light'}`}
                  style={{ maxWidth: '70%' }}
                >
                  <div className="fw-bold">{message.senderName}</div>
                  <div>{message.content}</div>
                  <small className="text-muted">
                    {formatRelativeTime(message.timestamp || new Date().toISOString())}
                  </small>
                </div>
              </div>
            ))
          )}
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.map(user => (
                <div key={user.senderId} className="text-muted">
                  {user.senderName} is typing...
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <InputGroup className="mt-3">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            disabled={webSocketStatus !== 'connected'}
          />
          <Button 
            variant="primary" 
            onClick={sendMessage}
            disabled={webSocketStatus !== 'connected' || !newMessage.trim()}
          >
            <FaPaperPlane />
          </Button>
        </InputGroup>
        
        {webSocketStatus !== 'connected' && (
          <div className="text-center mt-2">
            <Button variant="outline-primary" size="sm" onClick={() => connectWebSocket(selectedTicket.id)}>
              <FaSync className="me-1" /> Reconnect Chat
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAssignmentDropdown = () => {
    if (!selectedTicket) return null;
    
    return (
      <Dropdown>
        <Dropdown.Toggle variant="link" className="p-0 border-0 text-decoration-none">
          {selectedTicket.assignedTo ? (
            <div className="d-flex align-items-center">
              <FaUserCircle className="text-primary me-2" />
              <span>{selectedTicket.assignedTo.name}</span>
            </div>
          ) : (
            <Badge bg="secondary">Unassigned</Badge>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>Assign to:</Dropdown.Header>
          {selectedTicket.assignedTo && (
            <Dropdown.Item onClick={() => handleUnassignTicket(selectedTicket.id)}>
              <FaTrash className="me-2 text-danger" />
              Unassign
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          {employees.length > 0 ? (
            employees.map(employee => (
              <Dropdown.Item 
                key={employee.id} 
                onClick={() => handleAssignTicket(selectedTicket.id, employee.id)}
                className="d-flex align-items-center"
              >
                <FaUserCircle className="me-2 text-primary" />
                <div>
                  <div>{employee.name}</div>
                  <small className="text-muted">{employee.email}</small>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>
              <FaCog className="me-2" spin />
              Loading employees...
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderTicketDetails = () => {
    if (!selectedTicket) return null;

    return (
      <Modal show={showDetails} onHide={handleCloseDetails} size="lg" centered className="ticket-details-modal">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <FaTicketAlt className="me-2 text-primary" />
              Ticket #{selectedTicket.id}
            </div>
            <div className="fs-6 fw-normal">{selectedTicket.title}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Status</span>
                      {renderStatusBadge(selectedTicket.status)}
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Priority</span>
                      {renderPriorityBadge(selectedTicket.priority)}
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Category</span>
                      <span>{selectedTicket.category || 'N/A'}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <h6>Assignment</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Created By</span>
                      <span>{selectedTicket.createdBy || 'Unknown'}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Assigned To</span>
                      {renderAssignmentDropdown()}
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
              
              <h6 className="mt-4">Update Status</h6>
              <div className="d-grid gap-2 d-md-flex justify-content-between">
                {['OPEN', 'IN_PROGRESS', 'RESOLVE', 'CLOSED', 'REJECTED'].map(status => (
                  <Button
                    key={status}
                    variant={selectedTicket.status === status ? getBadgeVariant('status', status) : 'outline-secondary'}
                    onClick={() => handleStatusUpdate(selectedTicket.id, status)}
                    className="flex-fill me-2 mb-2"
                    size="sm"
                  >
                    {getStatusDisplay(status)}
                  </Button>
                ))}
              </div>
            </Tab>
            
            <Tab eventKey="chat" title="Chat">
              {renderChatTab()}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderDeleteModal = () => (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <FaExclamationCircle size={48} className="text-danger mb-3" />
          <h5>Are you sure you want to delete this ticket?</h5>
          <p className="text-muted">This action cannot be undone.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteTicket}>
          Delete Ticket
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="ticket-management-container">
      <Container fluid className="py-4 main-content">
        {/* Toast Notifications */}
        <ToastContainer position="top-end" className="p-3">
          {toasts.map(toast => (
            <Toast 
              key={toast.id} 
              bg={toast.type} 
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              delay={5000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Notification</strong>
              </Toast.Header>
              <Toast.Body className={toast.type === 'dark' || toast.type === 'danger' ? 'text-white' : ''}>
                {toast.message}
              </Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
        
        {/* Inline Alerts for error and success messages */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-4">
            <FaExclamationCircle className="me-2" />
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible className="mb-4">
            <FaCheckCircle className="me-2" />
            {success}
          </Alert>
        )}
        
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Ticket Management</h2>
            <p className="text-muted">Manage and track all support tickets</p>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <Button variant="outline-primary" className="me-2">
              <FaPlus className="me-1" /> New Ticket
            </Button>
            <Button variant="outline-primary" className="me-2">
              <FaFileExport className="me-1" /> Export
            </Button>
            <Button variant="primary" onClick={handleRefresh}>
              <FaSync className="me-1" /> Refresh
            </Button>
          </Col>
        </Row>
        
        {/* Stats Overview */}
        <Row className="mb-4">
          <Col md={2}>
            {renderStatsCard('Total Tickets', stats.total, 'primary', <FaTicketAlt />)}
          </Col>
          <Col md={2}>
            {renderStatsCard('Open', stats.open, 'warning', <FaExclamationCircle />)}
          </Col>
          <Col md={2}>
            {renderStatsCard('In Progress', stats.inProgress, 'info', <FaClock />)}
          </Col>
          <Col md={2}>
            {renderStatsCard('Resolved', stats.resolved, 'success', <FaCheckCircle />)}
          </Col>
          <Col md={2}>
            {renderStatsCard('Closed', stats.closed, 'secondary', <FaCheck />)}
          </Col>
        </Row>
        
        {/* Search and Filters */}
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search tickets by title, description, ID, or assignee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4} className="d-flex justify-content-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary">
                        <FaFilter /> Filters
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="p-3" style={{ width: '300px' }}>
                        <h6>Filter Tickets</h6>
                        
                        <div className="mb-2">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            size="sm"
                          >
                            <option value="all">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVE">Resolved</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                          </Form.Select>
                        </div>
                        
                        <div className="mb-2">
                          <Form.Label>Priority</Form.Label>
                          <Form.Select
                            value={filters.priority}
                            onChange={(e) => setFilters({...filters, priority: e.target.value})}
                            size="sm"
                          >
                            <option value="all">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                          </Form.Select>
                        </div>
                        
                        <div className="mb-2">
                          <Form.Label>Assignment</Form.Label>
                          <Form.Select
                            value={filters.assigned}
                            onChange={(e) => setFilters({...filters, assigned: e.target.value})}
                            size="sm"
                          >
                            <option value="all">All Tickets</option>
                            <option value="me">Assigned to Me</option>
                            <option value="unassigned">Unassigned</option>
                          </Form.Select>
                        </div>
                        
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => setFilters({
                            status: 'all',
                            priority: 'all',
                            assigned: 'all',
                            category: 'all'
                          })}
                        >
                          Clear Filters
                        </Button>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Tickets Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Tickets ({filteredTickets.length})</span>
                <Form.Select 
                  style={{ width: 'auto' }} 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  size="sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </Form.Select>
              </Card.Header>
              <Card.Body className="p-0">
                {renderTicketsTable()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Modals */}
        {renderTicketDetails()}
        {renderDeleteModal()}
      </Container>
    </div>
  );
};

export default TicketManagement;