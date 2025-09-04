import React from 'react';
import { Button } from 'react-bootstrap';
import { GeoAlt } from 'react-bootstrap-icons';

const LocationDetector = ({ onDetect }) => {
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          onDetect(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        error => {
          console.error('Error getting location:', error);
          onDetect('Location access denied or unavailable');
        }
      );
    } else {
      onDetect('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="mt-2">
      <Button 
        variant="outline-primary" 
        size="sm"
        onClick={handleDetectLocation}
      >
        <GeoAlt className="me-1" /> Detect My Location
      </Button>
    </div>
  );
};

export default LocationDetector;