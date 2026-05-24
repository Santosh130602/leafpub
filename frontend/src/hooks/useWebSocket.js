import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws';
const WS_URL = 'wss://leafpub-1.onrender.com/ws';


export const useWebSocket = (onMessage) => {
  const { token, isLoggedIn } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep callback ref current
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!token || !isLoggedIn) return;

    // Close existing connection
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      // Clear any pending reconnect
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket closed:', event.code);
      // Reconnect after 3 seconds unless intentionally closed
      if (event.code !== 1000 && isLoggedIn) {
        reconnectTimer.current = setTimeout(() => {
          console.log('🔌 Reconnecting WebSocket...');
          connect();
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error('WS error:', err);
    };
  }, [token, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && token) {
      connect();
    }
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [isLoggedIn, token, connect]);

  return wsRef;
};

export default useWebSocket;
