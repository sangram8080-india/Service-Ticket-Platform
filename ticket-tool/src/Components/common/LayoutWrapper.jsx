import React from 'react';
import AdminNavbar from '../../Pages/Admin/AdminNavbar';
import AdminSidebar from '../../Pages/Admin/Sidebar';

const LayoutWrapper = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <main className="flex-1 p-6 md:ml-64 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;