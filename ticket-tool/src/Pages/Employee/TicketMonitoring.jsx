import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Employee Dashboard Component
const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
    fetchTasks();
    fetchNotifications();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employees/${user.id}`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/tickets/employee/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${user.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Dashboard layout remains the same */}
      {/* Update content to use real data from API */}
    </div>
  );
};

// Location Tracking Component
const LocationTracking = () => {
  const { user } = useAuth();
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);

  const updateLocation = async (lat, lng) => {
    try {
      await axios.put(`/api/employees/${user.id}/location?lat=${lat}&lng=${lng}`);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Location tracking implementation remains similar
  // Add API call to update location when position changes
};

// Employee Tasks Component
const EmployeeTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/tickets/employee/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="employee-tasks">
      <h1>My Tasks</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <div className="task-details">
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span className="due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span className={`status ${task.status.toLowerCase()}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Employee Messages Component
const EmployeeMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/notifications/${user.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="employee-messages">
      <h1>Messages</h1>
      <div className="message-list">
        {messages.map(message => (
          <div key={message.id} className={`message-item ${message.read ? '' : 'unread'}`}>
            <div className="message-header">
              <h3>{message.title}</h3>
              <span className="message-date">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p>{message.message}</p>
            {!message.read && (
              <button onClick={() => markAsRead(message.id)} className="mark-read">
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Employee Performance Component
const EmployeePerformance = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      // You might need to create a new endpoint for performance data
      const response = await axios.get(`/api/employees/${user.id}/performance`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  return (
    <div className="employee-performance">
      <h1>My Performance</h1>
      {/* Render performance data */}
    </div>
  );
};

// Employee Profile Component
const EmployeeProfile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      const response = await axios.get(`/api/employees/${user.id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee profile:', error);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put(`/api/employees/${user.id}`, updatedData);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="employee-profile">
      <h1>My Profile</h1>
      {/* Render and update profile information */}
    </div>
  );
};

export {
  EmployeeDashboard,
  LocationTracking,
  EmployeeTasks,
  EmployeeMessages,
  EmployeePerformance,
  EmployeeProfile
};