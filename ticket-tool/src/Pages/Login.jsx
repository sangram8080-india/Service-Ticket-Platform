import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: ""
  });
  const [activeTab, setActiveTab] = useState("employee");
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userIsLoading, setUserIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Chatbot state
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your virtual assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const EMPLOYEE_API_URL = "http://localhost:8080/api/auth/login";
  const USER_API_URL = "http://localhost:8080/api/auth/login";

  useEffect(() => {
    // Handle video play/pause
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleInputChange = (e, isUser = false) => {
    const { name, value } = e.target;
    if (isUser) {
      setUserCredentials(prev => ({ ...prev, [name]: value }));
    } else {
      setCredentials(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, isUser = false) => {
    e.preventDefault();
    
    if (isUser) {
      setUserError("");
      const { email, password } = userCredentials;
      
      if (!email || !password) {
        setUserError("Please enter both email and password");
        return;
      }

      setUserIsLoading(true);
      
      try {
        const response = await fetch(USER_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            throw new Error(`Login failed with status: ${response.status}`);
          }
          throw new Error(errorData.message || `Login failed: ${response.status}`);
        }

        const responseData = await response.json();
        const token = responseData?.body?.data?.token;
        const userData = responseData?.body?.data;
        
        if (!token || !userData) {
          throw new Error("Authentication data not received from server");
        }

        const user = {
          role: userData.role,
          id: userData.userId,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phone,
          enabled: userData.enabled,
          emailVerified: userData.emailVerified
        };

        login(user, token);
        navigate("/user-portal/dashboard");

      } catch (err) {
        console.error("User login failed:", err);
        
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        let errorMessage = err.message || "Login failed. Please try again.";
        
        if (err.message.includes("401")) {
          errorMessage = "Invalid email or password";
        } else if (err.message.includes("403")) {
          errorMessage = "Account not authorized";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection.";
        }

        setUserError(errorMessage);
      } finally {
        setUserIsLoading(false);
      }
      
    } else {
      // Employee/Agent login
      setError("");
      const { email, password } = credentials;
      
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(EMPLOYEE_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            throw new Error(`Login failed with status: ${response.status}`);
          }
          throw new Error(errorData.message || `Login failed: ${response.status}`);
        }

        const responseData = await response.json();
        const token = responseData?.body?.data?.token;
        const userData = responseData?.body?.data;
        
        if (!token || !userData) {
          throw new Error("Authentication data not received from server");
        }

        const user = {
          role: userData.role,
          id: userData.userId,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phone,
          enabled: userData.enabled,
          emailVerified: userData.emailVerified
        };

        login(user, token);

        const redirectBasedOnRole = (role) => {
          switch(role.toUpperCase()) {
            case "EMPLOYEE":
              navigate("/employee-portal/dashboard");
              break;
            case "USER":
              navigate("/user-portal/dashboard");
              break;
            default:
              navigate("/");
          }
        };

        redirectBasedOnRole(user.role);

      } catch (err) {
        console.error("Login failed:", err);
        
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        let errorMessage = err.message || "Login failed. Please try again.";
        
        if (err.message.includes("401")) {
          errorMessage = "Invalid email or password";
        } else if (err.message.includes("403")) {
          errorMessage = "Account not authorized";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection.";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Chatbot functions
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user"
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "I can help with password resets and account questions.",
        "For security issues, please contact our support team directly.",
        "I'm still learning, but I'll do my best to assist you!",
        "You can reset your password using the 'Forgot Password' link.",
        "Our support team is available 24/7 at support@enterprise.com"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot"
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Container fluid className="login-container p-0">
      <Row className="m-0 h-100">
        {/* Left Side - Video Banner Background */}
        <Col lg={7} className="p-0 d-none d-lg-flex login-video-section">
          <div className="video-container">
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              loop 
              className="background-video"
              poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            >
              <source src="https://video-previews.elements.envatousercontent.com/1df03df8-49fa-499c-a59f-557a7c297304/watermarked_preview/watermarked_preview.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
            
            <div className="video-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="brand-logo mb-4">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h1 className="display-5 fw-bold mb-3">ENTERPRISE PORTAL</h1>
                <p className="lead mb-4 opacity-75">Secure Access Gateway for Employees and Customers</p>
                
                <div className="feature-grid">
                  <div className="feature-item">
                    <i className="bi bi-activity"></i>
                    <span>System Monitoring</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-database-check"></i>
                    <span>Enterprise Security</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-people-fill"></i>
                    <span>User Management</span>
                  </div>
                </div>

                <div className="security-badge mt-5">
                  <i className="bi bi-patch-check-fill me-2"></i>
                  <span>ISO 27001 Certified • GDPR Compliant</span>
                </div>
              </motion.div>
            </div>

            <button className="video-control-btn" onClick={togglePlay}>
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
          </div>
        </Col>

        {/* Right Side - Seamless Login Form */}
        <Col lg={5} className="p-0 login-form-section">
          <div className="h-100 d-flex align-items-center justify-content-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-100 seamless-form-container"
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div className="form-icon mb-3">
                  <i className="bi bi-person-badge"></i>
                </div>
                <h2 className="fw-bold text-white mb-2">ENTERPRISE PORTAL</h2>
                <p className="text-light">Sign in to access your account</p>
              </div>

              {/* Tabbed Login Form */}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4 seamless-tabs"
                justify
              >
                {/* Employee/Agent Login Tab */}
                <Tab eventKey="employee" title={
                  <span>
                    <i className="bi bi-briefcase me-2"></i>Employee/Agent
                  </span>
                }>
                  <Form onSubmit={(e) => handleSubmit(e, false)} className="mt-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label text-light">WORK EMAIL</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="employee@company.com"
                        value={credentials.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        autoComplete="username"
                        className="seamless-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label text-light">PASSWORD</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={credentials.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="seamless-input"
                      />
                    </Form.Group>

                    {error && (
                      <Alert variant="danger" className="seamless-alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                      </Alert>
                    )}

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 seamless-btn py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          SIGNING IN...
                        </>
                      ) : (
                        "SIGN IN AS EMPLOYEE"
                      )}
                    </Button>

                    <div className="form-footer text-center mt-4">
                      <Link to="/forgot-password" className="seamless-link">
                        Forgot Password?
                      </Link>
                    </div>
                  </Form>
                </Tab>

                {/* User Login Tab */}
                <Tab eventKey="user" title={
                  <span>
                    <i className="bi bi-person me-2"></i>Customer
                  </span>
                }>
                  <Form onSubmit={(e) => handleSubmit(e, true)} className="mt-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label text-light">EMAIL ADDRESS</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="customer@example.com"
                        value={userCredentials.email}
                        onChange={(e) => handleInputChange(e, true)}
                        disabled={userIsLoading}
                        autoComplete="username"
                        className="seamless-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label text-light">PASSWORD</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={userCredentials.password}
                        onChange={(e) => handleInputChange(e, true)}
                        disabled={userIsLoading}
                        autoComplete="current-password"
                        className="seamless-input"
                      />
                    </Form.Group>

                    {userError && (
                      <Alert variant="danger" className="seamless-alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {userError}
                      </Alert>
                    )}

                    <Button
                      variant="outline-light"
                      type="submit"
                      className="w-100 seamless-btn py-3"
                      disabled={userIsLoading}
                    >
                      {userIsLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          SIGNING IN...
                        </>
                      ) : (
                        "SIGN IN AS CUSTOMER"
                      )}
                    </Button>

                    <div className="form-footer text-center mt-4">
                      <Link to="/forgot-password" className="seamless-link">
                        Forgot Password?
                      </Link>
                      <span className="divider mx-2 text-light">•</span>
                      <Link to="/register" className="seamless-link">
                        Create Account
                      </Link>
                    </div>
                  </Form>
                </Tab>
              </Tabs>

              <div className="support-info text-center mt-4 pt-3 border-top border-light border-opacity-25">
                <p className="small text-light">
                  Need help? Contact support: <strong>support@enterprise.com</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </Col>
      </Row>

      {/* Chatbot Widget */}
      <div className={`chatbot-widget ${chatbotOpen ? 'open' : ''}`}>
        <div className="chatbot-header" onClick={() => setChatbotOpen(!chatbotOpen)}>
          <div className="d-flex align-items-center">
            <div className="chatbot-avatar">
              <i className="bi bi-robot"></i>
            </div>
            <div className="ms-2">
              <h6 className="mb-0">Virtual Assistant</h6>
              <small>{chatbotOpen ? "Click to minimize" : "Click for help"}</small>
            </div>
          </div>
          <div className="chatbot-actions">
            <button className="btn btn-sm btn-link text-white">
              <i className={`bi ${chatbotOpen ? 'bi-chevron-down' : 'bi-chat-dots'}`}></i>
            </button>
          </div>
        </div>
        
        {chatbotOpen && (
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="chatbot-input">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .login-container {
          height: 100vh;
          background: #0a1930;
        }
        
        .login-video-section {
          position: relative;
          overflow: hidden;
        }
        
        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .background-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translateX(-50%) translateY(-50%);
          object-fit: cover;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(236, 245, 248, 0.1) 0%, rgba(58, 67, 86, 0.52) 100%);
        }
        
        .video-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 2rem;
        }
        
        .video-control-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 3;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }
        
        .video-control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .brand-logo i {
          font-size: 4rem;
          color: #4facfe;
        }
        
        .feature-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .feature-item i {
          font-size: 1.5rem;
          color: #4fc3f7;
        }
        
        .security-badge {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(213, 122, 73, 0.8);
        }
        
        .login-form-section {
          background: linear-gradient(135deg, rgba(40, 80, 130, 0.95) 0%, rgba(25, 50, 100, 0.98) 100%);
          backdrop-filter: blur(5px);
        }
        
        .seamless-form-container {
          padding: 2rem;
          max-width: 450px;
        }
        
        .form-icon i {
          font-size: 2.5rem;
          color: #4facfe;
        }
        
        .form-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .seamless-input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          transition: all 0.3s;
        }
        
        .seamless-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        .seamless-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .seamless-alert {
          border-radius: 8px;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          background: rgba(220, 53, 69, 0.2);
          color: #fff;
        }
        
        .seamless-btn {
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s;
        }
        
        .btn-primary.seamless-btn {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .btn-outline-light.seamless-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .seamless-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .seamless-btn:disabled {
          opacity: 0.7;
        }
        
        .form-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .seamless-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        
        .seamless-link:hover {
          color: #fff;
          text-decoration: underline;
        }
        
        .divider {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .seamless-tabs .nav-link {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          border: none;
          padding: 0.75rem 1.5rem;
          background: transparent;
        }
        
        .seamless-tabs .nav-link.active {
          color: #fff;
          background: transparent;
          border-bottom: 2px solid #4facfe;
          border-radius: 0;
        }
        
        .seamless-tabs .nav-link:hover {
          color: #fff;
          border-color: transparent;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .seamless-tabs .nav-item {
          margin-bottom: 0;
        }
        
        .seamless-tabs .nav-tabs {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .support-info {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Chatbot Widget Styles */
        .chatbot-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.15);
          z-index: 1000;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .chatbot-header {
          padding: 15px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chatbot-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .chatbot-body {
          height: 350px;
          display: flex;
          flex-direction: column;
        }
        
        .chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background: #f8f9fa;
        }
        
        .message {
          margin-bottom: 15px;
          padding: 10px 15px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
        }
        
        .message.user {
          background: #4facfe;
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }
        
        .message.bot {
          background: #e9ecef;
          color: #333;
          margin-right: auto;
          border-bottom-left-radius: 5px;
        }
        
        .chatbot-input {
          padding: 15px;
          border-top: 1px solid #dee2e6;
          background: white;
        }
        
        @media (max-width: 991px) {
          .login-container {
            background: linear-gradient(135deg, #0a1930 0%, #1a2530 100%);
          }
          
          .login-form-section {
            background: transparent;
          }
        }
        
        @media (max-width: 576px) {
          .chatbot-widget {
            width: 90%;
            right: 5%;
            left: 5%;
          }
        }
      `}</style>
    </Container>
  );
};

export default Login;