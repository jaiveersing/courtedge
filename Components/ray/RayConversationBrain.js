// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  🧠 RAY CONVERSATION BRAIN v3.0 - ULTRA-INTELLIGENT CONTEXT SYSTEM            ║
// ║  Memory • Context Chains • Smart Follow-ups • Time Queries • Conditions       ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

import rayAnalytics, { PLAYERS_DB, TEAMS_DB, PLAYER_ALIASES } from './RayAnalyticsEngine';
import rayPropIntelligence from './RayPropIntelligence';
import rayComparisonEngine from './RayComparisonEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// 🗣️ CONVERSATION MEMORY (Session-based)
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
      sessionStarted: Date.now()
    };
    this.maxHistory = 50;
  }

  addMessage(role, content, metadata = {}) {
    this.history.push({
      role,
      content,
      timestamp: Date.now(),
      ...metadata
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  updateContext(updates) {
    this.context = { ...this.context, ...updates };
  }

  getLastNMessages(n = 5) {
    return this.history.slice(-n);
  }

  getRecentContext() {
    const recent = this.history.slice(-3);
    return {
      lastMessages: recent,
      currentPlayer: this.context.currentPlayer,
      currentTeam: this.context.currentTeam,
      mentionedPlayers: this.context.mentionedPlayers.slice(-5)
    };
  }

  clear() {
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
      sessionStarted: Date.now()
    };
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
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 CONVERSATION BRAIN CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class RayConversationBrain {
  constructor() {
    this.memory = new ConversationMemory();
    this.intents = INTENT_PATTERNS;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main process function
  // ─────────────────────────────────────────────────────────────────────────────
  async processMessage(message) {
    const normalized = this.normalizeMessage(message);
    const intent = this.detectIntent(normalized);
    const entities = this.extractEntities(normalized);

    // Update context based on new entities
    if (entities.players.length > 0) {
      this.memory.updateContext({ 
        currentPlayer: entities.players[0],
        mentionedPlayers: [...this.memory.context.mentionedPlayers, ...entities.players].slice(-10)
      });
    }
    if (entities.teams.length > 0) {
      this.memory.updateContext({
        currentTeam: entities.teams[0],
        mentionedTeams: [...this.memory.context.mentionedTeams, ...entities.teams].slice(-5)
      });
    }
    if (entities.props.length > 0) {
      this.memory.updateContext({ currentProp: entities.props[0] });
    }
    if (entities.timeframe) {
      this.memory.updateContext({ currentTimeframe: entities.timeframe });
    }

    this.memory.updateContext({ lastIntent: intent.type });
    this.memory.addMessage('user', message, { intent: intent.type, entities });

    // Generate response based on intent
    const response = await this.generateResponse(intent, entities, normalized);

    this.memory.addMessage('assistant', response.text, { 
      intent: intent.type,
      hasData: !!response.data 
    });

    return response;
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
      
      default:
        return this.handleUnknown(message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Intent Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  handleGreeting() {
    const greetings = [
      "Hey! Ready to dominate the prop market today? 🏀",
      "What's up! Ray here — your edge in player analytics. What player should we analyze?",
      "Yo! Let's find some value. Ask me about any player, prop, or matchup.",
      "Welcome back! I've got the latest stats, trends, and props. Who are we looking at?",
      "Hey there! I'm Ray — NBA analytics at your service. What do you need?"
    ];

    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      type: 'greeting',
      suggestions: ['Best props today', 'Curry stats', 'Top scorers', 'Sharp money plays']
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
        text: "Which player should I analyze? Just say a name like 'Curry' or 'LeBron'.",
        type: 'error',
        suggestions: ['Curry', 'LeBron', 'Luka', 'Tatum']
      };
    }

    const analysis = rayAnalytics.getPlayerAnalysis(playerName);
    if (analysis.error) {
      return {
        text: `I don't have data on "${playerName}" yet. Try: Curry, LeBron, Luka, Tatum, Giannis, or Jokic.`,
        type: 'error',
        suggestions: ['Curry', 'LeBron', 'Luka', 'Top scorers']
      };
    }

    const timeframe = entities.timeframe || 'season';
    const stats = analysis[timeframe] || analysis.season;
    const trend = analysis.trend;
    const injury = analysis.injuries;

    let text = `## ${analysis.name} ${analysis.team ? `(${analysis.team})` : ''}\n\n`;
    
    if (injury.status !== 'healthy') {
      text += `⚠️ **Injury:** ${injury.status} - ${injury.details}\n\n`;
    }

    text += `### ${timeframe === 'season' ? 'Season' : timeframe === 'last10' ? 'Last 10' : 'Last 5'} Averages\n`;
    text += `• **${stats.pts}** PTS • **${stats.reb}** REB • **${stats.ast}** AST\n`;
    text += `• **${(stats.fg_pct * 100).toFixed(1)}%** FG • **${stats.threes}** 3PM\n\n`;

    text += `### Trend: ${trend.direction === 'up' ? '📈 HOT' : trend.direction === 'down' ? '📉 COLD' : '➡️ STABLE'}\n`;
    text += `${trend.summary}\n\n`;

    if (analysis.bestProps && analysis.bestProps.length > 0) {
      text += `### 🔥 Best Props\n`;
      for (const prop of analysis.bestProps.slice(0, 3)) {
        text += `• ${prop.prop} — ${prop.hitRate}% hit rate ${prop.streak > 0 ? `(${prop.streak}+ streak)` : ''}\n`;
      }
    }

    return {
      text,
      type: 'playerStats',
      data: analysis,
      suggestions: [
        `${analysis.name.split(' ')[1]} props`,
        `${analysis.name.split(' ')[1]} vs Celtics`,
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
    const suggestions = [
      'Best props today',
      'Curry stats', 
      'Compare LeBron vs Curry',
      'Who\'s trending?'
    ];

    return {
      text: `I'm not sure what you're asking. Here are some things I can help with:

**Try asking:**
• "How is Curry playing?" — Player analysis
• "LeBron points prop" — Prop breakdown
• "Curry vs LeBron" — Player comparison
• "Best props today" — Value picks
• "Who's hot?" — Trending players

Or just say a player's name to get started!`,
      type: 'unknown',
      suggestions
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
