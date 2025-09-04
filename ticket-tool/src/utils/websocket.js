// WebSocket connection for chat
const connectWebSocket = useCallback((ticketId) => {
  try {
    setWebSocketStatus('connecting');
    
    // Get the authentication token
    const token = localStorage.getItem("authToken");
    
    // Create SockJS with query parameter for authentication
    const socket = new SockJS(`${API_BASE}/ws?token=${token}`);
    
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        console.log('WebSocket connected successfully');
        setWebSocketStatus('connected');
        
        // Subscribe to chat messages
        stompClient.current.subscribe(`/topic/chat.${ticketId}`, (message) => {
          try {
            const newMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, newMessage]);
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        });
        
        // Subscribe to typing indicators
        stompClient.current.subscribe(`/topic/chat.typing.${ticketId}`, (typing) => {
          try {
            const typingData = JSON.parse(typing.body);
            if (typingData.typing) {
              setTypingUsers(prev => [...prev.filter(u => u.senderId !== typingData.senderId), typingData]);
            } else {
              setTypingUsers(prev => prev.filter(u => u.senderId !== typingData.senderId));
            }
          } catch (e) {
            console.error('Error parsing typing indicator:', e);
          }
        });
        
        // Request chat history
        if (stompClient.current.connected) {
          stompClient.current.publish({
            destination: `/app/chat.history.${ticketId}`,
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      },
      onDisconnect: () => {
        setWebSocketStatus('disconnected');
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to chat');
        setWebSocketStatus('error');
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (selectedTicketRef.current) {
            connectWebSocket(selectedTicketRef.current.id);
          }
        }, 5000);
      }
    });
    
    stompClient.current.activate();
  } catch (error) {
    console.error('WebSocket connection error:', error);
    setError('Failed to connect to chat service');
    setWebSocketStatus('error');
  }
}, [API_BASE]);