import { useEffect, useRef, useState } from 'react';

export function useMLWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev.slice(-50), data]); // Keep last 50 messages
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.current.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const subscribe = (type, id) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: type === 'player' ? 'SUBSCRIBE_PLAYER' : 'SUBSCRIBE_GAME',
        [type === 'player' ? 'playerId' : 'gameId']: id
      }));
    }
  };

  return { connected, messages, subscribe };
}

export default useMLWebSocket;
