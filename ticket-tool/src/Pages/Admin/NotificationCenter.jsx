// src/components/NotificationCenter.jsx
import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../../Styles/Admin/NotificationCenter.css";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ✅ Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // ✅ Delete a notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notification-center">
      {/* Bell Icon */}
      <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p className="empty-msg">No notifications</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={n.read ? "read" : "unread"}
                  onClick={() => markAsRead(n.id)}
                >
                  <span>{n.message}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
