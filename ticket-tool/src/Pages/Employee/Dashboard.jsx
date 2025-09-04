import React, { useState } from 'react';
import { 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const performanceData = [
  { name: 'Jan', tasks: 15, quality: 4.2 },
  { name: 'Feb', tasks: 20, quality: 4.5 },
  { name: 'Mar', tasks: 18, quality: 4.3 },
  { name: 'Apr', tasks: 22, quality: 4.6 },
  { name: 'May', tasks: 25, quality: 4.7 },
];

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project report', dueDate: '2023-06-15', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Review design mockups', dueDate: '2023-06-12', status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Fix login bug', dueDate: '2023-06-10', status: 'Completed', priority: 'High' },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Manager', subject: 'Project Update', content: 'Please submit your report by Friday', read: false },
    { id: 2, sender: 'HR', subject: 'Benefits Update', content: 'New health insurance options available', read: true },
  ]);

  const markTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Completed' } : task
    ));
  };

  return (
    <div className="employee-dashboard" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: 250, background: '#34495e', color: '#ecf0f1', padding: 20 }}>
        <div className="profile" style={{ marginBottom: 30, textAlign: 'center' }}>
          <div className="avatar" style={{
            width: 80, height: 80, borderRadius: '50%', backgroundColor: '#2980b9',
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 28, margin: '0 auto 10px'
          }}>
            JD
          </div>
          <h3>John Doe</h3>
          <p>Developer</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
            style={{ background: activeTab === 'dashboard' ? '#2c3e50' : 'transparent', color: 'inherit', border: 'none', padding: '10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <i className="icon-dashboard" /> Dashboard
          </button>
          <button
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
            style={{ background: activeTab === 'tasks' ? '#2c3e50' : 'transparent', color: 'inherit', border: 'none', padding: '10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <i className="icon-tasks" /> My Tasks
          </button>
          <button
            className={activeTab === 'calendar' ? 'active' : ''}
            onClick={() => setActiveTab('calendar')}
            style={{ background: activeTab === 'calendar' ? '#2c3e50' : 'transparent', color: 'inherit', border: 'none', padding: '10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <i className="icon-calendar" /> Calendar
          </button>
          <button
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => setActiveTab('messages')}
            style={{ background: activeTab === 'messages' ? '#2c3e50' : 'transparent', color: 'inherit', border: 'none', padding: '10px', cursor: 'pointer', textAlign: 'left', position: 'relative' }}
          >
            <i className="icon-messages" /> Messages
            {messages.filter(m => !m.read).length > 0 && (
              <span style={{
                backgroundColor: '#e74c3c',
                borderRadius: '50%',
                color: 'white',
                padding: '2px 8px',
                fontSize: 12,
                position: 'absolute',
                top: 8,
                right: 15
              }}>
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
            style={{ background: activeTab === 'performance' ? '#2c3e50' : 'transparent', color: 'inherit', border: 'none', padding: '10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <i className="icon-performance" /> Performance
          </button>
        </nav>
      </div>

      <div className="main-content" style={{ flexGrow: 1, padding: 20, overflowY: 'auto' }}>
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            <h1>Welcome back, John!</h1>
            <div className="quick-stats" style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>Pending Tasks</h3>
                <p style={{ fontSize: 24 }}>{tasks.filter(t => t.status !== 'Completed').length}</p>
              </div>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>Upcoming Deadlines</h3>
                <p style={{ fontSize: 24 }}>2</p>
              </div>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>Unread Messages</h3>
                <p style={{ fontSize: 24 }}>{messages.filter(m => !m.read).length}</p>
              </div>
            </div>

            <div className="recent-tasks">
              <h2>Recent Tasks</h2>
              <div className="task-list">
                {tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="task-item" style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: '#f7f9fa', marginBottom: 10, borderRadius: 6 }}>
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>Due: {task.dueDate} | Priority: <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span></p>
                    </div>
                    <span className={`status ${task.status.replace(' ', '-').toLowerCase()}`} style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor:
                        task.status === 'Completed' ? '#2ecc71' :
                        task.status === 'In Progress' ? '#3498db' : '#e67e22',
                      color: 'white',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              <div className="event-list">
                <div className="event-item" style={{ display: 'flex', marginBottom: 15 }}>
                  <div className="event-date" style={{ marginRight: 15, textAlign: 'center' }}>
                    <span className="day" style={{ fontSize: 24, fontWeight: 'bold' }}>15</span>
                    <span className="month" style={{ fontSize: 14, textTransform: 'uppercase' }}>Jun</span>
                  </div>
                  <div className="event-details">
                    <h4>Team Meeting</h4>
                    <p>10:00 AM - Conference Room</p>
                  </div>
                </div>
                <div className="event-item" style={{ display: 'flex', marginBottom: 15 }}>
                  <div className="event-date" style={{ marginRight: 15, textAlign: 'center' }}>
                    <span className="day" style={{ fontSize: 24, fontWeight: 'bold' }}>20</span>
                    <span className="month" style={{ fontSize: 14, textTransform: 'uppercase' }}>Jun</span>
                  </div>
                  <div className="event-details">
                    <h4>Project Deadline</h4>
                    <p>All tasks due</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-view">
            <h1>My Tasks</h1>
            <div className="task-filters" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <select>
                <option>All Tasks</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button className="new-task" style={{ padding: '10px 15px', cursor: 'pointer' }}>+ New Task</button>
            </div>

            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.map(task => (
                <div key={task.id} className="task-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#ecf0f1', borderRadius: 8 }}>
                  <div className="task-main" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={() => markTaskComplete(task.id)}
                    />
                    <div className="task-details">
                      <h3>{task.title}</h3>
                      <p>Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <div className="task-meta" style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    <span className={`priority ${task.priority.toLowerCase()}`} style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      backgroundColor:
                        task.priority === 'High' ? '#e74c3c' :
                        task.priority === 'Medium' ? '#f39c12' : '#2ecc71',
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: 12,
                    }}>
                      {task.priority}
                    </span>
                    <span className={`status ${task.status.replace(' ', '-').toLowerCase()}`} style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor:
                        task.status === 'Completed' ? '#2ecc71' :
                        task.status === 'In Progress' ? '#3498db' : '#e67e22',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 12,
                      textTransform: 'uppercase',
                    }}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-view">
            <h1>Messages</h1>
            <div className="message-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(message => (
                <div key={message.id} className={`message-item ${message.read ? '' : 'unread'}`} style={{ backgroundColor: message.read ? '#f7f9fa' : '#eaf3fc', padding: 15, borderRadius: 8 }}>
                  <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{message.sender}</h3>
                    <p style={{ fontStyle: 'italic' }}>{message.subject}</p>
                  </div>
                  <div className="message-content" style={{ marginTop: 10 }}>
                    <p>{message.content}</p>
                  </div>
                  <div className="message-actions" style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                    <button style={{ cursor: 'pointer' }}>Reply</button>
                    <button style={{ cursor: 'pointer' }}>Archive</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-view">
            <h1>My Performance</h1>
            <div className="performance-stats" style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>Tasks Completed</h3>
                <p style={{ fontSize: 24 }}>24</p>
                <p className="trend up" style={{ color: 'green' }}>+5% from last month</p>
              </div>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>On Time Delivery</h3>
                <p style={{ fontSize: 24 }}>92%</p>
                <p className="trend up" style={{ color: 'green' }}>+2% from last month</p>
              </div>
              <div className="stat-card" style={{ flex: 1, background: '#ecf0f1', padding: 20, borderRadius: 8 }}>
                <h3>Quality Rating</h3>
                <p style={{ fontSize: 24 }}>4.5/5</p>
                <p className="trend neutral" style={{ color: 'gray' }}>No change</p>
              </div>
            </div>

            <div className="performance-chart">
              <h2>Monthly Performance</h2>
              <BarChart width={600} height={300} data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" />
                <Bar dataKey="quality" fill="#82ca9d" />
              </BarChart>
            </div>

            <div className="feedback" style={{ marginTop: 40 }}>
              <h2>Manager Feedback</h2>
              <div className="feedback-item" style={{ background: '#f7f9fa', padding: 20, borderRadius: 8 }}>
                <p>"John has shown excellent progress this quarter, especially in the new project."</p>
                <p className="feedback-meta" style={{ fontStyle: 'italic', marginTop: 10 }}>- Jane Smith, June 5, 2023</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
