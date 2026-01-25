/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY MEMORY SYSTEM v3.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Persistent memory and context management for Ray AI:
 * 
 * - Conversation History (multi-turn context)
 * - Entity Memory (players, teams, markets discussed)
 * - User Preference Learning
 * - Session State Management
 * - Long-term Memory (cross-session persistence)
 * - Semantic Memory (learned patterns)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MEMORY_CONFIG = {
  maxConversationTurns: 50,
  maxRecentPlayers: 10,
  maxRecentTeams: 5,
  contextWindowSize: 10,
  persistenceKey: 'ray_memory_v3',
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // Importance weights for memory prioritization
  weights: {
    explicit: 1.0,      // User explicitly mentioned
    inferred: 0.6,      // Inferred from context
    repeated: 0.8,      // Mentioned multiple times
    recent: 0.9         // Mentioned recently
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAY MEMORY CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class RayMemory {
  constructor() {
    this.config = MEMORY_CONFIG;
    
    // Initialize memory stores
    this.conversationHistory = [];
    this.entityMemory = {
      players: new Map(),
      teams: new Map(),
      markets: new Map(),
      lines: new Map()
    };
    this.userPreferences = {
      responseLength: 'full',       // brief, full, detailed
      riskTolerance: 'moderate',    // conservative, moderate, aggressive
      favoriteTeams: [],
      favoritePlayers: [],
      bettingStyle: 'balanced',     // value, volume, balanced
      expertiseLevel: 'intermediate' // beginner, intermediate, expert
    };
    this.sessionState = {
      startTime: Date.now(),
      turnCount: 0,
      currentFocus: null,
      activeAnalysis: null,
      pendingQuestions: []
    };
    this.semanticMemory = {
      patterns: new Map(),
      insights: [],
      corrections: []
    };
    this.analysisCache = new Map();
    
    // Load persisted memory
    this.loadFromStorage();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CONVERSATION MEMORY
  // ─────────────────────────────────────────────────────────────────────────────

  addTurn(turn) {
    const enrichedTurn = {
      ...turn,
      id: this.generateId(),
      timestamp: Date.now(),
      turnNumber: this.sessionState.turnCount++
    };
    
    this.conversationHistory.push(enrichedTurn);
    
    // Trim history if needed
    if (this.conversationHistory.length > this.config.maxConversationTurns) {
      this.conversationHistory.shift();
    }
    
    // Extract and store entities
    if (turn.entities) {
      this.updateEntityMemory(turn.entities);
    }
    
    // Update session state
    this.updateSessionState(turn);
    
    // Persist to storage
    this.saveToStorage();
    
    return enrichedTurn;
  }

  getRecentTurns(count = 5) {
    return this.conversationHistory.slice(-count);
  }

  getConversationContext() {
    const recentTurns = this.getRecentTurns(this.config.contextWindowSize);
    
    return {
      turns: recentTurns,
      currentFocus: this.sessionState.currentFocus,
      activeAnalysis: this.sessionState.activeAnalysis,
      recentPlayers: this.getRecentPlayers(3),
      recentMarkets: this.getRecentMarkets(2)
    };
  }

  getFullConversation() {
    return [...this.conversationHistory];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ENTITY MEMORY
  // ─────────────────────────────────────────────────────────────────────────────

  updateEntityMemory(entities) {
    const now = Date.now();
    
    if (entities.player) {
      const player = entities.player.toLowerCase();
      const existing = this.entityMemory.players.get(player) || { count: 0, firstMention: now };
      this.entityMemory.players.set(player, {
        ...existing,
        count: existing.count + 1,
        lastMention: now,
        contexts: [...(existing.contexts || []), this.sessionState.turnCount].slice(-5)
      });
    }
    
    if (entities.team) {
      const team = entities.team;
      const existing = this.entityMemory.teams.get(team) || { count: 0, firstMention: now };
      this.entityMemory.teams.set(team, {
        ...existing,
        count: existing.count + 1,
        lastMention: now
      });
    }
    
    if (entities.market) {
      const market = entities.market;
      const existing = this.entityMemory.markets.get(market) || { count: 0, firstMention: now };
      this.entityMemory.markets.set(market, {
        ...existing,
        count: existing.count + 1,
        lastMention: now
      });
    }
    
    if (entities.line !== undefined) {
      const key = `${entities.player || 'unknown'}_${entities.market || 'unknown'}`;
      this.entityMemory.lines.set(key, {
        line: entities.line,
        timestamp: now
      });
    }
  }

  getRecentPlayers(count = 5) {
    const entries = Array.from(this.entityMemory.players.entries());
    entries.sort((a, b) => (b[1].lastMention || 0) - (a[1].lastMention || 0));
    return entries.slice(0, count).map(([name, data]) => ({ name, ...data }));
  }

  getRecentMarkets(count = 3) {
    const entries = Array.from(this.entityMemory.markets.entries());
    entries.sort((a, b) => (b[1].lastMention || 0) - (a[1].lastMention || 0));
    return entries.slice(0, count).map(([name, data]) => ({ name, ...data }));
  }

  getMostDiscussedPlayers(count = 5) {
    const entries = Array.from(this.entityMemory.players.entries());
    entries.sort((a, b) => (b[1].count || 0) - (a[1].count || 0));
    return entries.slice(0, count).map(([name, data]) => ({ name, ...data }));
  }

  getLastLine(player, market) {
    const key = `${player}_${market}`;
    return this.entityMemory.lines.get(key);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CONTEXT MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  getContext() {
    return {
      // Current focus
      player: {
        active: this.sessionState.currentFocus?.player || null,
        recent: this.getRecentPlayers(3)
      },
      market: {
        active: this.sessionState.currentFocus?.market || null,
        recent: this.getRecentMarkets(2)
      },
      team: {
        active: this.sessionState.currentFocus?.team || null
      },
      
      // Analysis state
      currentAnalysis: this.sessionState.activeAnalysis,
      
      // User preferences
      preferences: this.userPreferences,
      
      // Session info
      session: {
        duration: Date.now() - this.sessionState.startTime,
        turnCount: this.sessionState.turnCount,
        isNew: this.sessionState.turnCount < 3
      }
    };
  }

  setFocus(type, value) {
    if (!this.sessionState.currentFocus) {
      this.sessionState.currentFocus = {};
    }
    this.sessionState.currentFocus[type] = value;
  }

  getFocus(type) {
    return this.sessionState.currentFocus?.[type] || null;
  }

  clearFocus() {
    this.sessionState.currentFocus = null;
  }

  updateSessionState(turn) {
    // Update focus based on turn entities
    if (turn.entities?.player) {
      this.setFocus('player', turn.entities.player);
    }
    if (turn.entities?.market) {
      this.setFocus('market', turn.entities.market);
    }
    if (turn.entities?.team) {
      this.setFocus('team', turn.entities.team);
    }
    
    // Store active analysis if present
    if (turn.synthesis) {
      this.sessionState.activeAnalysis = {
        synthesis: turn.synthesis,
        timestamp: Date.now()
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // USER PREFERENCES
  // ─────────────────────────────────────────────────────────────────────────────

  setPreference(key, value) {
    if (this.userPreferences.hasOwnProperty(key)) {
      this.userPreferences[key] = value;
      this.saveToStorage();
    }
  }

  getPreference(key) {
    return this.userPreferences[key];
  }

  inferPreferences(turn) {
    const input = turn.input?.toLowerCase() || '';
    
    // Infer response length preference
    if (input.includes('brief') || input.includes('quick') || input.includes('short')) {
      this.userPreferences.responseLength = 'brief';
    } else if (input.includes('detail') || input.includes('deep') || input.includes('everything')) {
      this.userPreferences.responseLength = 'detailed';
    }
    
    // Infer risk tolerance
    if (input.includes('safe') || input.includes('consistent') || input.includes('reliable')) {
      this.userPreferences.riskTolerance = 'conservative';
    } else if (input.includes('value') || input.includes('edge') || input.includes('aggressive')) {
      this.userPreferences.riskTolerance = 'aggressive';
    }
    
    // Infer expertise level
    if (input.includes('explain') || input.includes('what is') || input.includes('how does')) {
      this.userPreferences.expertiseLevel = 'beginner';
    } else if (input.includes('variance') || input.includes('distribution') || input.includes('ev')) {
      this.userPreferences.expertiseLevel = 'expert';
    }
  }

  addFavoritePlayer(player) {
    if (!this.userPreferences.favoritePlayers.includes(player)) {
      this.userPreferences.favoritePlayers.push(player);
      this.saveToStorage();
    }
  }

  addFavoriteTeam(team) {
    if (!this.userPreferences.favoriteTeams.includes(team)) {
      this.userPreferences.favoriteTeams.push(team);
      this.saveToStorage();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANTIC MEMORY
  // ─────────────────────────────────────────────────────────────────────────────

  storePattern(pattern, context) {
    this.semanticMemory.patterns.set(pattern.id || this.generateId(), {
      pattern,
      context,
      timestamp: Date.now(),
      useCount: 0
    });
  }

  getPattern(id) {
    return this.semanticMemory.patterns.get(id);
  }

  findSimilarPatterns(pattern) {
    const matches = [];
    for (const [id, stored] of this.semanticMemory.patterns.entries()) {
      if (this.patternSimilarity(pattern, stored.pattern) > 0.7) {
        matches.push({ id, ...stored });
      }
    }
    return matches;
  }

  patternSimilarity(p1, p2) {
    // Simple similarity based on player and market
    let score = 0;
    if (p1.player === p2.player) score += 0.5;
    if (p1.market === p2.market) score += 0.3;
    if (p1.direction === p2.direction) score += 0.2;
    return score;
  }

  addInsight(insight) {
    this.semanticMemory.insights.push({
      insight,
      timestamp: Date.now(),
      id: this.generateId()
    });
    
    // Keep only last 100 insights
    if (this.semanticMemory.insights.length > 100) {
      this.semanticMemory.insights.shift();
    }
  }

  getRecentInsights(count = 10) {
    return this.semanticMemory.insights.slice(-count);
  }

  addCorrection(original, corrected, reason) {
    this.semanticMemory.corrections.push({
      original,
      corrected,
      reason,
      timestamp: Date.now()
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ANALYSIS CACHE
  // ─────────────────────────────────────────────────────────────────────────────

  cacheAnalysis(key, analysis, ttl = 5 * 60 * 1000) {
    this.analysisCache.set(key, {
      analysis,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }

  getCachedAnalysis(key) {
    const cached = this.analysisCache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.analysisCache.delete(key);
      return null;
    }
    
    return cached.analysis;
  }

  clearAnalysisCache() {
    this.analysisCache.clear();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PERSISTENCE
  // ─────────────────────────────────────────────────────────────────────────────

  saveToStorage() {
    try {
      const data = {
        conversationHistory: this.conversationHistory.slice(-20), // Last 20 turns
        entityMemory: {
          players: Array.from(this.entityMemory.players.entries()),
          teams: Array.from(this.entityMemory.teams.entries()),
          markets: Array.from(this.entityMemory.markets.entries()),
          lines: Array.from(this.entityMemory.lines.entries())
        },
        userPreferences: this.userPreferences,
        semanticMemory: {
          patterns: Array.from(this.semanticMemory.patterns.entries()),
          insights: this.semanticMemory.insights.slice(-20),
          corrections: this.semanticMemory.corrections.slice(-10)
        },
        savedAt: Date.now()
      };
      
      localStorage.setItem(this.config.persistenceKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save Ray memory:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.config.persistenceKey);
      if (!stored) return;
      
      const data = JSON.parse(stored);
      
      // Check if data is stale (session timeout)
      if (Date.now() - data.savedAt > this.config.sessionTimeout) {
        // Start fresh session but keep preferences
        this.userPreferences = data.userPreferences || this.userPreferences;
        return;
      }
      
      // Restore conversation history
      this.conversationHistory = data.conversationHistory || [];
      
      // Restore entity memory
      if (data.entityMemory) {
        this.entityMemory.players = new Map(data.entityMemory.players || []);
        this.entityMemory.teams = new Map(data.entityMemory.teams || []);
        this.entityMemory.markets = new Map(data.entityMemory.markets || []);
        this.entityMemory.lines = new Map(data.entityMemory.lines || []);
      }
      
      // Restore user preferences
      this.userPreferences = { ...this.userPreferences, ...data.userPreferences };
      
      // Restore semantic memory
      if (data.semanticMemory) {
        this.semanticMemory.patterns = new Map(data.semanticMemory.patterns || []);
        this.semanticMemory.insights = data.semanticMemory.insights || [];
        this.semanticMemory.corrections = data.semanticMemory.corrections || [];
      }
      
      // Update session state
      this.sessionState.turnCount = this.conversationHistory.length;
      
    } catch (error) {
      console.warn('Failed to load Ray memory:', error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.config.persistenceKey);
    } catch (error) {
      console.warn('Failed to clear Ray memory:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  startNewSession() {
    this.sessionState = {
      startTime: Date.now(),
      turnCount: 0,
      currentFocus: null,
      activeAnalysis: null,
      pendingQuestions: []
    };
    this.conversationHistory = [];
    this.clearFocus();
    this.saveToStorage();
  }

  getSessionStats() {
    return {
      duration: Date.now() - this.sessionState.startTime,
      turnCount: this.sessionState.turnCount,
      playersDiscussed: this.entityMemory.players.size,
      marketsAnalyzed: this.entityMemory.markets.size,
      currentFocus: this.sessionState.currentFocus
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FOLLOW-UP MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  addPendingQuestion(question) {
    this.sessionState.pendingQuestions.push({
      question,
      timestamp: Date.now()
    });
  }

  getNextPendingQuestion() {
    return this.sessionState.pendingQuestions.shift();
  }

  hasPendingQuestions() {
    return this.sessionState.pendingQuestions.length > 0;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getMemoryStats() {
    return {
      conversationTurns: this.conversationHistory.length,
      playersTracked: this.entityMemory.players.size,
      teamsTracked: this.entityMemory.teams.size,
      marketsTracked: this.entityMemory.markets.size,
      patternsStored: this.semanticMemory.patterns.size,
      insightsStored: this.semanticMemory.insights.length,
      cacheSize: this.analysisCache.size,
      sessionDuration: Date.now() - this.sessionState.startTime
    };
  }

  reset() {
    this.conversationHistory = [];
    this.entityMemory = {
      players: new Map(),
      teams: new Map(),
      markets: new Map(),
      lines: new Map()
    };
    this.sessionState = {
      startTime: Date.now(),
      turnCount: 0,
      currentFocus: null,
      activeAnalysis: null,
      pendingQuestions: []
    };
    this.analysisCache.clear();
    this.clearStorage();
  }

  // Export memory for debugging
  exportMemory() {
    return {
      conversation: this.conversationHistory,
      entities: {
        players: Array.from(this.entityMemory.players.entries()),
        teams: Array.from(this.entityMemory.teams.entries()),
        markets: Array.from(this.entityMemory.markets.entries()),
        lines: Array.from(this.entityMemory.lines.entries())
      },
      preferences: this.userPreferences,
      session: this.sessionState,
      semantic: {
        patterns: Array.from(this.semanticMemory.patterns.entries()),
        insights: this.semanticMemory.insights,
        corrections: this.semanticMemory.corrections
      },
      stats: this.getMemoryStats()
    };
  }
}

export default RayMemory;
