import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Spinner, Alert, Button,
  Dropdown, Container, Badge, Form, Table
} from 'react-bootstrap';
import {
  FaDownload, FaChartBar, FaSync,
  FaUsers, FaTicketAlt, FaCheckCircle,
  FaClock, FaArrowUp, FaArrowDown, FaFilter,
  FaUserCog, FaExclamationTriangle, FaHistory,
  FaUserPlus, FaMapMarkerAlt, FaBell, FaComments
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import ChartJS for consistency with your other components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
);

// API service with all endpoints from your controllers
const api = {
  get: async (endpoint) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data based on your API endpoints
    switch(endpoint) {
      case '/admin/tickets/status-count':
        return {
          data: [
            { status: 'OPEN', count: 12 },
            { status: 'IN_PROGRESS', count: 8 },
            { status: 'RESOLVED', count: 25 },
            { status: 'CLOSED', count: 15 }
          ]
        };
      case '/users/stats':
        return {
          data: {
            totalUsers: 1248,
            enabledUsers: 1180,
            disabledUsers: 68,
            byRole: {
              ADMIN: 12,
              USER: 980,
              EMPLOYEE: 256
            },
            newThisWeek: 42
          }
        };
      case '/users/growth':
        return {
          data: [
            { period: 'Jan', count: 120 },
            { period: 'Feb', count: 240 },
            { period: 'Mar', count: 380 },
            { period: 'Apr', count: 510 },
            { period: 'May', count: 650 },
            { period: 'Jun', count: 820 },
            { period: 'Jul', count: 950 },
            { period: 'Aug', count: 1120 },
            { period: 'Sep', count: 1248 }
          ]
        };
      case '/tickets/all':
        return {
          data: [
            { id: 1, title: "Login issue", status: "OPEN", priority: "HIGH", createdAt: "2023-05-15", user: { name: "John Doe" } },
            { id: 2, title: "Payment problem", status: "RESOLVED", priority: "MEDIUM", createdAt: "2023-05-14", user: { name: "Jane Smith" } },
            { id: 3, title: "Feature request", status: "IN_PROGRESS", priority: "LOW", createdAt: "2023-05-13", user: { name: "Robert Johnson" } },
            { id: 4, title: "Bug report", status: "OPEN", priority: "HIGH", createdAt: "2023-05-12", user: { name: "Emily Davis" } },
            { id: 5, title: "Account setup", status: "RESOLVED", priority: "MEDIUM", createdAt: "2023-05-11", user: { name: "Michael Brown" } }
          ]
        };
      case '/activity/recent':
        return {
          data: [
            { id: 1, action: "Ticket Created", description: "New ticket #1052 created by user", timestamp: "2023-05-15T10:30:00" },
            { id: 2, action: "Ticket Resolved", description: "Ticket #1048 marked as resolved", timestamp: "2023-05-15T09:15:00" },
            { id: 3, action: "User Registered", description: "New user registered with email test@example.com", timestamp: "2023-05-14T16:45:00" },
            { id: 4, action: "Priority Changed", description: "Ticket #1045 priority changed to HIGH", timestamp: "2023-05-14T14:20:00" }
          ]
        };
      case '/employees/all':
        return {
          data: [
            { id: 1, name: "John Doe", role: "TECH_SUPPORT", status: "ACTIVE", ticketsAssigned: 12 },
            { id: 2, name: "Jane Smith", role: "DEVELOPER", status: "ACTIVE", ticketsAssigned: 8 },
            { id: 3, name: "Robert Johnson", role: "ADMIN", status: "ACTIVE", ticketsAssigned: 5 },
            { id: 4, name: "Emily Davis", role: "TECH_SUPPORT", status: "INACTIVE", ticketsAssigned: 3 }
          ]
        };
      case '/notifications/admin/all':
        return {
          data: [
            { id: 1, title: "System Update", message: "Scheduled maintenance tonight at 2 AM", createdAt: "2023-05-15T08:00:00" },
            { id: 2, title: "New Feature", message: "Chat functionality has been added to tickets", createdAt: "2023-05-14T15:30:00" },
            { id: 3, title: "Performance Alert", message: "High ticket volume detected", createdAt: "2023-05-13T11:45:00" }
          ]
        };
      case '/location/all':
        return {
          data: [
            { employeeId: 1, employeeName: "John Doe", latitude: 40.7128, longitude: -74.0060, lastUpdated: "2023-05-15T14:30:00" },
            { employeeId: 2, employeeName: "Jane Smith", latitude: 40.7215, longitude: -73.9982, lastUpdated: "2023-05-15T14:25:00" },
            { employeeId: 3, employeeName: "Robert Johnson", latitude: 40.7056, longitude: -74.0081, lastUpdated: "2023-05-15T14:15:00" }
          ]
        };
      case '/reviews':
        return {
          data: [
            { id: 1, username: "Sarah K.", message: "Great support experience!", rating: 5, timestamp: "2023-05-15T12:30:00" },
            { id: 2, username: "Mike T.", message: "Response time could be better", rating: 3, timestamp: "2023-05-14T16:45:00" },
            { id: 3, username: "Jennifer L.", message: "Very helpful technician", rating: 4, timestamp: "2023-05-13T09:15:00" }
          ]
        };
      default:
        return { data: [] };
    }
  }
};

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
const STATUS_COLORS = {
  'OPEN': '#EF4444',
  'IN_PROGRESS': '#F59E0B',
  'RESOLVED': '#10B981',
  'CLOSED': '#6B7280'
};

const PRIORITY_COLORS = {
  'HIGH': '#EF4444',
  'MEDIUM': '#F59E0B',
  'LOW': '#10B981'
};

// Define the Analytics component
const Analytics = () => {
  const [ticketData, setTicketData] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        statusRes, userRes, growthRes, ticketsRes, 
        activitiesRes, employeesRes, notificationsRes,
        locationsRes, reviewsRes
      ] = await Promise.all([
        api.get('/admin/tickets/status-count'),
        api.get('/users/stats'),
        api.get('/users/growth'),
        api.get('/tickets/all'),
        api.get('/activity/recent'),
        api.get('/employees/all'),
        api.get('/notifications/admin/all'),
        api.get('/location/all'),
        api.get('/reviews')
      ]);
      
      setTicketData(statusRes.data);
      setUserStats(userRes.data);
      setUserGrowthData(growthRes.data);
      setTickets(ticketsRes.data);
      setRecentActivities(activitiesRes.data);
      setEmployees(employeesRes.data);
      setNotifications(notificationsRes.data);
      setLocations(locationsRes.data);
      setReviews(reviewsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const exportReport = async (type) => {
    try {
      // In a real app, this would call your API endpoints
      const endpoint = type === 'pdf' ? '/reports/pdf' : '/reports/excel';
      console.log(`Exporting ${type} report from ${endpoint}`);
      
      // Create a mock download (in a real app, this would be an actual file download)
      const element = document.createElement("a");
      const file = new Blob([`Analytics Report - ${new Date().toLocaleDateString()}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${type}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      setError('Failed to export report.');
      console.error(err);
    }
  };

  // Calculate metrics from data
  const totalTickets = tickets.length;
  const openTickets = ticketData.find(item => item.status === 'OPEN')?.count || 0;
  const resolvedTickets = ticketData.find(item => item.status === 'RESOLVED')?.count || 0;
  const resolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  // Prepare chart data for ChartJS
  const ticketStatusChartData = {
    labels: ticketData.map(item => item.status),
    datasets: [
      {
        label: 'Ticket Count',
        data: ticketData.map(item => item.count),
        backgroundColor: ticketData.map(item => STATUS_COLORS[item.status] || COLORS[0]),
        borderColor: ticketData.map(item => STATUS_COLORS[item.status] || COLORS[0]),
        borderWidth: 1,
      },
    ],
  };

  const userGrowthChartData = {
    labels: userGrowthData.map(item => item.period),
    datasets: [
      {
        label: 'User Count',
        data: userGrowthData.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      }
    ],
  };

  const userDistributionData = {
    labels: userStats.byRole ? Object.keys(userStats.byRole) : [],
    datasets: [
      {
        label: 'User Count',
        data: userStats.byRole ? Object.values(userStats.byRole) : [],
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const employeePerformanceData = {
    labels: employees.map(emp => emp.name),
    datasets: [
      {
        label: 'Tickets Assigned',
        data: employees.map(emp => emp.ticketsAssigned || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const performanceMetrics = [
    { 
      name: 'User Satisfaction', 
      value: `${avgRating}/5`, 
      change: 2.5, 
      icon: FaUsers, 
      color: 'primary' 
    },
    { 
      name: 'Avg. Response Time', 
      value: '2.4h', 
      change: -1.2, 
      icon: FaClock, 
      color: 'success' 
    },
    { 
      name: 'Resolution Rate', 
      value: `${resolutionRate.toFixed(0)}%`, 
      change: 5.4, 
      icon: FaCheckCircle, 
      color: 'warning' 
    },
    { 
      name: 'Ticket Volume', 
      value: totalTickets, 
      change: -3.2, 
      icon: FaTicketAlt, 
      color: 'info' 
    }
  ];

  if (loading) return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3"/>
        <h5>Loading Analytics</h5>
        <p className="text-muted">Crunching the latest data...</p>
      </div>
    </Container>
  );

  return (
    <Container fluid className="px-4 py-4 analytics-dashboard">
      <style>
        {`
          .analytics-dashboard {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
          }
          .metric-card {
            transition: all 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            border: none;
          }
          .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .chart-container {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .nav-tabs .nav-link {
            border: none;
            padding: 0.75rem 1.5rem;
            color: #64748b;
            font-weight: 500;
            border-radius: 8px 8px 0 0;
          }
          .nav-tabs .nav-link.active {
            color: #3b82f6;
            background-color: transparent;
            border-bottom: 3px solid #3b82f6;
          }
          .tab-content {
            padding: 1.5rem 0;
          }
          .activity-item {
            border-left: 3px solid #3b82f6;
            padding-left: 15px;
            margin-bottom: 15px;
          }
        `}
      </style>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Analytics Dashboard</h1>
          <p className="text-muted mb-0">Insights into your support system performance</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)} 
            className="w-auto" 
            style={{ minWidth: '140px' }}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </Form.Select>
          <Button variant="outline-primary" onClick={fetchAnalyticsData}>
            <FaSync />
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              <FaDownload className="me-1"/> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportReport('pdf')}>PDF Report</Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport('excel')}>Excel Report</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {/* Navigation Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              Tickets
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <>
            {/* Performance Metrics */}
            <Row className="mb-4">
              {performanceMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <Col xl={3} lg={6} md={6} key={idx} className="mb-3">
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <Card className="h-100 metric-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex align-items-center">
                            <div className={`bg-${metric.color} bg-opacity-10 p-3 rounded-circle me-3`}>
                              <Icon className={`text-${metric.color}`} size={20}/>
                            </div>
                            <div className="flex-grow-1">
                              <h4 className="fw-bold mb-0">{metric.value}</h4>
                              <span className="text-muted small">{metric.name}</span>
                            </div>
                            <div className={`text-${metric.change >= 0 ? 'success' : 'danger'} small text-end`}>
                              {metric.change >= 0 ? <FaArrowUp size={12}/> : <FaArrowDown size={12}/>}
                              <br/>{Math.abs(metric.change)}%
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>

            {/* Charts Row */}
            <Row className="mb-4">
              <Col xl={6} lg={12} className="mb-4">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="h-100 metric-card shadow-sm">
                    <Card.Header className="bg-white d-flex align-items-center py-3">
                      <FaChartBar className="me-2 text-primary"/>
                      <Card.Title className="mb-0 fw-semibold">Ticket Status Distribution</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: '300px' }}>
                        <Doughnut 
                          data={ticketStatusChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              <Col xl={6} lg={12} className="mb-4">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="h-100 metric-card shadow-sm">
                    <Card.Header className="bg-white d-flex align-items-center py-3">
                      <FaUsers className="me-2 text-primary"/>
                      <Card.Title className="mb-0 fw-semibold">User Growth</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: '300px' }}>
                        <Line 
                          data={userGrowthChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true
                              }
                            }
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* Recent Activities and User Stats */}
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="h-100 metric-card shadow-sm">
                  <Card.Header className="bg-white d-flex align-items-center py-3">
                    <FaHistory className="me-2 text-primary"/>
                    <Card.Title className="mb-0 fw-semibold">Recent Activities</Card.Title>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="activity-item mb-3">
                        <h6 className="mb-1">{activity.action}</h6>
                        <p className="text-muted small mb-0">{activity.description}</p>
                        <small className="text-muted">
                          {new Date(activity.timestamp).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6} className="mb-4">
                <Card className="h-100 metric-card shadow-sm">
                  <Card.Header className="bg-white d-flex align-items-center py-3">
                    <FaUsers className="me-2 text-primary"/>
                    <Card.Title className="mb-0 fw-semibold">User Statistics</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row className="text-center">
                      <Col xs={6} className="mb-3">
                        <h3 className="fw-bold text-primary">{userStats.totalUsers || 0}</h3>
                        <p className="text-muted mb-0">Total Users</p>
                      </Col>
                      <Col xs={6} className="mb-3">
                        <h3 className="fw-bold text-success">{userStats.enabledUsers || 0}</h3>
                        <p className="text-muted mb-0">Active Users</p>
                      </Col>
                      <Col xs={6} className="mb-3">
                        <h3 className="fw-bold text-danger">{userStats.disabledUsers || 0}</h3>
                        <p className="text-muted mb-0">Inactive Users</p>
                      </Col>
                      <Col xs={6} className="mb-3">
                        <h3 className="fw-bold text-info">{userStats.newThisWeek || 0}</h3>
                        <p className="text-muted mb-0">New This Week</p>
                      </Col>
                    </Row>
                    <div className="mt-3" style={{ height: '200px' }}>
                      <Doughnut 
                        data={userDistributionData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {activeTab === 'tickets' && (
          <Row>
            <Col lg={12}>
              <Card className="metric-card shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                  <Card.Title className="mb-0 fw-semibold">Ticket Management</Card.Title>
                  <Button variant="outline-primary" size="sm">
                    <FaFilter className="me-1" /> Filter
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created</th>
                        <th>User</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr key={ticket.id}>
                          <td>#{ticket.id}</td>
                          <td>{ticket.title}</td>
                          <td>
                            <Badge bg={
                              ticket.status === 'OPEN' ? 'warning' : 
                              ticket.status === 'RESOLVED' ? 'success' : 'info'
                            }>
                              {ticket.status}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={
                              ticket.priority === 'HIGH' ? 'danger' : 
                              ticket.priority === 'MEDIUM' ? 'warning' : 'secondary'
                            }>
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td>{ticket.user?.name || 'N/A'}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              View
                            </Button>
                            <Button variant="outline-success" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'users' && (
          <Row>
            <Col lg={12}>
              <Card className="metric-card shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                  <Card.Title className="mb-0 fw-semibold">User Analytics</Card.Title>
                  <Form.Select className="w-auto">
                    <option>All Users</option>
                    <option>Active Only</option>
                    <option>Inactive Only</option>
                  </Form.Select>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <h5>User Growth</h5>
                      <div style={{ height: '250px' }}>
                        <Line 
                          data={userGrowthChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true
                              }
                            }
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5>User Distribution</h5>
                      <div style={{ height: '250px' }}>
                        <Doughnut 
                          data={userDistributionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'employees' && (
          <Row>
            <Col lg={8}>
              <Card className="metric-card shadow-sm mb-4">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                  <Card.Title className="mb-0 fw-semibold">Employee Performance</Card.Title>
                  <Button variant="primary" size="sm">
                    <FaUserPlus className="me-1" /> Add Employee
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Tickets</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(employee => (
                        <tr key={employee.id}>
                          <td>#{employee.id}</td>
                          <td>{employee.name}</td>
                          <td>{employee.role}</td>
                          <td>
                            <Badge bg={employee.status === 'ACTIVE' ? 'success' : 'secondary'}>
                              {employee.status}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="info">{employee.ticketsAssigned || 0}</Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              View
                            </Button>
                            <Button variant="outline-success" size="sm" className="me-1">
                              Edit
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="metric-card shadow-sm mb-4">
                <Card.Header className="bg-white d-flex align-items-center py-3">
                  <FaMapMarkerAlt className="me-2 text-primary"/>
                  <Card.Title className="mb-0 fw-semibold">Employee Locations</Card.Title>
                </Card.Header>
                <Card.Body>
                  {locations.map(location => (
                    <div key={location.employeeId} className="mb-3 p-2 border rounded">
                      <h6 className="mb-1">{location.employeeName}</h6>
                      <p className="text-muted small mb-1">
                        Lat: {location.latitude}, Lng: {location.longitude}
                      </p>
                      <small className="text-muted">
                        Last updated: {new Date(location.lastUpdated).toLocaleTimeString()}
                      </small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
              
              <Card className="metric-card shadow-sm">
                <Card.Header className="bg-white d-flex align-items-center py-3">
                  <FaChartBar className="me-2 text-primary"/>
                  <Card.Title className="mb-0 fw-semibold">Performance Chart</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '250px' }}>
                    <Bar 
                      data={employeePerformanceData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'notifications' && (
          <Row>
            <Col lg={8}>
              <Card className="metric-card shadow-sm mb-4">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                  <Card.Title className="mb-0 fw-semibold">System Notifications</Card.Title>
                  <Button variant="primary" size="sm">
                    <FaBell className="me-1" /> Send Notification
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map(notification => (
                        <tr key={notification.id}>
                          <td>#{notification.id}</td>
                          <td>{notification.title}</td>
                          <td>{notification.message}</td>
                          <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              View
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="metric-card shadow-sm mb-4">
                <Card.Header className="bg-white d-flex align-items-center py-3">
                  <FaComments className="me-2 text-primary"/>
                  <Card.Title className="mb-0 fw-semibold">Recent Reviews</Card.Title>
                </Card.Header>
                <Card.Body>
                  {reviews.map(review => (
                    <div key={review.id} className="mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0">{review.username}</h6>
                        <Badge bg={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'danger'}>
                          {review.rating}/5
                        </Badge>
                      </div>
                      <p className="text-muted small mb-1">{review.message}</p>
                      <small className="text-muted">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};

// Export the component as default
export default Analytics;