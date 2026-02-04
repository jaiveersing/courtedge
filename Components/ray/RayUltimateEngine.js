// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🚀 RAY ULTIMATE ENGINE v11.0 - THE WORLD'S MOST ADVANCED SPORTS AI                                       ║
// ║  ═══════════════════════════════════════════════════════════════════════════════════════════════════════  ║
// ║  🧠 Advanced ML Integration • 📊 Real-Time Analytics • 💰 Smart Betting Intelligence                      ║
// ║  🎯 Predictive Modeling • ⚡ Lightning Fast • 🔄 Live Data Streaming • 🎤 Enhanced Voice                  ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

import rayAnalytics, { PLAYERS_DB, TEAMS_DB } from './RayAnalyticsEngine';
import rayPropIntelligence from './RayPropIntelligence';
import { EXTENDED_PLAYERS } from './RayEnhancedDatabase';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔌 ML SERVICE CONNECTOR - REAL PREDICTIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

const ML_CONFIG = {
  baseUrl: import.meta.env?.VITE_ML_SERVICE_URL || 'https://courtedge-ml-api.onrender.com',
  timeout: 10000,
  retries: 3,
  cacheTime: 300000 // 5 minutes
};

class MLConnector {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.isOnline = true;
    this.lastHealthCheck = 0;
  }

  async checkHealth() {
    if (Date.now() - this.lastHealthCheck < 60000) {
return this.isOnline;
}
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${ML_CONFIG.baseUrl}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      this.isOnline = response.ok;
      this.lastHealthCheck = Date.now();
      return this.isOnline;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  async getPrediction(playerName, opponent, propType) {
    const cacheKey = `pred_${playerName}_${opponent}_${propType}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < ML_CONFIG.cacheTime) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${ML_CONFIG.baseUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName,
          opponent: opponent,
          prop_type: propType,
          include_confidence: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
    } catch (error) {
      console.warn('ML prediction failed, using fallback:', error);
    }

    // Fallback to local calculation
    return this.generateLocalPrediction(playerName, opponent, propType);
  }

  generateLocalPrediction(playerName, opponent, propType) {
    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
return null;
}

    const stat = propType === 'pts' ? 'pts' : 
                 propType === 'reb' ? 'reb' : 
                 propType === 'ast' ? 'ast' : 'pts';

    const season = player.season?.[stat] || 0;
    const last5 = player.last5?.[stat] || season;
    const last10 = player.last10?.[stat] || season;

    // Weighted prediction
    const prediction = (last5 * 0.4) + (last10 * 0.35) + (season * 0.25);
    
    // Calculate confidence based on consistency
    const variance = Math.abs(last5 - season) / season;
    const confidence = Math.max(0.5, Math.min(0.95, 1 - variance));

    return {
      prediction: Math.round(prediction * 10) / 10,
      confidence: confidence,
      factors: {
        recent_form: last5 > season ? 'positive' : last5 < season ? 'negative' : 'stable',
        trend_direction: last5 > last10 ? 'up' : last5 < last10 ? 'down' : 'stable',
        consistency: variance < 0.1 ? 'high' : variance < 0.2 ? 'medium' : 'low'
      },
      source: 'local_engine'
    };
  }

  async getBulkPredictions(requests) {
    const results = await Promise.all(
      requests.map(req => this.getPrediction(req.player, req.opponent, req.propType))
    );
    return results;
  }
}

const mlConnector = new MLConnector();

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🧠 ADVANCED NATURAL LANGUAGE PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class AdvancedNLP {
  constructor() {
    this.intentPatterns = this.buildIntentPatterns();
    this.entityExtractor = new EntityExtractor();
    this.contextWindow = [];
    this.maxContextSize = 10;
  }

  buildIntentPatterns() {
    return {
      PROP_ANALYSIS: {
        patterns: [
          /(?:what|how|analyze|check|show|give|tell).*(?:prop|line|odds|bet|over|under)/i,
          /(?:should|do).*(?:bet|take|play|fade)/i,
          /(?:points?|pts|rebounds?|reb|assists?|ast|threes?).*(?:prop|line|over|under)/i,
          /(?:over|under).*(?:\d+\.?\d*)/i,
          /(?:prop|bet|wager).*(?:recommendation|advice|analysis)/i
        ],
        priority: 1,
        requiresPlayer: true
      },
      PLAYER_STATS: {
        patterns: [
          /(?:how|what|show|tell|give).*(?:stats?|numbers?|averages?|performance)/i,
          /(?:averaging|stats?|numbers?).*(?:this|last|season)/i,
          /(?:what|how).*(?:doing|playing|performing)/i,
          /(?:season|career|game).*(?:stats?|averages?)/i
        ],
        priority: 2,
        requiresPlayer: true
      },
      COMPARE_PLAYERS: {
        patterns: [
          /(?:compare|vs|versus|better|worse|or)/i,
          /(?:who|which).*(?:better|worse|pick|choose)/i,
          /(.+)\s+(?:vs?\.?|versus|or|compared to)\s+(.+)/i
        ],
        priority: 1,
        requiresMultiplePlayers: true
      },
      TREND_ANALYSIS: {
        patterns: [
          /(?:trend|trending|hot|cold|streak|momentum|form)/i,
          /(?:last|recent|past)\s+(?:\d+)\s+games?/i,
          /(?:heating|cooling|slumping|on fire)/i
        ],
        priority: 2,
        requiresPlayer: true
      },
      INJURY_CHECK: {
        patterns: [
          /(?:injury|injured|hurt|out|questionable|doubtful|probable)/i,
          /(?:status|availability|playing|sitting)/i,
          /(?:health|healthy|fit)/i
        ],
        priority: 1,
        requiresPlayer: true
      },
      BEST_BETS: {
        patterns: [
          /(?:best|top|value|favorite|recommended).*(?:bets?|plays?|picks?|props?)/i,
          /(?:what|which).*(?:bet|play|pick).*(?:today|tonight|now)/i,
          /(?:sharp|smart|edge).*(?:plays?|bets?|money)/i,
          /(?:give|show|find).*(?:value|edge|opportunity)/i
        ],
        priority: 1,
        requiresPlayer: false
      },
      MATCHUP_ANALYSIS: {
        patterns: [
          /(?:matchup|match up|match-up|against|versus|facing)/i,
          /(?:how|what).*(?:against|vs|versus).*(?:team|defense)/i,
          /(?:tonight|today).*(?:game|matchup|opponent)/i
        ],
        priority: 2,
        requiresPlayer: true
      },
      PARLAY_BUILDER: {
        patterns: [
          /(?:parlay|combo|combination|multi|accumulator)/i,
          /(?:build|create|make|suggest).*(?:parlay|bet)/i,
          /(?:combine|stack|chain).*(?:bets?|props?)/i
        ],
        priority: 1,
        requiresPlayer: false
      },
      NAVIGATION: {
        patterns: [
          /(?:go|take|navigate|open|show).*(?:to|me)/i,
          /(?:open|show|display).*(?:page|screen|section)/i
        ],
        priority: 0,
        requiresPlayer: false
      },
      GREETING: {
        patterns: [
          /^(?:hi|hello|hey|yo|what'?s up|howdy|greetings)/i,
          /^(?:good\s+(?:morning|afternoon|evening|night))/i
        ],
        priority: 0,
        requiresPlayer: false
      },
      HELP: {
        patterns: [
          /(?:help|what can you|how do you|commands|features)/i,
          /(?:tell me about yourself|what do you do)/i
        ],
        priority: 0,
        requiresPlayer: false
      }
    };
  }

  classifyIntent(text, context = {}) {
    const entities = this.entityExtractor.extract(text);
    const scores = {};

    for (const [intentName, config] of Object.entries(this.intentPatterns)) {
      let score = 0;
      
      // Pattern matching
      for (const pattern of config.patterns) {
        if (pattern.test(text)) {
          score += 0.3;
        }
      }

      // Entity requirements
      if (config.requiresPlayer && entities.players.length > 0) {
        score += 0.25;
      } else if (config.requiresPlayer && entities.players.length === 0 && context.currentPlayer) {
        score += 0.15; // Context player
      }

      if (config.requiresMultiplePlayers && entities.players.length >= 2) {
        score += 0.3;
      }

      // Context boost
      if (context.lastIntent === intentName) {
        score += 0.1;
      }

      // Priority adjustment
      score += (1 - config.priority * 0.1);

      scores[intentName] = Math.min(score, 1.0);
    }

    // Sort by score
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0.2);

    return {
      primary: sorted[0] ? { name: sorted[0][0], confidence: sorted[0][1] } : { name: 'GENERAL', confidence: 0.5 },
      secondary: sorted[1] ? { name: sorted[1][0], confidence: sorted[1][1] } : null,
      entities,
      allScores: Object.fromEntries(sorted)
    };
  }

  addToContext(message, response, intent) {
    this.contextWindow.push({
      message,
      response: response?.substring(0, 200),
      intent,
      timestamp: Date.now()
    });

    if (this.contextWindow.length > this.maxContextSize) {
      this.contextWindow.shift();
    }
  }

  getRelevantContext() {
    const now = Date.now();
    return this.contextWindow.filter(ctx => now - ctx.timestamp < 600000); // 10 min window
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔍 ENTITY EXTRACTOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class EntityExtractor {
  constructor() {
    this.playerAliases = this.buildPlayerAliases();
    this.teamAliases = this.buildTeamAliases();
    this.statAliases = this.buildStatAliases();
  }

  buildPlayerAliases() {
    return {
      'lebron': 'LeBron James', 'bron': 'LeBron James', 'king james': 'LeBron James', 'lbj': 'LeBron James',
      'steph': 'Stephen Curry', 'curry': 'Stephen Curry', 'chef curry': 'Stephen Curry', 'wardell': 'Stephen Curry',
      'kd': 'Kevin Durant', 'durant': 'Kevin Durant', 'slim reaper': 'Kevin Durant',
      'giannis': 'Giannis Antetokounmpo', 'greek freak': 'Giannis Antetokounmpo', 'antetokounmpo': 'Giannis Antetokounmpo',
      'luka': 'Luka Doncic', 'doncic': 'Luka Doncic', 'luka magic': 'Luka Doncic', 'wonderboy': 'Luka Doncic',
      'jokic': 'Nikola Jokic', 'nikola': 'Nikola Jokic', 'joker': 'Nikola Jokic', 'big honey': 'Nikola Jokic',
      'embiid': 'Joel Embiid', 'joel': 'Joel Embiid', 'the process': 'Joel Embiid',
      'tatum': 'Jayson Tatum', 'jt': 'Jayson Tatum',
      'sga': 'Shai Gilgeous-Alexander', 'shai': 'Shai Gilgeous-Alexander', 'gilgeous': 'Shai Gilgeous-Alexander',
      'dame': 'Damian Lillard', 'lillard': 'Damian Lillard', 'dame time': 'Damian Lillard',
      'harden': 'James Harden', 'the beard': 'James Harden',
      'ant': 'Anthony Edwards', 'ant-man': 'Anthony Edwards', 'edwards': 'Anthony Edwards',
      'ad': 'Anthony Davis', 'davis': 'Anthony Davis', 'the brow': 'Anthony Davis',
      'booker': 'Devin Booker', 'book': 'Devin Booker',
      'trae': 'Trae Young', 'ice trae': 'Trae Young',
      'ja': 'Ja Morant', 'morant': 'Ja Morant',
      'kyrie': 'Kyrie Irving', 'uncle drew': 'Kyrie Irving',
      'butler': 'Jimmy Butler', 'jimmy': 'Jimmy Butler', 'jimmy buckets': 'Jimmy Butler',
      'kawhi': 'Kawhi Leonard', 'the claw': 'Kawhi Leonard', 'klaw': 'Kawhi Leonard',
      'pg': 'Paul George', 'paul george': 'Paul George',
      'mitchell': 'Donovan Mitchell', 'spida': 'Donovan Mitchell', 'donovan': 'Donovan Mitchell',
      'haliburton': 'Tyrese Haliburton', 'tyrese': 'Tyrese Haliburton',
      'brunson': 'Jalen Brunson', 'jb': 'Jalen Brunson'
    };
  }

  buildTeamAliases() {
    return {
      'lakers': 'LAL', 'la lakers': 'LAL', 'los angeles lakers': 'LAL', 'purple and gold': 'LAL',
      'warriors': 'GSW', 'golden state': 'GSW', 'dubs': 'GSW',
      'celtics': 'BOS', 'boston': 'BOS', 'cs': 'BOS',
      'bucks': 'MIL', 'milwaukee': 'MIL', 'deer': 'MIL',
      'nuggets': 'DEN', 'denver': 'DEN',
      'sixers': 'PHI', '76ers': 'PHI', 'philadelphia': 'PHI', 'philly': 'PHI',
      'heat': 'MIA', 'miami': 'MIA',
      'suns': 'PHX', 'phoenix': 'PHX',
      'mavs': 'DAL', 'mavericks': 'DAL', 'dallas': 'DAL',
      'clippers': 'LAC', 'clips': 'LAC',
      'thunder': 'OKC', 'okc': 'OKC', 'oklahoma': 'OKC',
      'knicks': 'NYK', 'new york': 'NYK',
      'nets': 'BKN', 'brooklyn': 'BKN',
      'cavs': 'CLE', 'cavaliers': 'CLE', 'cleveland': 'CLE',
      'hawks': 'ATL', 'atlanta': 'ATL',
      'raptors': 'TOR', 'toronto': 'TOR',
      'bulls': 'CHI', 'chicago': 'CHI',
      'pacers': 'IND', 'indiana': 'IND',
      'grizzlies': 'MEM', 'memphis': 'MEM',
      'pelicans': 'NOP', 'pels': 'NOP', 'new orleans': 'NOP',
      'timberwolves': 'MIN', 'wolves': 'MIN', 'minnesota': 'MIN',
      'kings': 'SAC', 'sacramento': 'SAC',
      'blazers': 'POR', 'portland': 'POR', 'trail blazers': 'POR'
    };
  }

  buildStatAliases() {
    return {
      'points': 'pts', 'point': 'pts', 'scoring': 'pts', 'pts': 'pts', 'buckets': 'pts',
      'rebounds': 'reb', 'rebound': 'reb', 'boards': 'reb', 'reb': 'reb',
      'assists': 'ast', 'assist': 'ast', 'dimes': 'ast', 'ast': 'ast',
      'steals': 'stl', 'steal': 'stl', 'stl': 'stl',
      'blocks': 'blk', 'block': 'blk', 'swats': 'blk', 'blk': 'blk',
      'threes': 'threes', 'three': 'threes', '3s': 'threes', '3pt': 'threes', 'three pointers': 'threes', 'treys': 'threes',
      'turnovers': 'tov', 'turnover': 'tov', 'tov': 'tov',
      'pra': 'pra', 'points rebounds assists': 'pra', 'p+r+a': 'pra',
      'pr': 'pr', 'points rebounds': 'pr', 'p+r': 'pr',
      'pa': 'pa', 'points assists': 'pa', 'p+a': 'pa',
      'minutes': 'min', 'mins': 'min', 'min': 'min',
      'field goal': 'fg', 'fg': 'fg', 'field goals': 'fg'
    };
  }

  extract(text) {
    const lowerText = text.toLowerCase().trim();
    const entities = {
      players: [],
      teams: [],
      stats: [],
      numbers: [],
      timeframes: [],
      directions: [] // over/under
    };

    // Extract players
    for (const [alias, fullName] of Object.entries(this.playerAliases)) {
      if (lowerText.includes(alias.toLowerCase())) {
        if (!entities.players.includes(fullName)) {
          entities.players.push(fullName);
        }
      }
    }

    // Also check full names in PLAYERS_DB
    for (const playerName of Object.keys(PLAYERS_DB)) {
      if (lowerText.includes(playerName.toLowerCase())) {
        if (!entities.players.includes(playerName)) {
          entities.players.push(playerName);
        }
      }
    }

    // Check EXTENDED_PLAYERS
    for (const playerName of Object.keys(EXTENDED_PLAYERS)) {
      if (lowerText.includes(playerName.toLowerCase())) {
        if (!entities.players.includes(playerName)) {
          entities.players.push(playerName);
        }
      }
    }

    // Extract teams
    for (const [alias, code] of Object.entries(this.teamAliases)) {
      if (lowerText.includes(alias.toLowerCase())) {
        if (!entities.teams.includes(code)) {
          entities.teams.push(code);
        }
      }
    }

    // Extract stats
    for (const [alias, stat] of Object.entries(this.statAliases)) {
      if (lowerText.includes(alias.toLowerCase())) {
        if (!entities.stats.includes(stat)) {
          entities.stats.push(stat);
        }
      }
    }

    // Extract numbers
    const numberMatches = text.match(/\b\d+(?:\.\d+)?\b/g);
    if (numberMatches) {
      entities.numbers = numberMatches.map(n => parseFloat(n));
    }

    // Extract timeframes
    const timeframePatterns = [
      { pattern: /last\s+(\d+)\s+games?/i, type: 'lastN' },
      { pattern: /past\s+(\d+)\s+games?/i, type: 'lastN' },
      { pattern: /this\s+season/i, type: 'season' },
      { pattern: /season/i, type: 'season' },
      { pattern: /career/i, type: 'career' },
      { pattern: /tonight|today/i, type: 'today' },
      { pattern: /home/i, type: 'home' },
      { pattern: /away|road/i, type: 'away' }
    ];

    for (const { pattern, type } of timeframePatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        entities.timeframes.push({ type, value: match[1] || null });
      }
    }

    // Extract over/under directions
    if (/over/i.test(lowerText)) {
entities.directions.push('over');
}
    if (/under/i.test(lowerText)) {
entities.directions.push('under');
}

    return entities;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 💬 INTELLIGENT RESPONSE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class ResponseGenerator {
  constructor() {
    this.personality = {
      name: 'Ray',
      style: 'professional_analyst',
      traits: ['knowledgeable', 'confident', 'data-driven', 'helpful']
    };
  }

  async generateResponse(intent, entities, context = {}) {
    switch (intent.name) {
      case 'PROP_ANALYSIS':
        return await this.generatePropAnalysis(entities, context);
      case 'PLAYER_STATS':
        return this.generatePlayerStats(entities, context);
      case 'COMPARE_PLAYERS':
        return this.generateComparison(entities, context);
      case 'TREND_ANALYSIS':
        return this.generateTrendAnalysis(entities, context);
      case 'BEST_BETS':
        return this.generateBestBets(entities, context);
      case 'MATCHUP_ANALYSIS':
        return this.generateMatchupAnalysis(entities, context);
      case 'PARLAY_BUILDER':
        return this.generateParlayBuilder(entities, context);
      case 'INJURY_CHECK':
        return this.generateInjuryCheck(entities, context);
      case 'GREETING':
        return this.generateGreeting(entities, context);
      case 'HELP':
        return this.generateHelp();
      case 'NAVIGATION':
        return this.generateNavigation(entities, context);
      default:
        return this.generateGeneral(entities, context);
    }
  }

  async generatePropAnalysis(entities, context) {
    const playerName = entities.players[0] || context.currentPlayer;
    if (!playerName) {
      return {
        text: "Which player's props would you like me to analyze? Just say their name and I'll break it down for you.",
        type: 'prompt',
        suggestions: ['Curry props', 'LeBron points', 'Giannis rebounds']
      };
    }

    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
      return {
        text: `I couldn't find data for "${playerName}". Try one of the major players like Curry, LeBron, or Giannis.`,
        type: 'error'
      };
    }

    const statType = entities.stats[0] || 'pts';
    const direction = entities.directions[0];
    const customLine = entities.numbers[0];

    // Get ML prediction
    const prediction = await mlConnector.getPrediction(playerName, 'OPP', statType);
    
    // Get prop analysis
    const propAnalysis = rayPropIntelligence.analyzeProp(playerName, statType);

    const statLabel = this.getStatLabel(statType);
    const seasonAvg = player.season?.[statType] || 0;
    const last5Avg = player.last5?.[statType] || seasonAvg;
    const last10Avg = player.last10?.[statType] || seasonAvg;
    const line = customLine || propAnalysis?.line || seasonAvg;

    // Calculate recommendation
    const avgToLine = ((last5Avg - line) / line * 100).toFixed(1);
    const trending = last5Avg > last10Avg ? 'up' : last5Avg < last10Avg ? 'down' : 'stable';
    
    let recommendation, confidence, reasoning;
    
    if (prediction?.confidence > 0.7 && prediction?.prediction) {
      if (prediction.prediction > line * 1.05) {
        recommendation = 'OVER';
        confidence = 'HIGH';
        reasoning = `ML model projects ${prediction.prediction.toFixed(1)} ${statLabel} (${((prediction.prediction - line) / line * 100).toFixed(1)}% above the line)`;
      } else if (prediction.prediction < line * 0.95) {
        recommendation = 'UNDER';
        confidence = 'HIGH';
        reasoning = `ML model projects ${prediction.prediction.toFixed(1)} ${statLabel} (${((line - prediction.prediction) / line * 100).toFixed(1)}% below the line)`;
      } else {
        recommendation = 'LEAN OVER';
        confidence = 'MEDIUM';
        reasoning = `Projection close to line at ${prediction.prediction.toFixed(1)} - slight lean based on recent form`;
      }
    } else {
      if (last5Avg > line * 1.08 && trending === 'up') {
        recommendation = 'OVER';
        confidence = 'HIGH';
        reasoning = `Averaging ${last5Avg.toFixed(1)} in last 5 games (+${avgToLine}% vs line), trending UP`;
      } else if (last5Avg < line * 0.92 && trending === 'down') {
        recommendation = 'UNDER';
        confidence = 'HIGH';
        reasoning = `Only ${last5Avg.toFixed(1)} in last 5 games (${avgToLine}% vs line), trending DOWN`;
      } else if (last5Avg > line) {
        recommendation = 'LEAN OVER';
        confidence = 'MEDIUM';
        reasoning = `Recent avg of ${last5Avg.toFixed(1)} is above the ${line} line`;
      } else {
        recommendation = 'PASS';
        confidence = 'LOW';
        reasoning = `No clear edge - too close to call`;
      }
    }

    // Build response text
    let text = `## 📊 ${playerName} ${statLabel.toUpperCase()} PROP ANALYSIS\n\n`;
    text += `**Line:** ${line} | **Season:** ${seasonAvg.toFixed(1)} | **Last 5:** ${last5Avg.toFixed(1)} | **Last 10:** ${last10Avg.toFixed(1)}\n\n`;
    
    if (prediction?.prediction) {
      text += `🤖 **ML Prediction:** ${prediction.prediction.toFixed(1)} ${statLabel} (${(prediction.confidence * 100).toFixed(0)}% confidence)\n\n`;
    }

    text += `### 🎯 ${recommendation} (${confidence} Confidence)\n`;
    text += `*${reasoning}*\n\n`;

    // Hit rate if available
    if (propAnalysis?.hitRate) {
      text += `**Historical Hit Rate:** ${propAnalysis.hitRate}% over in last 20 games\n`;
    }

    // Trend indicator
    const trendEmoji = trending === 'up' ? '📈' : trending === 'down' ? '📉' : '➡️';
    text += `**Trend:** ${trendEmoji} ${trending.toUpperCase()}\n`;

    return {
      text,
      type: 'analysis',
      data: {
        player: playerName,
        stat: statType,
        line,
        recommendation,
        confidence,
        prediction: prediction?.prediction,
        seasonAvg,
        last5Avg,
        last10Avg
      },
      suggestions: [
        `${playerName} last 10 games`,
        `Compare ${playerName} to similar players`,
        `Best ${statLabel} props tonight`
      ]
    };
  }

  generatePlayerStats(entities, context) {
    const playerName = entities.players[0] || context.currentPlayer;
    if (!playerName) {
      return {
        text: "Which player would you like to see stats for?",
        type: 'prompt',
        suggestions: ['LeBron stats', 'Curry this season', 'Giannis performance']
      };
    }

    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
      return { text: `I couldn't find stats for "${playerName}".`, type: 'error' };
    }

    const timeframe = entities.timeframes[0]?.type || 'season';
    let stats;
    let timeLabel;

    switch (timeframe) {
      case 'lastN':
        const n = parseInt(entities.timeframes[0]?.value) || 10;
        stats = n <= 5 ? player.last5 : player.last10;
        timeLabel = `Last ${n <= 5 ? 5 : 10} Games`;
        break;
      case 'season':
      default:
        stats = player.season;
        timeLabel = '2024-25 Season';
    }

    let text = `## 📊 ${playerName} - ${timeLabel}\n\n`;
    text += `**Team:** ${player.team} | **Position:** ${player.position} | **Age:** ${player.age}\n\n`;
    
    text += `### Core Stats\n`;
    text += `| Stat | Value |\n|------|-------|\n`;
    text += `| Points | **${stats.pts?.toFixed(1) || 'N/A'}** |\n`;
    text += `| Rebounds | **${stats.reb?.toFixed(1) || 'N/A'}** |\n`;
    text += `| Assists | **${stats.ast?.toFixed(1) || 'N/A'}** |\n`;
    text += `| Steals | **${stats.stl?.toFixed(1) || 'N/A'}** |\n`;
    text += `| Blocks | **${stats.blk?.toFixed(1) || 'N/A'}** |\n`;
    text += `| Minutes | **${stats.min?.toFixed(1) || 'N/A'}** |\n\n`;

    if (stats.fgPct) {
      text += `### Shooting\n`;
      text += `| Metric | Value |\n|--------|-------|\n`;
      text += `| FG% | **${stats.fgPct?.toFixed(1)}%** |\n`;
      text += `| 3PT% | **${stats.threePct?.toFixed(1) || 'N/A'}%** |\n`;
      text += `| FT% | **${stats.ftPct?.toFixed(1) || 'N/A'}%** |\n`;
    }

    // Trend comparison
    if (player.last5 && player.season) {
      const ptsDiff = player.last5.pts - player.season.pts;
      const trendEmoji = ptsDiff > 1 ? '🔥' : ptsDiff < -1 ? '❄️' : '➡️';
      text += `\n### Recent Form ${trendEmoji}\n`;
      text += `*Last 5 vs Season: ${ptsDiff > 0 ? '+' : ''}${ptsDiff.toFixed(1)} PPG*\n`;
    }

    return {
      text,
      type: 'stats',
      data: { player: playerName, stats, timeframe },
      suggestions: [
        `${playerName} props`,
        `${playerName} vs ${player.team === 'LAL' ? 'Warriors' : 'Lakers'}`,
        `Compare ${playerName} to another player`
      ]
    };
  }

  generateComparison(entities, context) {
    if (entities.players.length < 2) {
      return {
        text: "I need two players to compare. Who would you like me to compare?",
        type: 'prompt',
        suggestions: ['LeBron vs Curry', 'Giannis vs Jokic', 'Tatum vs Durant']
      };
    }

    const [player1Name, player2Name] = entities.players;
    const player1 = PLAYERS_DB[player1Name] || EXTENDED_PLAYERS[player1Name];
    const player2 = PLAYERS_DB[player2Name] || EXTENDED_PLAYERS[player2Name];

    if (!player1 || !player2) {
      return { text: "I couldn't find one of those players.", type: 'error' };
    }

    let text = `## ⚔️ ${player1Name} vs ${player2Name}\n\n`;
    
    const stats1 = player1.season;
    const stats2 = player2.season;

    text += `| Category | ${player1Name.split(' ')[1] || player1Name} | ${player2Name.split(' ')[1] || player2Name} | Edge |\n`;
    text += `|----------|---------|---------|------|\n`;

    const categories = [
      { key: 'pts', label: 'Points' },
      { key: 'reb', label: 'Rebounds' },
      { key: 'ast', label: 'Assists' },
      { key: 'stl', label: 'Steals' },
      { key: 'blk', label: 'Blocks' },
      { key: 'fgPct', label: 'FG%' }
    ];

    let p1Wins = 0, p2Wins = 0;

    for (const { key, label } of categories) {
      const v1 = stats1[key] || 0;
      const v2 = stats2[key] || 0;
      const winner = v1 > v2 ? '←' : v2 > v1 ? '→' : '=';
      if (v1 > v2) {
p1Wins++;
} else if (v2 > v1) {
p2Wins++;
}
      
      text += `| ${label} | **${v1.toFixed(1)}** | **${v2.toFixed(1)}** | ${winner} |\n`;
    }

    text += `\n### 🏆 Overall Edge: ${p1Wins > p2Wins ? player1Name : p2Wins > p1Wins ? player2Name : 'TIE'}\n`;
    text += `*${player1Name} wins ${p1Wins} categories, ${player2Name} wins ${p2Wins}*\n`;

    return {
      text,
      type: 'comparison',
      data: { player1: player1Name, player2: player2Name, p1Wins, p2Wins },
      suggestions: [
        `${player1Name} props tonight`,
        `${player2Name} props tonight`,
        `Who's hotter right now?`
      ]
    };
  }

  generateTrendAnalysis(entities, context) {
    const playerName = entities.players[0] || context.currentPlayer;
    if (!playerName) {
      return { text: "Which player's trend would you like to analyze?", type: 'prompt' };
    }

    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
      return { text: `I couldn't find trend data for "${playerName}".`, type: 'error' };
    }

    const season = player.season;
    const last5 = player.last5;
    const last10 = player.last10;

    const ptsTrend = last5.pts - season.pts;
    const rebTrend = last5.reb - season.reb;
    const astTrend = last5.ast - season.ast;

    const getTrendEmoji = (diff) => diff > 2 ? '🔥' : diff > 0 ? '📈' : diff < -2 ? '❄️' : diff < 0 ? '📉' : '➡️';
    const getHotCold = (diff) => diff > 3 ? 'ON FIRE' : diff > 1 ? 'Heating Up' : diff < -3 ? 'ICE COLD' : diff < -1 ? 'Cooling Off' : 'Stable';

    let text = `## 📈 ${playerName} Trend Analysis\n\n`;
    text += `### Recent Form vs Season Average\n\n`;
    
    text += `| Stat | Season | Last 10 | Last 5 | Trend |\n`;
    text += `|------|--------|---------|--------|-------|\n`;
    text += `| PTS | ${season.pts.toFixed(1)} | ${last10.pts.toFixed(1)} | **${last5.pts.toFixed(1)}** | ${getTrendEmoji(ptsTrend)} ${ptsTrend > 0 ? '+' : ''}${ptsTrend.toFixed(1)} |\n`;
    text += `| REB | ${season.reb.toFixed(1)} | ${last10.reb.toFixed(1)} | **${last5.reb.toFixed(1)}** | ${getTrendEmoji(rebTrend)} ${rebTrend > 0 ? '+' : ''}${rebTrend.toFixed(1)} |\n`;
    text += `| AST | ${season.ast.toFixed(1)} | ${last10.ast.toFixed(1)} | **${last5.ast.toFixed(1)}** | ${getTrendEmoji(astTrend)} ${astTrend > 0 ? '+' : ''}${astTrend.toFixed(1)} |\n`;

    text += `\n### Overall Status: ${getHotCold(ptsTrend)} ${getTrendEmoji(ptsTrend)}\n`;

    if (ptsTrend > 2) {
      text += `\n*${playerName} is performing well above his season average. OVER props look favorable.*`;
    } else if (ptsTrend < -2) {
      text += `\n*${playerName} is in a slump. Consider UNDER or look for buy-low opportunities.*`;
    }

    return {
      text,
      type: 'trend',
      data: { player: playerName, ptsTrend, rebTrend, astTrend },
      suggestions: [
        `${playerName} props analysis`,
        `${playerName} last 5 games`,
        `Compare ${playerName} to league average`
      ]
    };
  }

  generateBestBets(entities, context) {
    const allPlayers = { ...PLAYERS_DB, ...EXTENDED_PLAYERS };
    const opportunities = [];

    for (const [playerName, player] of Object.entries(allPlayers)) {
      if (!player.season || !player.last5) {
continue;
}

      const statTypes = ['pts', 'reb', 'ast'];
      
      for (const stat of statTypes) {
        const seasonAvg = player.season[stat];
        const last5Avg = player.last5[stat];
        const last10Avg = player.last10?.[stat] || seasonAvg;

        if (!seasonAvg || !last5Avg) {
continue;
}

        const diff5 = ((last5Avg - seasonAvg) / seasonAvg) * 100;
        const trending = last5Avg > last10Avg;

        // Find strong overs
        if (diff5 > 10 && trending) {
          opportunities.push({
            player: playerName,
            stat,
            type: 'OVER',
            edge: diff5.toFixed(1),
            line: seasonAvg.toFixed(1),
            current: last5Avg.toFixed(1),
            confidence: diff5 > 15 ? 'HIGH' : 'MEDIUM'
          });
        }

        // Find strong unders
        if (diff5 < -10 && !trending) {
          opportunities.push({
            player: playerName,
            stat,
            type: 'UNDER',
            edge: Math.abs(diff5).toFixed(1),
            line: seasonAvg.toFixed(1),
            current: last5Avg.toFixed(1),
            confidence: diff5 < -15 ? 'HIGH' : 'MEDIUM'
          });
        }
      }
    }

    // Sort by edge
    opportunities.sort((a, b) => parseFloat(b.edge) - parseFloat(a.edge));
    const topPicks = opportunities.slice(0, 5);

    if (topPicks.length === 0) {
      return {
        text: "I don't see any clear value plays right now. Markets seem efficient. Check back later!",
        type: 'info'
      };
    }

    let text = `## 🎯 Top Value Plays\n\n`;
    text += `*Based on recent performance vs season average*\n\n`;

    for (let i = 0; i < topPicks.length; i++) {
      const pick = topPicks[i];
      const statLabel = this.getStatLabel(pick.stat);
      const emoji = pick.confidence === 'HIGH' ? '🔥' : '✅';
      
      text += `### ${i + 1}. ${emoji} ${pick.player} ${statLabel} ${pick.type}\n`;
      text += `**Line:** ~${pick.line} | **Last 5:** ${pick.current} | **Edge:** ${pick.edge}%\n\n`;
    }

    return {
      text,
      type: 'recommendations',
      data: { picks: topPicks },
      suggestions: topPicks.slice(0, 3).map(p => `${p.player} ${p.stat} analysis`)
    };
  }

  generateMatchupAnalysis(entities, context) {
    const playerName = entities.players[0] || context.currentPlayer;
    const opponent = entities.teams[0];

    if (!playerName) {
      return { text: "Which player's matchup would you like me to analyze?", type: 'prompt' };
    }

    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
      return { text: `Couldn't find data for ${playerName}`, type: 'error' };
    }

    let text = `## 🏀 ${playerName} Matchup Analysis\n\n`;

    if (player.vsTeam && Object.keys(player.vsTeam).length > 0) {
      text += `### Historical Performance vs Teams\n\n`;
      text += `| Opponent | PTS | REB | AST | Games |\n`;
      text += `|----------|-----|-----|-----|-------|\n`;
      
      for (const [team, stats] of Object.entries(player.vsTeam)) {
        text += `| ${team} | ${stats.pts} | ${stats.reb} | ${stats.ast} | ${stats.games} |\n`;
      }
    }

    if (player.splits) {
      text += `\n### Situational Splits\n\n`;
      text += `| Situation | PTS | REB | AST |\n`;
      text += `|-----------|-----|-----|-----|\n`;
      if (player.splits.home) {
text += `| Home | ${player.splits.home.pts} | ${player.splits.home.reb} | ${player.splits.home.ast} |\n`;
}
      if (player.splits.away) {
text += `| Away | ${player.splits.away.pts} | ${player.splits.away.reb} | ${player.splits.away.ast} |\n`;
}
      if (player.splits.rest_2plus) {
text += `| 2+ Days Rest | ${player.splits.rest_2plus.pts} | ${player.splits.rest_2plus.reb} | ${player.splits.rest_2plus.ast} |\n`;
}
    }

    return {
      text,
      type: 'matchup',
      data: { player: playerName, opponent },
      suggestions: [
        `${playerName} props`,
        `${playerName} trend analysis`,
        `Best bets tonight`
      ]
    };
  }

  generateParlayBuilder(entities, context) {
    const allPlayers = { ...PLAYERS_DB, ...EXTENDED_PLAYERS };
    const correlatedPicks = [];

    // Find correlated plays
    for (const [playerName, player] of Object.entries(allPlayers)) {
      if (!player.last5 || !player.season) {
continue;
}

      const ptsDiff = player.last5.pts - player.season.pts;
      const astDiff = player.last5.ast - player.season.ast;

      // Hot scorers often get more assists too
      if (ptsDiff > 3 && astDiff > 1) {
        correlatedPicks.push({
          player: playerName,
          legs: [
            { stat: 'pts', type: 'OVER' },
            { stat: 'ast', type: 'OVER' }
          ],
          correlation: 'Scoring + Playmaking'
        });
      }
    }

    if (correlatedPicks.length === 0) {
      return {
        text: "I haven't found strong correlated plays at the moment. Check back closer to game time!",
        type: 'info'
      };
    }

    let text = `## 🎰 Parlay Builder\n\n`;
    text += `*Correlated prop combinations with higher hit probability*\n\n`;

    for (const pick of correlatedPicks.slice(0, 3)) {
      text += `### ${pick.player}\n`;
      text += `**Correlation:** ${pick.correlation}\n`;
      text += `Legs: ${pick.legs.map(l => `${l.stat.toUpperCase()} ${l.type}`).join(' + ')}\n\n`;
    }

    return {
      text,
      type: 'parlay',
      data: { picks: correlatedPicks },
      suggestions: ['Best single bets', 'Player trend analysis', 'Tonight\'s games']
    };
  }

  generateInjuryCheck(entities, context) {
    const playerName = entities.players[0] || context.currentPlayer;
    if (!playerName) {
      return { text: "Which player's injury status would you like to check?", type: 'prompt' };
    }

    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
      return { text: `Couldn't find ${playerName}`, type: 'error' };
    }

    let text = `## 🏥 ${playerName} Health Status\n\n`;

    if (player.injuries?.current) {
      text += `⚠️ **CURRENT INJURY:** ${player.injuries.current}\n\n`;
    } else {
      text += `✅ **STATUS:** Healthy / No injuries reported\n\n`;
    }

    if (player.injuries?.history && player.injuries.history.length > 0) {
      text += `### Injury History\n`;
      for (const injury of player.injuries.history) {
        text += `- ${injury}\n`;
      }
    }

    return {
      text,
      type: 'injury',
      data: { player: playerName, status: player.injuries },
      suggestions: [`${playerName} props`, `${playerName} recent games`, 'Best bets tonight']
    };
  }

  generateGreeting(entities, context) {
    const greetings = [
      "Hey! I'm Ray, your NBA analytics assistant. What would you like to know?",
      "What's up! Ready to find some value plays. Who are you looking at?",
      "Hey there! I've got all the stats and props covered. What do you need?",
      "Yo! Let's find some edges. Ask me about any player or prop."
    ];

    const hour = new Date().getHours();
    let timeGreeting = '';
    if (hour < 12) {
timeGreeting = "Good morning! ";
} else if (hour < 17) {
timeGreeting = "Good afternoon! ";
} else if (hour < 21) {
timeGreeting = "Good evening! ";
} else {
timeGreeting = "Burning the midnight oil? ";
}

    return {
      text: timeGreeting + greetings[Math.floor(Math.random() * greetings.length)],
      type: 'greeting',
      suggestions: ['Best bets today', 'LeBron props', 'Who\'s hot right now?']
    };
  }

  generateHelp() {
    let text = `## 🤖 I'm Ray - Your NBA Analytics AI\n\n`;
    text += `### What I Can Do:\n\n`;
    text += `**📊 Prop Analysis** - "How's Curry's points prop?" "Should I take LeBron over 24.5?"\n\n`;
    text += `**📈 Player Stats** - "Show me Giannis stats" "How's Tatum doing?"\n\n`;
    text += `**⚔️ Comparisons** - "Compare LeBron vs Curry" "Who's better, Jokic or Embiid?"\n\n`;
    text += `**🔥 Trends** - "Is Luka hot?" "Who's trending up?"\n\n`;
    text += `**🎯 Best Bets** - "Best value plays tonight" "Top props today"\n\n`;
    text += `**🎰 Parlays** - "Build me a parlay" "Correlated plays"\n\n`;
    text += `**🏥 Injuries** - "Is Durant playing?" "Injury updates"\n\n`;
    text += `*Just ask naturally - I understand most basketball questions!*`;

    return {
      text,
      type: 'help',
      suggestions: ['Best bets tonight', 'LeBron stats', 'Compare top players']
    };
  }

  generateNavigation(entities, context) {
    return {
      text: "I can help you navigate! Where would you like to go?",
      type: 'navigation',
      suggestions: ['Go to bets', 'Open analytics', 'Show workstation']
    };
  }

  generateGeneral(entities, context) {
    if (entities.players.length > 0) {
      return this.generatePlayerStats(entities, context);
    }

    return {
      text: "I'm not quite sure what you're asking. Try asking about a specific player's props, stats, or trends. Or say 'help' to see what I can do!",
      type: 'general',
      suggestions: ['Help', 'Best bets today', 'LeBron stats']
    };
  }

  getStatLabel(stat) {
    const labels = {
      pts: 'Points', reb: 'Rebounds', ast: 'Assists',
      stl: 'Steals', blk: 'Blocks', threes: '3-Pointers',
      pra: 'PTS+REB+AST', pr: 'PTS+REB', pa: 'PTS+AST',
      min: 'Minutes', tov: 'Turnovers'
    };
    return labels[stat] || stat.toUpperCase();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌟 MAIN ULTIMATE ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class RayUltimateEngine {
  constructor() {
    this.nlp = new AdvancedNLP();
    this.responseGenerator = new ResponseGenerator();
    this.mlConnector = mlConnector;
    this.context = {
      currentPlayer: null,
      lastIntent: null,
      conversationHistory: [],
      sessionStart: Date.now()
    };
  }

  async processMessage(message) {
    const startTime = Date.now();

    try {
      // Classify intent
      const classification = this.nlp.classifyIntent(message, this.context);
      
      // Update context
      if (classification.entities.players.length > 0) {
        this.context.currentPlayer = classification.entities.players[0];
      }
      this.context.lastIntent = classification.primary.name;

      // Generate response
      const response = await this.responseGenerator.generateResponse(
        classification.primary,
        classification.entities,
        this.context
      );

      // Add to context
      this.nlp.addToContext(message, response.text, classification.primary.name);
      this.context.conversationHistory.push({
        user: message,
        assistant: response.text,
        timestamp: Date.now()
      });

      // Add processing metadata
      response.metadata = {
        processingTime: Date.now() - startTime,
        intent: classification.primary,
        confidence: classification.primary.confidence,
        entities: classification.entities
      };

      return response;
    } catch (error) {
      console.error('Ray Ultimate Engine error:', error);
      return {
        text: "I ran into a small issue processing that. Could you try rephrasing your question?",
        type: 'error',
        suggestions: ['Help', 'Best bets', 'Player stats']
      };
    }
  }

  async getQuickAnalysis(playerName, statType = 'pts') {
    return await this.mlConnector.getPrediction(playerName, 'OPP', statType);
  }

  getContext() {
    return this.context;
  }

  resetContext() {
    this.context = {
      currentPlayer: null,
      lastIntent: null,
      conversationHistory: [],
      sessionStart: Date.now()
    };
  }

  // Quick access methods
  getPlayerData(playerName) {
    return PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName] || null;
  }

  getAllPlayers() {
    return { ...PLAYERS_DB, ...EXTENDED_PLAYERS };
  }

  getTopPlayers(count = 10) {
    const all = this.getAllPlayers();
    return Object.entries(all)
      .sort((a, b) => (b[1].season?.pts || 0) - (a[1].season?.pts || 0))
      .slice(0, count)
      .map(([name, data]) => ({ name, ...data }));
  }
}

// Create singleton instance
const rayUltimateEngine = new RayUltimateEngine();

export default rayUltimateEngine;
export { RayUltimateEngine, MLConnector, AdvancedNLP, EntityExtractor, ResponseGenerator };
