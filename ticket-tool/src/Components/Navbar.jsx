import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Navbar, Button, Image, Dropdown, Badge, Spinner, 
  OverlayTrigger, Popover, Alert, ListGroup
} from 'react-bootstrap';
import { 
  Bell, BellFill, Person, BoxArrowRight, Envelope, 
  CheckCircle, ExclamationCircle, XCircle, ArrowRepeat,
  Chat, Ticket, ShieldCheck, Gear, ThreeDots
} from 'react-bootstrap-icons';
import { AuthContext } from '../../context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './TopNavbar.css';

const TopNavbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const stompClientRef = useRef(null);
  
  const API_BASE = "http://localhost:8080/api";

  // API call function with authentication
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('token');
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
        if (response.status === 401) {
          logout();
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      setNotificationError(error.message || "Failed to fetch data");
      return null;
    }
  };

  // Fetch profile image
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchProfileImage = async () => {
      try {
        setLoadingImage(true);
        const data = await apiCall(`/employees/${user.id}/profile-image`);
        if (data) {
          setProfileImage(data);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoadingImage(false);
      }
    };
    
    fetchProfileImage();
  }, [user?.id]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingNotifications(true);
      setNotificationError('');
      const data = await apiCall(`/notifications/user/${user.id}`);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotificationError('Failed to load notifications. Please try again later.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Setup WebSocket for real-time notifications
  useEffect(() => {
    if (!user?.id) return;
    
    fetchNotifications();
    
    const setupWebSocket = () => {
      setConnectionStatus('connecting');
      
      const token = localStorage.getItem('token');
      const socket = new SockJS(`${API_BASE}/ws?token=${token}`);
      
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        onConnect: () => {
          setConnectionStatus('connected');
          console.log('WebSocket connected for notifications');
          
          client.subscribe(`/user/queue/notifications`, (message) => {
            try {
              const newNotification = JSON.parse(message.body);
              setNotifications(prev => [newNotification, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Show browser notification if not focused
              if (document.hidden && Notification.permission === 'granted') {
                new Notification(newNotification.title, {
                  body: newNotification.message,
                  icon: profileImage || '/logo192.png'
                });
              }
            } catch (error) {
              console.error("Error parsing notification:", error);
            }
          });
        },
        onDisconnect: () => {
          setConnectionStatus('disconnected');
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
          setConnectionStatus('error');
        },
        onWebSocketError: (error) => {
          console.error('WebSocket connection error:', error);
          setConnectionStatus('error');
        }
      });
      
      client.activate();
      stompClientRef.current = client;
    };
    
    setupWebSocket();
    
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [user?.id, profileImage]);

  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    logout();
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotificationError('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiCall(`/notifications/user/${user.id}/read-all`, {
        method: 'PUT'
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotificationError('Failed to mark all notifications as read.');
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes}m ago`;
      }
      return `${Math.floor(diffInHours)}h ago`;
    }
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20, className: "me-2" };
    
    switch(type) {
      case 'TICKET_UPDATE':
        return <ExclamationCircle {...iconProps} className="text-warning" />;
      case 'NEW_MESSAGE':
        return <Chat {...iconProps} className="text-primary" />;
      case 'TICKET_ASSIGNED':
        return <Ticket {...iconProps} className="text-success" />;
      case 'SYSTEM':
        return <ShieldCheck {...iconProps} className="text-info" />;
      default:
        return <Bell {...iconProps} className="text-secondary" />;
    }
  };

  const getNotificationVariant = (type) => {
    switch(type) {
      case 'TICKET_UPDATE': return 'warning';
      case 'NEW_MESSAGE': return 'primary';
      case 'TICKET_ASSIGNED': return 'success';
      case 'SYSTEM': return 'info';
      default: return 'secondary';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.ticketId) {
      window.location.href = `/tickets/${notification.ticketId}`;
    }
  };

  const notificationsPopover = (
    <Popover id="notifications-popover" className="notification-popover">
      <Popover.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">Notifications</h6>
          <small className="text-muted">
            {connectionStatus === 'connected' ? 'Live updates' : 'Offline'}
          </small>
        </div>
        <div className="d-flex align-items-center">
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm"
              onClick={markAllAsRead}
              className="p-0 text-decoration-none text-primary me-2"
              disabled={loadingNotifications}
              title="Mark all as read"
            >
              Clear all
            </Button>
          )}
          <Button 
            variant="link" 
            size="sm"
            onClick={fetchNotifications}
            className="p-0 text-decoration-none"
            title="Refresh notifications"
            disabled={loadingNotifications}
          >
            <ArrowRepeat size={14} />
          </Button>
        </div>
      </Popover.Header>
      <Popover.Body className="p-0">
        {notificationError && (
          <Alert variant="danger" className="m-2 mb-0">
            <div className="d-flex align-items-center">
              <XCircle className="me-2" />
              <small>{notificationError}</small>
            </div>
          </Alert>
        )}
        
        {loadingNotifications ? (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" size="sm" />
            <p className="mt-2 mb-0 small">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4">
            <Bell size={32} className="text-muted mb-2" />
            <p className="mb-0 small text-muted">No notifications yet</p>
            <small>You'll see updates here</small>
          </div>
        ) : (
          <ListGroup variant="flush" className="notification-list">
            {notifications.slice(0, 10).map(notification => {
              const isUnread = !notification.read;
              return (
                <ListGroup.Item 
                  key={notification.id}
                  className={`notification-item ${isUnread ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  action
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0">{notification.title}</h6>
                        {isUnread && (
                          <Badge pill bg="primary" className="ms-2">New</Badge>
                        )}
                      </div>
                      <p className="mb-1 small text-muted">{notification.message}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge 
                          bg={getNotificationVariant(notification.type)} 
                          className="text-uppercase"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {notification.type.replace('_', ' ').toLowerCase()}
                        </Badge>
                        <small className="text-muted">{formatDate(notification.timestamp)}</small>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
        
        {notifications.length > 10 && (
          <div className="text-center p-2 border-top">
            <Button variant="link" size="sm" className="text-decoration-none">
              View all notifications
            </Button>
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <Navbar bg="white" expand="lg" className="top-navbar shadow-sm">
      <div className="container-fluid">
        <Button 
          variant="light" 
          onClick={toggleSidebar} 
          className="sidebar-toggle me-2"
          aria-label="Toggle navigation"
        >
          <ThreeDots size={20} />
        </Button>

        <div className="d-flex ms-auto align-items-center">
          {/* Notification Bell */}
          <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            overlay={notificationsPopover}
            rootClose
            onToggle={(show) => setShowNotifications(show)}
          >
            <Button 
              variant="light" 
              className="notification-btn position-relative me-3"
              aria-label="Notifications"
              disabled={!user?.id}
            >
              {unreadCount > 0 ? <BellFill size={20} /> : <Bell size={20} />}
              {unreadCount > 0 && (
                <Badge 
                  pill 
                  bg="danger" 
                  className="notification-badge position-absolute"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </OverlayTrigger>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="light" 
              className="user-dropdown-toggle"
              id="user-dropdown"
              disabled={!user?.id}
            >
              <div className="d-flex align-items-center">
                {loadingImage ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : profileImage ? (
                  <Image 
                    src={profileImage} 
                    roundedCircle 
                    width={36} 
                    height={36} 
                    className="me-2 user-avatar"
                    alt="User profile"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div 
                    className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                  >
                    <Person size={18} />
                  </div>
                )}
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-lg border-0">
              <Dropdown.Header>
                <div className="text-center">
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      roundedCircle 
                      width={64} 
                      height={64} 
                      className="mb-2"
                      alt="Profile"
                    />
                  ) : (
                    <div className="avatar-placeholder-large bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                      <Person size={24} />
                    </div>
                  )}
                  <h6 className="mb-0">{user?.name}</h6>
                  <small className="text-muted">{user?.role}</small>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item href="/profile" className="d-flex align-items-center">
                <Person className="me-2" size={16} />
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="/settings" className="d-flex align-items-center">
                <Gear className="me-2" size={16} />
                Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={requestNotificationPermission} className="d-flex align-items-center">
                <Bell className="me-2" size={16} />
                Notification Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center text-danger">
                <BoxArrowRight className="me-2" size={16} />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default TopNavbar;