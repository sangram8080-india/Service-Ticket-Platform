import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminChat = () => {
  // State management (same as before)
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API functions (same as before)
  const fetchTickets = async () => { /* unchanged */ };
  const fetchMessages = async (ticketId) => { /* unchanged */ };
  const handleSendMessage = async () => { /* unchanged */ };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold text-dark">Support Ticket Management</h1>
        <div className="d-flex">
          <button className="btn btn-sm btn-outline-secondary me-2">
            <i className="bi bi-filter me-1"></i> Filter
          </button>
          <button className="btn btn-sm btn-primary">
            <i className="bi bi-plus-circle me-1"></i> New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Ticket List Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-ticket-detailed text-primary me-2"></i>
                Active Tickets
                <span className="badge bg-primary rounded-pill ms-2">{tickets.length}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {tickets.map(ticket => (
                  <a 
                    key={ticket.id}
                    href="#" 
                    className={`list-group-item list-group-item-action border-0 py-3 ${
                      selectedTicket === ticket.id ? 'bg-light' : ''
                    }`}
                    onClick={() => fetchMessages(ticket.id)}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1 fw-semibold text-dark">#{ticket.id} - {ticket.title}</h6>
                      <small className="text-muted">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div>
                        <span className="badge text-bg-light border text-muted">
                          <i className="bi bi-person me-1"></i>
                          {ticket.user?.name || 'Unknown User'}
                        </span>
                      </div>
                      <span className={`badge ${
                        ticket.status === 'OPEN' ? 'bg-info' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-warning' :
                        ticket.status === 'RESOLVED' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                {selectedTicket ? (
                  <>
                    <i className="bi bi-chat-dots text-primary me-2"></i>
                    Conversation: Ticket #{selectedTicket}
                  </>
                ) : (
                  "Select a ticket to view conversation"
                )}
              </h5>
              {selectedTicket && (
                <div>
                  <button className="btn btn-sm btn-outline-danger me-2">
                    <i className="bi bi-archive"></i> Close Ticket
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-download"></i> Export
                  </button>
                </div>
              )}
            </div>

            <div className="card-body p-0 d-flex flex-column">
              {/* Chat Messages Area */}
              <div 
                className="flex-grow-1 p-4" 
                style={{ height: '50vh', overflowY: 'auto', backgroundColor: '#f8f9fa' }}
              >
                {selectedTicket ? (
                  messages.length > 0 ? (
                    messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`mb-4 d-flex ${
                          message.senderName === 'Admin' ? 'justify-content-end' : 'justify-content-start'
                        }`}
                      >
                        <div 
                          className={`p-3 rounded-3 ${
                            message.senderName === 'Admin' 
                              ? 'bg-primary text-white' 
                              : 'bg-white border'
                          }`}
                          style={{ maxWidth: '75%' }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{message.senderName}</strong>
                            <small className={message.senderName === 'Admin' ? 'text-white-50' : 'text-muted'}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                          <p className="mb-0">{message.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted">
                      <i className="bi bi-chat-square-text display-5 opacity-25 mb-3"></i>
                      <h5>No messages yet</h5>
                      <p>Start the conversation with the customer</p>
                    </div>
                  )
                ) : (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted">
                    <i className="bi bi-ticket-detailed display-5 opacity-25 mb-3"></i>
                    <h5>Select a support ticket</h5>
                    <p>Choose a ticket from the left panel to view conversation history</p>
                  </div>
                )}
              </div>

              {/* Message Input Area */}
              {selectedTicket && (
                <div className="border-top p-4 bg-white">
                  <div className="input-group">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="form-control border-end-0 py-3"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn btn-outline-secondary border-start-0" type="button">
                      <i className="bi bi-paperclip"></i>
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="btn btn-primary px-4"
                      disabled={!newMessage.trim()}
                    >
                      <i className="bi bi-send me-1"></i> Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;