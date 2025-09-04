// src/Pages/Admin/LiveTracking.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/AuthService';

// Professional color palette
const COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  background: '#f5f5f5',
  text: '#333333',
  lightText: '#666666',
  border: '#e0e0e0',
  active: '#4caf50',
  inactive: '#9e9e9e',
};

// Simple SVG icons
const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

const MyLocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

const PersonPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const DirectionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
  </svg>
);

const LiveTracking = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const userRole = currentUser?.role;
  const userId = currentUser?.id;

  // Fetch locations
  const fetchLocations = async () => {
    if (!isAuthenticated) {
      setError('Authentication token missing. Please log in.');
      return;
    }

    try {
      let response;
      if (userRole === 'ADMIN') {
        response = await apiClient.get('/api/location/all');
        setLocations(response.data || []);
      } else {
        response = await apiClient.get(`/api/location/${userId}`);
        setLocations(response.data ? [response.data] : []);
      }
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations: ' + (err.message || 'Unknown error'));
    }
  };

  // Update own location
  const updateMyLocation = async (lat, lng) => {
    try {
      await apiClient.post('/api/location/update', { employeeId: userId, latitude: lat, longitude: lng });
      fetchLocations();
    } catch (err) {
      setError('Failed to update location: ' + (err.message || 'Unknown error'));
    }
  };

  // Get browser location
  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('Geolocation not supported'));
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true }
      );
    });

  const handleUpdateMyLocation = async () => {
    try {
      const pos = await getCurrentLocation();
      await updateMyLocation(pos.lat, pos.lng);
    } catch (err) {
      setError('Failed to update location: ' + (err.message || 'Unknown error'));
    }
  };

  // Open Google Maps directions
  const getDirections = (employee) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const url = `https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${employee.latitude},${employee.longitude}`;
        window.open(url, '_blank');
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!loading) fetchLocations();
  }, [loading]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, [userRole, userId]);

  if (loading) return <p>Loading authentication...</p>;
  if (!isAuthenticated) return <p>Please log in to access live tracking.</p>;

  return (
    <div style={{
      height: '100%',
      borderRadius: '8px',
      backgroundColor: COLORS.background,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.primary,
        color: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Live Employee Tracking</h2>
        <div>
          <button onClick={fetchLocations} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '10px' }} title="Refresh">
            <RefreshIcon />
          </button>
          <button onClick={handleUpdateMyLocation} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} title="Update My Location">
            <MyLocationIcon />
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', height: 'calc(100% - 64px)' }}>
        {error && <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '4px', backgroundColor: '#ffebee', color: COLORS.secondary }}>{error}</div>}

        {locations.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '32px', color: COLORS.lightText }}>No location data available</div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {locations.map(employee => (
              <div
                key={employee.employeeId}
                onClick={() => setSelectedEmployee(employee)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  border: selectedEmployee?.employeeId === employee.employeeId ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                  backgroundColor: selectedEmployee?.employeeId === employee.employeeId ? '#f0f7ff' : 'white',
                  padding: '12px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <PersonPinIcon style={{ marginRight: '8px', color: COLORS.primary }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{employee.employeeName || `Employee ${employee.employeeId}`}</div>
                  <div style={{ color: COLORS.lightText, fontSize: '0.875rem' }}>ID: {employee.employeeId}</div>
                  <div style={{ color: COLORS.lightText, fontSize: '0.875rem' }}>
                    Location: {employee.latitude?.toFixed(4)}, {employee.longitude?.toFixed(4)}
                  </div>
                  <div style={{ color: COLORS.lightText, fontSize: '0.75rem' }}>
                    Updated: {employee.timestamp ? new Date(employee.timestamp).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ backgroundColor: COLORS.active, color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', marginBottom: '8px' }}>Active</span>
                  <button onClick={(e) => { e.stopPropagation(); getDirections(employee); }} style={{ background: 'none', border: 'none', color: COLORS.primary, cursor: 'pointer', padding: 0 }} title="Get Directions">
                    <DirectionsIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {lastUpdated && <p style={{ marginTop: '16px', fontSize: '0.875rem', color: COLORS.lightText }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
      </div>
    </div>
  );
};

export default LiveTracking;
