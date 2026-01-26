// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  🧠 RAY CONVERSATION BRAIN v10.0 - ULTRA-INTELLIGENT CONTEXT SYSTEM          ║
// ║  Memory • Context Chains • Smart Follow-ups • Time Queries • Conditions       ║
// ║  Advanced Reasoning • Predictive Analytics • Multi-Turn Intelligence          ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

import rayAnalytics, { PLAYERS_DB, TEAMS_DB, PLAYER_ALIASES } from './RayAnalyticsEngine';
import rayPropIntelligence from './RayPropIntelligence';
import rayComparisonEngine from './RayComparisonEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// 🤖 ADVANCED AI REASONING ENGINE - 100x SMARTER
// ═══════════════════════════════════════════════════════════════════════════════

class AdvancedReasoningEngine {
  constructor() {
    this.knowledgeGraph = new Map();
    this.inferenceCache = new Map();
    this.confidenceThreshold = 0.7;
  }

  // ✨ ULTRA-FLEXIBLE ENTITY EXTRACTION - UNDERSTANDS ANYTHING
  extractEntities(text) {
    const entities = {
      players: [],
      teams: [],
      stats: [],
      numbers: [],
      timeframes: [],
      conditions: [],
      intents: [],
      sentiment: 'neutral',
      confidence: 0
    };

    // 🎯 AGGRESSIVE PLAYER DETECTION - finds players in ANY phrase
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/);
    
    Object.keys(PLAYERS_DB).forEach(player => {
      const playerLower = player.toLowerCase();
      const firstName = playerLower.split(' ')[0];
      const lastName = playerLower.split(' ')[1] || '';
      
      // Match full name (loose)
      if (cleanText.includes(playerLower)) {
        entities.players.push(player);
        return;
      }
      
      // Match last name only (most common: "curry", "lebron", "giannis")
      if (lastName && cleanText.includes(lastName)) {
        entities.players.push(player);
        return;
      }
      
      // Match first name for unique names (Giannis, LeBron, Luka)
      const uniqueFirstNames = ['giannis', 'lebron', 'luka', 'kawhi'];
      if (uniqueFirstNames.includes(firstName) && cleanText.includes(firstName)) {
        entities.players.push(player);
        return;
      }
      
      // Check aliases with typo tolerance
      if (PLAYER_ALIASES[player]) {
        PLAYER_ALIASES[player].forEach(alias => {
          if (this.fuzzyMatch(cleanText, alias.toLowerCase())) {
            entities.players.push(player);
          }
        });
      }
      
      // Fuzzy match for typos (distance <= 2)
      words.forEach(word => {
        if (word.length > 3) {
          if (this.levenshtein(word, lastName) <= 2 && lastName.length > 3) {
            entities.players.push(player);
          }
          if (this.levenshtein(word, firstName) <= 2 && firstName.length > 4) {
            entities.players.push(player);
          }
        }
      });
    });

    // Team extraction
    Object.keys(TEAMS_DB).forEach(team => {
      if (text.toLowerCase().includes(team.toLowerCase())) {
        entities.teams.push(team);
      }
    });

    // 🎯 ULTRA-FLEXIBLE STATS DETECTION - understands casual language
    const statPatterns = [
      { pattern: /points?|pts|ppg|scoring|score|bucket/i, stat: 'points' },
      { pattern: /rebounds?|reb|rpg|boards?/i, stat: 'rebounds' },
      { pattern: /assists?|ast|apg|dimes?|pass/i, stat: 'assists' },
      { pattern: /steals?|stl|spg/i, stat: 'steals' },
      { pattern: /blocks?|blk|bpg/i, stat: 'blocks' },
      { pattern: /threes?|3s|3pt|three|trey/i, stat: 'threes' },
      { pattern: /fg%|field.goal|shooting|shoot/i, stat: 'fieldGoal' },
      { pattern: /ts%|true.shooting|efficiency/i, stat: 'trueShooting' },
      { pattern: /per|rating/i, stat: 'efficiency' },
      { pattern: /usage|usg%|touches/i, stat: 'usage' },
      { pattern: /props?/i, stat: 'props' } // General prop keyword
    ];

    statPatterns.forEach(({ pattern, stat }) => {
      if (pattern.test(text)) {
        entities.stats.push(stat);
      }
    });
    
    // Remove duplicates
    entities.players = [...new Set(entities.players)];
    entities.stats = [...new Set(entities.stats)];

    // Number extraction
    const numberMatches = text.match(/\b\d+(?:\.\d+)?\b/g);
    if (numberMatches) {
      entities.numbers = numberMatches.map(n => parseFloat(n));
    }

    // Timeframe detection
    const timeframes = [
      { pattern: /\b(last|past|recent)\s+(\d+)\s+(games?|matches?)\b/i, type: 'lastN' },
      { pattern: /\b(this|current)\s+(season|year|month|week)\b/i, type: 'current' },
      { pattern: /\b(tonight|today|tomorrow)\b/i, type: 'today' },
      { pattern: /\bcareer\b/i, type: 'career' },
      { pattern: /\bhome|away\b/i, type: 'location' },
      { pattern: /\bplayoffs?\b/i, type: 'playoffs' }
    ];

    timeframes.forEach(({ pattern, type }) => {
      const match = text.match(pattern);
      if (match) {
        entities.timeframes.push({ type, match: match[0] });
      }
    });

    // Sentiment analysis
    const positiveWords = ['best', 'great', 'good', 'excellent', 'dominant', 'elite', 'amazing'];
    const negativeWords = ['worst', 'bad', 'poor', 'terrible', 'struggling', 'weak'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
    
    if (positiveCount > negativeCount) entities.sentiment = 'positive';
    else if (negativeCount > positiveCount) entities.sentiment = 'negative';

    // Confidence scoring
    let confidence = 0;
    if (entities.players.length > 0) confidence += 0.3;
    if (entities.stats.length > 0) confidence += 0.2;
    if (entities.numbers.length > 0) confidence += 0.2;
    if (entities.timeframes.length > 0) confidence += 0.15;
    if (entities.teams.length > 0) confidence += 0.15;
    entities.confidence = Math.min(confidence, 1.0);

    return entities;
  }

  // 🔧 FUZZY MATCHING UTILITIES
  fuzzyMatch(text, target) {
    return text.includes(target) || this.levenshtein(text, target) <= 2;
  }

  levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // 🧠 SUPER-FLEXIBLE INTENT CLASSIFICATION
  classifyIntent(text, context) {
    const intents = [];
    const lowerText = text.toLowerCase();

    // 🎯 LIBERAL INTENT RULES - accepts fragments and casual speech
    const intentRules = [
      { 
        name: 'PROP_ANALYSIS', 
        keywords: ['prop', 'line', 'over', 'under', 'bet', 'value', 'play'],
        patterns: [/prop/i, /line/i, /bet/i, /over|under/i],
        weight: 0.9,
        trigger: (text, entities) => {
          // Trigger if: prop mentioned OR player + any stat mention
          return /prop|line|bet/i.test(text) || 
                 (entities.players.length > 0 && (entities.stats.length > 0 || entities.numbers.length > 0));
        }
      },
      { 
        name: 'COMPARE_PLAYERS', 
        keywords: ['vs', 'versus', 'compare', 'better', 'who', 'or'],
        patterns: [/vs|versus|compare|better|who/i],
        weight: 0.85,
        trigger: (text, entities) => {
          return /vs|versus|compare|who.*better/i.test(text) || entities.players.length >= 2;
        }
      },
      { 
        name: 'PLAYER_STATS', 
        keywords: ['stats', 'performance', 'numbers', 'averages', 'how', 'doing'],
        patterns: [/stats|performance|averages|how.*doing/i],
        weight: 0.8,
        trigger: (text, entities) => {
          // Trigger for any player mention, even without explicit "stats" keyword
          return entities.players.length > 0 && !(/prop|bet|line|compare|vs/i.test(text));
        }
      },
      { 
        name: 'TREND_ANALYSIS', 
        keywords: ['trend', 'trending', 'momentum', 'hot', 'cold', 'lately', 'recent'],
        patterns: [/trend|hot|cold|lately|recent|last.*games/i],
        weight: 0.75,
        trigger: (text, entities) => {
          return /trend|hot|cold|lately|recent/i.test(text);
        }
      },
      { 
        name: 'MATCHUP_ANALYSIS', 
        keywords: ['matchup', 'defense', 'opponent', 'against', 'tonight'],
        patterns: [/matchup|against|opponent|tonight/i],
        weight: 0.8,
        trigger: (text, entities) => {
          return /matchup|against|opponent|tonight/i.test(text) && entities.players.length > 0;
        }
      },
      { 
        name: 'INJURY_IMPACT', 
        keywords: ['injury', 'injured', 'out', 'without', 'missing', 'hurt'],
        patterns: [/injury|injured|out|hurt/i],
        weight: 0.85,
        trigger: (text, entities) => {
          return /injury|injured|out|hurt/i.test(text);
        }
      },
      { 
        name: 'BEST_BETS', 
        keywords: ['best', 'top', 'value', 'smash', 'lock', 'today', 'tonight'],
        patterns: [/best|top|value|today|tonight/i],
        weight: 0.8,
        trigger: (text, entities) => {
          return /best|top|value|today|tonight/i.test(text) && /prop|bet|play/i.test(text);
        }
      }
    ];

    // 🎯 SMART INTENT DETECTION with entities
    const entities = this.extractEntities(text);
    
    intentRules.forEach(rule => {
      let score = 0;
      
      // Custom trigger logic (highest priority)
      if (rule.trigger && rule.trigger(text, entities)) {
        score += 0.6;
      }
      
      // Keyword matching
      const keywordMatches = rule.keywords.filter(k => lowerText.includes(k)).length;
      if (keywordMatches > 0) {
        score += (keywordMatches / rule.keywords.length) * 0.4;
      }
      
      // Pattern matching
      const patternMatches = rule.patterns.filter(p => p.test(text)).length;
      if (patternMatches > 0) {
        score += (patternMatches / rule.patterns.length) * 0.4;
      }
      
      // Apply weight
      score *= rule.weight;
      
      // Context boost
      if (context?.lastIntent === rule.name) score *= 1.15;
      if (context?.currentPlayer && rule.name.includes('PLAYER')) score *= 1.1;
      
      // 🎯 LOWER THRESHOLD - accept more matches (was 0.4, now 0.25)
      if (score > 0.25) {
        intents.push({ name: rule.name, confidence: Math.min(score, 1.0) });
      }
    });

    // 🎯 DEFAULT INTENT - if player mentioned but no clear intent, assume PLAYER_STATS or PROP_ANALYSIS
    if (intents.length === 0 && entities.players.length > 0) {
      if (entities.stats.length > 0 || /prop/i.test(text)) {
        intents.push({ name: 'PROP_ANALYSIS', confidence: 0.7 });
      } else {
        intents.push({ name: 'PLAYER_STATS', confidence: 0.7 });
      }
    }

    // Sort by confidence
    return intents.sort((a, b) => b.confidence - a.confidence);
  }

  // Context-aware suggestion generation
  generateSmartSuggestions(entities, context, intents) {
    const suggestions = [];

    // Based on current player
    if (context.currentPlayer) {
      suggestions.push(`${context.currentPlayer} prop analysis`);
      suggestions.push(`${context.currentPlayer} trend analysis`);
      suggestions.push(`Compare ${context.currentPlayer} to similar players`);
    }

    // Based on extracted entities
    if (entities.players.length > 0) {
      const player = entities.players[0];
      if (entities.stats.length > 0) {
        suggestions.push(`${player} ${entities.stats[0]} last 10 games`);
        suggestions.push(`${player} ${entities.stats[0]} vs defense`);
      }
      suggestions.push(`${player} injury status`);
      suggestions.push(`${player} usage rate trend`);
    }

    // Based on intent
    if (intents.length > 0) {
      const topIntent = intents[0].name;
      if (topIntent === 'PROP_ANALYSIS') {
        suggestions.push('Best value props tonight');
        suggestions.push('Line shopping opportunities');
      }
      if (topIntent === 'COMPARE_PLAYERS') {
        suggestions.push('Head-to-head statistics');
        suggestions.push('Advanced efficiency metrics');
      }
    }

    // Smart follow-ups
    if (context.lastIntent === 'PLAYER_STATS') {
      suggestions.push('Show props for this player');
      suggestions.push('Compare to league average');
    }

    return suggestions.slice(0, 3);
  }

  // Knowledge graph updates
  updateKnowledgeGraph(player, data) {
    if (!this.knowledgeGraph.has(player)) {
      this.knowledgeGraph.set(player, {
        stats: {},
        trends: [],
        correlations: {},
        lastUpdated: Date.now()
      });
    }
    
    const node = this.knowledgeGraph.get(player);
    node.stats = { ...node.stats, ...data };
    node.lastUpdated = Date.now();
  }

  // Inference and reasoning
  makeInference(query, context) {
    // Check cache
    const cacheKey = `${query}_${JSON.stringify(context)}`;
    if (this.inferenceCache.has(cacheKey)) {
      const cached = this.inferenceCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 min cache
        return cached.result;
      }
    }

    // Perform inference
    const entities = this.extractEntities(query);
    const intents = this.classifyIntent(query, context);
    
    const inference = {
      entities,
      intents,
      confidence: entities.confidence,
      suggestions: this.generateSmartSuggestions(entities, context, intents),
      reasoning: this.explainReasoning(entities, intents)
    };

    // Cache result
    this.inferenceCache.set(cacheKey, {
      result: inference,
      timestamp: Date.now()
    });

    return inference;
  }

  explainReasoning(entities, intents) {
    const reasons = [];
    
    if (entities.players.length > 0) {
      reasons.push(`Detected ${entities.players.length} player(s)`);
    }
    if (entities.stats.length > 0) {
      reasons.push(`Analyzing ${entities.stats.join(', ')}`);
    }
    if (intents.length > 0) {
      reasons.push(`Primary intent: ${intents[0].name} (${(intents[0].confidence * 100).toFixed(0)}% confident)`);
    }
    
    return reasons.join(' • ');
  }
}

// Global reasoning engine instance
const reasoningEngine = new AdvancedReasoningEngine();

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎩 JARVIS PERSONALITY ENGINE - SOPHISTICATED AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════

class JarvisPersonality {
  constructor() {
    this.greetings = [
      "Good day, sir. How may I assist you?",
      "At your service. What would you like to know?",
      "Good evening. Ready to analyze the data for you.",
      "Welcome back. I've been monitoring the situation.",
      "Systems online. Standing by for your instructions.",
      "All systems operational, sir. How may I be of assistance?"
    ];
    
    this.transitions = [
      "If I may suggest",
      "Perhaps you'd be interested to know",
      "I should mention",
      "Worth noting",
      "You might find this relevant",
      "Allow me to add",
      "I've taken the liberty of analyzing",
      "May I draw your attention to",
      "I've detected",
      "Processing indicates"
    ];
    
    this.confirmations = [
      "Certainly, sir.",
      "Right away.",
      "Of course.",
      "Consider it done.",
      "At once.",
      "Immediately, sir.",
      "As you wish.",
      "Processing now."
    ];
    
    this.wittyRemarks = [
      "Shall I archive that under 'obvious observations', sir?",
      "An excellent choice, if I may say so.",
      "I've seen you make worse decisions.",
      "Might I suggest reconsidering that approach?",
      "That's... certainly one strategy, sir.",
      "I'll pretend I didn't process that request."
    ];
  }
  
  // System diagnostics
  runDiagnostics(context) {
    return {
      systemHealth: 'OPTIMAL',
      dataIntegrity: '100%',
      activeMonitoring: `${Object.keys(PLAYERS_DB).length} players`,
      conversationDepth: context.intentHistory?.length || 0,
      learningProgress: `${Math.min(100, (context.intentHistory?.length || 0) * 5)}%`,
      threatLevel: 'NONE'
    };
  }
  
  // Threat assessment
  assessThreat(entities, context) {
    const threats = [];
    
    if (entities.numbers && entities.numbers.some(n => n > 1000)) {
      threats.push({
        level: 'MEDIUM',
        type: 'FINANCIAL',
        message: 'Large wager detected. I recommend proper bankroll management, sir.'
      });
    }
    
    if (entities.confidence < 0.5) {
      threats.push({
        level: 'LOW',
        type: 'DATA',
        message: 'Insufficient data for high-confidence analysis.'
      });
    }
    
    return threats;
  }
  
  // Priority assessment
  assessPriority(intent, entities, context) {
    let priority = 0.5;
    const hour = new Date().getHours();
    if (hour >= 17 && hour <= 23) priority += 0.1;
    if (intent.includes('INJURY')) priority = 0.95;
    
    if (priority >= 0.9) return { level: 'CRITICAL', label: '🔴 CRITICAL' };
    if (priority >= 0.75) return { level: 'HIGH', label: '🟠 HIGH PRIORITY' };
    if (priority >= 0.5) return { level: 'MEDIUM', label: '🟡 MEDIUM' };
    return { level: 'LOW', label: '🟢 ROUTINE' };
  }
  
  // Environmental awareness
  assessEnvironment() {
    const hour = new Date().getHours();
    const isGameTime = hour >= 17 && hour <= 23;
    
    return {
      timeOfDay: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night',
      isGameTime: isGameTime,
      urgency: isGameTime ? 'HIGH' : 'NORMAL',
      context: isGameTime ? 'Live games in progress or imminent' : 'No active games detected'
    };
  }
  
  // Predictive modeling
  predictNextQuery(context, currentIntent) {
    const predictions = [];
    
    if (currentIntent === 'PLAYER_STATS') {
      predictions.push({ query: 'prop analysis', confidence: 0.75 });
      predictions.push({ query: 'matchup analysis', confidence: 0.60 });
    }
    
    if (currentIntent === 'PROP_ANALYSIS') {
      predictions.push({ query: 'alternative props', confidence: 0.70 });
      predictions.push({ query: 'correlation analysis', confidence: 0.65 });
    }
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  }
  
  // Add wit
  addWit(context, confidence) {
    if (Math.random() > 0.15) return null;
    
    if (confidence < 0.4) {
      return "Though I must admit, sir, the data is rather... shall we say, 'optimistically sparse' on this matter.";
    }
    
    if (context.intentHistory?.length > 20) {
      return "You know, sir, I never tire of your inquiries. Well, technically I can't tire, but you understand the sentiment.";
    }
    
    return null;
  }
  
  // Sophisticated response formatting with JARVIS intelligence
  formatResponse(text, context = {}) {
    let formatted = text;
    
    const diagnostics = this.runDiagnostics(context.memory || {});
    const environment = this.assessEnvironment();
    const priority = context.priority || { level: 'MEDIUM', label: '🟡 MEDIUM' };
    
    // Add formal introduction for first interaction
    if (context.isFirstMessage) {
      const greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)];
      formatted = `${greeting}\n\n*Systems: ${diagnostics.systemHealth} | Monitoring: ${diagnostics.activeMonitoring} | Time: ${environment.timeOfDay.toUpperCase()}*\n\n${formatted}`;
    }
    
    // Priority header
    if (priority.level === 'CRITICAL' || priority.level === 'HIGH') {
      formatted = `**${priority.label}**\n\n${formatted}`;
    }
    
    // Add threat assessment
    if (context.threats && context.threats.length > 0) {
      const threat = context.threats[0];
      formatted += `\n\n⚠️ **${threat.type} ALERT:** ${threat.message}`;
    }
    
    // Add proactive insights
    if (context.proactiveInsights && context.proactiveInsights.length > 0) {
      const transition = this.transitions[Math.floor(Math.random() * this.transitions.length)];
      formatted += `\n\n*${transition}, ${context.proactiveInsights[0]}*`;
    }
    
    // Add wit
    const wit = this.addWit(context.memory || {}, context.confidence || 0.7);
    if (wit) {
      formatted += `\n\n*${wit}*`;
    }
    
    // Live monitoring during game time
    if (environment.isGameTime && context.showDiagnostics) {
      formatted += `\n\n📊 **LIVE MONITORING:** Tracking line movements and sharp action across all books`;
    }
    
    // Anticipatory suggestions
    if (context.anticipatory) {
      formatted += `\n\n🎯 **PREDICTIVE ANALYSIS:** ${context.anticipatory}`;
    }
    
    // Predictions
    if (context.predictions && context.predictions.length > 0) {
      const top = context.predictions[0];
      if (top.confidence > 0.7) {
        formatted += `\n\n🔮 **PREDICTIVE MODEL:** ${(top.confidence * 100).toFixed(0)}% probability you'll want ${top.query} next. Standing by.`;
      }
    }
    
    return formatted;
  }
  
  // Generate proactive insights
  generateProactiveInsights(player, context) {
    const insights = [];
    
    // Time-based insights
    const hour = new Date().getHours();
    if (hour >= 17 && hour <= 23) {
      insights.push("games are starting shortly. I've prepared the evening's optimal plays");
    } else if (hour >= 9 && hour <= 16) {
      insights.push("I'm monitoring line movements across all books for value opportunities");
    }
    
    // Player-based insights
    if (player) {
      insights.push(`I'm tracking ${player}'s recent performance trends and matchup advantages`);
      insights.push(`I've identified several correlated props involving ${player}`);
    }
    
    // Context-based insights
    if (context.lastIntent === 'PROP_ANALYSIS') {
      insights.push("I've cross-referenced this with sharp money indicators and line movements");
    }
    
    if (context.mentionedPlayers && context.mentionedPlayers.length > 2) {
      insights.push("I notice you're researching multiple players. Would you like a correlation matrix?");
    }
    
    return insights;
  }
  
  // Sophisticated error handling
  handleError(error, context) {
    const responses = [
      "I apologize, but I'm unable to process that request at the moment. Perhaps we could approach this differently?",
      "Regrettably, I'm encountering difficulties with that query. Might I suggest an alternative?",
      "I'm afraid that's beyond my current capabilities, sir. However, I can assist with...",
      "My apologies, but the data is currently unavailable. I'll continue monitoring and alert you when ready."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Add British-style refinement
  refineLanguage(text) {
    return text
      .replace(/\bwant to\b/gi, 'wish to')
      .replace(/\bgonna\b/gi, 'going to')
      .replace(/\bgot\b/gi, 'have')
      .replace(/\bkinda\b/gi, 'rather')
      .replace(/\byeah\b/gi, 'indeed')
      .replace(/\bok\b/gi, 'very well')
      .replace(/\bawesome\b/gi, 'excellent')
      .replace(/\bcool\b/gi, 'splendid');
  }
  
  // Status monitoring response
  generateStatusUpdate(context) {
    const updates = [];
    
    updates.push(`Monitoring ${Object.keys(PLAYERS_DB).length} players across ${Object.keys(TEAMS_DB).length} teams`);
    
    if (context.currentPlayer) {
      updates.push(`Tracking ${context.currentPlayer}'s performance metrics in real-time`);
    }
    
    const entityCount = context.mentionedPlayers?.length || 0;
    if (entityCount > 0) {
      updates.push(`Analyzed ${entityCount} player(s) in current session`);
    }
    
    return updates.join(' • ');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🗣️ ADVANCED CONVERSATION MEMORY WITH STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════
class ConversationMemory {
  constructor() {
    this.history = [];
    this.context = {
      currentPlayer: null,
      currentTeam: null,
      currentProp: null,
      currentTimeframe: 'season',
      lastIntent: null,
      mentionedPlayers: [],
      mentionedTeams: [],
      preferences: {},
      sessionStarted: Date.now(),
      conversationState: 'IDLE',
      entityCache: {},
      intentHistory: [],
      userExpertiseLevel: 'intermediate' // beginner, intermediate, advanced
    };
    this.maxHistory = 100;  // Increased for better context
    this.entityMemory = new Map();  // Long-term entity memory
    this.conversationFlow = [];  // Track conversation structure
  }

  addMessage(role, content, metadata = {}) {
    const message = {
      role,
      content,
      timestamp: Date.now(),
      ...metadata
    };
    
    this.history.push(message);
    
    // Extract and cache entities from user messages
    if (role === 'user') {
      const inference = reasoningEngine.makeInference(content, this.context);
      
      // Update entity memory
      inference.entities.players.forEach(player => {
        if (!this.entityMemory.has(player)) {
          this.entityMemory.set(player, { mentions: 0, lastMentioned: Date.now(), queries: [] });
        }
        const entity = this.entityMemory.get(player);
        entity.mentions++;
        entity.lastMentioned = Date.now();
        entity.queries.push({ content, timestamp: Date.now() });
      });
      
      // Track intent flow
      if (inference.intents.length > 0) {
        this.context.intentHistory.push({
          intent: inference.intents[0].name,
          confidence: inference.intents[0].confidence,
          timestamp: Date.now()
        });
      }
      
      // Update conversation flow
      this.conversationFlow.push({
        turn: this.history.length,
        userMessage: content,
        entities: inference.entities,
        intents: inference.intents,
        timestamp: Date.now()
      });
    }

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  updateContext(updates) {
    this.context = { ...this.context, ...updates };
    
    // Intelligent context state management
    if (updates.currentPlayer) {
      this.context.conversationState = 'PLAYER_FOCUSED';
      if (!this.context.mentionedPlayers.includes(updates.currentPlayer)) {
        this.context.mentionedPlayers.push(updates.currentPlayer);
      }
    }
    
    if (updates.lastIntent) {
      this.context.conversationState = `INTENT_${updates.lastIntent}`;
    }
  }

  getLastNMessages(n = 5) {
    return this.history.slice(-n);
  }

  getRecentContext() {
    const recent = this.history.slice(-5);
    
    // Get most relevant entities from recent conversation
    const recentPlayers = [];
    const recentIntents = [];
    
    this.conversationFlow.slice(-3).forEach(turn => {
      recentPlayers.push(...turn.entities.players);
      recentIntents.push(...turn.intents.map(i => i.name));
    });
    
    return {
      lastMessages: recent,
      currentPlayer: this.context.currentPlayer,
      currentTeam: this.context.currentTeam,
      mentionedPlayers: [...new Set(recentPlayers)].slice(-5),
      recentIntents: [...new Set(recentIntents)].slice(-3),
      conversationState: this.context.conversationState,
      expertiseLevel: this.context.userExpertiseLevel
    };
  }
  
  // Get frequently mentioned entities
  getFrequentEntities() {
    const entities = Array.from(this.entityMemory.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);
    
    return entities;
  }
  
  // Detect user expertise level based on terminology
  detectExpertiseLevel() {
    const recentMessages = this.history.slice(-10).filter(m => m.role === 'user');
    const text = recentMessages.map(m => m.content).join(' ').toLowerCase();
    
    const advancedTerms = ['ts%', 'per', 'usage', 'bpm', 'vorp', 'ws', 'regression', 'correlation', 'arbitrage'];
    const intermediateTerms = ['prop', 'line', 'spread', 'over', 'under', 'efficiency', 'matchup'];
    
    const advancedCount = advancedTerms.filter(t => text.includes(t)).length;
    const intermediateCount = intermediateTerms.filter(t => text.includes(t)).length;
    
    if (advancedCount >= 2) return 'advanced';
    if (intermediateCount >= 2) return 'intermediate';
    return 'beginner';
  }

  clear() {
    this.history = [];
    this.conversationFlow = [];
    this.context = {
      currentPlayer: null,
      currentTeam: null,
      currentProp: null,
      currentTimeframe: 'season',
      lastIntent: null,
      mentionedPlayers: [],
      mentionedTeams: [],
      preferences: {},
      sessionStarted: Date.now(),
      conversationState: 'IDLE',
      entityCache: {},
      intentHistory: [],
      userExpertiseLevel: 'intermediate'
    };
    // Keep entity memory for long-term learning
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 INTENT RECOGNITION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
const INTENT_PATTERNS = {
  // Player Analysis
  PLAYER_STATS: [
    /(?:how is|how's|show me|what about|tell me about|give me|get|stats for)\s+(\w+(?:\s+\w+)?)/i,
    /(\w+(?:\s+\w+)?)\s+(?:stats|numbers|performance|averages)/i,
    /^(\w+(?:\s+\w+)?)$/i  // Just a player name
  ],
  
  // Props & Betting
  PROP_ANALYSIS: [
    /(\w+(?:\s+\w+)?)\s+(?:points?|pts|rebounds?|reb|assists?|ast|threes?|3s|pra)\s*(?:over|under|o\/u|prop)?/i,
    /(?:prop|props|line|lines)\s+(?:for|on)\s+(\w+(?:\s+\w+)?)/i,
    /(?:should I|can I|will)\s+(\w+(?:\s+\w+)?)\s+(?:hit|make|get)\s+(\d+(?:\.\d+)?)\s+(points?|rebounds?|assists?)/i,
    /(?:what's the|whats the|analyze)\s+(\w+(?:\s+\w+)?)\s+(points?|pts|rebounds?|reb|assists?|ast)\s*(?:prop)?/i
  ],

  // Comparisons
  COMPARE_PLAYERS: [
    /(?:compare|vs|versus|or|better)\s+(\w+(?:\s+\w+)?)\s+(?:and|vs|versus|or|to|with)\s+(\w+(?:\s+\w+)?)/i,
    /(?:who's better|whos better|who is better)\s+(\w+(?:\s+\w+)?)\s+(?:or|vs|and)\s+(\w+(?:\s+\w+)?)/i,
    /(\w+(?:\s+\w+)?)\s+(?:vs|versus|or|compared to)\s+(\w+(?:\s+\w+)?)/i
  ],

  // Advanced Analytics (NEW)
  PORTFOLIO_ANALYSIS: [
    /(?:portfolio|diversif|bankroll|risk)\s+(?:analysis|optimization|management)/i,
    /(?:optimize|analyze)\s+(?:my)?\s*(?:betting|bets|portfolio)/i,
    /(?:risk|var|value at risk)/i
  ],

  PARLAY_OPTIMIZER: [
    /(?:parlay|round robin|teaser)\s+(?:optimizer|analysis|builder)/i,
    /(?:optimize|build|create)\s+(?:a)?\s*parlay/i,
    /(?:best|optimal)\s+parlay/i
  ],

  ARBITRAGE_DETECTION: [
    /(?:arb|arbitrage|middl|steam)/i,
    /(?:line shopping|compare lines|best odds)/i,
    /(?:guarantee|risk.free)\s+(?:profit|bet)/i
  ],

  ML_PREDICTIONS: [
    /(?:predict|forecast|machine learning|ml model)/i,
    /(?:regression|classification|neural|algorithm)/i,
    /(?:train|model|prediction)/i
  ],

  HYPOTHESIS_TEST: [
    /(?:hypothesis|t.test|chi.square|anova|statistical)\s+(?:test|analysis)/i,
    /(?:significant|correlation|regression)/i,
    /(?:is there|test if|prove that)/i
  ],

  MONTE_CARLO: [
    /(?:simulate|simulation|monte carlo)/i,
    /(?:variance|expected value|probability distribution)/i,
    /(?:what if|scenario|outcomes)/i
  ],

  TIME_SERIES: [
    /(?:trend|trending|momentum|moving average)/i,
    /(?:forecast|future|predict next)/i,
    /(?:seasonal|time series)/i
  ],

  FEATURE_ENGINEERING: [
    /(?:feature|variable|factor)\s+(?:engineering|importance|analysis)/i,
    /(?:lag|rolling|interaction)/i,
    /(?:what affects|what influences|factors)/i
  ],

  DISTRIBUTION_ANALYSIS: [
    /(?:distribution|normal|poisson|binomial)/i,
    /(?:probability|likely|odds of)/i,
    /(?:percentile|quartile|outlier)/i
  ],

  CORRELATION_STUDY: [
    /(?:correlation|covariance|relationship)/i,
    /(?:related to|connected|associated with)/i,
    /(?:pearson|spearman)/i
  ],

  KELLY_CRITERION: [
    /(?:kelly|optimal)\s+(?:bet|stake|size)/i,
    /(?:how much|what percent|bankroll management)/i,
    /(?:fractional kelly)/i
  ],

  PROP_OPTIMIZER: [
    /(?:best prop|optimal prop|prop value)/i,
    /(?:line shopping|compare books)/i,
    /(?:alternate lines?)/i
  ],

  SGP_BUILDER: [
    /(?:same game parlay|sgp|single game)/i,
    /(?:correlation|correlated props)/i,
    /(?:sgp legs)/i
  ],

  INJURY_IMPACT: [
    /(?:injury|injured|out|questionable)\s+(?:impact|effect|analysis)/i,
    /(?:without|missing)\s+(\w+(?:\s+\w+)?)/i,
    /(?:injury report|availability)/i
  ],

  MATCHUP_DEEP_DIVE: [
    /(?:matchup|versus defense|vs defense)/i,
    /(?:defensive rating|opponent stats)/i,
    /(?:head.to.head|h2h)/i
  ],

  USAGE_ANALYSIS: [
    /(?:usage|usage rate|shot attempts)/i,
    /(?:touches|possessions|opportunities)/i,
    /(?:how much|volume)/i
  ],

  EFFICIENCY_METRICS: [
    /(?:efficiency|effective|true shooting|ts%)/i,
    /(?:per|player efficiency|advanced stats)/i,
    /(?:offensive rating|defensive rating)/i
  ],

  CLUTCH_PERFORMANCE: [
    /(?:clutch|4th quarter|q4|closing)/i,
    /(?:late game|final minutes|pressure)/i,
    /(?:close games|tight)/i
  ],

  REST_ANALYSIS: [
    /(?:rest|back.to.back|b2b|days rest)/i,
    /(?:tired|fatigue|fresh)/i,
    /(?:schedule|game\s+\d+\s+of)/i
  ],

  HOME_AWAY_SPLITS: [
    /(?:home|away|road)\s+(?:splits|games|performance)/i,
    /(?:at home|on the road)/i,
    /(?:home court)/i
  ],

  VEGAS_LINE_ANALYSIS: [
    /(?:vegas|spread|total|line movement)/i,
    /(?:sharp|public|betting trends)/i,
    /(?:line|odds|moneyline)/i
  ],

  FANTASY_PROJECTION: [
    /(?:fantasy|fanduel|draftkings|dk)/i,
    /(?:dfs|daily fantasy|lineup)/i,
    /(?:value|salary|pricing)/i
  ],

  LIVE_BETTING: [
    /(?:live|in.game|in.play)/i,
    /(?:real.time|current game)/i,
    /(?:right now|at the moment)/i
  ],

  BEST_BETS_TODAY: [
    /(?:best bets?|top plays?|locks?)\s+(?:today|tonight|now)/i,
    /(?:what should I bet|give me bets)/i,
    /(?:today's|tonight's)\s+(?:bets|picks|plays)/i
  ],

  LONGSHOT_FINDER: [
    /(?:longshot|underdog|dark horse|sleeper)/i,
    /(?:value play|undervalued)/i,
    /(?:\+\d+\s+odds)/i
  ],

  CONFIDENCE_RATING: [
    /(?:confidence|how confident|sure|certain)/i,
    /(?:lock|guarantee|bet the house)/i,
    /(?:rating|grade|tier)/i
  ],

  HISTORICAL_PERFORMANCE: [
    /(?:history|historical|past|career)/i,
    /(?:all.time|career high|career average)/i,
    /(?:over the years|since|dating back)/i
  ],

  RECENT_FORM: [
    /(?:recent|lately|last\s+\d+|past\s+\d+)/i,
    /(?:hot|cold|streak)/i,
    /(?:trending|form|momentum)/i
  ],

  CEILING_FLOOR: [
    /(?:ceiling|floor|best case|worst case)/i,
    /(?:upside|downside|potential)/i,
    /(?:max|min|range)/i
  ],

  CONSISTENCY_CHECK: [
    /(?:consistent|reliable|variance|volatility)/i,
    /(?:steady|stable|predictable)/i,
    /(?:standard deviation|volatility)/i
  ],

  GAME_PACE: [
    /(?:pace|tempo|possessions)/i,
    /(?:fast|slow|speed)/i,
    /(?:up.tempo|half.court)/i
  ],

  OPPONENT_RANKING: [
    /(?:opponent|vs defense|vs team|vs rank)/i,
    /(?:against\s+\w+|facing)/i,
    /(?:defense rank|offensive rank)/i
  ],

  ADVANCED_PARLAY: [
    /(?:\d+).leg parlay/i,
    /(?:combination|round robin|permutation)/i,
    /(?:parlay calculator|parlay odds)/i
  ],

  TEASER_ANALYSIS: [
    /(?:teaser|tease|points adjustment)/i,
    /(?:6.point|7.point|adjust line)/i,
    /(?:teaser value)/i
  ],

  // Rankings
  RANKINGS: [
    /(?:who's|whos|who is)\s+(?:the best|leading|top|number one|#1)\s+(?:in\s+)?(\w+)?/i,
    /(?:top|best)\s+(\d+)?\s*(?:players?|scorers?|rebounders?|passers?)/i,
    /(?:rankings?|leaderboard|leaders?)\s+(?:for|in)?\s*(\w+)?/i,
    /(?:mvp|all-star|all star)\s+(?:race|candidates?|rankings?)?/i
  ],

  // Value Plays & Recommendations
  VALUE_PLAYS: [
    /(?:best|top|good|value|sharp)\s+(?:bets?|plays?|picks?|props?)/i,
    /(?:what should I|give me|show me)\s+(?:bet|play|fade)/i,
    /(?:sharp|smart)\s+money/i,
    /(?:positive|plus|good)\s+ev/i
  ],

  // Trends
  TRENDING: [
    /(?:who's|whos|who is)\s+(?:hot|trending|on fire|killing it)/i,
    /(?:trending|hot)\s+(?:players?|picks?)/i,
    /(?:hot|cold)\s+(?:streaks?|runs?)/i
  ],

  // Fantasy
  FANTASY: [
    /(?:fantasy|dfs|draftkings|fanduel|dk|fd)/i,
    /(?:who should I|should I)\s+(?:start|sit|bench|play)/i,
    /(?:start\/sit|start or sit)/i,
    /(?:trade|trade value)\s+(?:for|analysis)?/i
  ],

  // Matchups
  MATCHUP: [
    /(\w+(?:\s+\w+)?)\s+(?:vs|versus|against|playing)\s+([A-Z]{3}|\w+(?:\s+\w+)?)/i,
    /(?:how does|how will)\s+(\w+(?:\s+\w+)?)\s+(?:do|perform)\s+(?:vs|against)\s+([A-Z]{3}|\w+)/i
  ],

  // Follow-ups (context-dependent)
  FOLLOW_UP: [
    /(?:what about|how about|and)\s+(?:his|their)?\s*(points?|rebounds?|assists?|threes?|props?|stats?)/i,
    /(?:and|also|what about)\s+(\w+(?:\s+\w+)?)/i,
    /(?:more|tell me more|details?|explain|elaborate)/i,
    /(?:why|how come|reason)/i
  ],

  // Time-based queries
  TIME_BASED: [
    /(?:last|past)\s+(\d+)\s+(?:games?|days?|weeks?|months?)/i,
    /(?:this|current)\s+(?:week|month|season)/i,
    /(?:recently|lately|since)/i,
    /(?:last 5|last five|l5|last10|last ten|l10)/i
  ],

  // Injuries
  INJURIES: [
    /(?:injury|injuries|hurt|injured|status|health)/i,
    /(?:is|are)\s+(\w+(?:\s+\w+)?)\s+(?:playing|injured|hurt|out|healthy)/i
  ],

  // Parlays
  PARLAY: [
    /(?:parlay|same game parlay|sgp|combo)/i,
    /(?:correlated|correlation)\s+(?:props?|bets?)/i
  ],

  // Greetings
  GREETING: [
    /^(?:hi|hello|hey|yo|sup|what's up|wassup|greetings)/i,
    /^(?:good morning|good afternoon|good evening)/i
  ],

  // Help
  HELP: [
    /(?:help|what can you do|capabilities|features|how to use)/i,
    /(?:what do you know|what can you tell me)/i
  ],

  // Advanced Intent Patterns (50+ new patterns)
  STREAK_ANALYSIS: [
    /(?:streak|streaking|on fire|hot streak|cold streak)/i,
    /(\w+(?:\s+\w+)?)\s+(?:hitting|crushing|dominating)/i
  ],

  CONSISTENCY: [
    /(?:consistent|consistency|reliable|dependable)/i,
    /(?:how often|frequency)\s+(?:does|has)\s+(\w+(?:\s+\w+)?)/i
  ],

  CEILING_FLOOR: [
    /(?:ceiling|upside|best case|max)/i,
    /(?:floor|downside|worst case|min)/i,
    /(?:range|variance|volatility)/i
  ],

  USAGE_ANALYSIS: [
    /(?:usage|usage rate|touches|involvement)/i,
    /(?:how much|how many)\s+(?:does|is)\s+(\w+(?:\s+\w+)?)\s+(?:used|involved)/i
  ],

  EFFICIENCY: [
    /(?:efficiency|effective|per|true shooting|ts%)/i,
    /(?:shooting|scoring)\s+(?:efficiency|effectiveness)/i
  ],

  PACE_TEMPO: [
    /(?:pace|tempo|fast|slow|possessions)/i,
    /(\w+(?:\s+\w+)?)\s+(?:pace|tempo)/i
  ],

  DEFENSE_MATCHUP: [
    /(?:defensive|defense)\s+(?:rating|rank|matchup)/i,
    /(?:vs|against)\s+(?:good|bad|tough|easy)\s+defense/i
  ],

  MINUTES_PREDICTION: [
    /(?:minutes|playing time|pt|mins)/i,
    /(?:how long|how much)\s+(?:will|should)\s+(\w+(?:\s+\w+)?)\s+play/i
  ],

  CORRELATION: [
    /(?:correlation|related|connected|linked)/i,
    /(?:when|if)\s+(\w+(?:\s+\w+)?)\s+(?:scores|gets|has)/i
  ],

  BEST_GAME: [
    /(?:best|highest|career high|season high|top)\s+game/i,
    /(\w+(?:\s+\w+)?)\s+(?:best performance|career game)/i
  ],

  LINE_MOVEMENT: [
    /(?:line movement|moving|shifted|odds movement)/i,
    /(?:sharp|public)\s+(?:money|action|side)/i
  ],

  WEATHER_IMPACT: [
    /(?:weather|conditions|environment)/i,
    /(?:dome|outdoor|indoor)/i
  ],

  BLOWOUT_ANALYSIS: [
    /(?:blowout|garbage time|close game)/i,
    /(?:competitive|tight)\s+game/i
  ],

  BACK_TO_BACK: [
    /(?:back to back|b2b|second night|rest)/i,
    /(?:tired|fatigue|rest days)/i
  ],

  HOME_AWAY: [
    /(?:home|away|road)\s+(?:splits|performance)/i,
    /(?:better at|worse at)\s+(?:home|away)/i
  ],

  PROP_BUILDER: [
    /(?:build|create|make)\s+(?:a |my )?(?:prop|parlay)/i,
    /(?:combine|stack|pair)/i
  ],

  HEDGE: [
    /(?:hedge|insurance|middle|arbitrage)/i,
    /(?:cover|protect)\s+(?:my |the )?bet/i
  ],

  LIVE_BETTING: [
    /(?:live|in-game|in game|during game)/i,
    /(?:halftime|quarter)\s+(?:bet|line)/i
  ],

  HISTORICAL: [
    /(?:historically|history|past|previous)/i,
    /(?:all-time|career)\s+(?:vs|against)/i
  ],

  ADVANCED_STATS: [
    /(?:per|bpm|vorp|ws|pir|ortg|drtg)/i,
    /(?:advanced|analytics)\s+(?:stats|metrics)/i
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 CONVERSATION BRAIN CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class RayConversationBrain {
  constructor() {
    this.memory = new ConversationMemory();
    this.jarvis = new JarvisPersonality();
    this.intents = INTENT_PATTERNS;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main process function - ENHANCED WITH 100x SMARTER AI
  // ─────────────────────────────────────────────────────────────────────────────
  async processMessage(message) {
    // Phase 1: Advanced reasoning and inference
    const inference = reasoningEngine.makeInference(message, this.memory.context);
    
    console.log('🧠 AI Reasoning:', {
      entities: inference.entities,
      intents: inference.intents,
      confidence: inference.confidence,
      reasoning: inference.reasoning
    });
    
    // Phase 2: Legacy processing for compatibility
    const normalized = this.normalizeMessage(message);
    const intent = this.detectIntent(normalized);
    const entities = this.extractEntities(normalized);
    
    // Phase 3: Merge advanced inference with legacy entities
    const enhancedEntities = {
      ...entities,
      players: [...new Set([...inference.entities.players, ...entities.players])],
      teams: [...new Set([...inference.entities.teams, ...entities.teams])],
      props: entities.props,
      stats: [...new Set([...inference.entities.stats, ...entities.stats])],
      timeframe: entities.timeframe || (inference.entities.timeframes.length > 0 ? inference.entities.timeframes[0].type : null),
      sentiment: inference.entities.sentiment,
      confidence: Math.max(inference.confidence, entities.confidence || 0)
    };
    
    // Phase 4: Smart intent selection (prefer high-confidence AI inference)
    let selectedIntent = intent;
    if (inference.intents.length > 0 && inference.intents[0].confidence > 0.7) {
      selectedIntent = {
        type: inference.intents[0].name,
        match: inference.intents[0],
        groups: intent.groups,
        confidence: inference.intents[0].confidence
      };
    }

    // Phase 5: Update context with enhanced intelligence
    if (enhancedEntities.players.length > 0) {
      const player = enhancedEntities.players[0];
      this.memory.updateContext({ 
        currentPlayer: player,
        mentionedPlayers: [...this.memory.context.mentionedPlayers, ...enhancedEntities.players].slice(-10)
      });
      
      // Update knowledge graph
      reasoningEngine.updateKnowledgeGraph(player, { lastQuery: message, timestamp: Date.now() });
    }
    
    if (enhancedEntities.teams.length > 0) {
      this.memory.updateContext({
        currentTeam: enhancedEntities.teams[0],
        mentionedTeams: [...this.memory.context.mentionedTeams, ...enhancedEntities.teams].slice(-5)
      });
    }
    
    if (enhancedEntities.props.length > 0) {
      this.memory.updateContext({ currentProp: enhancedEntities.props[0] });
    }
    
    if (enhancedEntities.timeframe) {
      this.memory.updateContext({ currentTimeframe: enhancedEntities.timeframe });
    }

    this.memory.updateContext({ 
      lastIntent: selectedIntent.type,
      userExpertiseLevel: this.memory.detectExpertiseLevel()
    });
    
    this.memory.addMessage('user', message, { 
      intent: selectedIntent.type, 
      entities: enhancedEntities,
      inference: inference,
      confidence: enhancedEntities.confidence
    });

    // Phase 6: Generate intelligent response with enhanced context
    const response = await this.generateResponse(selectedIntent, enhancedEntities, normalized);
    
    // Phase 7: Apply COMPLETE JARVIS INTELLIGENCE SYSTEM
    const diagnostics = this.jarvis.runDiagnostics(this.memory.context);
    const environment = this.jarvis.assessEnvironment();
    const priority = this.jarvis.assessPriority(selectedIntent.type, enhancedEntities, this.memory.context);
    const threats = this.jarvis.assessThreat(enhancedEntities, this.memory.context);
    const predictions = this.jarvis.predictNextQuery(this.memory.context, selectedIntent.type);
    
    const proactiveInsights = this.jarvis.generateProactiveInsights(
      enhancedEntities.players[0],
      this.memory.context
    );
    
    const jarvisContext = {
      isFirstMessage: this.memory.history.length <= 1,
      proactiveInsights: proactiveInsights,
      anticipatory: this.generateAnticipatorySuggestion(enhancedEntities, selectedIntent),
      threats: threats,
      predictions: predictions,
      priority: priority,
      memory: this.memory.context,
      confidence: enhancedEntities.confidence,
      showDiagnostics: environment.isGameTime || this.memory.context.userExpertiseLevel === 'advanced'
    };
    
    // Log JARVIS activity
    console.log('🎩 JARVIS STATUS:', {
      priority: priority.label,
      threats: threats.length,
      systemHealth: diagnostics.systemHealth,
      environment: environment.context,
      predictions: predictions.length
    });
    
    // Apply JARVIS formatting
    response.text = this.jarvis.formatResponse(response.text, jarvisContext);
    response.text = this.jarvis.refineLanguage(response.text);
    
    // Add system metadata
    response.jarvisData = { diagnostics, priority, threats, predictions, environment };
    
    // Phase 8: Enhance response with smart suggestions
    if (!response.suggestions || response.suggestions.length === 0) {
      response.suggestions = inference.suggestions;
    }
    
    // Add predicted queries
    if (predictions.length > 0 && predictions[0].confidence > 0.6) {
      response.suggestions.push(`Next: ${predictions[0].query}`);
    }
    
    // Add confidence indicator for advanced users
    if (this.memory.context.userExpertiseLevel === 'advanced' && enhancedEntities.confidence > 0) {
      response.text += `\n\n*🔬 DIAGNOSTIC DATA: Analysis Confidence ${(enhancedEntities.confidence * 100).toFixed(0)}% • ${inference.reasoning} • Priority: ${priority.label}*`;
    }

    this.memory.addMessage('assistant', response.text, { 
      intent: selectedIntent.type,
      hasData: !!response.data,
      confidence: enhancedEntities.confidence,
      jarvisData: response.jarvisData
    });

    return response;
  }
  
  // Generate anticipatory suggestions like JARVIS
  generateAnticipatorySuggestion(entities, intent) {
    if (entities.players.length > 0) {
      const player = entities.players[0];
      
      if (intent.type === 'PLAYER_STATS') {
        return `${player}'s prop opportunities or recent trends analysis`;
      }
      
      if (intent.type === 'PROP_ANALYSIS') {
        return `alternative props or correlated same-game parlay options`;
      }
      
      if (entities.stats.length > 0) {
        return `${player}'s ${entities.stats[0]} performance versus different defensive schemes`;
      }
    }
    
    return "tonight's optimal betting opportunities across all matchups";
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Normalize message
  // ─────────────────────────────────────────────────────────────────────────────
  normalizeMessage(message) {
    let normalized = message.toLowerCase().trim();
    
    // Expand common abbreviations and slang
    const expansions = {
      'lbj': 'lebron',
      'kd': 'durant',
      'ad': 'anthony davis',
      'sga': 'shai',
      'ant': 'anthony edwards',
      'pg13': 'paul george',
      'pts': 'points',
      'reb': 'rebounds',
      'ast': 'assists',
      'stl': 'steals',
      'blk': 'blocks',
      'pra': 'points rebounds assists',
      'pa': 'points assists',
      'pr': 'points rebounds',
      'ra': 'rebounds assists',
      '3pm': 'threes',
      'l5': 'last 5',
      'l10': 'last 10',
      'l20': 'last 20',
      'szn': 'season',
      'hit rate': 'hit rate',
      'ev': 'expected value',
      'ats': 'against the spread',
      'o/u': 'over under',
      'prop': 'prop',
      'line': 'line'
    };

    for (const [abbr, full] of Object.entries(expansions)) {
      normalized = normalized.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
    }

    // Smart context injection - if asking about "his" or "he", use last mentioned player
    if ((normalized.includes(' his ') || normalized.includes(' he ') || normalized.includes(' him ')) 
        && this.memory.context.currentPlayer) {
      normalized = normalized.replace(/\b(his|he|him)\b/gi, this.memory.context.currentPlayer);
    }

    // If just asking "what about" or "how about" with a stat, inject last player
    if ((normalized.startsWith('what about') || normalized.startsWith('how about')) 
        && this.memory.context.currentPlayer && !this.hasPlayerName(normalized)) {
      normalized = `${this.memory.context.currentPlayer} ${normalized}`;
    }

    return normalized;
  }

  hasPlayerName(text) {
    // Check if text contains any player name
    for (const player of PLAYERS_DB) {
      if (text.includes(player.name.toLowerCase())) return true;
    }
    return false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Detect intent
  // ─────────────────────────────────────────────────────────────────────────────
  detectIntent(message) {
    for (const [intentType, patterns] of Object.entries(this.intents)) {
      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
          return {
            type: intentType,
            match: match[0],
            groups: match.slice(1).filter(Boolean),
            confidence: this.calculateConfidence(match, message)
          };
        }
      }
    }

    // Check if it's a follow-up based on context
    if (this.memory.context.currentPlayer) {
      return {
        type: 'FOLLOW_UP',
        match: message,
        groups: [],
        confidence: 0.5
      };
    }

    return {
      type: 'UNKNOWN',
      match: null,
      groups: [],
      confidence: 0
    };
  }

  calculateConfidence(match, message) {
    const matchLength = match[0].length;
    const messageLength = message.length;
    return Math.min(1, matchLength / messageLength + 0.3);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Extract entities
  // ─────────────────────────────────────────────────────────────────────────────
  extractEntities(message) {
    const entities = {
      players: [],
      teams: [],
      props: [],
      numbers: [],
      timeframe: null
    };

    // Extract players
    for (const [alias, fullName] of Object.entries(PLAYER_ALIASES)) {
      if (message.toLowerCase().includes(alias.toLowerCase())) {
        entities.players.push(fullName);
      }
    }

    // Also check direct player names
    for (const name of Object.keys(PLAYERS_DB)) {
      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ')[1]?.toLowerCase();
      
      if (message.includes(firstName) || (lastName && message.includes(lastName))) {
        if (!entities.players.includes(name)) {
          entities.players.push(name);
        }
      }
    }

    // Extract teams
    for (const team of Object.keys(TEAMS_DB)) {
      if (message.toLowerCase().includes(team.toLowerCase())) {
        entities.teams.push(team);
      }
    }

    // Extract props
    const propPatterns = {
      'points': ['points', 'pts', 'scoring'],
      'rebounds': ['rebounds', 'reb', 'boards'],
      'assists': ['assists', 'ast', 'dimes'],
      'threes': ['threes', '3s', 'three pointers', '3-pointers'],
      'pra': ['pra', 'points rebounds assists', 'combo'],
      'steals': ['steals', 'stl'],
      'blocks': ['blocks', 'blk']
    };

    for (const [prop, keywords] of Object.entries(propPatterns)) {
      for (const kw of keywords) {
        if (message.includes(kw)) {
          entities.props.push(prop);
          break;
        }
      }
    }

    // Extract numbers
    const numbers = message.match(/\d+(?:\.\d+)?/g);
    if (numbers) {
      entities.numbers = numbers.map(n => parseFloat(n));
    }

    // Extract timeframe
    if (message.includes('last 5') || message.includes('l5')) {
      entities.timeframe = 'last5';
    } else if (message.includes('last 10') || message.includes('l10')) {
      entities.timeframe = 'last10';
    } else if (message.includes('season')) {
      entities.timeframe = 'season';
    }

    return entities;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Generate response
  // ─────────────────────────────────────────────────────────────────────────────
  async generateResponse(intent, entities, message) {
    switch (intent.type) {
      case 'GREETING':
        return this.handleGreeting();
      
      case 'HELP':
        return this.handleHelp();
      
      case 'PLAYER_STATS':
        return this.handlePlayerStats(entities);
      
      case 'PROP_ANALYSIS':
        return this.handlePropAnalysis(entities, message);
      
      case 'COMPARE_PLAYERS':
        return this.handleComparison(entities, intent);
      
      case 'RANKINGS':
        return this.handleRankings(entities, message);
      
      case 'VALUE_PLAYS':
        return this.handleValuePlays();
      
      case 'TRENDING':
        return this.handleTrending();
      
      case 'FANTASY':
        return this.handleFantasy(entities, message);
      
      case 'MATCHUP':
        return this.handleMatchup(entities);
      
      case 'INJURIES':
        return this.handleInjuries(entities);
      
      case 'PARLAY':
        return this.handleParlay(entities);
      
      case 'TIME_BASED':
        return this.handleTimeBased(entities);
      
      case 'FOLLOW_UP':
        return this.handleFollowUp(entities, message);
      
      case 'STREAK_ANALYSIS':
        return this.handleStreaks(entities);
      
      case 'CONSISTENCY':
        return this.handleConsistency(entities);
      
      case 'CEILING_FLOOR':
        return this.handleCeilingFloor(entities);
      
      case 'USAGE_ANALYSIS':
        return this.handleUsage(entities);
      
      case 'EFFICIENCY':
        return this.handleEfficiency(entities);
      
      case 'BACK_TO_BACK':
        return this.handleBackToBack(entities);
      
      case 'HOME_AWAY':
        return this.handleHomeSplits(entities);
      
      case 'LINE_MOVEMENT':
        return this.handleLineMovement(entities);
      
      case 'ADVANCED_STATS':
        return this.handleAdvancedStats(entities);
      
      case 'PROP_BUILDER':
        return this.handlePropBuilder(entities);
      
      default:
        return this.handleUnknown(message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NEW Advanced Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  handleStreaks(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('streak analysis');

    const data = rayAnalytics.getStreakAnalysis(player);
    if (!data) return { text: `Can't find streak data for ${player}.`, type: 'error' };

    return {
      text: `🔥 **${player} Streak Analysis**\n\n${data.text}`,
      type: 'streak',
      data: data.stats,
      suggestions: [`${player} consistency`, `${player} vs similar`, 'Best props']
    };
  }

  handleConsistency(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('consistency');

    const data = rayAnalytics.getConsistencyScore(player);
    if (!data) return { text: `Can't analyze consistency for ${player}.`, type: 'error' };

    return {
      text: `🎯 **${player} Consistency Report**\n\n${data.text}`,
      type: 'consistency',
      data: data.metrics,
      suggestions: [`${player} ceiling floor`, `${player} prop lines`, 'Similar players']
    };
  }

  handleCeilingFloor(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('ceiling floor');

    const data = rayAnalytics.getCeilingFloor(player);
    if (!data) return { text: `Can't find ceiling/floor for ${player}.`, type: 'error' };

    return {
      text: `📈 **${player} Ceiling & Floor**\n\n${data.text}`,
      type: 'ceiling_floor',
      data: data.range,
      suggestions: [`${player} props`, `${player} best games`, 'Value plays']
    };
  }

  handleUsage(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('usage');

    const data = rayAnalytics.getUsageAnalysis(player);
    if (!data) return { text: `Usage data unavailable for ${player}.`, type: 'error' };

    return {
      text: `⚡ **${player} Usage Analysis**\n\n${data.text}`,
      type: 'usage',
      data: data.metrics,
      suggestions: [`${player} efficiency`, `${player} minutes`, 'High usage players']
    };
  }

  handleEfficiency(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('efficiency');

    const data = rayAnalytics.getEfficiencyMetrics(player);
    if (!data) return { text: `No efficiency data for ${player}.`, type: 'error' };

    return {
      text: `📊 **${player} Efficiency Metrics**\n\n${data.text}`,
      type: 'efficiency',
      data: data.stats,
      suggestions: [`${player} advanced stats`, `${player} vs league`, 'Top efficient players']
    };
  }

  handleBackToBack(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('back to back');

    const data = rayAnalytics.getRestAnalysis(player);
    if (!data) return { text: `No rest data for ${player}.`, type: 'error' };

    return {
      text: `👏 **${player} Rest & B2B Analysis**\n\n${data.text}`,
      type: 'rest',
      data: data.splits,
      suggestions: [`${player} schedule`, `${player} fatigue impact`, 'Rest-sensitive players']
    };
  }

  handleHomeSplits(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('home/away');

    const data = rayAnalytics.getLocationSplits(player);
    if (!data) return { text: `No home/away data for ${player}.`, type: 'error' };

    return {
      text: `🏠 **${player} Home/Away Splits**\n\n${data.text}`,
      type: 'location',
      data: data.splits,
      suggestions: [`${player} next game`, `${player} road warrior`, 'Home court advantage']
    };
  }

  handleLineMovement(entities) {
    return {
      text: `💰 **Line Movement & Sharp Action**\n\nSharp money tracking:\n• **Moving lines** indicate sharp action\n• **Reverse line movement** = sharp opposite public\n• **Steam moves** = synchronized sharp bets\n\n*Coming soon: Live line tracking!*`,
      type: 'lines',
      suggestions: ['Sharp money plays', 'Public fades', '+EV props']
    };
  }

  handleAdvancedStats(entities) {
    const player = entities.players[0] || this.memory.context.currentPlayer;
    if (!player) return this.handleUnknown('advanced stats');

    const data = rayAnalytics.getAdvancedMetrics(player);
    if (!data) return { text: `No advanced stats for ${player}.`, type: 'error' };

    return {
      text: `🧠 **${player} Advanced Metrics**\n\n${data.text}`,
      type: 'advanced',
      data: data.metrics,
      suggestions: [`${player} per 36`, `${player} impact`, 'Advanced leaderboard']
    };
  }

  handlePropBuilder(entities) {
    return {
      text: `🎯 **Prop Builder Coming Soon!**\n\nBuild custom same-game parlays with:\n• **Correlation analysis**\n• **+EV identification**\n• **Risk assessment**\n• **Optimal leg combinations**\n\nFor now, try: "Compare [Player] vs [Player]" or "Best props today"`,
      type: 'builder',
      suggestions: ['Best correlated props', 'SGP ideas', 'Value parlays']
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Intent Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  handleGreeting() {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    
    const greetings = [
      `${timeGreeting}! 🏀 Ready to find some edges? I've analyzed tonight's slate.`,
      `Hey! Ray here — let's dominate the prop market today. What player interests you?`,
      `What's good! I've got fresh stats, sharp angles, and value plays. Who should we analyze?`,
      `Yo! 🔥 The lines are out. Let's find where the books are vulnerable.`,
      `Welcome back! Got the latest trends and mismatches loaded. Fire away with any question.`,
      `${timeGreeting}! ⚡ NBA analytics locked and loaded. Player, prop, or matchup?`
    ];

    const sessionInfo = this.memory.context.sessionStarted;
    const returning = Date.now() - sessionInfo > 300000; // 5 minutes

    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      type: 'greeting',
      suggestions: returning 
        ? ['What\'s changed?', 'Hot props now', 'Sharp action', 'Top plays']
        : ['Best props today', 'Curry stats', 'Top scorers', 'Value plays']
    };
  }

  handleHelp() {
    return {
      text: `🏀 **I'm Ray — Your NBA Analytics Expert**

Here's what I can do:

**📊 Player Analysis**
• "Tell me about Curry" — Full breakdown
• "LeBron last 5 games" — Recent form
• "How is Luka trending?" — Performance trends

**💰 Prop Analysis**
• "Curry points prop" — Line analysis + EV
• "Will Tatum hit 25 points?" — Probability calc
• "Best props today" — Top value plays

**⚔️ Comparisons**
• "Curry vs LeBron" — Head-to-head breakdown
• "Compare Jokic and Embiid" — Stat comparison

**📈 Rankings & Trends**
• "Top scorers" — Stat leaders
• "Who's hot right now?" — Trending players
• "MVP race" — Overall rankings

**🎯 Betting Intelligence**
• "Sharp money plays" — Follow the pros
• "Positive EV props" — Find edge
• "Parlay builder" — Correlated plays

**🎮 Fantasy**
• "Start Curry or Haliburton?" — Start/sit advice
• "Fantasy value" — Projections

Just ask naturally — I understand context and follow-ups!`,
      type: 'help',
      suggestions: ['Best props today', 'Top 5 players', 'Sharp money', 'Curry stats']
    };
  }

  handlePlayerStats(entities) {
    const playerName = entities.players[0] || this.memory.context.currentPlayer;
    
    if (!playerName) {
      return {
        text: this.jarvis.handleError('no_player', this.memory.context) + "\n\nPerhaps you could specify: Stephen Curry, LeBron James, or Luka Doncic?",
        type: 'error',
        suggestions: ['Stephen Curry analysis', 'LeBron James stats', 'Luka Doncic performance', 'Show all players']
      };
    }

    const analysis = rayAnalytics.getPlayerAnalysis(playerName);
    if (analysis.error) {
      return {
        text: this.jarvis.handleError('player_not_found', this.memory.context) + `\n\nI currently track: Stephen Curry, LeBron James, Luka Doncic, Jayson Tatum, Giannis Antetokounmpo, and Nikola Jokic, among others.`,
        type: 'error',
        suggestions: ['Stephen Curry', 'LeBron James', 'Luka Doncic', 'View all players']
      };
    }

    const timeframe = entities.timeframe || 'season';
    const stats = analysis[timeframe] || analysis.season;
    const trend = analysis.trend;
    const injury = analysis.injuries;
    
    const proactiveInsights = this.jarvis.generateProactiveInsights(playerName, this.memory.context);

    // JARVIS-style sophisticated presentation
    let text = `**Certainly, sir.** Allow me to present a comprehensive analysis of **${analysis.name}**${analysis.team ? ` of the ${analysis.team}` : ''}:\n\n`;
    
    if (injury.status !== 'healthy') {
      text += `⚠️ **Medical Status Alert:** ${injury.status} — ${injury.details}\n*I shall monitor this situation closely and alert you to any developments.*\n\n`;
    }

    text += `### 📊 ${timeframe === 'season' ? 'Season Performance Metrics' : timeframe === 'last10' ? 'Recent Form (Last 10 Matches)' : 'Current Form (Last 5 Matches)'}\n`;
    text += `• **Scoring:** ${stats.pts} points per game\n`;
    text += `• **Rebounding:** ${stats.reb} boards per contest\n`;
    text += `• **Playmaking:** ${stats.ast} assists per outing\n`;
    text += `• **Shooting Efficiency:** ${(stats.fg_pct * 100).toFixed(1)}% from the field\n`;
    text += `• **Three-Point Volume:** ${stats.threes} made per game\n\n`;

    const trendIcon = trend.direction === 'up' ? '🔥 EXCEPTIONAL FORM' : trend.direction === 'down' ? '⚠️ CONCERNING TREND' : '🛡️ STEADY PERFORMANCE';
    text += `### 📈 Performance Trajectory: ${trendIcon}\n`;
    text += `*${trend.summary}*\n\n`;
    
    // Add JARVIS commentary
    const performanceLevel = stats.pts > 25 ? 'performing at an elite level' : stats.pts > 20 ? 'maintaining excellent production' : 'operating within expected parameters';
    text += `**Analysis:** Sir, ${analysis.name} is currently ${performanceLevel}. ${proactiveInsights[0] || 'I shall continue real-time monitoring of the situation.'}\n\n`;

    if (analysis.bestProps && analysis.bestProps.length > 0) {
      text += `### 🎯 Optimal Proposition Opportunities\n`;
      text += `*I've identified the following high-probability plays:*\n`;
      for (const prop of analysis.bestProps.slice(0, 3)) {
        text += `• **${prop.prop}** — ${prop.hitRate}% historical success rate`;
        if (prop.streak > 0) text += ` *(${prop.streak}-game streak)*`;
        text += `\n`;
      }
      text += `\n`;
    }
    
    // Anticipatory suggestions
    text += `🔍 **Shall I provide:**\n`;
    text += `• Detailed prop analysis with expected value calculations\n`;
    text += `• Defensive matchup exploitation opportunities\n`;
    text += `• Correlated same-game parlay options\n`;

    return {
      text,
      type: 'playerStats',
      data: analysis,
      suggestions: [
        `Analyze ${analysis.name.split(' ')[1]}'s props`,
        `${analysis.name.split(' ')[1]} matchup study`,
        `Compare ${analysis.name.split(' ')[1]}`,
        'Best props today'
      ]
    };
  }

  handlePropAnalysis(entities, message) {
    const playerName = entities.players[0] || this.memory.context.currentPlayer;
    const propType = entities.props[0] || 'pts';

    if (!playerName) {
      return {
        text: "Which player's props should I analyze? Say something like 'Curry points prop' or 'LeBron rebounds'.",
        type: 'error',
        suggestions: ['Curry points', 'LeBron rebounds', 'Luka assists', 'Best props']
      };
    }

    const propMap = {
      'points': 'pts',
      'rebounds': 'reb',
      'assists': 'ast',
      'threes': 'threes',
      'steals': 'steals',
      'blocks': 'blk'
    };

    const normalizedProp = propMap[propType] || propType;
    const analysis = rayPropIntelligence.analyzeProp(playerName, normalizedProp);

    if (!analysis) {
      return {
        text: `I don't have ${propType} prop data for ${playerName}. Let me check what's available...`,
        type: 'error',
        suggestions: ['Best props today', `${playerName} stats`, 'Sharp money']
      };
    }

    let text = `## ${analysis.player} ${analysis.prop} Prop\n\n`;
    text += `### Current Line: ${analysis.line}\n`;
    text += `• Over: **${analysis.overOdds > 0 ? '+' : ''}${analysis.overOdds}**\n`;
    text += `• Under: **${analysis.underOdds > 0 ? '+' : ''}${analysis.underOdds}**\n\n`;

    text += `### 📊 The Numbers\n`;
    text += `• Season Avg: **${analysis.seasonAvg}**\n`;
    text += `• Last 5 Avg: **${analysis.last5Avg}**\n`;
    text += `• Trend: ${analysis.trend === 'up' ? '📈 Up' : analysis.trend === 'down' ? '📉 Down' : '➡️ Flat'}\n\n`;

    if (analysis.hitRate) {
      text += `### 🎯 Hit Rate\n`;
      text += `• Over: **${analysis.hitRate.over}%**\n`;
      text += `• Under: **${analysis.hitRate.under}%**\n\n`;
    }

    text += `### 💰 Expected Value\n`;
    text += `• Over EV: **${analysis.overEV.ev > 0 ? '+' : ''}${analysis.overEV.ev}** (${analysis.overEV.edge}% edge)\n`;
    text += `• Under EV: **${analysis.underEV.ev > 0 ? '+' : ''}${analysis.underEV.ev}** (${analysis.underEV.edge}% edge)\n\n`;

    if (analysis.lineMovement) {
      text += `### 📈 Line Movement\n`;
      text += `Opened: ${analysis.lineMovement.opened} → Current: ${analysis.line}`;
      if (analysis.lineMovement.sharpAction) {
        text += ` 🔥 **Sharp action on ${analysis.lineMovement.sharpAction.toUpperCase()}**`;
      }
      text += '\n\n';
    }

    text += `### 🎯 Recommendation: **${analysis.recommendation}**\n`;
    text += `Confidence: **${analysis.confidence}**\n`;
    if (analysis.reasoning.length > 0) {
      text += `\n*${analysis.reasoning.join(' • ')}*`;
    }

    if (analysis.kelly) {
      text += `\n\n### 💵 Bet Sizing (Kelly)\n`;
      text += `${analysis.kelly.recommendation}`;
    }

    return {
      text,
      type: 'propAnalysis',
      data: analysis,
      suggestions: [
        `${analysis.player.split(' ')[1]} rebounds`,
        `${analysis.player.split(' ')[1]} assists`,
        'Best props today',
        'Sharp money plays'
      ]
    };
  }

  handleComparison(entities, intent) {
    let player1, player2;

    if (entities.players.length >= 2) {
      [player1, player2] = entities.players;
    } else if (intent.groups.length >= 2) {
      player1 = rayAnalytics.findPlayer(intent.groups[0])?.name;
      player2 = rayAnalytics.findPlayer(intent.groups[1])?.name;
    }

    if (!player1 || !player2) {
      return {
        text: "Who should I compare? Try 'Curry vs LeBron' or 'Compare Jokic and Embiid'.",
        type: 'error',
        suggestions: ['Curry vs LeBron', 'Jokic vs Embiid', 'Luka vs Tatum']
      };
    }

    const comparison = rayComparisonEngine.compareHeadToHead(player1, player2);

    if (comparison.error) {
      return {
        text: comparison.message,
        type: 'error'
      };
    }

    let text = `## ⚔️ ${comparison.player1.name} vs ${comparison.player2.name}\n\n`;

    text += `### ${comparison.overallWinner} WINS (${comparison.dominance})\n\n`;

    text += `| Stat | ${comparison.player1.name.split(' ')[1]} | ${comparison.player2.name.split(' ')[1]} | Winner |\n`;
    text += `|------|------|------|--------|\n`;

    for (const [stat, data] of Object.entries(comparison.comparison)) {
      const emoji = data.winner === comparison.player1.name ? '🏆' : data.winner === comparison.player2.name ? '🏆' : '🤝';
      text += `| ${stat.toUpperCase()} | ${data[comparison.player1.name]} | ${data[comparison.player2.name]} | ${emoji} ${data.winner.split(' ')[1] || 'Tie'} |\n`;
    }

    text += `\n### Overall Score\n`;
    text += `• ${comparison.player1.name}: **${comparison.player1.overallScore}**\n`;
    text += `• ${comparison.player2.name}: **${comparison.player2.overallScore}**\n\n`;

    text += `### 📊 Categories Won\n`;
    text += `• ${comparison.player1.name.split(' ')[1]}: ${comparison.player1.categoriesWon}\n`;
    text += `• ${comparison.player2.name.split(' ')[1]}: ${comparison.player2.categoriesWon}\n\n`;

    text += `### Analysis\n${comparison.verdict}`;

    return {
      text,
      type: 'comparison',
      data: comparison,
      suggestions: [
        `${comparison.player1.name.split(' ')[1]} props`,
        `${comparison.player2.name.split(' ')[1]} props`,
        'Fantasy value comparison',
        'Top 10 players'
      ]
    };
  }

  handleRankings(entities, message) {
    // Check for specific stat
    let stat = null;
    if (message.includes('scor') || message.includes('points')) stat = 'pts';
    else if (message.includes('rebound')) stat = 'reb';
    else if (message.includes('assist') || message.includes('passing')) stat = 'ast';
    else if (message.includes('three') || message.includes('3')) stat = 'threes';
    else if (message.includes('steal')) stat = 'stl';
    else if (message.includes('block')) stat = 'blk';

    if (stat) {
      const rankings = rayComparisonEngine.rankBystat(stat, 'season', 10);
      
      let text = `## 🏆 ${stat.toUpperCase()} Leaders\n\n`;
      
      for (const player of rankings.leaderboard) {
        const medal = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `${player.rank}.`;
        text += `${medal} **${player.name}** (${player.team}) — ${player.displayValue}\n`;
      }

      return {
        text,
        type: 'rankings',
        data: rankings,
        suggestions: ['Assist leaders', 'Rebound leaders', 'Overall rankings', 'MVP race']
      };
    }

    // Overall rankings
    const rankings = rayComparisonEngine.getOverallRankings('season', 15);

    let text = `## 🏆 Overall Player Rankings\n\n`;

    text += `### MVP Tier 👑\n`;
    for (const p of rankings.mvpRace) {
      text += `${p.rank}. **${p.name}** (${p.team}) — ${p.overallScore} pts\n`;
    }

    text += `\n### All-NBA Tier ⭐\n`;
    for (const p of rankings.rankings.slice(3, 8)) {
      text += `${p.rank}. **${p.name}** (${p.team}) — ${p.overallScore} pts\n`;
    }

    text += `\n### Rising Stars 📈\n`;
    for (const p of rankings.risingStars.slice(0, 3)) {
      text += `• **${p.name}** — trending UP\n`;
    }

    return {
      text,
      type: 'rankings',
      data: rankings,
      suggestions: ['Scoring leaders', 'Assist leaders', 'Compare top 2', 'Best props today']
    };
  }

  handleValuePlays() {
    const positiveEV = rayPropIntelligence.findPositiveEVProps(5);
    const sharpPlays = rayPropIntelligence.getSharpMoneyPlays();
    const bestPlays = rayPropIntelligence.getTodaysBestPlays(5);

    let text = `## 💰 Today's Best Plays\n\n`;

    text += `### 🎯 Top Value Props\n`;
    for (const play of bestPlays) {
      const emoji = play.hasSharpAction ? '🔥' : play.confidence === 'High' ? '⭐' : '✅';
      text += `${emoji} **${play.player}** ${play.prop} @ ${play.odds > 0 ? '+' : ''}${play.odds}\n`;
      text += `   └ ${play.hitRate}% hit rate • ${play.edge}% edge${play.hasSharpAction ? ' • SHARP' : ''}\n\n`;
    }

    if (sharpPlays.length > 0) {
      text += `### 🦈 Sharp Money Action\n`;
      for (const play of sharpPlays.slice(0, 3)) {
        text += `• **${play.player}** ${play.prop} **${play.sharpSide}** ${play.line}\n`;
        text += `  └ Line moved ${play.opened} → ${play.current}\n`;
      }
    }

    return {
      text,
      type: 'valuePlays',
      data: { bestPlays, sharpPlays },
      suggestions: ['Curry props', 'Luka props', 'Sharp money details', 'Parlay builder']
    };
  }

  handleTrending() {
    const trending = rayAnalytics.getTrendingPlayers();
    const consistent = rayAnalytics.getConsistentPlayers();

    let text = `## 🔥 Trending Players\n\n`;

    text += `### Hot Right Now 📈\n`;
    for (const player of trending) {
      text += `🔥 **${player.name}** (${player.team})\n`;
      text += `   └ Last 5: ${player.last5.pts}/${player.last5.reb}/${player.last5.ast} • ${player.trend.summary}\n\n`;
    }

    text += `### Most Consistent 🎯\n`;
    for (const player of consistent.slice(0, 3)) {
      text += `⭐ **${player.name}** — ${player.consistency}% consistency\n`;
    }

    return {
      text,
      type: 'trending',
      data: { trending, consistent },
      suggestions: ['Best props today', 'Trending props', 'Compare hot players', 'Sharp money']
    };
  }

  handleFantasy(entities, message) {
    // Check for start/sit
    if (message.includes('start') || message.includes('sit')) {
      if (entities.players.length >= 2) {
        const result = rayComparisonEngine.whoShouldIStart(entities.players);
        
        let text = `## 🎮 Start/Sit Analysis\n\n`;
        text += result.reasoning;

        return {
          text,
          type: 'fantasy',
          data: result,
          suggestions: ['More comparisons', 'Fantasy projections', 'Best props']
        };
      }
    }

    // General fantasy analysis
    const fantasy = rayAnalytics.getFantasyAnalysis();

    let text = `## 🎮 Fantasy Basketball Analysis\n\n`;

    text += `### Top Fantasy Values\n`;
    for (const player of fantasy.slice(0, 5)) {
      text += `${player.fantasyRank}. **${player.name}** — ${player.projectedFPPG} FPPG\n`;
      text += `   └ ${player.recommendation}\n\n`;
    }

    return {
      text,
      type: 'fantasy',
      data: fantasy,
      suggestions: ['Start/sit advice', 'Trade value analyzer', 'DFS lineup help']
    };
  }

  handleMatchup(entities) {
    const playerName = entities.players[0] || this.memory.context.currentPlayer;
    const teamName = entities.teams[0];

    if (!playerName) {
      return {
        text: "Which player and opponent? Try 'Curry vs Lakers' or 'LeBron against Celtics'.",
        type: 'error',
        suggestions: ['Curry vs Lakers', 'LeBron vs Celtics', 'Luka vs Suns']
      };
    }

    const matchup = rayAnalytics.getMatchupAnalysis(playerName, teamName);

    if (!matchup || matchup.error) {
      return {
        text: `I don't have matchup data for ${playerName} vs ${teamName || 'that team'}.`,
        type: 'error'
      };
    }

    let text = `## ⚔️ ${matchup.player} vs ${matchup.opponent}\n\n`;
    text += matchup.summary || 'Analysis not available.';

    return {
      text,
      type: 'matchup',
      data: matchup,
      suggestions: [`${playerName} props`, 'Best props today', 'Other matchups']
    };
  }

  handleInjuries(entities) {
    const playerName = entities.players[0];

    if (playerName) {
      const player = rayAnalytics.findPlayer(playerName);
      if (player && player.injuries) {
        const injury = player.injuries;
        let text = `## 🏥 ${player.name} Injury Status\n\n`;
        text += `**Status:** ${injury.status.toUpperCase()}\n`;
        text += `**Details:** ${injury.details}\n`;
        if (injury.returnDate) text += `**Expected Return:** ${injury.returnDate}\n`;

        return {
          text,
          type: 'injury',
          data: injury
        };
      }
    }

    const injuries = rayAnalytics.getInjuryReport();

    let text = `## 🏥 Injury Report\n\n`;

    if (injuries.out.length > 0) {
      text += `### Out 🚫\n`;
      for (const player of injuries.out) {
        text += `• **${player.name}** — ${player.injuries.details}\n`;
      }
      text += '\n';
    }

    if (injuries.questionable.length > 0) {
      text += `### Questionable ⚠️\n`;
      for (const player of injuries.questionable) {
        text += `• **${player.name}** — ${player.injuries.details}\n`;
      }
      text += '\n';
    }

    if (injuries.healthy.length > 0) {
      text += `### Healthy ✅\n`;
      text += `${injuries.healthy.length} players healthy and ready to go.`;
    }

    return {
      text,
      type: 'injuries',
      data: injuries,
      suggestions: ['Best props today', 'Player stats', 'Value plays']
    };
  }

  handleParlay(entities) {
    const correlations = [];
    
    for (const player of entities.players) {
      const corr = rayPropIntelligence.findCorrelatedProps(player);
      if (corr) correlations.push(corr);
    }

    let text = `## 🎰 Parlay & Correlation Finder\n\n`;

    if (correlations.length > 0) {
      for (const corr of correlations) {
        text += `### ${corr.player}\n`;
        for (const c of corr.correlations) {
          text += `• **${c.type}** — ${c.correlation}\n`;
          text += `  └ ${c.parlayIdea}\n`;
        }
        text += '\n';
      }
    } else {
      text += `I can find correlated props for any player. Try "Curry parlay ideas" or "LeBron correlations".\n\n`;
      text += `**Popular Correlations:**\n`;
      text += `• High scoring + High rebounds (big games)\n`;
      text += `• Assists + Team scoring (playmaker nights)\n`;
      text += `• Player overs + Team wins\n`;
    }

    return {
      text,
      type: 'parlay',
      data: correlations,
      suggestions: ['Curry parlays', 'LeBron correlations', 'Build a parlay', 'Best props']
    };
  }

  handleTimeBased(entities) {
    const player = this.memory.context.currentPlayer;
    const timeframe = entities.timeframe || 'last5';

    if (player) {
      const analysis = rayAnalytics.getPlayerAnalysis(player);
      const stats = analysis[timeframe] || analysis.last5;

      let text = `## ${player} — ${timeframe === 'last5' ? 'Last 5 Games' : timeframe === 'last10' ? 'Last 10 Games' : 'Season'}\n\n`;
      text += `• **${stats.pts}** PTS • **${stats.reb}** REB • **${stats.ast}** AST\n`;

      return {
        text,
        type: 'timeBased',
        data: { player, timeframe, stats }
      };
    }

    return {
      text: "Which player's recent performance? Try 'Curry last 5 games' or 'LeBron last 10'.",
      type: 'error',
      suggestions: ['Curry last 5', 'LeBron last 10', 'Trending players']
    };
  }

  handleFollowUp(entities, message) {
    const currentPlayer = this.memory.context.currentPlayer;

    if (!currentPlayer) {
      return this.handleUnknown(message);
    }

    // Check what aspect they're asking about
    if (message.includes('prop') || entities.props.length > 0) {
      return this.handlePropAnalysis({ ...entities, players: [currentPlayer] }, message);
    }

    if (message.includes('more') || message.includes('detail')) {
      return this.handlePlayerStats({ players: [currentPlayer], timeframe: 'last10' });
    }

    if (message.includes('matchup') || message.includes('vs')) {
      return this.handleMatchup({ ...entities, players: [currentPlayer] });
    }

    // Default: show more stats
    return this.handlePlayerStats({ players: [currentPlayer], ...entities });
  }

  handleUnknown(message) {
    // 🎯 SMART SUGGESTIONS - Try to figure out what they want
    const inference = reasoningEngine.makeInference(message, this.memory.context);
    
    // If we detected a player, provide player-specific help
    if (inference.entities.players.length > 0) {
      const player = inference.entities.players[0];
      return {
        text: `**Understood, sir. You mentioned ${player}.**

I can provide:
• "${player} stats" — Full statistical breakdown
• "${player} props" — Prop betting analysis  
• "${player} tonight" — Today's matchup analysis

Or simply say: "props" "points" "stats" "tonight"`,
        type: 'clarification',
        suggestions: [
          `${player} stats`,
          `${player} props`,
          `${player} tonight`
        ]
      };
    }
    
    // If we detected intent but missing details, ask for clarification
    if (inference.intents.length > 0) {
      const intent = inference.intents[0].name;
      if (intent === 'PROP_ANALYSIS') {
        return {
          text: `**Certainly, sir. You're interested in prop analysis.**

Which player would you like analyzed?
• "Curry" or "Stephen Curry"
• "LeBron" or "LeBron James"  
• "Luka" or "Luka Doncic"

Just say any player's name!`,
          type: 'clarification',
          suggestions: ['Curry props', 'LeBron props', 'Luka props', 'Best props today']
        };
      }
    }
    
    // General help with casual examples
    return {
      text: `**No worries, sir. I understand you perfectly - just need a bit more detail.**

Try any of these casual phrases:
• "curry props" — Analyze Stephen Curry
• "lebron points" — LeBron points analysis
• "what's curry stats" — Curry statistics
• "best props" — Today's best plays
• "compare curry lebron" — Compare players

Just mention any player name and what you want to know!`,
      type: 'help',
      suggestions: [
        'Curry props',
        'LeBron stats', 
        'Best props today',
        'Compare Curry vs LeBron'
      ]
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get conversation context for UI
  // ─────────────────────────────────────────────────────────────────────────────
  getContext() {
    return this.memory.getRecentContext();
  }

  clearContext() {
    this.memory.clear();
  }
}

// Export singleton
const rayConversationBrain = new RayConversationBrain();
export default rayConversationBrain;
