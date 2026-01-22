import { WebSocketServer } from 'ws';

class MLWebSocketServer {
  constructor(port = 8080) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Set();
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    this.setupWebSocket();
    this.startBroadcasting();
    
    console.log(`🔌 WebSocket server running on port ${port}`);
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('✅ New WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      });

      ws.on('close', () => {
        console.log('❌ WebSocket client disconnected');
        this.clients.delete(ws);
      });

      // Send initial connection success
      ws.send(JSON.stringify({
        type: 'CONNECTION_SUCCESS',
        timestamp: new Date().toISOString()
      }));
    });
  }

  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'SUBSCRIBE_PLAYER':
        console.log(`Subscribing to player: ${data.playerId}`);
        // Store subscription info
        ws.subscribedPlayers = ws.subscribedPlayers || [];
        ws.subscribedPlayers.push(data.playerId);
        break;

      case 'SUBSCRIBE_GAME':
        console.log(`Subscribing to game: ${data.gameId}`);
        ws.subscribedGames = ws.subscribedGames || [];
        ws.subscribedGames.push(data.gameId);
        break;

      case 'PING':
        ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
        break;
    }
  }

  async startBroadcasting() {
    // Broadcast live predictions every 30 seconds
    setInterval(async () => {
      await this.broadcastLivePredictions();
    }, 30000);

    // Broadcast sharp money alerts every 60 seconds
    setInterval(async () => {
      await this.broadcastSharpMoney();
    }, 60000);
  }

  async broadcastLivePredictions() {
    if (this.clients.size === 0) return;

    try {
      const response = await fetch(`${this.mlServiceUrl}/detect/sharp_money?sport=nba`);
      if (!response.ok) return;

      const data = await response.json();

      this.broadcast({
        type: 'SHARP_MONEY_UPDATE',
        data: data.signals,
        timestamp: new Date().toISOString()
      });

      console.log(`📡 Broadcasted sharp money to ${this.clients.size} clients`);
    } catch (err) {
      console.error('Broadcast error:', err);
    }
  }

  async broadcastSharpMoney() {
    if (this.clients.size === 0) return;

    try {
      const response = await fetch(`${this.mlServiceUrl}/detect/sharp_money?sport=nba`);
      if (!response.ok) return;

      const data = await response.json();

      if (data.signals && data.signals.length > 0) {
        this.broadcast({
          type: 'SHARP_ALERT',
          data: data.signals.filter(s => s.confidence > 0.85),
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Sharp money broadcast error:', err);
    }
  }

  broadcast(message) {
    const payload = JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  broadcastToSubscribers(playerId, message) {
    const payload = JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && 
          client.subscribedPlayers && 
          client.subscribedPlayers.includes(playerId)) {
        client.send(payload);
      }
    });
  }
}

// Export singleton instance
let wsServer = null;

export function initializeWebSocket(port = 8080) {
  if (!wsServer) {
    wsServer = new MLWebSocketServer(port);
  }
  return wsServer;
}

export default initializeWebSocket;
