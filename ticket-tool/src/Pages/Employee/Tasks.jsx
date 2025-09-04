import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const EmployeeTasks = () => {
  const { user } = useAuth();

  const tasks = [
    { id: 1, title: 'Fix login issue', status: 'In Progress', priority: 'High', dueDate: '2023-06-15' },
    { id: 2, title: 'Update documentation', status: 'Pending', priority: 'Medium', dueDate: '2023-06-20' },
    { id: 3, title: 'Review pull request', status: 'Completed', priority: 'Low', dueDate: '2023-06-10' },
  ];

  return (
    <div className="employee-tasks">
      <h1>My Tasks</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
            <h3>{task.title}</h3>
            <div className="task-details">
              <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className="due-date">Due: {task.dueDate}</span>
              <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTasks;