import React, { useEffect, useMemo, useRef, useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBell, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaCog 
} from 'react-icons/fa';
import { Badge, Spinner, Dropdown } from 'react-bootstrap';
import NotificationCenter from './NotificationCenter';
import '../../Styles/Admin/AdminNavbar.css';

const AdminNavbar = memo(({
  user,
  toggleSidebar,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onLogout,
  isMobile = false,
  isLoadingNotifications = false
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unread = useMemo(() => Math.min(Number(unreadCount) || 0, 99), [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isMobile && showMobileMenu) {
      setShowMobileMenu(false);
    }
  }, [isMobile, showMobileMenu]);

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(prev => !prev);
    setShowProfileDropdown(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    setShowProfileDropdown(prev => !prev);
    setShowNotifications(false);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout();
    navigate('/login');
  }, [onLogout, navigate]);

  const handleMarkAsRead = useCallback((notificationId) => {
    onMarkAsRead(notificationId);
  }, [onMarkAsRead]);

  const handleMarkAllAsRead = useCallback(() => {
    onMarkAllAsRead();
    setShowNotifications(false);
  }, [onMarkAllAsRead]);

  const handleProfileNavigation = useCallback((path) => {
    navigate(path);
    setShowProfileDropdown(false);
  }, [navigate]);

  return (
    <nav className="admin-navbar navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Sidebar toggle */}
        <button 
          className="navbar-toggler sidebar-toggler" 
          type="button" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        
        {/* Brand */}
        <Link to="/admin/dashboard" className="navbar-brand">
          {/* <span className="brand-text">Admin Panel</span> */}
          {/* {!isMobile && <span className="brand-subtitle">Management Console</span>} */}
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className="navbar-toggler mobile-menu-toggler" 
          type="button" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
          aria-expanded={showMobileMenu}
        >
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={`navbar-content ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {/* Notifications */}
            <li className="nav-item notifications-item" ref={notifRef}>
              <button 
                className="nav-link notification-btn"
                onClick={handleNotificationClick}
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <FaBell className="notification-icon" />
                {unread > 0 && (
                  <Badge bg="danger" className="notification-badge">
                    {unread > 9 ? '9+' : unread}
                  </Badge>
                )}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <NotificationCenter
                    notifications={notifications}
                    markAsRead={handleMarkAsRead}
                    markAllAsRead={handleMarkAllAsRead}
                    onClose={() => setShowNotifications(false)}
                    isLoading={isLoadingNotifications}
                  />
                </div>
              )}
            </li>

            {/* User Profile */}
            <li className="nav-item profile-item" ref={profileRef}>
              <button 
                className="nav-link profile-btn"
                onClick={handleProfileClick}
                aria-label="User profile"
                aria-expanded={showProfileDropdown}
              >
                <div className="profile-info">
                  <FaUserCircle className="profile-icon" />
                  {!isMobile && (
                    <div className="profile-details">
                      <span className="profile-name">{user?.name || 'Admin User'}</span>
                      <span className="profile-role">{user?.role || 'Administrator'}</span>
                    </div>
                  )}
                </div>
              </button>
              
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <FaUserCircle className="user-icon" />
                      <div>
                        <div className="user-name">{user?.name || 'Admin User'}</div>
                        <div className="user-email">{user?.email || 'admin@example.com'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item"
                    onClick={() => handleProfileNavigation('/admin/profile')}
                  >
                    <FaUserCircle className="dropdown-icon" />
                    My Profile
                  </button>
                  
                  <button 
                    className="dropdown-item"
                    onClick={() => handleProfileNavigation('/admin/settings')}
                  >
                    <FaCog className="dropdown-icon" />
                    Settings
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
});

AdminNavbar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  toggleSidebar: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
    read: PropTypes.bool,
    createdAt: PropTypes.string,
  })),
  unreadCount: PropTypes.number,
  onMarkAsRead: PropTypes.func,
  onMarkAllAsRead: PropTypes.func,
  onLogout: PropTypes.func,
  isMobile: PropTypes.bool,
  isLoadingNotifications: PropTypes.bool
};

AdminNavbar.defaultProps = {
  user: null,
  notifications: [],
  unreadCount: 0,
  isMobile: false,
  isLoadingNotifications: false
};

export default AdminNavbar;