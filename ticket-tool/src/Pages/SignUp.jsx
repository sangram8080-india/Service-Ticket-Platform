import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../Styles/SignUp.css';
import RegisterImage from "../Images/1.png";

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = [];

    if (form.name.length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.push('Please enter a valid corporate email address');
    }

    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(form.phone.replace(/[\s-]/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    if (form.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.push('Password must include uppercase, lowercase letters and numbers');
    }
    if (form.password !== form.confirmPassword) {
      errors.push('Password confirmation does not match');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'USER'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Registration failed with status ${response.status}`);
      }

      setSuccess('Account created successfully! Redirecting to login...');
      
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Registration failed. Please contact IT support');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 vh-100 enterprise-landscape">
      <Row className="m-0 h-100">
        {/* Left Side - Corporate Banner (Merged Background) */}
        <Col lg={7} className="p-0 corporate-banner">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5"
          >
            {/* Animated Logo */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 20 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="text-center mb-4"
            >
              <img
                src={RegisterImage}
                alt="Enterprise Solutions"
                className="banner-logo"
              />
            </motion.div>

            {/* Corporate Message */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="display-4 fw-bold mb-3">ENTERPRISE SOLUTIONS</h1>
              <p className="lead mb-4 opacity-75">Global IT Support Platform</p>
              
              <div className="banner-features">
                <div className="feature-item">
                  <i className="bi bi-shield-check me-2"></i>
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-clock-history me-2"></i>
                  <span>24/7 Dedicated Support</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-graph-up me-2"></i>
                  <span>Real-time Analytics Dashboard</span>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="position-absolute bottom-0 start-0 end-0 p-4 text-center"
            >
              <p className="small opacity-75 mb-1">© 2024 Enterprise Solutions Inc.</p>
              <p className="small opacity-50">v2.4.1 • Secure Connection • ISO 27001 Certified</p>
            </motion.div>
          </motion.div>
        </Col>

        {/* Right Side - Seamless Form (No Borders) */}
        <Col lg={5} className="p-0 seamless-form-section">
          <div className="h-100 d-flex align-items-center justify-content-center">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-100 seamless-form-container"
            >
              {/* Header */}
              <div className="text-center mb-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="fw-bold text-dark mb-2">USER ACCESS PORTAL</h3>
                  <p className="text-muted small">Register for enterprise system access</p>
                </motion.div>
              </div>

              {/* Status Alerts */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Alert variant="danger" className="seamless-alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-x-circle-fill me-2"></i>
                      <span className="small">{error}</span>
                    </div>
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Alert variant="success" className="seamless-alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span className="small">{success}</span>
                    </div>
                  </Alert>
                </motion.div>
              )}

              {/* Registration Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">FULL NAME *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name" 
                    required 
                    className="seamless-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">CORPORATE EMAIL *</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="name@company.com" 
                    required 
                    className="seamless-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">CONTACT NUMBER *</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    placeholder="+1 (555) 123-4567" 
                    required 
                    className="seamless-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">PASSWORD *</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Minimum 8 characters with complexity" 
                    required 
                    className="seamless-input"
                  />
                  <Form.Text className="help-text">
                    Include uppercase, lowercase, numbers, and special characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">CONFIRM PASSWORD *</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Re-enter your password" 
                    required 
                    className="seamless-input"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 seamless-btn py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span>PROCESSING REQUEST...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill me-2"></i>
                      <span>REQUEST ACCESS</span>
                    </>
                  )}
                </Button>
              </Form>

              {/* Footer Links */}
              <div className="text-center mt-4">
                <p className="footer-text">
                  Existing user?{' '}
                  <a href="/login" className="seamless-link">
                    SIGN IN TO YOUR ACCOUNT
                  </a>
                </p>
                <p className="footer-small">
                  <a href="/" className="seamless-link-secondary">
                    ← RETURN TO CORPORATE HOMEPAGE
                  </a>
                </p>
                <div className="security-badge">
                  <i className="bi bi-shield-check me-1"></i>
                  <span>256-bit SSL Encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;