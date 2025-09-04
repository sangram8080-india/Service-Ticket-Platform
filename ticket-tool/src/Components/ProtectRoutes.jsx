import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./common/LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, loading, tokenExpiry } = useAuth();
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreview(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking authentication
  if (loading || showPreview) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-medium">Validating your session...</p>
      </div>
    );
  }

  // Check if user is authenticated & token not expired
  const isTokenExpired = tokenExpiry && Date.now() > tokenExpiry;
  if (!user || isTokenExpired) {
    const redirectPath = location.pathname.startsWith("/admin-portal")
      ? "/admin-login"   // ✅ keep consistent with your first version
      : "/login";

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
