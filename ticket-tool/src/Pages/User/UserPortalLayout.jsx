// src/Pages/User/UserPortalLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserSideNav from '../../Components/UserSideNav';
import TopNavbar from '../../Components/TopNavbar';
import DashboardFooter from '../../Components/DashboardFooter';
import LoadingSpinner from '../../Components/common/LoadingSpinner';
import '../../Styles/User/UserPortal.css';

const UserPortalLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="user-portal-layout d-flex flex-column min-vh-100">
      <TopNavbar toggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="d-flex flex-grow-1">
        <UserSideNav collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`main-content flex-grow-1 ${collapsed ? 'collapsed' : ''}`}>
          <div className="content-wrapper p-3 p-md-4">
            <Outlet />
          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
};

export default UserPortalLayout;