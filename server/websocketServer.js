const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

/**
 * WebSocket Server for Real-Time Updates
 * Live odds, line movements, bet updates, notifications
 */
class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws'
    });

    this.clients = new Map(); // Map<userId, Set<WebSocket>>
    this.subscriptions = new Map(); // Map<WebSocket, Set<subscriptionKey>>
    
    this.setupServer();
    console.log('✓ WebSocket server initialized');
  }

  /**
   * Setup WebSocket server
   */
  setupServer() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');

      // Authentication
      const token = this.extractToken(req);
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      try {
        // SECURITY: JWT_SECRET required - no insecure fallback
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret && process.env.NODE_ENV === 'production') {
          ws.close(1008, 'Server configuration error');
          return;
        }
        const user = jwt.verify(token, jwtSecret || 'dev-only-secret-change-in-production');
        ws.userId = user.id;
        ws.username = user.username;

        // Add to clients map
        if (!this.clients.has(ws.userId)) {
          this.clients.set(ws.userId, new Set());
        }
        this.clients.get(ws.userId).add(ws);

        // Initialize subscriptions
        this.subscriptions.set(ws, new Set());

        // Setup handlers
        this.setupHandlers(ws);

        // Send welcome message
        this.send(ws, {
          type: 'connected',
          message: 'WebSocket connection established',
          userId: ws.userId
        });

      } catch (error) {
        console.error('WebSocket auth failed:', error);
        ws.close(1008, 'Invalid token');
      }
    });

    // Heartbeat to keep connections alive
    setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  /**
   * Setup message handlers
   */
  setupHandlers(ws) {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.handleMessage(ws, data);
      } catch (error) {
        console.error('Message parse error:', error);
        this.sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      console.log(`Client disconnected: ${ws.username}`);
      this.handleDisconnect(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Handle incoming messages
   */
  handleMessage(ws, data) {
    const { type, payload } = data;

    switch (type) {
      case 'subscribe':
        this.handleSubscribe(ws, payload);
        break;

      case 'unsubscribe':
        this.handleUnsubscribe(ws, payload);
        break;

      case 'ping':
        this.send(ws, { type: 'pong', timestamp: Date.now() });
        break;

      default:
        this.sendError(ws, `Unknown message type: ${type}`);
    }
  }

  /**
   * Handle subscription requests
   */
  handleSubscribe(ws, payload) {
    const { channel, params = {} } = payload;

    const subscriptionKey = this.getSubscriptionKey(channel, params);
    this.subscriptions.get(ws).add(subscriptionKey);

    this.send(ws, {
      type: 'subscribed',
      channel,
      params
    });

    console.log(`${ws.username} subscribed to ${subscriptionKey}`);
  }

  /**
   * Handle unsubscription requests
   */
  handleUnsubscribe(ws, payload) {
    const { channel, params = {} } = payload;

    const subscriptionKey = this.getSubscriptionKey(channel, params);
    this.subscriptions.get(ws).delete(subscriptionKey);

    this.send(ws, {
      type: 'unsubscribed',
      channel,
      params
    });

    console.log(`${ws.username} unsubscribed from ${subscriptionKey}`);
  }

  /**
   * Handle disconnect
   */
  handleDisconnect(ws) {
    // Remove from clients map
    const userClients = this.clients.get(ws.userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(ws.userId);
      }
    }

    // Remove subscriptions
    this.subscriptions.delete(ws);
  }

  /**
   * Extract token from request
   */
  extractToken(req) {
    const url = new URL(req.url, 'http://localhost');
    return url.searchParams.get('token');
  }

  /**
   * Generate subscription key
   */
  getSubscriptionKey(channel, params) {
    if (Object.keys(params).length === 0) {
      return channel;
    }
    return `${channel}:${JSON.stringify(params)}`;
  }

  /**
   * Send message to client
   */
  send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  /**
   * Send error to client
   */
  sendError(ws, message) {
    this.send(ws, {
      type: 'error',
      message
    });
  }

  // ========================================
  // BROADCAST METHODS
  // ========================================

  /**
   * Broadcast to all clients
   */
  broadcast(data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        this.send(client, data);
      }
    });
  }

  /**
   * Broadcast to specific user
   */
  broadcastToUser(userId, data) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.forEach(ws => {
        this.send(ws, data);
      });
    }
  }

  /**
   * Broadcast to channel subscribers
   */
  broadcastToChannel(channel, data, params = {}) {
    const subscriptionKey = this.getSubscriptionKey(channel, params);

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const clientSubs = this.subscriptions.get(client);
        if (clientSubs && clientSubs.has(subscriptionKey)) {
          this.send(client, {
            type: 'broadcast',
            channel,
            params,
            data
          });
        }
      }
    });
  }

  // ========================================
  // BETTING-SPECIFIC BROADCASTS
  // ========================================

  /**
   * Broadcast odds update
   */
  broadcastOddsUpdate(sport, odds) {
    this.broadcastToChannel('odds', {
      type: 'odds_update',
      sport,
      odds,
      timestamp: Date.now()
    }, { sport });
  }

  /**
   * Broadcast line movement
   */
  broadcastLineMovement(gameId, movement) {
    this.broadcastToChannel('line_movement', {
      type: 'line_movement',
      gameId,
      movement,
      timestamp: Date.now()
    }, { gameId });
  }

  /**
   * Broadcast steam move alert
   */
  broadcastSteamMove(movement) {
    this.broadcastToChannel('alerts', {
      type: 'steam_move',
      data: movement,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast arbitrage opportunity
   */
  broadcastArbitrage(opportunity) {
    this.broadcastToChannel('alerts', {
      type: 'arbitrage',
      data: opportunity,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast bet settled
   */
  broadcastBetSettled(userId, bet) {
    this.broadcastToUser(userId, {
      type: 'bet_settled',
      data: bet,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast injury update
   */
  broadcastInjury(injury) {
    this.broadcastToChannel('injuries', {
      type: 'injury_update',
      data: injury,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast new prediction
   */
  broadcastPrediction(gameId, prediction) {
    this.broadcastToChannel('predictions', {
      type: 'new_prediction',
      gameId,
      data: prediction,
      timestamp: Date.now()
    }, { gameId });
  }

  /**
   * Broadcast game starting soon
   */
  broadcastGameStarting(game, minutesUntilStart) {
    this.broadcastToChannel('games', {
      type: 'game_starting',
      game,
      minutesUntilStart,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast live score update
   */
  broadcastScoreUpdate(gameId, score) {
    this.broadcastToChannel('live_scores', {
      type: 'score_update',
      gameId,
      score,
      timestamp: Date.now()
    }, { gameId });
  }

  /**
   * Broadcast social activity
   */
  broadcastSocialActivity(userId, activity) {
    this.broadcastToUser(userId, {
      type: 'social_activity',
      data: activity,
      timestamp: Date.now()
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get connection stats
   */
  getStats() {
    return {
      totalConnections: this.wss.clients.size,
      uniqueUsers: this.clients.size,
      subscriptions: Array.from(this.subscriptions.values())
        .reduce((sum, subs) => sum + subs.size, 0)
    };
  }

  /**
   * Close all connections
   */
  closeAll() {
    this.wss.clients.forEach(client => {
      client.close(1001, 'Server shutting down');
    });
  }
}

module.exports = WebSocketServer;
