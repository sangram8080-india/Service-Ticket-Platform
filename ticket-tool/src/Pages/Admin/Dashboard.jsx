import React, { useState, useEffect, useCallback } from "react";
import {
  Card, Row, Col, Spinner, Alert, Button, Container, Badge, ProgressBar,
  Modal, Form, Table, Dropdown, InputGroup
} from "react-bootstrap";
import {
  FaUsers, FaTicketAlt, FaChartLine, FaCheckCircle,
  FaSync, FaExclamationTriangle, FaClock, FaUserCog,
  FaHistory, FaDatabase, FaCog, FaFilter, FaEye, FaEdit, FaTrash,
  FaArrowUp, FaArrowDown, FaSearch, FaEllipsisV
} from "react-icons/fa";
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
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [ticketStatusData, setTicketStatusData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [timeRange, setTimeRange] = useState("week"); // week, month, quarter

  // API base URL
  const API_BASE = "http://localhost:8080/api";

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
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel
      const [
        userStatsRes, 
        ticketsRes, 
        statusRes, 
        growthRes, 
        activitiesRes,
        employeesRes
      ] = await Promise.all([
        apiCall("/users/stats"),
        apiCall("/tickets/all"),
        apiCall("/admin/tickets/status-count"),
        apiCall(`/users/growth?range=${timeRange}`),
        apiCall("/activity/recent"),
        apiCall("/employees/all")
      ]);

      // Extract data from responses
      const userStats = userStatsRes.data || {};
      const allTickets = ticketsRes || [];
      const statusCounts = statusRes || [];
      const growthData = growthRes.data || [];
      const activities = activitiesRes || [];
      const employeesData = employeesRes || [];

      // Process ticket status counts
      const openTickets = statusCounts.find(s => s.status === "OPEN")?.count || 0;
      const resolvedTickets = statusCounts.find(s => s.status === "RESOLVED")?.count || 0;
      const inProgressTickets = statusCounts.find(s => s.status === "IN_PROGRESS")?.count || 0;
      const highPriorityTickets = allTickets.filter(t => t.priority === "HIGH").length;

      // Set state with processed data
      setStats({
        totalUsers: userStats.totalUsers || 0,
        totalTickets: allTickets.length,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        highPriorityTickets,
        newUsersThisWeek: userStats.newThisWeek || 0,
        enabledUsers: userStats.enabledUsers || 0,
        disabledUsers: userStats.disabledUsers || 0,
        byRole: userStats.byRole || {}
      });

      setTicketStatusData([
        { status: "Open", count: openTickets, color: "rgba(255, 193, 7, 0.8)" },
        { status: "Resolved", count: resolvedTickets, color: "rgba(40, 167, 69, 0.8)" },
        { status: "In Progress", count: inProgressTickets, color: "rgba(23, 162, 184, 0.8)" }
      ]);

      setUserGrowthData(Array.isArray(growthData) ? growthData : []);
      setRecentActivities(activities);
      setTickets(allTickets);
      setEmployees(employeesData);
      
      // Mock system health data (not in your API)
      setSystemHealth({
        cpu: 45,
        memory: 78,
        storage: 62,
        uptime: "12 days, 4 hrs",
        responseTime: "142ms",
        errorRate: "0.2%"
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Filter tickets based on parameters
  const filterTickets = async () => {
    try {
      const filteredTickets = await apiCall("/admin/tickets/filter", {
        method: "POST",
        body: JSON.stringify(filterParams)
      });
      setTickets(filteredTickets);
      setShowFilterModal(false);
    } catch (error) {
      setError("Failed to filter tickets");
    }
  };

  // Safely process user growth data
  const userGrowthLabels = Array.isArray(userGrowthData) 
    ? userGrowthData.map(d => d.week || d.period || '') 
    : [];
  const userGrowthCounts = Array.isArray(userGrowthData) 
    ? userGrowthData.map(d => d.count || d.userCount || 0) 
    : [];

  const userGrowthChartData = {
    labels: userGrowthLabels,
    datasets: [{
      label: "New Users",
      data: userGrowthCounts,
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.3,
      fill: true,
      pointBackgroundColor: "rgb(59, 130, 246)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(59, 130, 246)"
    }]
  };

  const userGrowthOptions = {
    responsive: true,
    plugins: { 
      legend: { position: "top" }, 
      title: { display: true, text: "User Growth Trend" } 
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1 },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      }
    }
  };

  const ticketStatusChartData = {
    labels: ticketStatusData.map(d => d.status),
    datasets: [{
      label: "Tickets",
      data: ticketStatusData.map(d => d.count || 0),
      backgroundColor: ticketStatusData.map(d => d.color),
      borderColor: ticketStatusData.map(d => d.color.replace("0.8", "1")),
      borderWidth: 1
    }]
  };

  const ticketStatusOptions = {
    responsive: true,
    plugins: { 
      legend: { position: "top" }, 
      title: { display: true, text: "Ticket Status Distribution" } 
    }
  };

  const systemHealthData = {
    labels: ['CPU', 'Memory', 'Storage'],
    datasets: [{
      label: 'Usage (%)',
      data: [systemHealth.cpu || 0, systemHealth.memory || 0, systemHealth.storage || 0],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)'
      ],
      borderWidth: 1
    }]
  };

  const statCards = [
    { 
      label: "Total Users", 
      value: stats.totalUsers || 0, 
      icon: FaUsers, 
      color: "primary", 
      change: stats.newUsersThisWeek > 0 ? `+${stats.newUsersThisWeek} this week` : null,
      trend: stats.newUsersThisWeek > 0 ? "up" : "down"
    },
    { 
      label: "Total Tickets", 
      value: stats.totalTickets || 0, 
      icon: FaTicketAlt, 
      color: "info" 
    },
    { 
      label: "Open Tickets", 
      value: stats.openTickets || 0, 
      icon: FaExclamationTriangle, 
      color: "warning" 
    },
    { 
      label: "In Progress", 
      value: stats.inProgressTickets || 0, 
      icon: FaClock, 
      color: "secondary" 
    },
    { 
      label: "Resolved Tickets", 
      value: stats.resolvedTickets || 0, 
      icon: FaCheckCircle, 
      color: "success", 
      progress: stats.totalTickets > 0 ? (stats.resolvedTickets / stats.totalTickets) * 100 : 0 
    },
    { 
      label: "High Priority", 
      value: stats.highPriorityTickets || 0, 
      icon: FaExclamationTriangle, 
      color: "danger" 
    }
  ];

  if (loading) return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading dashboard data...</span>
      </div>
    </Container>
  );

  return (
    <Container fluid className="py-4 dashboard-container">
      {/* CSS Styles */}
      <style>
        {`
          .dashboard-container {
            background-color: #f8fafc;
            min-height: 100vh;
          }
          .stat-card {
            transition: all 0.3s ease;
            border-radius: 8px;
            overflow: hidden;
            border: none;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .chart-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
          }
          .system-health {
            background: linear-gradient(120deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border-radius: 8px;
            border: none;
          }
          .activity-item {
            border-left: 3px solid #4f46e5;
            padding-left: 12px;
            margin-bottom: 15px;
          }
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .trend-up {
            color: #10b981;
          }
          .trend-down {
            color: #ef4444;
          }
          .table th {
            border-top: none;
            font-weight: 600;
            color: #374151;
            background-color: #f9fafb;
          }
          .dashboard-header {
            color: #1f2937;
            font-weight: 700;
          }
          .dashboard-subheader {
            color: #6b7280;
          }
          .card-header-custom {
            background-color: white;
            border-bottom: 1px solid #e5e7eb;
          }
          .filter-btn {
            border-radius: 6px;
          }
          .search-input {
            border-left: none;
          }
          .search-icon {
            border-right: none;
            background-color: #f9fafb;
          }
        `}
      </style>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="dashboard-header mb-1">Dashboard Overview</h3>
          <p className="dashboard-subheader mb-0">Monitor system performance and metrics</p>
        </div>
        <div className="d-flex align-items-center">
          {lastUpdated && (
            <Badge bg="light" text="dark" className="me-3">
              <FaHistory className="me-1" /> Last updated: {lastUpdated}
            </Badge>
          )}
          <Button variant="outline-primary" size="sm" onClick={fetchDashboardData} className="d-flex align-items-center">
            <FaSync className="me-1" /> Refresh
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Col xl={4} lg={4} md={6} sm={6} key={idx}>
              <Card className="stat-card h-100">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div className={`stat-icon bg-${card.color} bg-opacity-10 me-3`}>
                      <Icon className={`text-${card.color}`} size={18} />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-0">{(card.value || 0).toLocaleString()}</h5>
                      <span className="text-muted small">{card.label}</span>
                      {card.change && (
                        <div className={`small mt-1 ${card.trend === "up" ? "trend-up" : "trend-down"}`}>
                          {card.trend === "up" ? <FaArrowUp className="me-1" /> : <FaArrowDown className="me-1" />}
                          {card.change}
                        </div>
                      )}
                    </div>
                    {card.progress !== undefined && (
                      <div className="text-end">
                        <Badge bg={card.color} className="px-2 py-1">{card.progress.toFixed(0)}%</Badge>
                      </div>
                    )}
                  </div>
                  {card.progress !== undefined && (
                    <ProgressBar now={card.progress} variant={card.color} className="mt-2" style={{ height: "4px" }} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Charts */}
      <Row className="g-3 mb-4">
        <Col xl={8} lg={7}>
          <Card className="chart-container h-100">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-semibold">User Growth</h6>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" id="time-range-dropdown">
                  {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Quarterly"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTimeRange("week")}>Weekly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeRange("month")}>Monthly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeRange("quarter")}>Quarterly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body className="pt-0">
              {userGrowthLabels.length > 0 ? (
                <Line data={userGrowthChartData} options={userGrowthOptions} height={100} />
              ) : (
                <div className="text-center py-5 text-muted">
                  <FaDatabase size={40} className="mb-3 opacity-50" />
                  <p>No user growth data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={5}>
          <Card className="chart-container h-100">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-semibold">Ticket Distribution</h6>
              <Badge bg="light" text="dark">Status</Badge>
            </Card.Header>
            <Card.Body className="pt-0">
              {ticketStatusData.length > 0 ? (
                <div className="d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                  <Doughnut data={ticketStatusChartData} options={ticketStatusOptions} />
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <FaTicketAlt size={40} className="mb-3 opacity-50" />
                  <p>No ticket data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Health and Recent Activities */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <Card className="system-health h-100">
            <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 text-white fw-semibold">System Health</h6>
              <Badge bg="light" text="dark">
                <FaCog className="me-1" /> Live
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Bar 
                    data={systemHealthData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: 'white'
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            color: 'white'
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          }
                        },
                        x: {
                          ticks: {
                            color: 'white'
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          }
                        }
                      }
                    }} 
                    height={100}
                  />
                </Col>
                <Col md={4} className="d-flex flex-column justify-content-center">
                  <div className="mb-3">
                    <h6 className="text-white-50 mb-1">Uptime</h6>
                    <h5 className="text-white mb-0">{systemHealth.uptime || "Calculating..."}</h5>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-white-50 mb-1">Response Time</h6>
                    <h5 className="text-white mb-0">{systemHealth.responseTime || "142ms"}</h5>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-white-50 mb-1">Error Rate</h6>
                    <h5 className="text-white mb-0">{systemHealth.errorRate || "0.2%"}</h5>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-semibold">Recent Activities</h6>
              <Badge bg="primary">{recentActivities.length}</Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <h6 className="mb-1 text-gray-800">{activity.action}</h6>
                    <p className="text-muted small mb-0">{activity.description}</p>
                    <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>No recent activities</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tickets Table */}
      <Row className="g-3">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-semibold">Recent Tickets</h6>
              <div className="d-flex">
                <InputGroup size="sm" className="me-2" style={{ width: '200px' }}>
                  <InputGroup.Text className="search-icon">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search tickets..."
                    className="search-input"
                  />
                </InputGroup>
                <Button variant="outline-primary" size="sm" onClick={() => setShowFilterModal(true)} className="filter-btn">
                  <FaFilter className="me-1" /> Filter
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map(ticket => (
                    <tr key={ticket.id}>
                      <td className="fw-semibold">#{ticket.id}</td>
                      <td>{ticket.title}</td>
                      <td>
                        <Badge bg={
                          ticket.status === 'OPEN' ? 'warning' : 
                          ticket.status === 'RESOLVED' ? 'success' : 'info'
                        } className="px-2">
                          {ticket.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={
                          ticket.priority === 'HIGH' ? 'danger' : 
                          ticket.priority === 'MEDIUM' ? 'warning' : 'secondary'
                        } className="px-2">
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="text-dark p-0" id="action-dropdown">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <FaEye className="me-2" /> View
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <FaEdit className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-danger">
                              <FaTrash className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {tickets.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <p>No tickets found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Modal */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title>Filter Tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select onChange={e => setFilterParams({...filterParams, status: e.target.value})}>
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select onChange={e => setFilterParams({...filterParams, priority: e.target.value})}>
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowFilterModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={filterTickets}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;