// src/Pages/Admin/AdminPortalLayout.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import api from './api';
import LoadingSpinner from '../../Components/common/LoadingSpinner';
import '../../Styles/Admin/AdminLayout.css';

const AdminPortalLayout = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const fetchNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const response = await api.get('/notifications/admin/all');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/admin/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="admin-portal-wrapper">
      <AdminNavbar
        user={user}
        notifications={notifications}
        unreadCount={notifications.filter(n => !n.read).length}
        toggleSidebar={() => setSidebarOpen(prev => !prev)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onLogout={logout}
        isMobile={isMobile}
        isLoadingNotifications={isLoadingNotifications}
      />

      <div className="admin-portal-container">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        
        <main className={`admin-main-content ${sidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPortalLayout;