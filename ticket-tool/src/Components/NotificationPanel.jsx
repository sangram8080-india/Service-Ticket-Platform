import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Bell, CheckCircle, ExclamationCircle, Ticket, Person } from 'react-bootstrap-icons';
import moment from 'moment';

const NotificationPanel = ({ notifications, markAsRead }) => {
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'status': return <CheckCircle className="text-success me-2" />;
      case 'assignment': return <Person className="text-primary me-2" />;
      case 'ticket': return <Ticket className="text-warning me-2" />;
      default: return <Bell className="text-secondary me-2" />;
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications</h5>
        <Button variant="link" size="sm" onClick={markAsRead}>
          Mark all as read
        </Button>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {notifications.length === 0 ? (
            <ListGroup.Item className="text-center text-muted py-4">
              No notifications
            </ListGroup.Item>
          ) : (
            notifications.map((notification, index) => (
              <ListGroup.Item 
                key={index}
                className={`d-flex align-items-start ${notification.unread ? 'bg-light' : ''}`}
              >
                <div className="me-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <strong>{notification.title}</strong>
                    <small className="text-muted">
                      {moment(notification.timestamp).fromNow()}
                    </small>
                  </div>
                  <div className="mt-1">
                    {notification.message}
                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default NotificationPanel;