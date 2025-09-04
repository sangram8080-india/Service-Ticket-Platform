// src/Pages/Admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import {
  FaTachometerAlt, FaUsers, FaTicketAlt, FaChartBar,
  FaMapMarkerAlt, FaCog, FaHistory, FaQuestionCircle,
  FaUserCog, FaSignOutAlt, FaUserCircle,
  FaChevronDown, FaChevronUp, FaCircle, FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../Styles/Admin/AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setActiveItem(location.pathname);
    if (isMobile) setCollapsed(false);
  }, [location.pathname, isMobile]);

  const menuItems = [
    { path: '/admin-portal/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin-portal/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin-portal/tickets', label: 'Ticket Management', icon: <FaTicketAlt /> },
    { path: '/admin-portal/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { path: '/admin-portal/live-tracking', label: 'Live Tracking', icon: <FaMapMarkerAlt /> },
    { path: '/admin-portal/activity-log', label: 'Activity Log', icon: <FaHistory /> },
    { path: '/admin-portal/support', label: 'Support', icon: <FaQuestionCircle /> },
  ];

  const settingsItems = [
    { path: '/admin-portal/profile', label: 'Profile', icon: <FaUserCircle /> },
    { path: '/logout', label: 'Logout', icon: <FaSignOutAlt /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (showSettingsMenu) setShowSettingsMenu(false);
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="admin-sidebar-backdrop"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : false}
        animate={isOpen || !isMobile ? 'open' : 'closed'}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-between p-3">
            {!collapsed && (
              <motion.div 
                className="d-flex align-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FaUserCog size={24} className="me-2 text-primary" />
                <span className="sidebar-title">Admin Portal</span>
              </motion.div>
            )}
            {collapsed && (
              <div className="d-flex justify-content-center w-100">
                <FaUserCog size={24} className="text-primary" />
              </div>
            )}
            <button 
              className="sidebar-toggle-btn" 
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronRight />}
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="sidebar-content">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                className={`sidebar-nav-item ${activeItem === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {collapsed && hoveredItem === item.path && (
                  <motion.div 
                    className="nav-tooltip"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {item.label}
                  </motion.div>
                )}
                {activeItem === item.path && !collapsed && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeIndicator"
                  />
                )}
                {(activeItem === item.path && collapsed) && (
                  <div className="active-dot"></div>
                )}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Footer with settings */}
        <div className="sidebar-footer">
          <div
            className={`sidebar-nav-item settings-item ${showSettingsMenu ? 'open' : ''}`}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            onMouseEnter={() => !collapsed && setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="nav-icon"><FaCog /></span>
            {!collapsed && (
              <>
                <span className="nav-label">Settings</span>
                {/* <span className="chevron">{showSettingsMenu ? <FaChevronUp /> : <FaChevronDown />}</span> */}
              </>
            )}
            {collapsed && hoveredItem === 'settings' && (
              <motion.div 
                className="nav-tooltip"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Settings
              </motion.div>
            )}
            {(collapsed && showSettingsMenu) && (
              <div className="active-dot"></div>
            )}
          </div>

          {/* {!collapsed && showSettingsMenu && (
            <motion.div 
              className="settings-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {settingsItems.map((item) => (
                <div
                  key={item.path}
                  className="settings-menu-item"
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="settings-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          )} */}

          {/* System info */}
          {!collapsed && (
            <>
              <div className="system-status p-3 d-flex align-items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <FaCircle className="status-indicator online me-2" />
                </motion.div>
                <span>System Online</span>
              </div>
              <div className="version-info p-3">
                <small className="text-muted">v2.1.0</small>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

AdminSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default AdminSidebar;