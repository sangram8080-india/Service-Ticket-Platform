import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HouseDoor, Ticket, PlusCircle, List, XLg } from 'react-bootstrap-icons';
import '../Styles/SideNav.css';

const UserSideNav = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <HouseDoor size={20} />, path: '/user-portal/dashboard' },
    { name: 'My Tickets', icon: <Ticket size={20} />, path: '/user-portal/tickets' },
    { name: 'New Ticket', icon: <PlusCircle size={20} />, path: '/user-portal/new-ticket' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const currentItem = menuItems.find(item => location.pathname.startsWith(item.path));
    if (currentItem) setActiveItem(currentItem.name);

    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {!collapsed && isMobile && (
        <div 
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      <div className={`sidebar-container${collapsed ? " collapsed" : ""} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="d-flex align-items-center">
              <div className="app-logo">
                <Ticket size={24} className="text-primary" />
              </div>
              <h3 className="mb-0 ms-2">ServiceTicket</h3>
            </div>
          )}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? <List size={24} /> : <XLg size={24} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.name}
                className={`nav-item${activeItem === item.name ? ' active' : ''}`}
                onClick={() => handleNavClick(item.name)}
              >
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-text">{item.name}</span>}
                  {activeItem === item.name && !collapsed && (
                    <div className="active-indicator"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default UserSideNav;
