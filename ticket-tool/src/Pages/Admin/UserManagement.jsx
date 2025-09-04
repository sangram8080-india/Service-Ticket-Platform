import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Spinner,
  Alert,
  Pagination,
  Row,
  Col,
  Dropdown,
  InputGroup,
  Container
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaUserSlash,
  FaEnvelope,
  FaEye,
  FaTh,
  FaList,
  FaEllipsisV,
  FaPhone,
  FaUserCircle,
  FaIdCard,
  FaCalendar,
  FaFilter,
  FaSync
} from "react-icons/fa";

// API service with real endpoints
const API_BASE = "http://localhost:8080/api";

const api = {
  get: async (endpoint, params = {}) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const url = `${API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },
  
  delete: async (endpoint) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers,
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },
  
  patch: async (endpoint, data = {}) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({});

  const [viewMode, setViewMode] = useState("list"); // list or grid

  // Fetch users
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page: page - 1, size: 10 };
      if (searchTerm) params.search = searchTerm;
      if (filterRole !== "ALL") params.role = filterRole;
      if (filterStatus !== "ALL") params.enabled = filterStatus === "ENABLED";

      const response = await api.get("/users", params);
      if (response.status === "success") {
        const filteredUsers = response.data.users.filter(u => u.role !== "ADMIN");
        setUsers(filteredUsers);
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalUsers(response.data.pagination.totalItems || 0);
        setError("");
      } else {
        setError(response.message || "Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await api.get("/users/stats");
      if (response.status === "success") {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchUserStats();
  }, [searchTerm, filterRole, filterStatus, currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
      fetchUsers(currentPage);
      fetchUserStats();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleStatusChange = async (id, enabled) => {
    try {
      await api.patch(`/users/${id}/status?enabled=${enabled}`);
      setSuccess(`User ${enabled ? "enabled" : "disabled"} successfully`);
      setTimeout(() => setSuccess(""), 3000);
      fetchUsers(currentPage);
      fetchUserStats();
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const getProfileImageUrl = (userId) => {
    return `${API_BASE}/users/${userId}/profile-image`;
  };

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4 user-management">
      <style>
        {`
          .user-management {
            background-color: #f8f9fa;
            min-height: 100vh;
          }
          .user-card {
            transition: all 0.2s ease;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e9ecef;
            background-color: #fff;
          }
          .user-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .user-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #fff;
          }
          .stats-card {
            background-color: #fff;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          .stats-value {
            font-size: 1.75rem;
            font-weight: 600;
            color: #2c3e50;
          }
          .stats-label {
            color: #6c757d;
            font-size: 0.875rem;
          }
          .table th {
            border-top: none;
            font-weight: 600;
            color: #495057;
            background-color: #f8f9fa;
          }
          .action-btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0 text-dark fw-bold">User Management</h3>
          <p className="text-muted mb-0">Manage your team members and their accounts</p>
        </div>
        <Button variant="primary" className="rounded-pill px-4">
          <FaPlus className="me-2" /> Add User
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {/* Stats Card */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 stats-card">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="stats-label mb-1">Total Users</p>
                  <h4 className="stats-value mb-0">{stats.totalUsers || 0}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FaUserCircle className="text-primary" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 stats-card">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="stats-label mb-1">Active Users</p>
                  <h4 className="stats-value mb-0">{stats.enabledUsers || 0}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <FaUserPlus className="text-success" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 stats-card">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="stats-label mb-1">Employees</p>
                  <h4 className="stats-value mb-0">{stats.byRole?.EMPLOYEE || 0}</h4>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <FaUserPlus className="text-info" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 stats-card">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="stats-label mb-1">Regular Users</p>
                  <h4 className="stats-value mb-0">{stats.byRole?.USER || 0}</h4>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                  <FaUserCircle className="text-secondary" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and View Toggle */}
      <Card className="mb-4 user-card">
        <Card.Body className="py-3">
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="ALL">All Roles</option>
                <option value="USER">User</option>
                <option value="EMPLOYEE">Employee</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="ENABLED">Enabled</option>
                <option value="DISABLED">Disabled</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-primary" 
                onClick={() => { setCurrentPage(1); fetchUsers(1); }} 
                className="w-100"
              >
                <FaFilter className="me-1" /> Apply
              </Button>
            </Col>
            <Col md={2} className="text-end">
              <div className="btn-group">
                <Button 
                  variant={viewMode === "list" ? "primary" : "outline-primary"} 
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <FaList />
                </Button>
                <Button 
                  variant={viewMode === "grid" ? "primary" : "outline-primary"} 
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <FaTh />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => { fetchUsers(currentPage); fetchUserStats(); }}
                  className="ms-2"
                >
                  <FaSync />
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* List View */}
      {viewMode === "list" && (
        <Card className="user-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Contact Info</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="py-4">
                          <FaUserCircle size={40} className="text-muted mb-2" />
                          <p className="text-muted mb-0">No users found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className={!user.enabled ? "text-muted" : ""}>
                        <td>
                          <div className="d-flex align-items-center">
                            {user.profileImage ? (
                              <img
                                src={getProfileImageUrl(user.id)}
                                alt={user.name}
                                className="user-avatar me-3"
                              />
                            ) : (
                              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" 
                                style={{ width: "48px", height: "48px" }}>
                                <FaUserCircle size={24} className="text-secondary" />
                              </div>
                            )}
                            <div>
                              <div className="fw-medium">{user.name}</div>
                              <small className="text-muted">ID: {user.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mb-1">{user.email}</div>
                          {user.phone ? (
                            <div className="d-flex align-items-center text-muted small">
                              <FaPhone className="me-1" size={12} />
                              {formatPhoneNumber(user.phone)}
                            </div>
                          ) : (
                            <span className="text-muted small">No phone</span>
                          )}
                        </td>
                        <td>
                          <Badge 
                            bg={user.role === "EMPLOYEE" ? "info" : "secondary"} 
                            className="px-2 py-1"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <div className="mb-1">
                            <Badge 
                              bg={user.enabled ? "success" : "danger"} 
                              className="px-2 py-1"
                            >
                              {user.enabled ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div>
                            <Badge 
                              bg={user.emailVerified ? "success" : "warning"} 
                              className="px-2 py-1"
                            >
                              {user.emailVerified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                        </td>
                        <td className="text-center">
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="text-dark p-0" id={`dropdown-${user.id}`}>
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => setSelectedUser(user)}>
                                <FaEye className="me-2" /> View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => setSelectedUser(user)}>
                                <FaEdit className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleStatusChange(user.id, !user.enabled)}>
                                {user.enabled ? (
                                  <><FaUserSlash className="me-2" /> Disable</>
                                ) : (
                                  <><FaUserPlus className="me-2" /> Enable</>
                                )}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger" 
                                onClick={() => handleDelete(user.id)}
                              >
                                <FaTrash className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer className="d-flex justify-content-between align-items-center border-0 bg-light">
              <div className="text-muted">
                Showing {users.length} of {totalUsers} users
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item 
                    key={i + 1} 
                    active={i + 1 === currentPage} 
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </Card.Footer>
          )}
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <Row className="g-4">
          {users.length === 0 ? (
            <Col xs={12} className="text-center py-5">
              <FaUserCircle size={50} className="text-muted mb-3" />
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </Col>
          ) : (
            users.map((user) => (
              <Col key={user.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 user-card">
                  <Card.Body className="text-center pb-0">
                    <div className="position-relative mb-3">
                      {user.profileImage ? (
                        <img
                          src={getProfileImageUrl(user.id)}
                          alt={user.name}
                          className="user-avatar mx-auto"
                        />
                      ) : (
                        <div className="mx-auto" style={{ width: "80px", height: "80px" }}>
                          <FaUserCircle size={80} className="text-secondary" />
                        </div>
                      )}
                      <Badge 
                        bg={user.enabled ? "success" : "danger"} 
                        className="position-absolute top-0 start-50 translate-middle"
                        style={{ zIndex: 1 }}
                      >
                        {user.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <h6 className="mb-1">{user.name}</h6>
                    <p className="text-muted small mb-2">{user.email}</p>
                    
                    {user.phone && (
                      <div className="d-flex align-items-center justify-content-center text-muted small mb-2">
                        <FaPhone className="me-1" size={10} />
                        <span>{formatPhoneNumber(user.phone)}</span>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <Badge bg={user.role === "EMPLOYEE" ? "info" : "secondary"}>
                        {user.role}
                      </Badge>
                      <Badge bg={user.emailVerified ? "success" : "warning"}>
                        {user.emailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 pt-0">
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <FaEye className="me-1" /> View Details
                      </Button>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                          <FaEllipsisV /> Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectedUser(user)}>
                            <FaEdit className="me-2" /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleStatusChange(user.id, !user.enabled)}>
                            {user.enabled ? (
                              <><FaUserSlash className="me-2" /> Disable</>
                            ) : (
                              <><FaUserPlus className="me-2" /> Enable</>
                            )}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="text-danger" 
                            onClick={() => handleDelete(user.id)}
                          >
                            <FaTrash className="me-2" /> Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* User Detail Modal */}
      <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-3 position-relative d-inline-block">
                  {selectedUser.profileImage ? (
                    <img
                      src={getProfileImageUrl(selectedUser.id)}
                      alt={selectedUser.name}
                      className="user-avatar"
                      style={{ width: "120px", height: "120px" }}
                    />
                  ) : (
                    <div style={{ width: "120px", height: "120px" }} className="mx-auto">
                      <FaUserCircle size={120} className="text-secondary" />
                    </div>
                  )}
                  <Badge 
                    bg={selectedUser.enabled ? "success" : "danger"} 
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {selectedUser.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <h5>{selectedUser.name}</h5>
                <p className="text-muted mb-3">{selectedUser.email}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <Badge bg={selectedUser.role === "EMPLOYEE" ? "info" : "secondary"}>
                    {selectedUser.role}
                  </Badge>
                  <Badge bg={selectedUser.emailVerified ? "success" : "warning"}>
                    {selectedUser.emailVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="outline-primary"
                    onClick={() => {
                      setSelectedUser(selectedUser);
                    }}
                  >
                    <FaEdit className="me-2" /> Edit User
                  </Button>
                  <Button 
                    variant={selectedUser.enabled ? "outline-danger" : "outline-success"}
                    onClick={() => {
                      handleStatusChange(selectedUser.id, !selectedUser.enabled);
                      setSelectedUser(null);
                    }}
                  >
                    {selectedUser.enabled ? (
                      <><FaUserSlash className="me-2" /> Disable User</>
                    ) : (
                      <><FaUserPlus className="me-2" /> Enable User</>
                    )}
                  </Button>
                </div>
              </Col>
              <Col md={8}>
                <h6 className="mb-3 border-bottom pb-2">Contact Information</h6>
                
                <div className="d-flex mb-3">
                  <div className="me-3 text-muted">
                    <FaPhone />
                  </div>
                  <div>
                    <div className="text-muted small">Phone</div>
                    <div>{formatPhoneNumber(selectedUser.phone) || "Not provided"}</div>
                  </div>
                </div>
                
                <div className="d-flex mb-3">
                  <div className="me-3 text-muted">
                    <FaEnvelope />
                  </div>
                  <div>
                    <div className="text-muted small">Email</div>
                    <div>{selectedUser.email}</div>
                  </div>
                </div>
                
                <h6 className="mb-3 mt-4 border-bottom pb-2">Account Information</h6>
                
                <div className="d-flex mb-3">
                  <div className="me-3 text-muted">
                    <FaIdCard />
                  </div>
                  <div>
                    <div className="text-muted small">Role</div>
                    <div>{selectedUser.role}</div>
                  </div>
                </div>
                
                <div className="d-flex mb-3">
                  <div className="me-3 text-muted">
                    <FaUserCircle />
                  </div>
                  <div>
                    <div className="text-muted small">Account Status</div>
                    <div>
                      <Badge bg={selectedUser.enabled ? "success" : "danger"}>
                        {selectedUser.enabled ? "Active" : "Disabled"}
                      </Badge>
                      {" • "}
                      <Badge bg={selectedUser.emailVerified ? "success" : "warning"}>
                        {selectedUser.emailVerified ? "Email Verified" : "Email Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <h6 className="mb-3 mt-4 border-bottom pb-2">System Information</h6>
                
                <div className="d-flex">
                  <div className="me-3 text-muted">
                    <FaCalendar />
                  </div>
                  <div>
                    <div className="text-muted small">User ID</div>
                    <div>{selectedUser.id}</div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagement;