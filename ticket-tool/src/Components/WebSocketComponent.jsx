// In your component where you're connecting to WebSocket (likely TopNavbar.jsx)
import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketComponent = () => {
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    // Use the correct endpoint that matches your backend configuration
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      onConnect: () => {
        console.log('[WebSocket] Connected successfully');
        setConnectionStatus('Connected');
        
        // Subscribe to topics
        client.subscribe('/topic/reviews', (message) => {
          console.log('Received review:', JSON.parse(message.body));
          // Handle incoming review messages
        });
        
        // Add other subscriptions as needed
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame);
        setConnectionStatus('Error: ' + frame.headers?.message || 'Unknown error');
      },
      onWebSocketError: (event) => {
        console.error('[WebSocket] Connection error:', event);
        setConnectionStatus('Connection failed');
      },
      onWebSocketClose: (event) => {
        console.log('[WebSocket] Connection closed:', event);
        setConnectionStatus('Disconnected');
      }
    });

    client.activate();
    setStompClient(client);

    // Cleanup on component unmount
    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/send-review',
        body: JSON.stringify({
          username: 'currentUser',
          message: 'Test message'
        })
      });
    }
  };

  return (
    <div>
      <p>WebSocket Status: {connectionStatus}</p>
      <button onClick={sendMessage} disabled={connectionStatus !== 'Connected'}>
        Send Test Message
      </button>
    </div>
  );
};

export default WebSocketComponent;