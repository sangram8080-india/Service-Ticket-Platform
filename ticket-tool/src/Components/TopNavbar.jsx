import React, { useState, useEffect, useRef } from 'react';
import { 
  Navbar, Button, Image, Dropdown, Badge, Spinner, 
  OverlayTrigger, Popover, Alert 
} from 'react-bootstrap';
import { 
  Bell, Person, BoxArrowRight, Envelope, 
  CheckCircle, ExclamationCircle, XCircle 
} from 'react-bootstrap-icons';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

const TopNavbar = ({ toggleSidebar }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const stompClientRef = useRef(null);
  
  // Safely get user data
  const getUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : { name: 'User', id: null };
    } catch (error) {
      console.error("Invalid user data:", error);
      return { name: 'User', id: null };
    }
  };
  
  const user = getUser();

  // Fetch profile image
  useEffect(() => {
    if (!user.id) return;
    
    const fetchProfileImage = async () => {
      try {
        setLoadingImage(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/api/users/${user.id}/profile-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer'
          }
        );
        
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte), ''
          )
        );
        setProfileImage(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoadingImage(false);
      }
    };
    
    fetchProfileImage();
  }, [user.id]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user.id) return;
    
    try {
      setLoadingNotifications(true);
      setNotificationError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/notifications/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotificationError('Failed to load notifications. Please try again later.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Setup WebSocket for real-time notifications
    if (!user.id) return;
    
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: function (str) {
        console.log('[WebSocket]', str);
      },
      onConnect: () => {
        client.subscribe(`/topic/notifications/${user.id}`, (message) => {
          try {
            const newNotification = JSON.parse(message.body);
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch (error) {
            console.error("Error parsing notification:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket connection error:', error);
      }
    });
    
    client.activate();
    stompClientRef.current = client;
    
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user.id]);

  const handleLogout = () => {
    // Close WebSocket connection
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.deactivate();
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotificationError('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/notifications/${user.id}/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotificationError('Failed to mark all notifications as read.');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'TICKET_UPDATE':
        return <ExclamationCircle size={24} className="text-warning" />;
      case 'NEW_MESSAGE':
        return <Envelope size={24} className="text-primary" />;
      case 'TICKET_ASSIGNED':
        return <CheckCircle size={24} className="text-success" />;
      default:
        return <Bell size={24} className="text-info" />;
    }
  };

  const notificationsPopover = (
    <Popover id="notifications-popover" style={{ width: '400px', maxWidth: '90vw' }}>
      <Popover.Header as="h5" className="d-flex justify-content-between align-items-center bg-light">
        <span>Notifications</span>
        <div>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm"
              onClick={markAllAsRead}
              className="p-0 text-decoration-none text-primary"
              disabled={loadingNotifications}
            >
              Mark all read
            </Button>
          )}
          <Button 
            variant="link" 
            size="sm"
            onClick={fetchNotifications}
            className="p-0 ms-2 text-decoration-none"
            title="Refresh notifications"
          >
            <i className="bi bi-arrow-repeat"></i>
          </Button>
        </div>
      </Popover.Header>
      <Popover.Body className="p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {notificationError && (
          <Alert variant="danger" className="m-2 p-2">
            <div className="d-flex align-items-center">
              <XCircle className="me-2" />
              <small>{notificationError}</small>
            </div>
          </Alert>
        )}
        
        {loadingNotifications ? (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0 small">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4">
            <Envelope size={32} className="text-muted mb-2" />
            <p className="mb-0 small">No notifications</p>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-2"
              onClick={fetchNotifications}
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map(notification => {
              const isUnread = !notification.read;
              return (
                <div 
                  key={notification.id}
                  className={`list-group-item list-group-item-action ${isUnread ? 'bg-light' : ''}`}
                  onClick={() => isUnread && markAsRead(notification.id)}
                  style={{ cursor: isUnread ? 'pointer' : 'default' }}
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-1">{notification.title}</h6>
                        {isUnread && (
                          <span className="badge bg-primary">New</span>
                        )}
                      </div>
                      <p className="mb-1 small">{notification.message}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">{formatTime(notification.timestamp)}</small>
                        <small className="text-muted">{formatDate(notification.timestamp)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-2">
      <div className="container-fluid">
        <Button 
          variant="light" 
          onClick={toggleSidebar} 
          className="me-2 d-lg-none"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>

        <div className="d-flex ms-auto align-items-center">
          <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            overlay={notificationsPopover}
            rootClose
            onToggle={(show) => setShowNotifications(show)}
          >
            <Button 
              variant="light" 
              className="position-relative me-3 p-2"
              aria-label="Notifications"
              disabled={!user.id}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 end-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </OverlayTrigger>

          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="light" 
              className="d-flex align-items-center bg-transparent border-0"
              id="user-dropdown"
              disabled={!user.id}
            >
              {!user.id ? (
                <Spinner animation="border" size="sm" />
              ) : loadingImage ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : profileImage ? (
                <Image 
                  src={profileImage} 
                  roundedCircle 
                  width={36} 
                  height={36} 
                  className="me-2"
                  alt="User profile"
                />
              ) : (
                <div 
                  className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                  style={{ width: 36, height: 36 }}
                >
                  <Person size={18} />
                </div>
              )}
              <span className="d-none d-md-inline">{user.name || 'User'}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border-0">
              <Dropdown.Item 
                href="/user-portal/profile" 
                className="d-flex align-items-center"
              >
                <Person className="me-2" size={16} />
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={handleLogout} 
                className="d-flex align-items-center"
              >
                <BoxArrowRight className="me-2" size={16} />
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default TopNavbar; 