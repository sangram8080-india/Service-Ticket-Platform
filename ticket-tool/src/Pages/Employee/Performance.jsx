import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const performanceData = [
  { name: 'Jan', tasks: 15, quality: 4.2 },
  { name: 'Feb', tasks: 18, quality: 4.5 },
  { name: 'Mar', tasks: 22, quality: 4.7 },
  { name: 'Apr', tasks: 20, quality: 4.6 },
  { name: 'May', tasks: 25, quality: 4.8 },
];

const EmployeePerformance = () => {
  return (
    <div className="employee-performance">
      <h1>My Performance</h1>
      <div className="performance-stats">
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>4.6/5.0</p>
        </div>
        <div className="stat-card">
          <h3>Tasks Completed</h3>
          <p>105</p>
        </div>
        <div className="stat-card">
          <h3>On Time Rate</h3>
          <p>92%</p>
        </div>
      </div>

      <div className="performance-chart">
        <BarChart width={600} height={300} data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks" fill="#8884d8" name="Tasks Completed" />
          <Bar dataKey="quality" fill="#82ca9d" name="Quality Rating" />
        </BarChart>
      </div>

      <div className="feedback-section">
        <h2>Recent Feedback</h2>
        <div className="feedback-item">
          <p>"Consistently delivers high-quality work ahead of schedule."</p>
          <p className="feedback-meta">- Manager, June 1, 2023</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;