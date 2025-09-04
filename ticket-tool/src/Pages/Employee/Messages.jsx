import React, { useState } from 'react';

const EmployeeMessages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Manager', subject: 'Project Update', content: 'Please submit your report by Friday', read: false, date: '2023-06-10' },
    { id: 2, sender: 'HR', subject: 'Benefits Update', content: 'New health insurance options available', read: true, date: '2023-06-08' },
  ]);

  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  return (
    <div className="employee-messages">
      <h1>Messages</h1>
      <div className="message-list">
        {messages.map(message => (
          <div key={message.id} className={`message-item ${message.read ? '' : 'unread'}`}>
            <div className="message-header">
              <h3>{message.sender}</h3>
              <span className="message-date">{message.date}</span>
            </div>
            <h4>{message.subject}</h4>
            <p>{message.content}</p>
            {!message.read && (
              <button onClick={() => markAsRead(message.id)} className="mark-read">
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMessages;