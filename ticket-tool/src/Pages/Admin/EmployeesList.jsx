import React, { useState, useEffect } from 'react';
import { FaCheck, FaRoute, FaMapMarkerAlt, FaComment, FaUserCircle, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import Map from '../../Components/common/Map';

const EmployeeList = () => {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);
  
  useEffect(() => {
    const employeeData = JSON.parse(localStorage.getItem('currentUser'));
    if (employeeData && employeeData.id) {
      setEmployeeId(employeeData.id);
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        const [ticketsRes, locationRes] = await Promise.all([
          api.get(`/tickets/employee/${employeeId}`),
          api.get(`/location/${employeeId}`)
        ]);
        
        setTickets(ticketsRes.data);
        setLocation(locationRes.data);
        
        // Set current ticket if any is in progress
        const inProgress = ticketsRes.data.find(t => t.status === 'IN_PROGRESS');
        if (inProgress) {
          setCurrentTicket(inProgress);
          fetchMessages(inProgress.id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up geolocation updates
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, [employeeId]);

  const updateLocation = async (lat, lng) => {
    try {
      await api.post('/location/update', {
        employeeId: employeeId,
        latitude: lat,
        longitude: lng
      });
      setLocation({ latitude: lat, longitude: lng });
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      const response = await api.get(`/messages/${ticketId}`);
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tickets/${currentTicket.id}/status-update`, newStatus, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setCurrentTicket({ ...currentTicket, status: newStatus });
      setTickets(tickets.map(t => 
        t.id === currentTicket.id ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      console.error('Error updating ticket status:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentTicket) return;
    
    try {
      const employeeData = JSON.parse(localStorage.getItem('currentUser'));
      const response = await api.post(`/messages/${currentTicket.id}`, {
        content: newMessage,
        senderName: employeeData?.name || 'Employee'
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Ticket */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-1"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUserCircle className="mr-2 text-primary" /> Current Ticket
          </h2>
          
          {currentTicket ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{currentTicket.title}</h3>
                <p className="text-sm text-gray-600">{currentTicket.description}</p>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-2" />
                Created: {new Date(currentTicket.createdAt).toLocaleString()}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusChange('ACCEPTED')}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    currentTicket.status === 'ACCEPTED' ? 
                    'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaCheck className="mr-2" /> Accept
                </button>
                
                <button
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    currentTicket.status === 'IN_PROGRESS' ? 
                    'bg-yellow-100 text-yellow-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaRoute className="mr-2" /> On Route
                </button>
                
                <button
                  onClick={() => handleStatusChange('RESOLVED')}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    currentTicket.status === 'RESOLVED' ? 
                    'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaCheck className="mr-2" /> Mark as Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No active ticket assigned
            </div>
          )}
        </motion.div>

        {/* Ticket List */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-1"
        >
          <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <motion.div
                  key={ticket.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    currentTicket?.id === ticket.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setCurrentTicket(ticket);
                    fetchMessages(ticket.id);
                  }}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">#{ticket.id} - {ticket.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tickets assigned yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Map and Chat */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-1 space-y-6"
        >
          {/* Location Map */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primary" /> Your Location
            </h2>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
              {location ? (
                <Map lat={location.latitude} lng={location.longitude} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading map...
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          {currentTicket && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaComment className="mr-2 text-primary" /> Chat with User
              </h2>
              <div className="border rounded-lg h-48 overflow-y-auto p-3 space-y-3">
                <AnimatePresence>
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.senderName === localStorage.getItem('employeeName') ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${
                        message.senderName === localStorage.getItem('employeeName') ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-xs p-3 rounded-lg ${
                        message.senderName === localStorage.getItem('employeeName') ? 
                        'bg-primary text-white' : 'bg-gray-100'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderName === localStorage.getItem('employeeName') ? 
                          'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.senderName} • {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mt-3 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeList;