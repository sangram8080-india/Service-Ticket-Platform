import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('tokenExpiry');

    if (storedUser && storedToken && storedExpiry) {
      try {
        const expiryTime = parseInt(storedExpiry);
        if (Date.now() < expiryTime) {
          setUser(JSON.parse(storedUser));
          setTokenExpiry(expiryTime);

          // Auto logout when token expires
          const timeUntilExpiry = expiryTime - Date.now();
          logoutTimerRef.current = setTimeout(logout, timeUntilExpiry);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        logout();
      }
    }
    setLoading(false);

    // Cleanup timeout on unmount
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const login = (userData, token) => {
    const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour

    setUser(userData);
    setTokenExpiry(expiryTime);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    // Reset logout timer
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(logout, 60 * 60 * 1000);
  };

  const logout = () => {
    setUser(null);
    setTokenExpiry(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  const value = {
    user,
    loading,
    tokenExpiry,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};