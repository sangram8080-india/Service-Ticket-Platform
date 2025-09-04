import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, Tab, Form, Button, Spinner, Alert,
  Row, Col, Badge, ListGroup, Modal
} from 'react-bootstrap';
import { 
  FaUserCog, FaShieldAlt, FaBell, FaPalette, 
  FaSave, FaKey, FaEnvelope, FaLanguage,
  FaEye, FaEyeSlash, FaSync, FaTrash
} from 'react-icons/fa';
import api from './api';
import '../../Styles/Admin/Setting.css'; 

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings');
        setSettings(response.data);
        setFormData(response.data);
        
        // Fetch session history for security tab
        const sessionResponse = await api.get('/auth/sessions');
        setSessionHistory(sessionResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load settings');
        setLoading(false);
        console.error('Settings error:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/settings', formData);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSecurityAction = async (action, data = {}) => {
    try {
      let response;
      switch (action) {
        case 'terminateSessions':
          response = await api.post('/auth/terminate-sessions');
          setSuccess('All other sessions terminated successfully');
          break;
        case 'enable2FA':
          response = await api.post('/auth/enable-2fa', data);
          setSuccess('Two-factor authentication enabled');
          break;
        case 'disable2FA':
          response = await api.post('/auth/disable-2fa');
          setSuccess('Two-factor authentication disabled');
          break;
        default:
          break;
      }
      
      // Refresh session history
      const sessionResponse = await api.get('/auth/sessions');
      setSessionHistory(sessionResponse.data || []);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform security action');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center settings-loader">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and security settings</p>
      </div>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible className="settings-alert">
          <Alert.Heading>Error</Alert.Heading>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible className="settings-alert">
          <Alert.Heading>Success</Alert.Heading>
          {success}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="settings-tabs"
        fill
      >
        <Tab eventKey="profile" title={
          <span className="tab-title">
            <FaUserCog className="me-2" /> Profile
          </span>
        }>
          <Card className="settings-card">
            <Card.Header>
              <h5 className="card-title">Profile Information</h5>
              <p className="card-subtitle">Update your personal information</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select
                    name="timezone"
                    value={formData.timezone || ''}
                    onChange={handleChange}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="CET">Central European Time (CET)</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving} className="settings-save-btn">
                    {saving ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="me-1" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="security" title={
          <span className="tab-title">
            <FaShieldAlt className="me-2" /> Security
          </span>
        }>
          <Card className="settings-card">
            <Card.Header>
              <h5 className="card-title">Security Settings</h5>
              <p className="card-subtitle">Manage your account security</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <h6 className="mb-3 border-bottom pb-2">Password Management</h6>
                
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword || ''}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                    <Button 
                      variant="outline-secondary" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword || ''}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <Button 
                      variant="outline-secondary" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword || ''}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                    <Button 
                      variant="outline-secondary" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>
                
                <div className="mb-4">
                  <h6 className="mb-3 border-bottom pb-2">Security Settings</h6>
                  <Form.Check
                    type="switch"
                    id="twoFactorAuth"
                    label="Enable Two-Factor Authentication"
                    checked={formData.twoFactorAuth || false}
                    onChange={handleChange}
                    name="twoFactorAuth"
                    className="mb-2"
                  />
                  <small className="text-muted">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </small>
                </div>
                
                <div className="mb-4">
                  <h6 className="mb-3 border-bottom pb-2">Active Sessions</h6>
                  <p className="text-muted">Manage your active login sessions</p>
                  
                  {sessionHistory.length > 0 ? (
                    <ListGroup variant="flush">
                      {sessionHistory.map((session, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                          <div>
                            <div><strong>{session.device}</strong> - {session.browser}</div>
                            <small className="text-muted">
                              {session.location} • Last active: {session.lastActive}
                            </small>
                          </div>
                          {session.current ? (
                            <Badge bg="primary">Current Session</Badge>
                          ) : (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleSecurityAction('terminateSession', { sessionId: session.id })}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No active sessions found.</p>
                  )}
                  
                  <Button 
                    variant="outline-danger" 
                    className="mt-3"
                    onClick={() => handleSecurityAction('terminateSessions')}
                  >
                    <FaSync className="me-1" /> Terminate All Other Sessions
                  </Button>
                </div>
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving} className="settings-save-btn">
                    {saving ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaKey className="me-1" /> Update Security Settings
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="notifications" title={
          <span className="tab-title">
            <FaBell className="me-2" /> Notifications
          </span>
        }>
          <Card className="settings-card">
            <Card.Header>
              <h5 className="card-title">Notification Preferences</h5>
              <p className="card-subtitle">Manage how you receive notifications</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <h6 className="mb-3 border-bottom pb-2">Email Notifications</h6>
                <Form.Check
                  type="switch"
                  id="emailTicketUpdates"
                  label="Ticket updates and responses"
                  checked={formData.emailTicketUpdates || false}
                  onChange={handleChange}
                  name="emailTicketUpdates"
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="emailAnnouncements"
                  label="System announcements"
                  checked={formData.emailAnnouncements || false}
                  onChange={handleChange}
                  name="emailAnnouncements"
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="emailPromotions"
                  label="Promotional offers"
                  checked={formData.emailPromotions || false}
                  onChange={handleChange}
                  name="emailPromotions"
                  className="mb-4"
                />
                
                <h6 className="mb-3 border-bottom pb-2">In-App Notifications</h6>
                <Form.Check
                  type="switch"
                  id="inAppTicketUpdates"
                  label="Ticket updates"
                  checked={formData.inAppTicketUpdates || false}
                  onChange={handleChange}
                  name="inAppTicketUpdates"
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="inAppMessages"
                  label="New messages"
                  checked={formData.inAppMessages || false}
                  onChange={handleChange}
                  name="inAppMessages"
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="inAppSystemAlerts"
                  label="System alerts"
                  checked={formData.inAppSystemAlerts || false}
                  onChange={handleChange}
                  name="inAppSystemAlerts"
                  className="mb-4"
                />
                
                <h6 className="mb-3 border-bottom pb-2">Push Notifications</h6>
                <Form.Check
                  type="switch"
                  id="pushTicketUpdates"
                  label="Ticket updates"
                  checked={formData.pushTicketUpdates || false}
                  onChange={handleChange}
                  name="pushTicketUpdates"
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="pushMessages"
                  label="New messages"
                  checked={formData.pushMessages || false}
                  onChange={handleChange}
                  name="pushMessages"
                  className="mb-4"
                />
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving} className="settings-save-btn">
                    {saving ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="me-1" /> Update Notification Preferences
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="appearance" title={
          <span className="tab-title">
            <FaPalette className="me-2" /> Appearance
          </span>
        }>
          <Card className="settings-card">
            <Card.Header>
              <h5 className="card-title">Appearance Settings</h5>
              <p className="card-subtitle">Customize the look and feel of your dashboard</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Theme</Form.Label>
                  <div className="d-flex gap-4">
                    <div className="theme-option">
                      <Form.Check
                        type="radio"
                        id="themeLight"
                        label={
                          <div className="theme-preview light-theme">
                            <div className="theme-header"></div>
                            <div className="theme-content"></div>
                          </div>
                        }
                        name="theme"
                        value="light"
                        checked={formData.theme === 'light'}
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="themeLight" className="text-center d-block mt-2">Light</Form.Label>
                    </div>
                    <div className="theme-option">
                      <Form.Check
                        type="radio"
                        id="themeDark"
                        label={
                          <div className="theme-preview dark-theme">
                            <div className="theme-header"></div>
                            <div className="theme-content"></div>
                          </div>
                        }
                        name="theme"
                        value="dark"
                        checked={formData.theme === 'dark'}
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="themeDark" className="text-center d-block mt-2">Dark</Form.Label>
                    </div>
                    <div className="theme-option">
                      <Form.Check
                        type="radio"
                        id="themeSystem"
                        label={
                          <div className="theme-preview system-theme">
                            <div className="theme-header"></div>
                            <div className="theme-content"></div>
                          </div>
                        }
                        name="theme"
                        value="system"
                        checked={formData.theme === 'system'}
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="themeSystem" className="text-center d-block mt-2">System Default</Form.Label>
                    </div>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    name="language"
                    value={formData.language || 'en'}
                    onChange={handleChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Density</Form.Label>
                  <Form.Select
                    name="density"
                    value={formData.density || 'normal'}
                    onChange={handleChange}
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="comfortable">Comfortable</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Font Size</Form.Label>
                  <Form.Range 
                    min="12"
                    max="18"
                    step="1"
                    name="fontSize"
                    value={formData.fontSize || 14}
                    onChange={handleChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small>Small</small>
                    <small>Medium</small>
                    <small>Large</small>
                  </div>
                </Form.Group>
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving} className="settings-save-btn">
                    {saving ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaLanguage className="me-1" /> Update Appearance
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Security Confirmation Modal */}
      <Modal show={showSecurityModal} onHide={() => setShowSecurityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Security Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to terminate all other sessions? This will log you out from all other devices.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSecurityModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleSecurityAction('terminateSessions');
            setShowSecurityModal(false);
          }}>
            Terminate Sessions
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;