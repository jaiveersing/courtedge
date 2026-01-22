const admin = require('firebase-admin');

/**
 * Push Notification Service
 * Supports Firebase Cloud Messaging (FCM) for cross-platform notifications
 */
class PushNotificationService {
  constructor() {
    this.initialized = false;
    this.fcm = null;
  }

  /**
   * Initialize Firebase Admin SDK
   */
  initialize(serviceAccountPath) {
    try {
      const serviceAccount = require(serviceAccountPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });

      this.fcm = admin.messaging();
      this.initialized = true;

      console.log('✓ Firebase Admin SDK initialized');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  }

  /**
   * Send notification to a single device
   */
  async sendToDevice(token, notification, data = {}) {
    if (!this.initialized) {
      throw new Error('Push notification service not initialized');
    }

    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        timestamp: Date.now().toString()
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: notification.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      },
      webpush: {
        notification: {
          icon: notification.icon || '/icon-192x192.png',
          badge: notification.badge || '/badge-72x72.png'
        }
      }
    };

    try {
      const response = await this.fcm.send(message);
      console.log('Notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Notification send failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to multiple devices
   */
  async sendToMultipleDevices(tokens, notification, data = {}) {
    if (!this.initialized) {
      throw new Error('Push notification service not initialized');
    }

    if (tokens.length === 0) {
      return { success: true, results: [] };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        timestamp: Date.now().toString()
      },
      tokens
    };

    try {
      const response = await this.fcm.sendMulticast(message);
      console.log(`Sent ${response.successCount} / ${tokens.length} notifications`);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        results: response.responses
      };
    } catch (error) {
      console.error('Multicast send failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to a topic
   */
  async sendToTopic(topic, notification, data = {}) {
    if (!this.initialized) {
      throw new Error('Push notification service not initialized');
    }

    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        timestamp: Date.now().toString()
      }
    };

    try {
      const response = await this.fcm.send(message);
      console.log('Topic notification sent:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Topic notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe device to topic
   */
  async subscribeToTopic(tokens, topic) {
    if (!this.initialized) {
      throw new Error('Push notification service not initialized');
    }

    try {
      const response = await this.fcm.subscribeToTopic(tokens, topic);
      console.log(`Subscribed ${response.successCount} devices to ${topic}`);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Topic subscription failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unsubscribe device from topic
   */
  async unsubscribeFromTopic(tokens, topic) {
    if (!this.initialized) {
      throw new Error('Push notification service not initialized');
    }

    try {
      const response = await this.fcm.unsubscribeFromTopic(tokens, topic);
      console.log(`Unsubscribed ${response.successCount} devices from ${topic}`);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Topic unsubscription failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================
  // BETTING-SPECIFIC NOTIFICATIONS
  // ========================================

  /**
   * Send bet settled notification
   */
  async notifyBetSettled(userToken, bet) {
    const won = bet.status === 'won';
    const notification = {
      title: won ? '🎉 Bet Won!' : '😔 Bet Lost',
      body: `${bet.game}: ${bet.selection} - ${won ? '+' : ''}$${bet.profitLoss.toFixed(2)}`,
      image: won ? '/images/win.png' : '/images/loss.png',
      clickAction: 'VIEW_BET'
    };

    const data = {
      type: 'bet_settled',
      betId: bet.id,
      status: bet.status,
      profitLoss: bet.profitLoss.toString()
    };

    return this.sendToDevice(userToken, notification, data);
  }

  /**
   * Send arbitrage opportunity alert
   */
  async notifyArbitrageOpportunity(userTokens, opportunity) {
    const notification = {
      title: '⚡ Arbitrage Alert!',
      body: `${opportunity.game} - ${opportunity.profitPercent.toFixed(2)}% guaranteed profit`,
      image: '/images/arbitrage.png',
      clickAction: 'VIEW_ARBITRAGE'
    };

    const data = {
      type: 'arbitrage',
      opportunityId: opportunity.id,
      profitPercent: opportunity.profitPercent.toString()
    };

    return this.sendToMultipleDevices(userTokens, notification, data);
  }

  /**
   * Send steam move alert
   */
  async notifySteamMove(userTokens, movement) {
    const notification = {
      title: '🔥 Steam Move Detected!',
      body: `${movement.game} - Line moved ${Math.abs(movement.change).toFixed(1)} points`,
      image: '/images/steam.png',
      clickAction: 'VIEW_LINE_MOVEMENT'
    };

    const data = {
      type: 'steam_move',
      gameId: movement.gameId,
      market: movement.market,
      change: movement.change.toString()
    };

    return this.sendToMultipleDevices(userTokens, notification, data);
  }

  /**
   * Send reverse line movement (RLM) alert
   */
  async notifyRLM(userTokens, movement) {
    const notification = {
      title: '💎 Sharp Money Alert (RLM)',
      body: `${movement.game} - Line moving against public betting`,
      image: '/images/rlm.png',
      clickAction: 'VIEW_LINE_MOVEMENT'
    };

    const data = {
      type: 'rlm',
      gameId: movement.gameId,
      market: movement.market
    };

    return this.sendToMultipleDevices(userTokens, notification, data);
  }

  /**
   * Send injury update alert
   */
  async notifyInjuryUpdate(userTokens, injury) {
    const notification = {
      title: `🏥 Injury Update: ${injury.playerName}`,
      body: `${injury.status} - ${injury.team}`,
      image: injury.playerImage,
      clickAction: 'VIEW_INJURY'
    };

    const data = {
      type: 'injury',
      playerId: injury.playerId,
      status: injury.status
    };

    return this.sendToMultipleDevices(userTokens, notification, data);
  }

  /**
   * Send game start reminder
   */
  async notifyGameStarting(userTokens, game, minutesUntilStart) {
    const notification = {
      title: '⏰ Game Starting Soon!',
      body: `${game.awayTeam} @ ${game.homeTeam} in ${minutesUntilStart} minutes`,
      image: '/images/game-start.png',
      clickAction: 'VIEW_GAME'
    };

    const data = {
      type: 'game_starting',
      gameId: game.id,
      minutesUntilStart: minutesUntilStart.toString()
    };

    return this.sendToMultipleDevices(userTokens, notification, data);
  }

  /**
   * Send new follower notification
   */
  async notifyNewFollower(userToken, follower) {
    const notification = {
      title: '👤 New Follower',
      body: `${follower.username} started following you`,
      image: follower.avatarUrl,
      clickAction: 'VIEW_PROFILE'
    };

    const data = {
      type: 'new_follower',
      userId: follower.id
    };

    return this.sendToDevice(userToken, notification, data);
  }

  /**
   * Send bet liked notification
   */
  async notifyBetLiked(userToken, liker, bet) {
    const notification = {
      title: '❤️ Someone liked your bet!',
      body: `${liker.username} liked your ${bet.selection} bet`,
      image: liker.avatarUrl,
      clickAction: 'VIEW_BET'
    };

    const data = {
      type: 'bet_liked',
      betId: bet.id,
      userId: liker.id
    };

    return this.sendToDevice(userToken, notification, data);
  }

  /**
   * Send bet comment notification
   */
  async notifyBetComment(userToken, commenter, bet, comment) {
    const notification = {
      title: '💬 New comment on your bet',
      body: `${commenter.username}: ${comment.content.substring(0, 50)}...`,
      image: commenter.avatarUrl,
      clickAction: 'VIEW_BET'
    };

    const data = {
      type: 'bet_comment',
      betId: bet.id,
      commentId: comment.id,
      userId: commenter.id
    };

    return this.sendToDevice(userToken, notification, data);
  }

  /**
   * Send daily performance summary
   */
  async notifyDailySummary(userToken, summary) {
    const profitColor = summary.profitLoss >= 0 ? '📈' : '📉';
    const notification = {
      title: `${profitColor} Daily Summary`,
      body: `${summary.wins}W-${summary.losses}L | ${summary.profitLoss >= 0 ? '+' : ''}$${summary.profitLoss.toFixed(2)}`,
      image: '/images/summary.png',
      clickAction: 'VIEW_ANALYTICS'
    };

    const data = {
      type: 'daily_summary',
      date: summary.date
    };

    return this.sendToDevice(userToken, notification, data);
  }

  /**
   * Validate FCM token
   */
  async validateToken(token) {
    try {
      // Try to send a dry-run message
      await this.fcm.send({
        token,
        notification: { title: 'Test', body: 'Test' }
      }, true);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Singleton instance
const pushNotificationService = new PushNotificationService();

module.exports = pushNotificationService;
