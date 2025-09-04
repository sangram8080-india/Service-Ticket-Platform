import React, { useState, useEffect } from 'react';
import { 
  House, 
  Ticket, 
  People, 
  BarChart, 
  ArrowLeftRight, 
  Chat, 
  Gear,
  ChevronDown,
  BoxArrowRight,
  Person,
  List,
  XLg
} from 'react-bootstrap-icons';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/SideNav.css';

const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <House size={18} />, path: '/dashboard' },
    { name: 'Tickets', icon: <Ticket size={18} />, path: '/tickets' },
    { name: 'Team', icon: <People size={18} />, path: '/team' },
    { name: 'Analytics', icon: <BarChart size={18} />, path: '/analytics' },
    { name: 'Requests', icon: <ArrowLeftRight size={18} />, path: '/requests' },
    { name: 'Chat', icon: <Chat size={18} />, path: '/chat' },
  ];

  const settingsItems = [
    { name: 'Profile', icon: <Person size={16} />, path: '/profile' },
    { name: 'Logout', icon: <BoxArrowRight size={16} />, path: '/login' }
  ];

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      
      // Close mobile menu when switching to desktop view
      if (!isMobileView && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      // Auto-collapse sidebar on mobile
      if (isMobileView && !collapsed) {
        setCollapsed(true);
      }
    };

    // Set active item based on current route
    const currentMenuItem = menuItems.find(item => location.pathname.startsWith(item.path));
    if (currentMenuItem) setActiveItem(currentMenuItem.name);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
    
    // Close settings menu when toggling sidebar
    if (showSettingsMenu) {
      setShowSettingsMenu(false);
    }
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
    setActiveItem('Settings');
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
    closeMobileMenu();
  };

  return (
    <>
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          {mobileMenuOpen ? <XLg size={24} /> : <List size={24} />}
        </button>
      )}

      <div 
        className={`sidebar-container ${collapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onMouseEnter={() => !isMobile && !collapsed && setCollapsed(false)}
        onMouseLeave={() => !isMobile && !collapsed && setCollapsed(true)}
      >
        <div className="sidebar-header">
          {!collapsed && (
            <div className="d-flex align-items-center">
              <div className="app-logo">
                <Ticket size={24} />
              </div>
              <h3>ServiceTicket</h3>
            </div>
          )}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.name}
                className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
                onClick={() => handleNavClick(item.name)}
              >
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <span className="nav-text">{item.name}</span>
                  )}
                  {activeItem === item.name && !collapsed && (
                    <div className="active-indicator"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div 
            className={`nav-item settings-item ${activeItem === 'Settings' ? 'active' : ''}`}
            onClick={toggleSettingsMenu}
          >
            <span className="nav-icon"><Gear size={18} /></span>
            {!collapsed && (
              <>
                <span className="nav-text">Settings</span>
                <span className={`chevron ${showSettingsMenu ? 'open' : ''}`}>
                  <ChevronDown size={14} />
                </span>
              </>
            )}
          </div>

          {!collapsed && showSettingsMenu && (
            <div className="settings-menu">
              {settingsItems.map((item) => (
                <Link 
                  to={item.path}
                  key={item.name} 
                  className="settings-menu-item"
                  onClick={() => handleNavClick(item.name)}
                >
                  <span className="settings-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default SideNav;