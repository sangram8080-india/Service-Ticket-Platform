import React from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'OPEN':
        return { 
          text: 'Open', 
          color: 'bg-blue-100 text-blue-800', 
          icon: <FaClock className="mr-1" /> 
        };
      case 'IN_PROGRESS':
        return { 
          text: 'In Progress', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <FaClock className="mr-1" /> 
        };
      case 'RESOLVED':
        return { 
          text: 'Resolved', 
          color: 'bg-green-100 text-green-800', 
          icon: <FaCheck className="mr-1" /> 
        };
      case 'CLOSED':
        return { 
          text: 'Closed', 
          color: 'bg-gray-100 text-gray-800', 
          icon: <FaTimes className="mr-1" /> 
        };
      default:
        return { 
          text: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
      {statusDetails.icon}
      {statusDetails.text}
    </span>
  );
};

export default StatusBadge;