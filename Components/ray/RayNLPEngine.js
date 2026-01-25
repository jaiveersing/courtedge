/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY NLP ENGINE v3.0 - Natural Language Processing
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Advanced NLP capabilities for sports betting AI:
 * 
 * - Intent Classification (40+ intent types)
 * - Entity Extraction (players, teams, markets, lines, dates, etc.)
 * - Sentiment Analysis
 * - Context Understanding
 * - Response Generation
 * - Conversational Flow Management
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const INTENTS = {
  // Greetings & Meta
  GREETING: { patterns: ['hey', 'hi', 'hello', 'yo', 'sup', 'what\'s up', 'ray'], priority: 1 },
  GOODBYE: { patterns: ['bye', 'goodbye', 'see ya', 'later', 'thanks', 'thank you'], priority: 1 },
  HELP: { patterns: ['help', 'what can you do', 'commands', 'options', 'how do i'], priority: 2 },
  
  // Player Analysis
  PLAYER_ANALYSIS: { 
    patterns: ['tell me about', 'analyze', 'what about', 'how is', 'show me', 'check'],
    entities: ['player'],
    priority: 5
  },
  PLAYER_PROPS: {
    patterns: ['props', 'player prop', 'points', 'rebounds', 'assists', 'threes', 'steals', 'blocks'],
    entities: ['player', 'market'],
    priority: 5
  },
  PLAYER_COMPARISON: {
    patterns: ['compare', 'vs', 'versus', 'or', 'which is better', 'pick between'],
    entities: ['player', 'player2'],
    priority: 6
  },
  PLAYER_TRENDS: {
    patterns: ['trending', 'hot', 'cold', 'streak', 'heating up', 'on fire', 'slumping'],
    entities: ['player'],
    priority: 4
  },
  PLAYER_HISTORY: {
    patterns: ['history', 'last', 'previous', 'past', 'games', 'performance'],
    entities: ['player', 'timeframe'],
    priority: 4
  },
  
  // Betting Intent
  FIND_VALUE: {
    patterns: ['value', 'edge', 'good bet', 'what\'s good', 'opportunities', 'plays'],
    priority: 7
  },
  FIND_CONSISTENT: {
    patterns: ['consistent', 'safe', 'reliable', 'stable', 'low variance', 'lock'],
    priority: 6
  },
  FIND_TRENDING: {
    patterns: ['trending', 'hot', 'who\'s hot', 'momentum', 'heating up'],
    priority: 5
  },
  LINE_ANALYSIS: {
    patterns: ['line', 'sharp', 'soft', 'trap', 'fake', 'real', 'movement'],
    entities: ['player', 'market', 'line'],
    priority: 6
  },
  OVER_UNDER: {
    patterns: ['over', 'under', 'o/u', 'total'],
    entities: ['player', 'market', 'line'],
    priority: 5
  },
  
  // Risk Assessment
  RISK_ASSESSMENT: {
    patterns: ['risk', 'concern', 'worry', 'red flag', 'warning', 'avoid', 'danger'],
    entities: ['player'],
    priority: 5
  },
  INJURY_CHECK: {
    patterns: ['injury', 'injured', 'hurt', 'health', 'status', 'questionable', 'doubtful'],
    entities: ['player', 'team'],
    priority: 6
  },
  
  // Game Context
  GAME_ANALYSIS: {
    patterns: ['game', 'matchup', 'tonight', 'today', 'tomorrow'],
    entities: ['team', 'opponent'],
    priority: 5
  },
  TEAM_ANALYSIS: {
    patterns: ['team', 'roster', 'lineup', 'defense', 'offense'],
    entities: ['team'],
    priority: 4
  },
  SCHEDULE_CHECK: {
    patterns: ['schedule', 'when', 'next game', 'playing'],
    entities: ['team', 'player'],
    priority: 3
  },
  
  // Response Format
  DEEP_DIVE: {
    patterns: ['deep dive', 'detailed', 'full analysis', 'everything', 'breakdown', 'in depth'],
    priority: 4
  },
  QUICK_TAKE: {
    patterns: ['quick', 'summary', 'tldr', 'brief', 'short', 'bottom line'],
    priority: 4
  },
  
  // Follow-up
  MORE_INFO: {
    patterns: ['more', 'else', 'what else', 'anything else', 'continue', 'go on'],
    priority: 3
  },
  CLARIFICATION: {
    patterns: ['what do you mean', 'explain', 'clarify', 'confused', 'don\'t understand'],
    priority: 3
  },
  REPEAT: {
    patterns: ['repeat', 'again', 'say that again', 'what was that'],
    priority: 2
  },
  
  // Market Switch
  MARKET_SWITCH: {
    patterns: ['switch to', 'check', 'what about', 'show'],
    entities: ['market'],
    priority: 5
  },
  
  // Bankroll
  SIZING: {
    patterns: ['how much', 'bet size', 'units', 'sizing', 'kelly'],
    entities: ['player', 'market'],
    priority: 4
  },
  
  // Historical
  MATCHUP_HISTORY: {
    patterns: ['vs', 'against', 'matchup history', 'head to head'],
    entities: ['player', 'team'],
    priority: 5
  },
  SPLIT_ANALYSIS: {
    patterns: ['home', 'away', 'road', 'splits', 'rest'],
    entities: ['player'],
    priority: 4
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

const PLAYER_ALIASES = {
  // Superstars
  'steph': 'stephen curry',
  'curry': 'stephen curry',
  'lebron': 'lebron james',
  'bron': 'lebron james',
  'lbj': 'lebron james',
  'jokic': 'nikola jokic',
  'joker': 'nikola jokic',
  'luka': 'luka doncic',
  'tatum': 'jayson tatum',
  'jt': 'jayson tatum',
  'giannis': 'giannis antetokounmpo',
  'greek freak': 'giannis antetokounmpo',
  'kd': 'kevin durant',
  'durant': 'kevin durant',
  'embiid': 'joel embiid',
  'joel': 'joel embiid',
  'ant': 'anthony edwards',
  'edwards': 'anthony edwards',
  'haliburton': 'tyrese haliburton',
  'hali': 'tyrese haliburton',
  'sabonis': 'domantas sabonis',
  'sga': 'shai gilgeous-alexander',
  'shai': 'shai gilgeous-alexander',
  'wemby': 'victor wembanyama',
  'wembanyama': 'victor wembanyama',
  'dame': 'damian lillard',
  'lillard': 'damian lillard',
  'booker': 'devin booker',
  'book': 'devin booker',
  'trae': 'trae young',
  'brunson': 'jalen brunson',
  'mitchell': 'donovan mitchell',
  'spida': 'donovan mitchell',
  'ja': 'ja morant',
  'morant': 'ja morant',
  'jimmy': 'jimmy butler',
  'butler': 'jimmy butler',
  'jb': 'jaylen brown',
  'jaylen': 'jaylen brown',
  'fox': 'de\'aaron fox',
  'maxey': 'tyrese maxey',
  'kat': 'karl-anthony towns',
  'towns': 'karl-anthony towns',
  'bam': 'bam adebayo',
  'adebayo': 'bam adebayo',
  'lamelo': 'lamelo ball',
  'melo': 'lamelo ball',
  'cade': 'cade cunningham',
  'cunningham': 'cade cunningham',
  'paolo': 'paolo banchero',
  'banchero': 'paolo banchero',
  'scottie': 'scottie barnes',
  'barnes': 'scottie barnes',
  'harden': 'james harden',
  'kawhi': 'kawhi leonard',
  'leonard': 'kawhi leonard',
  'pg': 'paul george',
  'pg13': 'paul george',
  'zion': 'zion williamson',
  'williamson': 'zion williamson'
};

const TEAM_ALIASES = {
  // Western Conference
  'warriors': 'GSW', 'gsw': 'GSW', 'dubs': 'GSW', 'golden state': 'GSW',
  'lakers': 'LAL', 'lal': 'LAL', 'la lakers': 'LAL', 'los angeles lakers': 'LAL',
  'nuggets': 'DEN', 'den': 'DEN', 'denver': 'DEN',
  'mavericks': 'DAL', 'dal': 'DAL', 'mavs': 'DAL', 'dallas': 'DAL',
  'suns': 'PHX', 'phx': 'PHX', 'phoenix': 'PHX',
  'clippers': 'LAC', 'lac': 'LAC', 'clips': 'LAC',
  'thunder': 'OKC', 'okc': 'OKC', 'oklahoma': 'OKC',
  'wolves': 'MIN', 'min': 'MIN', 'timberwolves': 'MIN', 'minnesota': 'MIN',
  'pelicans': 'NOP', 'nop': 'NOP', 'pels': 'NOP', 'new orleans': 'NOP',
  'kings': 'SAC', 'sac': 'SAC', 'sacramento': 'SAC',
  'spurs': 'SAS', 'sas': 'SAS', 'san antonio': 'SAS',
  'grizzlies': 'MEM', 'mem': 'MEM', 'grizz': 'MEM', 'memphis': 'MEM',
  'rockets': 'HOU', 'hou': 'HOU', 'houston': 'HOU',
  'jazz': 'UTA', 'uta': 'UTA', 'utah': 'UTA',
  'blazers': 'POR', 'por': 'POR', 'portland': 'POR', 'trail blazers': 'POR',
  
  // Eastern Conference
  'celtics': 'BOS', 'bos': 'BOS', 'boston': 'BOS',
  'bucks': 'MIL', 'mil': 'MIL', 'milwaukee': 'MIL',
  'sixers': 'PHI', 'phi': 'PHI', 'philadelphia': 'PHI', '76ers': 'PHI',
  'heat': 'MIA', 'mia': 'MIA', 'miami': 'MIA',
  'knicks': 'NYK', 'nyk': 'NYK', 'new york': 'NYK',
  'cavaliers': 'CLE', 'cle': 'CLE', 'cavs': 'CLE', 'cleveland': 'CLE',
  'pacers': 'IND', 'ind': 'IND', 'indiana': 'IND',
  'magic': 'ORL', 'orl': 'ORL', 'orlando': 'ORL',
  'hawks': 'ATL', 'atl': 'ATL', 'atlanta': 'ATL',
  'raptors': 'TOR', 'tor': 'TOR', 'toronto': 'TOR',
  'nets': 'BKN', 'bkn': 'BKN', 'brooklyn': 'BKN',
  'hornets': 'CHA', 'cha': 'CHA', 'charlotte': 'CHA',
  'bulls': 'CHI', 'chi': 'CHI', 'chicago': 'CHI',
  'pistons': 'DET', 'det': 'DET', 'detroit': 'DET',
  'wizards': 'WAS', 'was': 'WAS', 'washington': 'WAS'
};

const MARKET_ALIASES = {
  'points': 'points', 'pts': 'points', 'point': 'points', 'scoring': 'points',
  'rebounds': 'rebounds', 'rebs': 'rebounds', 'reb': 'rebounds', 'boards': 'rebounds',
  'assists': 'assists', 'ast': 'assists', 'asts': 'assists', 'dimes': 'assists',
  'threes': 'threes', '3s': 'threes', 'three pointers': 'threes', '3pm': 'threes', 'treys': 'threes',
  'steals': 'steals', 'stl': 'steals', 'stls': 'steals',
  'blocks': 'blocks', 'blk': 'blocks', 'blks': 'blocks', 'swats': 'blocks',
  'pra': 'pra', 'pts+reb+ast': 'pra', 'points rebounds assists': 'pra',
  'pr': 'pr', 'pts+reb': 'pr', 'points rebounds': 'pr',
  'pa': 'pa', 'pts+ast': 'pa', 'points assists': 'pa',
  'ra': 'ra', 'reb+ast': 'ra', 'rebounds assists': 'ra',
  'fantasy': 'fantasy', 'fpts': 'fantasy', 'fantasy points': 'fantasy',
  'turnovers': 'turnovers', 'to': 'turnovers', 'tos': 'turnovers',
  'minutes': 'minutes', 'min': 'minutes', 'mins': 'minutes',
  'double double': 'double_double', 'double-double': 'double_double', 'dd': 'double_double',
  'triple double': 'triple_double', 'triple-double': 'triple_double', 'td': 'triple_double'
};

// ═══════════════════════════════════════════════════════════════════════════════
// NLP ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class RayNLPEngine {
  constructor() {
    this.intents = INTENTS;
    this.playerAliases = PLAYER_ALIASES;
    this.teamAliases = TEAM_ALIASES;
    this.marketAliases = MARKET_ALIASES;
    this.conversationHistory = [];
    this.lastEntities = {};
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INTENT CLASSIFICATION
  // ─────────────────────────────────────────────────────────────────────────────

  classifyIntent(input) {
    const normalized = input.toLowerCase().trim();
    const words = normalized.split(/\s+/);
    
    let bestMatch = { type: 'UNKNOWN', confidence: 0, patterns: [] };
    
    for (const [intentType, config] of Object.entries(this.intents)) {
      let matchScore = 0;
      const matchedPatterns = [];
      
      for (const pattern of config.patterns) {
        if (normalized.includes(pattern)) {
          matchScore += pattern.split(' ').length * 10;
          matchedPatterns.push(pattern);
        }
        
        // Fuzzy matching for typos
        for (const word of words) {
          if (this.levenshteinDistance(word, pattern) <= 2 && word.length > 3) {
            matchScore += 5;
          }
        }
      }
      
      // Boost for entity requirements match
      if (config.entities) {
        const entities = this.extractEntities(input);
        for (const req of config.entities) {
          if (entities[req]) matchScore += 15;
        }
      }
      
      // Apply priority weighting
      matchScore *= (config.priority || 1);
      
      if (matchScore > bestMatch.confidence) {
        bestMatch = {
          type: intentType,
          confidence: matchScore,
          patterns: matchedPatterns,
          requiredEntities: config.entities || [],
          priority: config.priority || 1
        };
      }
    }
    
    // Normalize confidence to 0-100
    bestMatch.confidence = Math.min(100, bestMatch.confidence);
    
    // Determine response format
    if (normalized.includes('deep') || normalized.includes('detail') || normalized.includes('everything')) {
      bestMatch.responseFormat = 'detailed';
    } else if (normalized.includes('quick') || normalized.includes('brief') || normalized.includes('short')) {
      bestMatch.responseFormat = 'brief';
    } else {
      bestMatch.responseFormat = 'full';
    }
    
    return bestMatch;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ENTITY EXTRACTION
  // ─────────────────────────────────────────────────────────────────────────────

  extractEntities(input) {
    const normalized = input.toLowerCase().trim();
    const entities = {};
    
    // Extract player
    const player = this.extractPlayer(normalized);
    if (player) entities.player = player;
    
    // Extract second player (for comparisons)
    const player2 = this.extractSecondPlayer(normalized, player);
    if (player2) entities.player2 = player2;
    
    // Extract team
    const team = this.extractTeam(normalized);
    if (team) entities.team = team;
    
    // Extract opponent
    const opponent = this.extractOpponent(normalized, team);
    if (opponent) entities.opponent = opponent;
    
    // Extract market
    const market = this.extractMarket(normalized);
    if (market) entities.market = market;
    
    // Extract line (number)
    const line = this.extractLine(normalized);
    if (line !== null) entities.line = line;
    
    // Extract timeframe
    const timeframe = this.extractTimeframe(normalized);
    if (timeframe) entities.timeframe = timeframe;
    
    // Extract direction (over/under)
    const direction = this.extractDirection(normalized);
    if (direction) entities.direction = direction;
    
    // Store for context
    this.lastEntities = { ...this.lastEntities, ...entities };
    
    // Fill from context if missing
    if (!entities.player && this.lastEntities.player) {
      entities.player = this.lastEntities.player;
      entities.fromContext = true;
    }
    if (!entities.market && this.lastEntities.market) {
      entities.market = this.lastEntities.market;
      entities.fromContext = true;
    }
    
    return entities;
  }

  extractPlayer(text) {
    // Check aliases first
    for (const [alias, fullName] of Object.entries(this.playerAliases)) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(text)) {
        return fullName;
      }
    }
    
    // Check for full names (first + last)
    const namePattern = /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g;
    const match = text.match(namePattern);
    if (match) {
      return match[0].toLowerCase();
    }
    
    return null;
  }

  extractSecondPlayer(text, firstPlayer) {
    // For comparison queries, find second player
    const vsMatch = text.match(/vs\.?\s*(\w+)/i) || 
                   text.match(/versus\s+(\w+)/i) ||
                   text.match(/or\s+(\w+)/i) ||
                   text.match(/compared?\s+to\s+(\w+)/i);
    
    if (vsMatch) {
      const alias = vsMatch[1].toLowerCase();
      if (this.playerAliases[alias] && this.playerAliases[alias] !== firstPlayer) {
        return this.playerAliases[alias];
      }
    }
    
    // Look for second player name
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (this.playerAliases[word] && this.playerAliases[word] !== firstPlayer) {
        return this.playerAliases[word];
      }
    }
    
    return null;
  }

  extractTeam(text) {
    for (const [alias, code] of Object.entries(this.teamAliases)) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(text)) {
        return code;
      }
    }
    return null;
  }

  extractOpponent(text, excludeTeam) {
    // Look for vs/against patterns
    const vsMatch = text.match(/(?:vs\.?|against|@)\s*(\w+)/i);
    if (vsMatch) {
      const alias = vsMatch[1].toLowerCase();
      if (this.teamAliases[alias] && this.teamAliases[alias] !== excludeTeam) {
        return this.teamAliases[alias];
      }
    }
    return null;
  }

  extractMarket(text) {
    for (const [alias, market] of Object.entries(this.marketAliases)) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(text)) {
        return market;
      }
    }
    return null;
  }

  extractLine(text) {
    // Match patterns like "at 25.5", "over 25.5", "25.5 line"
    const patterns = [
      /(?:at|over|under|o|u)\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*(?:line|prop)/i,
      /line\s*(?:of|at|is)?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*(?:points?|pts?|rebounds?|rebs?|assists?|ast)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    
    // Standalone number in context
    const standalone = text.match(/\b(\d+\.5)\b/);
    if (standalone) {
      return parseFloat(standalone[1]);
    }
    
    return null;
  }

  extractTimeframe(text) {
    const patterns = {
      'last 5': { games: 5, label: 'L5' },
      'last 10': { games: 10, label: 'L10' },
      'last 15': { games: 15, label: 'L15' },
      'last 20': { games: 20, label: 'L20' },
      'l5': { games: 5, label: 'L5' },
      'l10': { games: 10, label: 'L10' },
      'season': { games: 82, label: 'Season' },
      'this month': { games: 15, label: 'Month' },
      'recent': { games: 5, label: 'Recent' },
      'tonight': { games: 1, label: 'Tonight' },
      'today': { games: 1, label: 'Today' }
    };
    
    for (const [pattern, value] of Object.entries(patterns)) {
      if (text.includes(pattern)) {
        return value;
      }
    }
    
    // Extract "last X games"
    const match = text.match(/last\s+(\d+)/i);
    if (match) {
      const games = parseInt(match[1]);
      return { games, label: `L${games}` };
    }
    
    return null;
  }

  extractDirection(text) {
    if (/\bover\b/i.test(text) || /\bo\b(?=\s*\d)/i.test(text)) {
      return 'over';
    }
    if (/\bunder\b/i.test(text) || /\bu\b(?=\s*\d)/i.test(text)) {
      return 'under';
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SENTIMENT ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────────

  analyzeSentiment(text) {
    const positive = [
      'good', 'great', 'excellent', 'amazing', 'love', 'like', 'value', 'strong',
      'hot', 'fire', 'crushing', 'dominating', 'consistent', 'reliable'
    ];
    const negative = [
      'bad', 'terrible', 'awful', 'hate', 'worry', 'concern', 'risk', 'avoid',
      'cold', 'slump', 'struggling', 'inconsistent', 'volatile'
    ];
    const urgent = [
      'now', 'tonight', 'quick', 'fast', 'asap', 'hurry', 'lock'
    ];
    const uncertain = [
      'maybe', 'might', 'could', 'possibly', 'unsure', 'not sure', 'confused'
    ];
    
    const normalized = text.toLowerCase();
    let posScore = 0;
    let negScore = 0;
    let urgency = 0;
    let uncertainty = 0;
    
    positive.forEach(word => { if (normalized.includes(word)) posScore++; });
    negative.forEach(word => { if (normalized.includes(word)) negScore++; });
    urgent.forEach(word => { if (normalized.includes(word)) urgency++; });
    uncertain.forEach(word => { if (normalized.includes(word)) uncertainty++; });
    
    const total = posScore + negScore;
    let sentiment = 'neutral';
    
    if (total > 0) {
      const ratio = posScore / total;
      if (ratio > 0.6) sentiment = 'positive';
      else if (ratio < 0.4) sentiment = 'negative';
    }
    
    return {
      sentiment,
      positiveScore: posScore,
      negativeScore: negScore,
      urgency: urgency > 0,
      uncertainty: uncertainty > 0,
      confidence: total > 0 ? Math.abs(posScore - negScore) / total : 0.5
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RESPONSE GENERATION
  // ─────────────────────────────────────────────────────────────────────────────

  generateResponse(synthesis, format = 'full') {
    const { recommendation, keyFactors, risks, insights, grade } = synthesis;
    
    if (format === 'brief') {
      return this.generateBriefResponse(synthesis);
    }
    
    if (format === 'detailed') {
      return this.generateDetailedResponse(synthesis);
    }
    
    return this.generateFullResponse(synthesis);
  }

  generateBriefResponse(synthesis) {
    const { recommendation } = synthesis;
    const dir = recommendation.direction;
    const conf = recommendation.confidence;
    const edge = recommendation.edge?.toFixed(1) || '0';
    
    return `${dir === 'over' ? 'Over' : 'Under'} play with ${conf}% confidence and ${edge}% edge. Grade: ${synthesis.grade}.`;
  }

  generateFullResponse(synthesis) {
    const { recommendation, keyFactors, insights, grade } = synthesis;
    
    let response = '';
    
    // Opening with key finding
    const firstInsight = insights[0];
    if (firstInsight) {
      response += `${firstInsight.insight}. `;
    }
    
    // Key factors
    if (keyFactors && keyFactors.length > 0) {
      response += keyFactors.slice(0, 2).map(f => f.factor).join('. ') + '. ';
    }
    
    // Recommendation
    const dir = recommendation.direction;
    const conf = recommendation.confidence;
    const edge = recommendation.edge;
    
    if (edge >= 10 && conf >= 70) {
      response += `The data supports the ${dir}. `;
    } else if (edge >= 5 && conf >= 60) {
      response += `Marginal edge on the ${dir}—position size accordingly. `;
    } else {
      response += `No clear edge presents. Consider passing or exploring alternatives. `;
    }
    
    // Close with grade
    response += `Grade: ${grade}.`;
    
    return this.sanitize(response);
  }

  generateDetailedResponse(synthesis) {
    const { recommendation, keyFactors, risks, insights, opportunities, grade } = synthesis;
    
    let response = '';
    
    // All insights
    response += 'Running comprehensive analysis. ';
    insights.forEach(insight => {
      response += `${insight.insight}. `;
    });
    
    // Key factors
    response += 'Key factors: ';
    keyFactors.forEach(factor => {
      response += `${factor.factor}. `;
    });
    
    // Risks
    if (risks && risks.length > 0) {
      response += 'Risks to monitor: ';
      risks.forEach(risk => {
        response += `${risk.risk}. `;
      });
    }
    
    // Opportunities
    if (opportunities && opportunities.length > 0) {
      response += 'Opportunities: ';
      opportunities.forEach(opp => {
        response += `${opp.opportunity}. `;
      });
    }
    
    // Recommendation
    const dir = recommendation.direction;
    const conf = recommendation.confidence;
    const edge = recommendation.edge;
    const ev = recommendation.expectedValue;
    
    response += `Synthesis: ${dir.toUpperCase()} with ${conf}% confidence, ${edge?.toFixed(1) || 0}% edge, ${ev?.toFixed(2) || 0}% expected value. Grade: ${grade}.`;
    
    return this.sanitize(response);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  sanitize(text) {
    // Remove prohibited phrases
    const prohibited = [
      'unfortunately', 'luckily', 'amazingly', 'i think', 'in my opinion',
      'basically', 'essentially', 'at the end of the day', 'to be honest',
      'guaranteed', 'lock', 'sure thing', 'can\'t miss', 'slam dunk'
    ];
    
    let cleaned = text;
    prohibited.forEach(phrase => {
      cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
    });
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    cleaned = cleaned.replace(/\s+\./g, '.').replace(/\s+,/g, ',');
    cleaned = cleaned.replace(/\.\s*\./g, '.');
    
    return cleaned;
  }

  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
        }
      }
    }
    
    return dp[m][n];
  }

  // Clear context
  clearContext() {
    this.lastEntities = {};
    this.conversationHistory = [];
  }

  // Add to conversation history
  addToHistory(message, isUser = true) {
    this.conversationHistory.push({
      message,
      isUser,
      timestamp: Date.now()
    });
    
    // Keep only last 20 messages
    if (this.conversationHistory.length > 20) {
      this.conversationHistory.shift();
    }
  }

  // Get conversation summary
  getConversationSummary() {
    return {
      messageCount: this.conversationHistory.length,
      lastEntities: this.lastEntities,
      recentTopics: this.conversationHistory.slice(-5).map(m => m.message.substring(0, 50))
    };
  }
}

export default RayNLPEngine;
export { INTENTS, PLAYER_ALIASES, TEAM_ALIASES, MARKET_ALIASES };
