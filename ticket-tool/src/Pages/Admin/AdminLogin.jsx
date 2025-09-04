import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaEye, 
  FaEyeSlash, 
  FaSignInAlt, 
  FaShieldAlt,
  FaBuilding,
  FaLock,
  FaEnvelope
} from "react-icons/fa";
import AuthService from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call AuthService.login
      const { token, user: userData } = await AuthService.login(email, password);
      console.log("Login response:", { token, userData });

      if (!userData) {
        setError("Invalid response from server");
        return;
      }

      // Check admin role
      if (userData.role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        AuthService.logout();
        return;
      }

      // Store admin token & user
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(userData));

      // Update auth context
      login(userData);

      // Navigate to admin dashboard
      navigate("/admin-portal/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message = err.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-content">
        <div className="login-card admin-login-card">
          <div className="login-header">
            <div className="logo-container">
              <FaShieldAlt className="main-logo" />
              <div className="logo-badge admin-badge">
                <FaBuilding />
              </div>
            </div>
            <h1>Admin Portal</h1>
            <p>Secure System Administration</p>
          </div>

          {error && (
            <div className="error-alert admin-alert">
              <div className="alert-icon">!</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="login-input"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="login-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button 
              type="submit" 
              className="login-btn admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <FaSignInAlt />
                  Admin Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="security-badge admin-security">
              <FaShieldAlt />
              <span>Enterprise-grade Security</span>
            </div>
          </div>
        </div>

        <div className="system-status admin-status">
          <div className="status-indicator active"></div>
          <span>Admin System Operational</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
