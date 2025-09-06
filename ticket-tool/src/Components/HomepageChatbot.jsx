import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomepageChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm ServiceHub's virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample responses for the chatbot
  const botResponses = {
    greeting: "Hello! I'm here to help you with ServiceHub. What would you like to know?",
    pricing: "We offer several plans tailored to different business needs. Our basic plan starts at $29/month per agent. Would you like me to direct you to our pricing page?",
    features: "ServiceHub offers ticket management, AI-powered responses, knowledge base, customer portal, and analytics. Which feature are you most interested in?",
    signup: "You can sign up for a free trial at our signup page. It takes just a few minutes to get started!",
    default: "I'm not sure I understand. Could you please rephrase that? You can ask me about pricing, features, or how to get started."
  };

  // Scroll to bottom of chat when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      let responseText = botResponses.default;

      // Simple keyword matching for responses
      const message = inputMessage.toLowerCase();
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        responseText = botResponses.greeting;
      } else if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
        responseText = botResponses.pricing;
      } else if (message.includes('feature') || message.includes('what can') || message.includes('capability')) {
        responseText = botResponses.features;
      } else if (message.includes('sign up') || message.includes('register') || message.includes('trial')) {
        responseText = botResponses.signup;
      }

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <div
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
        {!isOpen && <span className="chat-notification"></span>}
      </div>

      {/* Chatbot window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="d-flex align-items-center">
            <div className="chatbot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
                <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z" />
              </svg>
            </div>
            <div className="chatbot-info">
              <h6 className="mb-0">ServiceHub Assistant</h6>
              <small className={isTyping ? 'text-primary' : 'text-muted'}>
                {isTyping ? 'Typing...' : 'Online'}
              </small>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <small className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chatbot-input">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        /* Chatbot Styles */
        .chatbot-toggle {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #F7941D 0%, #f76c1d 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .chatbot-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .chatbot-toggle.active {
          background: #6c757d;
        }

        .chat-notification {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background-color: #dc3545;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }

        .chatbot-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 350px;
          height: 450px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        .chatbot-window.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .chatbot-header {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8f9fa;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .chatbot-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6f42c1 0%, #F7941D 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: white;
        }

        .chatbot-info h6 {
          font-weight: 600;
        }

        .chatbot-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .chatbot-close:hover {
          background-color: #e9ecef;
          color: #495057;
        }

        .chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          display: flex;
          max-width: 80%;
        }

        .bot-message {
          align-self: flex-start;
        }

        .user-message {
          align-self: flex-end;
        }

        .message-content {
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }

        .bot-message .message-content {
          background-color: #f1f3f5;
          border-top-left-radius: 4px;
        }

        .user-message .message-content {
          background: linear-gradient(135deg, #F7941D 0%, #f76c1d 100%);
          color: white;
          border-top-right-radius: 4px;
        }

        .message-content p {
          margin-bottom: 5px;
          word-wrap: break-word;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .chatbot-input {
          padding: 15px;
          border-top: 1px solid #e9ecef;
        }

        .chatbot-input .input-group {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          overflow: hidden;
        }

        .chatbot-input .form-control {
          border: none;
          padding: 10px 15px;
        }

        .chatbot-input .form-control:focus {
          box-shadow: none;
        }

        .chatbot-input .btn {
          border-radius: 0 20px 20px 0;
          padding: 10px 15px;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .chatbot-toggle {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
          }
          
          .chatbot-window {
            width: calc(100vw - 40px);
            right: 20px;
            bottom: 80px;
            height: 60vh;
          }
        }
      `}</style>
    </>
  );
};

export default HomepageChatbot;