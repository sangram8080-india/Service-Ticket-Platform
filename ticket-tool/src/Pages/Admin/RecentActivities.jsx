import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiShoppingCart, FiDollarSign, FiSettings, 
  FiClock, FiArrowUpRight, FiFilter 
} from 'react-icons/fi';
import './RecentActivities.css';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulating data fetching
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData = [
        {
          id: 1,
          user: 'Sarah Johnson',
          action: 'placed a new order',
          target: 'Premium Plan',
          timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
          type: 'order',
          value: 299.99
        },
        {
          id: 2,
          user: 'Michael Chen',
          action: 'updated account settings',
          target: 'Security Preferences',
          timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
          type: 'settings'
        },
        {
          id: 3,
          user: 'Emma Wilson',
          action: 'made a payment',
          target: 'Invoice #2842',
          timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
          type: 'payment',
          value: 149.99
        },
        {
          id: 4,
          user: 'Alex Rodriguez',
          action: 'created a new account',
          target: 'Standard Tier',
          timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
          type: 'user'
        },
        {
          id: 5,
          user: 'Jessica Taylor',
          action: 'cancelled subscription',
          target: 'Business Plan',
          timestamp: new Date(Date.now() - 12 * 3600000), // 12 hours ago
          type: 'order'
        }
      ];
      
      setActivities(mockData);
      setIsLoading(false);
    };

    fetchActivities();
  }, []);

  const filterActivities = (type) => {
    setFilter(type);
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <FiUser className="activity-icon user" />;
      case 'order': return <FiShoppingCart className="activity-icon order" />;
      case 'payment': return <FiDollarSign className="activity-icon payment" />;
      case 'settings': return <FiSettings className="activity-icon settings" />;
      default: return <FiUser className="activity-icon" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="recent-activities">
        <div className="activities-header">
          <h2>Recent Activities</h2>
          <div className="loading-spinner"></div>
        </div>
        <div className="activities-loading">
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h2>Recent Activities</h2>
        <div className="activities-filter">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => filterActivities('all')}
          >
            All
          </button>
          <button 
            className={filter === 'user' ? 'active' : ''}
            onClick={() => filterActivities('user')}
          >
            Users
          </button>
          <button 
            className={filter === 'order' ? 'active' : ''}
            onClick={() => filterActivities('order')}
          >
            Orders
          </button>
          <button 
            className={filter === 'payment' ? 'active' : ''}
            onClick={() => filterActivities('payment')}
          >
            Payments
          </button>
        </div>
      </div>

      <div className="activities-list">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <p>No activities found for the selected filter.</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-container">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-details">
                  <span className="user-name">{activity.user}</span>
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-target">{activity.target}</span>
                  {activity.value && (
                    <span className="activity-value">${activity.value}</span>
                  )}
                </div>
                <div className="activity-meta">
                  <FiClock className="time-icon" />
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
              <button className="activity-link">
                <FiArrowUpRight />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="activities-footer">
        <button className="view-all-btn">
          View All Activities
          <FiArrowUpRight />
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;