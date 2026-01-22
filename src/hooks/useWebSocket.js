import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * WebSocket Hook for Real-Time Data
 * Handles connection, subscriptions, and reconnection
 */
export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const subscriptions = useRef(new Map());
  const messageHandlers = useRef(new Map());

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  const connect = useCallback(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const wsUrl = `${url}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        // Resubscribe to channels after reconnect
        subscriptions.current.forEach((params, channel) => {
          subscribe(channel, params);
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);

          // Call registered handlers
          const { type, channel } = data;
          
          // Type-specific handlers
          const typeHandler = messageHandlers.current.get(type);
          if (typeHandler) {
            typeHandler(data);
          }

          // Channel-specific handlers
          if (channel) {
            const channelHandler = messageHandlers.current.get(`channel:${channel}`);
            if (channelHandler) {
              channelHandler(data);
            }
          }

        } catch (error) {
          console.error('Message parse error:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setIsConnected(false);
  }, []);

  const send = useCallback((type, payload) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket not connected');
    }
  }, []);

  const subscribe = useCallback((channel, params = {}) => {
    subscriptions.current.set(channel, params);
    send('subscribe', { channel, params });
  }, [send]);

  const unsubscribe = useCallback((channel, params = {}) => {
    subscriptions.current.delete(channel);
    send('unsubscribe', { channel, params });
  }, [send]);

  const on = useCallback((event, handler) => {
    messageHandlers.current.set(event, handler);
  }, []);

  const off = useCallback((event) => {
    messageHandlers.current.delete(event);
  }, []);

  return {
    isConnected,
    lastMessage,
    send,
    subscribe,
    unsubscribe,
    on,
    off
  };
};

/**
 * Hook for Live Odds Updates
 */
export const useLiveOdds = (sport) => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocket(wsUrl);
  const [odds, setOdds] = useState(null);

  useEffect(() => {
    if (isConnected) {
      subscribe('odds', { sport });

      on('odds_update', (data) => {
        if (data.sport === sport) {
          setOdds(data.odds);
        }
      });

      return () => {
        unsubscribe('odds', { sport });
        off('odds_update');
      };
    }
  }, [isConnected, sport]);

  return { odds, isConnected };
};

/**
 * Hook for Line Movement Updates
 */
export const useLineMovement = (gameId) => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocket(wsUrl);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    if (isConnected && gameId) {
      subscribe('line_movement', { gameId });

      on('line_movement', (data) => {
        if (data.gameId === gameId) {
          setMovements(prev => [data.movement, ...prev].slice(0, 50));
        }
      });

      return () => {
        unsubscribe('line_movement', { gameId });
        off('line_movement');
      };
    }
  }, [isConnected, gameId]);

  return { movements, isConnected };
};

/**
 * Hook for Betting Alerts
 */
export const useBettingAlerts = () => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocket(wsUrl);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (isConnected) {
      subscribe('alerts');

      const handleAlert = (data) => {
        setAlerts(prev => [
          {
            ...data,
            id: Date.now(),
            timestamp: new Date().toISOString()
          },
          ...prev
        ].slice(0, 20));
      };

      on('steam_move', handleAlert);
      on('arbitrage', handleAlert);

      return () => {
        unsubscribe('alerts');
        off('steam_move');
        off('arbitrage');
      };
    }
  }, [isConnected]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return { alerts, clearAlerts, isConnected };
};

/**
 * Hook for Live Scores
 */
export const useLiveScores = (gameIds = []) => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocket(wsUrl);
  const [scores, setScores] = useState({});

  useEffect(() => {
    if (isConnected && gameIds.length > 0) {
      gameIds.forEach(gameId => {
        subscribe('live_scores', { gameId });
      });

      on('score_update', (data) => {
        setScores(prev => ({
          ...prev,
          [data.gameId]: data.score
        }));
      });

      return () => {
        gameIds.forEach(gameId => {
          unsubscribe('live_scores', { gameId });
        });
        off('score_update');
      };
    }
  }, [isConnected, JSON.stringify(gameIds)]);

  return { scores, isConnected };
};

/**
 * Hook for Injury Updates
 */
export const useInjuryUpdates = () => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocket(wsUrl);
  const [injuries, setInjuries] = useState([]);

  useEffect(() => {
    if (isConnected) {
      subscribe('injuries');

      on('injury_update', (data) => {
        setInjuries(prev => [data.data, ...prev].slice(0, 50));
      });

      return () => {
        unsubscribe('injuries');
        off('injury_update');
      };
    }
  }, [isConnected]);

  return { injuries, isConnected };
};

/**
 * Hook for Bet Updates
 */
export const useBetUpdates = () => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, on, off } = useWebSocket(wsUrl);
  const [settledBets, setSettledBets] = useState([]);

  useEffect(() => {
    if (isConnected) {
      on('bet_settled', (data) => {
        setSettledBets(prev => [data.data, ...prev].slice(0, 10));
      });

      return () => {
        off('bet_settled');
      };
    }
  }, [isConnected]);

  return { settledBets, isConnected };
};

/**
 * Hook for Social Activity
 */
export const useSocialActivity = () => {
  const wsUrl = `ws://${window.location.host}/ws`;
  const { isConnected, on, off } = useWebSocket(wsUrl);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (isConnected) {
      on('social_activity', (data) => {
        setActivities(prev => [data.data, ...prev].slice(0, 20));
      });

      return () => {
        off('social_activity');
      };
    }
  }, [isConnected]);

  return { activities, isConnected };
};

export default useWebSocket;
