import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Card, 
  Col, 
  Row, 
  Container, 
  Button, 
  Badge, 
  Table, 
  Modal, 
  Spinner, 
  Form, 
  Alert, 
  InputGroup,
  Dropdown,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  ExclamationCircle, 
  Plus, 
  PersonCircle, 
  FileEarmark, 
  GeoAlt, 
  Calendar, 
  InfoCircle,
  Chat, 
  Telephone, 
  Envelope, 
  Send, 
  Bell, 
  BellFill, 
  Search,
  ArrowRepeat,
  XCircle,
  Filter,
  SortDown,
  SortUp,
  ThreeDotsVertical
} from 'react-bootstrap-icons';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement
} from 'chart.js';
import { AuthContext } from '../../context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../../Styles/Dashboard.css';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketComments, setTicketComments] = useState('');
    const [commentSending, setCommentSending] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        inProgress: 0,
        resolved: 0
    });
    const [allTickets, setAllTickets] = useState([]);
    const [chartData, setChartData] = useState({
        statusDistribution: null,
        priorityDistribution: null
    });
    const [stompClient, setStompClient] = useState(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [blinkingMessages, setBlinkingMessages] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const messagesEndRef = useRef(null);
    
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const userRole = user?.role;
    const userName = user?.name;

    // API base URL
    const API_BASE = "http://localhost:8080/api";

    // Function to make API calls with authentication
    const apiCall = async (endpoint, options = {}) => {
        try {
            const token = localStorage.getItem('token');
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
                    // Clear invalid token
                    localStorage.removeItem("token");
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user tickets
                const tickets = await apiCall(`/tickets/user/${userId}`);
                
                if (!tickets) return; // API call failed
                
                setAllTickets(tickets);

                // Calculate stats
                const totalTickets = tickets.length;
                const openTickets = tickets.filter(t => t.status === 'OPEN').length;
                const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
                const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'RESOLVE').length;
                
                setStats({ totalTickets, openTickets, inProgress, resolved });

                // Prepare chart data
                setChartData({
                    statusDistribution: {
                        labels: ['Open', 'In Progress', 'Resolved'],
                        datasets: [{
                            label: 'Tickets by Status',
                            data: [openTickets, inProgress, resolved],
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(75, 192, 192, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 159, 64, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(75, 192, 192, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    priorityDistribution: {
                        labels: ['High', 'Medium', 'Low'],
                        datasets: [{
                            label: 'Tickets by Priority',
                            data: [
                                tickets.filter(t => t.priority === 'HIGH').length,
                                tickets.filter(t => t.priority === 'MEDIUM').length,
                                tickets.filter(t => t.priority === 'LOW').length
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(153, 102, 255, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });

                // Fetch initial notifications
                await fetchNotifications();
                
                setLoading(false);
            } catch (err) {
                console.error('Dashboard error:', err);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };
        
        if (userId) {
            fetchData();
        }
    }, [userId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        scrollToBottom();
    }, [selectedTicket?.messages]);

    useEffect(() => {
        if (selectedTicket && showTicketModal) {
            connectWebSocket(selectedTicket.id);
            fetchUnreadCount(selectedTicket.id);
            return () => {
                if (stompClient) {
                    stompClient.deactivate();
                    setStompClient(null);
                }
            };
        }
    }, [selectedTicket, showTicketModal]);

    useEffect(() => {
        // Check for unread notifications
        const hasUnread = notifications.some(notification => !notification.read);
        setHasUnreadNotifications(hasUnread);
    }, [notifications]);

    // Filter tickets based on search term and status filter
    const filteredTickets = allTickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             ticket.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

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

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const connectWebSocket = (ticketId) => {
        setConnectionStatus('connecting');
        
        // Get the authentication token
        const token = localStorage.getItem('token');
        
        // Create SockJS with query parameter for authentication
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
                setConnectionStatus('connected');
                console.log('WebSocket connected successfully');
                
                // Subscribe to the ticket's chat topic
                client.subscribe(`/topic/chat.${ticketId}`, (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setSelectedTicket(prev => ({
                            ...prev,
                            messages: [...(prev?.messages || []), newMessage]
                        }));
                        
                        // Add blinking effect for new messages
                        setBlinkingMessages(prev => {
                            const newSet = new Set(prev);
                            newSet.add(newMessage.id);
                            return newSet;
                        });
                        
                        // Remove blinking effect after 3 seconds
                        setTimeout(() => {
                            setBlinkingMessages(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(newMessage.id);
                                return newSet;
                            });
                        }, 3000);
                        
                        // Mark message as read if it's from someone else
                        if (newMessage.senderId !== userId) {
                            markMessageAsRead(newMessage.id);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                // Subscribe to typing indicators
                client.subscribe(`/topic/chat.typing.${ticketId}`, (typing) => {
                    try {
                        const typingData = JSON.parse(typing.body);
                        if (typingData.typing) {
                            setTypingUsers(prev => [...prev.filter(u => u.userId !== typingData.userId), typingData]);
                        } else {
                            setTypingUsers(prev => prev.filter(u => u.userId !== typingData.userId));
                        }
                    } catch (error) {
                        console.error('Error parsing typing indicator:', error);
                    }
                });

                setStompClient(client);
            },
            onDisconnect: () => {
                setConnectionStatus('disconnected');
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
                setError('Failed to connect to chat. Please refresh and try again.');
                setConnectionStatus('error');
            }
        });

        client.activate();
        return client;
    };

    const reconnectWebSocket = () => {
        if (selectedTicket) {
            if (stompClient) {
                stompClient.deactivate();
            }
            connectWebSocket(selectedTicket.id);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await apiCall(`/notifications/user/${userId}`);
            setNotifications(response || []);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const fetchUnreadCount = async (ticketId) => {
        try {
            const response = await apiCall(`/messages/unread-count/${ticketId}/${userRole}`);
            setUnreadCounts(prev => ({ ...prev, [ticketId]: response }));
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    const markMessageAsRead = async (messageId) => {
        try {
            await apiCall(`/messages/mark-as-read/${messageId}`, {
                method: 'POST'
            });
        } catch (err) {
            console.error('Failed to mark message as read:', err);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await apiCall(`/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read: true } 
                        : notification
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'OPEN': return <Badge bg="warning" className="text-dark">Open</Badge>;
            case 'IN_PROGRESS': return <Badge bg="primary">In Progress</Badge>;
            case 'RESOLVED': 
            case 'RESOLVE': return <Badge bg="success">Resolved</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const getPriorityIcon = (priority) => {
        switch(priority) {
            case 'HIGH': return <ExclamationCircle className="text-danger me-1" />;
            case 'MEDIUM': return <ExclamationCircle className="text-warning me-1" />;
            default: return <ExclamationCircle className="text-info me-1" />;
        }
    };

    const fetchEmployeeDetails = async (employeeId) => {
        try {
            const response = await apiCall(`/employees/${employeeId}`);
            setEmployeeDetails(response);
        } catch (err) {
            console.error('Failed to fetch employee details:', err);
        }
    };

    const handleViewTicket = async (ticket) => {
        setSelectedTicket(ticket);
        setShowTicketModal(true);
        
        // Fetch employee details if ticket is assigned
        if (ticket.assignedToId) {
            await fetchEmployeeDetails(ticket.assignedToId);
        }
        
        // Fetch ticket messages
        await fetchTicketMessages(ticket.id);
        
        // Reset unread count for this ticket
        setUnreadCounts(prev => ({ ...prev, [ticket.id]: 0 }));
    };

    const fetchTicketMessages = async (ticketId) => {
        try {
            const response = await apiCall(`/messages/${ticketId}`);
            
            setSelectedTicket(prev => ({
                ...prev,
                messages: response
            }));
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!ticketComments.trim() || !stompClient || !selectedTicket) return;
        
        setCommentSending(true);
        
        try {
            const chatMessage = {
                ticketId: selectedTicket.id,
                senderId: userId,
                senderType: userRole,
                senderName: user?.name || 'User',
                content: ticketComments.trim(),
                timestamp: new Date(),
                messageType: "TEXT"
            };
            
            stompClient.publish({
                destination: `/app/chat.send.${selectedTicket.id}`,
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setTicketComments('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setCommentSending(false);
        }
    };

    const handleTyping = () => {
        if (stompClient && selectedTicket) {
            const typingNotification = {
                ticketId: selectedTicket.id,
                userId: userId,
                userName: user?.name || 'User',
                typing: true
            };
            
            stompClient.publish({
                destination: `/app/chat.typing.${selectedTicket.id}`,
                body: JSON.stringify(typingNotification),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            // Clear previous timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set timeout to send "stop typing" after 2 seconds
            const timeout = setTimeout(() => {
                const stopTyping = {
                    ticketId: selectedTicket.id,
                    userId: userId,
                    userName: user?.name || 'User',
                    typing: false
                };
                
                if (stompClient) {
                    stompClient.publish({
                        destination: `/app/chat.typing.${selectedTicket.id}`,
                        body: JSON.stringify(stopTyping),
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                }
            }, 2000);
            
            setTypingTimeout(timeout);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment(e);
        }
    };

    const handleCreateTicket = () => {
        window.location.href = '/user-portal/new-ticket';
    };

    const handleCloseModal = () => {
        setShowTicketModal(false);
        setSelectedTicket(null);
        setEmployeeDetails(null);
        setTypingUsers([]);
        setTicketComments('');
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if (stompClient) {
            stompClient.deactivate();
            setStompClient(null);
        }
        setConnectionStatus('disconnected');
    };

    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getConnectionStatusBadge = () => {
        switch(connectionStatus) {
            case 'connected': return <Badge bg="success">Connected</Badge>;
            case 'connecting': return <Badge bg="warning">Connecting...</Badge>;
            case 'error': return <Badge bg="danger">Connection Error</Badge>;
            default: return <Badge bg="secondary">Disconnected</Badge>;
        }
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <ThreeDotsVertical className="ms-1 text-muted" />;
        return sortConfig.direction === 'asc' ? 
            <SortUp className="ms-1" /> : <SortDown className="ms-1" />;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="text-center">
                    <ExclamationCircle size={24} className="me-2" />
                    {error}
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <div className="dashboard-page">
            <Container fluid className="py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2 fw-bold mb-2">Support Dashboard</h1>
                        <p className="text-muted mb-0">
                            Welcome back, {userName}. Here's an overview of your support tickets.
                        </p>
                    </div>
                    <Button variant="primary" onClick={handleCreateTicket}>
                        <Plus className="me-2" /> New Ticket
                    </Button>
                </div>
                
                {stats.totalTickets === 0 ? (
                    <Card className="border-0 shadow-sm text-center py-5">
                        <ExclamationCircle size={48} className="text-muted mb-3" />
                        <h4 className="mb-3">No tickets found</h4>
                        <p className="text-muted mb-4">Get started by creating your first support ticket</p>
                        <Button variant="primary" size="lg" onClick={handleCreateTicket}>
                            <Plus className="me-2" /> Create Ticket
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <Row className="mb-4 g-3">
                            <Col md={3} sm={6}>
                                <Card className="stat-card border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="text-muted mb-2">Total Tickets</h5>
                                            <h2 className="fw-bold">{stats.totalTickets}</h2>
                                        </div>
                                        <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                                            <Ticket size={24} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={3} sm={6}>
                                <Card className="stat-card border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="text-muted mb-2">Open</h5>
                                            <h2 className="fw-bold">{stats.openTickets}</h2>
                                        </div>
                                        <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-circle p-3">
                                            <ExclamationCircle size={24} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={3} sm={6}>
                                <Card className="stat-card border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="text-muted mb-2">In Progress</h5>
                                            <h2 className="fw-bold">{stats.inProgress}</h2>
                                        </div>
                                        <div className="icon-wrapper bg-info bg-opacity-10 text-info rounded-circle p-3">
                                            <Clock size={24} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={3} sm={6}>
                                <Card className="stat-card border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="text-muted mb-2">Resolved</h5>
                                            <h2 className="fw-bold">{stats.resolved}</h2>
                                        </div>
                                        <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-circle p-3">
                                            <CheckCircle size={24} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        
                        {/* Analytics Charts */}
                        <Row className="mb-4 g-4">
                            <Col lg={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body>
                                        <h5 className="fw-bold mb-4">Status Distribution</h5>
                                        {chartData.statusDistribution && (
                                            <div className="chart-container" style={{ height: '300px' }}>
                                                <Pie 
                                                    data={chartData.statusDistribution} 
                                                    options={{ 
                                                        maintainAspectRatio: false,
                                                        plugins: { 
                                                            legend: { position: 'bottom' } 
                                                        } 
                                                    }} 
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body>
                                        <h5 className="fw-bold mb-4">Priority Distribution</h5>
                                        {chartData.priorityDistribution && (
                                            <div className="chart-container" style={{ height: '300px' }}>
                                                <Bar 
                                                    data={chartData.priorityDistribution} 
                                                    options={{ 
                                                        maintainAspectRatio: false,
                                                        scales: { y: { beginAtZero: true } },
                                                        plugins: {
                                                            legend: { display: false }
                                                        }
                                                    }} 
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        
                        {/* Ticket Management Section */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                                    <h4 className="fw-bold mb-3 mb-md-0">Your Tickets</h4>
                                </div>
                                
                                {/* Search and Filter Controls */}
                                <Row className="mb-4">
                                    <Col md={5}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <Search />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search tickets by title or ID..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={3}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <Filter />
                                            </InputGroup.Text>
                                            <Form.Select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="ALL">All Statuses</option>
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="RESOLVE">Resolved</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col md={3}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <Filter />
                                            </InputGroup.Text>
                                            <Form.Select
                                                value={priorityFilter}
                                                onChange={(e) => setPriorityFilter(e.target.value)}
                                            >
                                                <option value="ALL">All Priorities</option>
                                                <option value="HIGH">High</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="LOW">Low</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('id')}>
                                                        <span>Ticket ID</span>
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
                                                <th>Priority</th>
                                                <th>Assigned To</th>
                                                <th>
                                                    <div className="d-flex align-items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                                                        <span>Date Created</span>
                                                        {renderSortIcon('createdAt')}
                                                    </div>
                                                </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedTickets.length > 0 ? (
                                                sortedTickets.map(ticket => (
                                                    <tr key={ticket.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                #{ticket.id}
                                                                {unreadCounts[ticket.id] > 0 && (
                                                                    <Badge bg="danger" className="ms-2">
                                                                        {unreadCounts[ticket.id]}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '200px' }} title={ticket.title}>{ticket.title}</td>
                                                        <td>{getStatusBadge(ticket.status)}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {getPriorityIcon(ticket.priority)}
                                                                <span>{ticket.priority}</span>
                                                            </div>
                                                        </td>
                                                        <td>{ticket.assignedTo || 'Not assigned'}</td>
                                                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm"
                                                                onClick={() => handleViewTicket(ticket)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                                                            ? 'No tickets match your search criteria' 
                                                            : 'No tickets found'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
            
            {/* Ticket Details Modal */}
            <Modal 
                show={showTicketModal} 
                onHide={handleCloseModal}
                centered
                size="lg"
                backdrop="static"
                className="ticket-modal"
            >
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold">
                        Ticket #{selectedTicket?.id || 'Loading...'}
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="pt-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedTicket ? (
                        <div className="ticket-details">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">{selectedTicket.title}</h4>
                                <Badge bg={
                                    selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'RESOLVE' ? 'success' : 
                                    selectedTicket.status === 'IN_PROGRESS' ? 'primary' : 'warning'
                                }>
                                    {selectedTicket.status}
                                </Badge>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-muted">{selectedTicket.description}</p>
                            </div>
                            
                            <Row className="mb-4">
                                <Col md={6}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                                            <PersonCircle size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small">Assigned To</div>
                                            <div className="fw-medium">
                                                {selectedTicket.assignedTo || 'Not assigned yet'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                                            <Calendar size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small">Created On</div>
                                            <div className="fw-medium">
                                                {new Date(selectedTicket.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                
                                <Col md={6}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                                            <GeoAlt size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small">Location</div>
                                            <div className="fw-medium">{selectedTicket.location || 'Not specified'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex align-items-center">
                                        <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                                            <InfoCircle size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small">Priority</div>
                                            <div className="fw-medium">{selectedTicket.priority}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            {/* Employee Contact Information */}
                            {employeeDetails && (
                                <Card className="mb-4 border-0 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <h6 className="mb-0 fw-bold">
                                            <PersonCircle className="me-2" />
                                            Assigned Employee Details
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <strong>Name:</strong> {employeeDetails.name}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Email:</strong> {employeeDetails.email}
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <strong>Phone:</strong> {employeeDetails.phone}
                                                </div>
                                                <div className="d-flex gap-2 mt-3">
                                                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                                        <Telephone className="me-1" size={14} />
                                                        Call
                                                    </Button>
                                                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                                        <Envelope className="me-1" size={14} />
                                                        Email
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            )}
                            
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Attachments</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedTicket.attachments && selectedTicket.attachments.length > 0 ? (
                                        selectedTicket.attachments.map((file, index) => (
                                            <Button key={index} variant="light" className="d-flex align-items-center">
                                                <FileEarmark className="me-2" />
                                                {file}
                                            </Button>
                                        ))
                                    ) : (
                                        <p className="text-muted">No attachments</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">
                                        <Chat className="me-2" />
                                        Ticket Conversation
                                    </h6>
                                    <div className="d-flex align-items-center gap-2">
                                        {getConnectionStatusBadge()}
                                        {connectionStatus !== 'connected' && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                onClick={reconnectWebSocket}
                                                className="d-flex align-items-center"
                                            >
                                                <ArrowRepeat size={14} className="me-1" />
                                                Reconnect
                                            </Button>
                                        )}
                                        <Badge bg="primary">{selectedTicket.messages?.length || 0} messages</Badge>
                                    </div>
                                </div>
                                <div className="ticket-comments" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {(selectedTicket.messages || []).length > 0 ? (
                                        selectedTicket.messages.map((message, index) => (
                                            <div 
                                                key={index} 
                                                className={`comment mb-3 p-3 ${message.senderType === userRole ? 'user-comment bg-primary text-white' : 'bg-light'} ${blinkingMessages.has(message.id) ? 'blinking-message' : ''}`}
                                            >
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="fw-bold">
                                                        {message.senderType === userRole ? 'You' : 
                                                         message.senderType === 'EMPLOYEE' ? employeeDetails?.name || 'Employee' : 
                                                         message.senderType === 'ADMIN' ? 'Admin' : 'System'}
                                                    </span>
                                                    <span className="small">
                                                        {formatMessageTime(message.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="comment-body">
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No messages yet. Start the conversation!</p>
                                    )}
                                    {typingUsers.length > 0 && (
                                        <div className="typing-indicator mb-2">
                                            <small className="text-muted">
                                                {typingUsers.map(user => user.userName).join(', ')} 
                                                {typingUsers.length === 1 ? ' is ' : ' are '}
                                                typing...
                                            </small>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            
                            <Form onSubmit={handleAddComment}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Add Message</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={ticketComments}
                                            onChange={(e) => {
                                                setTicketComments(e.target.value);
                                                handleTyping();
                                            }}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message here..."
                                            disabled={connectionStatus !== 'connected'}
                                        />
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={commentSending || !ticketComments.trim() || connectionStatus !== 'connected'}
                                        >
                                            {commentSending ? (
                                                <Spinner as="span" animation="border" size="sm" />
                                            ) : (
                                                <Send size={18} />
                                            )}
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
                    ) : (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading ticket details...</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Toast Container for Notifications */}
            <ToastContainer position="bottom-end" className="p-3">
                {notifications.slice(0, 3).map((notification, index) => (
                    <Toast 
                        key={index} 
                        onClose={() => markNotificationAsRead(notification.id)}
                        show={!notification.read} 
                        delay={5000} 
                        autohide
                    >
                        <Toast.Header>
                            <BellFill className="me-2" />
                            <strong className="me-auto">{notification.title}</strong>
                            <small>{new Date(notification.createdAt).toLocaleTimeString()}</small>
                        </Toast.Header>
                        <Toast.Body>{notification.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </div>
    );
};

export default Dashboard;