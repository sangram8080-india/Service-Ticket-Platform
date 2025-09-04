// src/components/StatusBadge.js
import React from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'OPEN':
        return { text: 'Open', color: 'bg-primary text-white', icon: <FaClock className="me-1" /> };
      case 'IN_PROGRESS':
        return { text: 'In Progress', color: 'bg-warning text-dark', icon: <FaClock className="me-1" /> };
      case 'RESOLVED':
        return { text: 'Resolved', color: 'bg-success text-white', icon: <FaCheck className="me-1" /> };
      case 'CLOSED':
        return { text: 'Closed', color: 'bg-secondary text-white', icon: <FaTimes className="me-1" /> };
      default:
        return { text: status, color: 'bg-light text-dark' };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <span className={`badge d-inline-flex align-items-center ${statusDetails.color}`}>
      {statusDetails.icon}
      {statusDetails.text}
    </span>
  );
};

export default StatusBadge;