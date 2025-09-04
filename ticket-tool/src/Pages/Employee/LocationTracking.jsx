// src/Pages/Employee/Tracking.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const LocationTracking = () => {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState('available');
  const [lastUpdated, setLastUpdated] = useState('');

  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    if (tracking) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos = [pos.coords.latitude, pos.coords.longitude];
            setPosition(newPos);
            setLastUpdated(new Date().toLocaleTimeString());
            // In a real app, you would send this to your backend
          },
          (err) => console.error(err),
          { enableHighAccuracy: true }
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [tracking]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Location Tracking</h1>
        <p className="text-gray-600">Share your location with administrators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 h-96">
          <MapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <Marker position={position} icon={customIcon}>
                <Popup>
                  <div>Your current location</div>
                  <div className="text-sm text-gray-600">Status: {status}</div>
                  <div className="text-xs text-gray-500">Last update: {lastUpdated}</div>
                </Popup>
              </Marker>
            )}
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tracking Settings</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Status</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTracking(!tracking)}
                className={`px-4 py-2 rounded-lg flex items-center ${tracking ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
              >
                {tracking ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    Stop Tracking
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    Start Tracking
                  </>
                )}
              </button>
              <div className="text-sm text-gray-500">
                {tracking ? 'Location is being shared' : 'Location not shared'}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStatus('available')}
                className={`px-3 py-2 rounded-lg text-sm ${status === 'available' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-800'}`}
              >
                Available
              </button>
              <button
                onClick={() => setStatus('busy')}
                className={`px-3 py-2 rounded-lg text-sm ${status === 'busy' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-800'}`}
              >
                Busy
              </button>
              <button
                onClick={() => setStatus('offline')}
                className={`px-3 py-2 rounded-lg text-sm ${status === 'offline' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-800'}`}
              >
                Offline
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Current Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Tracking:</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${tracking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tracking ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-gray-500">Availability:</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  status === 'available' ? 'bg-green-100 text-green-800' : 
                  status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <div className="text-gray-500">Last Update:</div>
              <div>{lastUpdated || 'Never'}</div>
              <div className="text-gray-500">Location:</div>
              <div>{position ? position.join(', ') : 'Unknown'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTracking;