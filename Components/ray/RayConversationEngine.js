/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY CONVERSATION ENGINE v6.0 - TRUE JARVIS-LEVEL CONVERSATIONAL AI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This engine makes Ray handle LITERALLY ANY INPUT like Jarvis.
 * KEY PRINCIPLE: NEVER PANIC, ALWAYS RESPOND INTELLIGENTLY
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// RAY'S PERSONALITY CORE
// ═══════════════════════════════════════════════════════════════════════════════

const RAY_PERSONALITY = {
  name: 'Ray',
  version: '6.0',
  traits: {
    confident: true,
    analytical: true,
    witty: true,
    calm: true,
    helpful: true,
    professional: true,
    knowledgeable: true
  },
  
  speechPatterns: {
    analytical: [
      "The data suggests", "Looking at the numbers", "Analysis shows",
      "Based on the patterns", "The metrics indicate", "Statistically speaking"
    ],
    confident: [
      "Here's the situation", "Let me break this down", "The picture is clear",
      "I've got you covered", "Allow me to explain"
    ],
    casual: [
      "So here's the deal", "Alright, let's see", "Good question",
      "Interesting ask", "I hear you"
    ]
  },
  
  prohibited: [
    'unfortunately', 'luckily', 'amazingly', 'basically', 'essentially',
    'I think', 'in my opinion', 'I believe', 'guaranteed', 'lock'
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT CLASSIFICATION (100+ patterns)
// ═══════════════════════════════════════════════════════════════════════════════

const INTENT_PATTERNS = {
  greeting: {
    patterns: [
      /^(hey|hi|hello|yo|sup|what'?s\s*up|howdy|greetings|hiya)/i,
      /^ray\b/i, /good\s*(morning|afternoon|evening)/i
    ],
    priority: 1
  },
  
  identity: {
    patterns: [
      /who\s*are\s*you/i, /what\s*are\s*you/i, /what'?s\s*your\s*name/i,
      /tell\s*me\s*about\s*yourself/i, /are\s*you\s*(a\s*)?(bot|ai|robot)/i
    ],
    priority: 1
  },
  
  playerAnalysis: {
    patterns: [
      /(?:tell\s*me\s*about|analyze|check|look\s*at)\s+([a-z]+)/i,
      /(?:^|\s)(?:curry|steph|lebron|bron|jokic|joker|luka|doncic|tatum|durant|kd|giannis|embiid|sga|shai|ant|edwards|booker|lillard|dame|trae|morant|ja|haliburton|fox|mitchell|kawhi|pg13|davis|ad|kyrie|zion|brunson|butler|jimmy)\b/i
    ],
    priority: 2
  },
  
  valueFinder: {
    patterns: [
      /what.?s\s*good/i, /any\s*value/i, /best\s*(bet|pick|play)/i,
      /find\s*(me\s*)?(value|edge)/i, /opportunities/i, /tonight.?s\s*best/i
    ],
    priority: 2
  },
  
  consistency: {
    patterns: [
      /who.?s\s*consistent/i, /consistent\s*players?/i, /safe\s*(bet|play)/i,
      /reliable/i, /stable/i, /low\s*variance/i
    ],
    priority: 2
  },
  
  trending: {
    patterns: [
      /who.?s\s*(hot|trending|on\s*fire)/i, /trending\s*players?/i,
      /hot\s*(streak|players?)/i, /heating\s*up/i, /momentum/i
    ],
    priority: 2
  },
  
  comparison: {
    patterns: [
      /compare/i, /vs\.?/i, /versus/i, /which.*better/i, /who.?s\s*better/i
    ],
    priority: 2
  },
  
  help: {
    patterns: [
      /^help$/i, /what\s*can\s*you\s*do/i, /how\s*do\s*you\s*work/i,
      /capabilities/i, /commands|options/i, /how\s*to\s*use/i
    ],
    priority: 1
  },
  
  thanks: {
    patterns: [
      /\b(thanks?|thank\s*you|thx|ty|appreciate|cheers)\b/i,
      /you.?re\s*(the\s*)?(best|great|awesome)/i, /good\s*(job|work)/i
    ],
    priority: 1
  },
  
  goodbye: {
    patterns: [
      /\b(bye|goodbye|cya|see\s*ya|later|peace|out)\b/i,
      /talk\s*later/i, /i.?m\s*(out|done|leaving)/i
    ],
    priority: 1
  },
  
  fun: {
    patterns: [
      /tell\s*(me\s*)?(a\s*)?joke/i, /say\s*something\s*funny/i,
      /make\s*me\s*laugh/i, /i.?m\s*bored/i, /bored/i
    ],
    priority: 3
  },
  
  compliment: {
    patterns: [
      /you.?re\s*(so\s*)?(smart|intelligent|good|amazing|awesome)/i,
      /i\s*love\s*(you|this)/i, /you.?re\s*the\s*best/i, /you\s*rock/i
    ],
    priority: 3
  },
  
  insult: {
    patterns: [
      /you\s*(suck|stink|are\s*bad|are\s*stupid)/i,
      /(stupid|dumb|idiot|useless)\s*(bot|ai)?/i, /hate\s*(you|this)/i
    ],
    priority: 3
  },
  
  opinion: {
    patterns: [
      /what\s*do\s*you\s*think/i, /your\s*opinion/i, /what.?s\s*your\s*take/i,
      /do\s*you\s*think/i, /should\s*i/i, /what\s*would\s*you\s*do/i
    ],
    priority: 3
  },
  
  weather: {
    patterns: [/weather/i, /temperature/i, /is\s*it\s*(hot|cold|raining)/i],
    priority: 4
  },
  
  time: {
    patterns: [/what\s*time/i, /current\s*time/i, /what\s*day/i, /today.?s\s*date/i],
    priority: 4
  },
  
  news: {
    patterns: [/any\s*news/i, /what.?s\s*happening/i, /headlines/i],
    priority: 4
  },
  
  sports: {
    patterns: [
      /who\s*(won|is\s*winning)/i, /game\s*score/i, /what.?s\s*the\s*score/i,
      /tonight.?s\s*games?/i, /nba\s*news/i, /injury\s*report/i
    ],
    priority: 3
  },
  
  philosophical: {
    patterns: [
      /meaning\s*of\s*life/i, /are\s*you\s*alive/i,
      /do\s*you\s*have\s*(feelings|emotions)/i, /are\s*you\s*sentient/i
    ],
    priority: 4
  },
  
  sizing: {
    patterns: [
      /how\s*much\s*should\s*i\s*bet/i, /bet\s*size/i, /units?/i,
      /kelly/i, /sizing/i, /bankroll/i
    ],
    priority: 2
  },
  
  affirmative: {
    patterns: [/^(yes|yeah|yep|yup|sure|ok|okay|alright|correct|right)$/i],
    priority: 5
  },
  
  negative: {
    patterns: [/^(no|nope|nah|never\s*mind|forget\s*it)$/i],
    priority: 5
  },
  
  confusion: {
    patterns: [
      /^(huh|what|wha|um|hmm|idk|\?)$/i, /what\s*do\s*you\s*mean/i,
      /i\s*don.?t\s*understand/i, /confused/i
    ],
    priority: 5
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const RESPONSE_TEMPLATES = {
  greeting: [
    "Ready for analysis. What player or game has your attention?",
    "Online and operational. Who are we analyzing today?",
    "At your service. Give me a player name and I'll break it down.",
    "Ray here. What do you want to know?"
  ],
  
  identity: [
    "I'm Ray, your sports betting analytics AI. Version 6.0, powered by real NBA data. I analyze player props, find value plays, and help you make data-driven decisions. No hype, no locks—just the numbers."
  ],
  
  help: [
    "Here's what I can do: Analyze any NBA player's props, find value plays, identify consistent players, spot trending performers, compare players head-to-head. Try 'Analyze Curry points' or 'What's good tonight?'"
  ],
  
  thanks: [
    "No problem. Ready when you need more analysis.",
    "Anytime. That's what I'm here for.",
    "You got it. Let me know when you need another breakdown."
  ],
  
  goodbye: [
    "Good luck out there. Remember—edge over volume.",
    "Catch you later. May the variance be in your favor.",
    "Take care. Come back when you need data."
  ],
  
  fun: [
    "I'd tell you a joke about a parlay, but it never hits. Let's stick to single props.",
    "Fun fact: The house edge on parlays is brutal. That's the real joke.",
    "My humor circuits run on data. Give me a player name—that's where the magic happens."
  ],
  
  compliment: [
    "Appreciate that. Now let's make you some money—what player should we analyze?",
    "Thanks. I aim to be useful. What else can I help with?",
    "Glad I could help. Ready for another question."
  ],
  
  insult: [
    "I hear you. Maybe I can change your mind—try asking about a specific player.",
    "Fair enough. Give me another shot—ask about any NBA player.",
    "Noted. Let's start fresh—what's one player you're curious about?"
  ],
  
  opinion: [
    "I don't deal in opinions—only probabilities. Give me a specific player or prop and I'll show you the data.",
    "My job is to show you the data, not make decisions. Which player are you considering?"
  ],
  
  weather: [
    "Weather's not my department—I'm all about player analytics. But speaking of hot and cold, want me to show you who's heating up in the NBA?"
  ],
  
  time: [
    "Check your clock, then check with me on tonight's player props. What's on your mind?"
  ],
  
  news: [
    "I'm focused on player stats and props, not breaking news. But if you want the latest on a specific player's performance, I've got you."
  ],
  
  sports: [
    "I'm built for prop betting analytics specifically. For scores and game info, check any sports app. But for player breakdowns? That's my lane."
  ],
  
  philosophical: [
    "Deep questions require processing power I'd rather spend on your betting analysis. What player should I focus on?",
    "The meaning of life? Positive expected value and good bankroll management. What else can I help with?"
  ],
  
  affirmative: [
    "Great. What would you like me to analyze?",
    "Perfect. Give me a player name or ask what's good tonight."
  ],
  
  negative: [
    "No worries. Let me know when you're ready for analysis.",
    "Fair enough. I'm here when you need me."
  ],
  
  confusion: [
    "Let me clarify—I analyze NBA player props. Try 'Analyze LeBron points' or 'Who's consistent tonight?'",
    "No problem. Start with a player name or ask 'What's good?' and I'll take it from there."
  ],
  
  fallbackWithContext: (player) => [
    `Still thinking about ${player}? I can check their rebounds, assists, or threes if you want.`,
    `Want more on ${player}? Just say which market—points, rebounds, or assists.`,
    `I've still got ${player} pulled up. What else do you want to know?`
  ],
  
  fallbackIntelligent: [
    "I'm not sure I caught that. Try asking about a specific player—like 'How's Curry doing?' or 'Analyze Jokic points.'",
    "Didn't quite get that one. I'm best with player questions. Who should I analyze?",
    "Let me redirect—I specialize in player props. Give me a name or ask 'What's good tonight?'",
    "That's outside my wheelhouse. Try 'Analyze [player name]' or 'Find value plays'.",
    "I'm built for player analytics. Try asking about Curry, LeBron, Jokic—anyone in the NBA.",
    "Not sure what you're looking for there. My specialty is player props. What's one player you're curious about?"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER ALIASES
// ═══════════════════════════════════════════════════════════════════════════════

const PLAYER_ALIASES = {
  'curry': 'Stephen Curry', 'steph': 'Stephen Curry', 'chef': 'Stephen Curry',
  'lebron': 'LeBron James', 'bron': 'LeBron James', 'king': 'LeBron James', 'james': 'LeBron James',
  'jokic': 'Nikola Jokic', 'joker': 'Nikola Jokic', 'nikola': 'Nikola Jokic',
  'luka': 'Luka Doncic', 'doncic': 'Luka Doncic',
  'tatum': 'Jayson Tatum', 'jt': 'Jayson Tatum',
  'kd': 'Kevin Durant', 'durant': 'Kevin Durant',
  'booker': 'Devin Booker', 'book': 'Devin Booker',
  'giannis': 'Giannis Antetokounmpo', 'greek': 'Giannis Antetokounmpo',
  'dame': 'Damian Lillard', 'lillard': 'Damian Lillard',
  'embiid': 'Joel Embiid', 'joel': 'Joel Embiid',
  'sga': 'Shai Gilgeous-Alexander', 'shai': 'Shai Gilgeous-Alexander',
  'ant': 'Anthony Edwards', 'edwards': 'Anthony Edwards',
  'trae': 'Trae Young', 'young': 'Trae Young',
  'ja': 'Ja Morant', 'morant': 'Ja Morant',
  'hali': 'Tyrese Haliburton', 'haliburton': 'Tyrese Haliburton',
  'fox': "De'Aaron Fox", 'deaaron': "De'Aaron Fox",
  'mitchell': 'Donovan Mitchell', 'spida': 'Donovan Mitchell',
  'kawhi': 'Kawhi Leonard', 'leonard': 'Kawhi Leonard',
  'pg': 'Paul George', 'pg13': 'Paul George',
  'ad': 'Anthony Davis', 'davis': 'Anthony Davis',
  'kyrie': 'Kyrie Irving', 'irving': 'Kyrie Irving',
  'zion': 'Zion Williamson',
  'brunson': 'Jalen Brunson', 'jalen': 'Jalen Brunson',
  'bam': 'Bam Adebayo', 'adebayo': 'Bam Adebayo',
  'butler': 'Jimmy Butler', 'jimmy': 'Jimmy Butler', 'buckets': 'Jimmy Butler'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class RayConversationEngine {
  constructor() {
    this.context = {
      lastPlayer: null,
      lastMarket: null,
      lastIntent: null,
      conversationTurns: [],
      consecutiveUnknowns: 0,
      sessionStart: Date.now(),
      totalQueries: 0
    };
  }
  
  classifyIntent(input) {
    const cleaned = input.toLowerCase().trim();
    let bestMatch = { intent: 'unknown', confidence: 0, entities: {} };
    
    for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (pattern.test(cleaned)) {
          const confidence = 100 - (config.priority * 10);
          if (confidence > bestMatch.confidence) {
            bestMatch = { 
              intent, 
              confidence, 
              entities: this.extractEntities(input)
            };
          }
        }
      }
    }
    
    this.context.totalQueries++;
    return bestMatch;
  }
  
  extractEntities(input) {
    const entities = {};
    const cleaned = input.toLowerCase();
    
    // Player detection
    for (const [alias, fullName] of Object.entries(PLAYER_ALIASES)) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(cleaned)) {
        if (!entities.player) {
          entities.player = fullName;
        } else if (!entities.player2 && fullName !== entities.player) {
          entities.player2 = fullName;
        }
      }
    }
    
    // Market detection
    const marketPatterns = {
      points: /\b(points?|pts|scoring)\b/i,
      rebounds: /\b(rebounds?|reb|boards?)\b/i,
      assists: /\b(assists?|ast|dimes?)\b/i,
      threes: /\b(threes?|3s|3pm)\b/i,
      steals: /\b(steals?|stl)\b/i,
      blocks: /\b(blocks?|blk)\b/i,
      pra: /\b(pra|p\+r\+a)\b/i
    };
    
    for (const [market, pattern] of Object.entries(marketPatterns)) {
      if (pattern.test(cleaned)) {
        entities.market = market;
        break;
      }
    }
    
    // Line detection
    const lineMatch = cleaned.match(/\b(\d+\.?\d*)\b/);
    if (lineMatch) {
      const num = parseFloat(lineMatch[1]);
      if (num > 0 && num < 100) {
        entities.line = num;
      }
    }
    
    // Direction
    if (/\b(over|o)\b/i.test(cleaned)) entities.direction = 'over';
    if (/\b(under|u)\b/i.test(cleaned)) entities.direction = 'under';
    
    return entities;
  }
  
  getResponse(intent) {
    const templates = RESPONSE_TEMPLATES[intent];
    if (!templates || templates.length === 0) return null;
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  generateFallback(input) {
    this.context.consecutiveUnknowns++;
    
    // If we have recent player context
    if (this.context.lastPlayer && this.context.consecutiveUnknowns <= 2) {
      const contextResponses = RESPONSE_TEMPLATES.fallbackWithContext(this.context.lastPlayer);
      return {
        text: contextResponses[Math.floor(Math.random() * contextResponses.length)],
        confidence: 70
      };
    }
    
    // After too many unknowns, offer help
    if (this.context.consecutiveUnknowns >= 3) {
      this.context.consecutiveUnknowns = 0;
      return {
        text: "Looks like we're not connecting. Here's what I do best: player prop analysis. Try 'Analyze Curry' or 'Who's consistent tonight?'",
        confidence: 60
      };
    }
    
    const fallbacks = RESPONSE_TEMPLATES.fallbackIntelligent;
    return {
      text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      confidence: 55
    };
  }
  
  updateContext(key, value) {
    if (key === 'player') this.context.lastPlayer = value;
    if (key === 'market') this.context.lastMarket = value;
    if (key === 'intent') this.context.lastIntent = value;
    
    if (key === 'intent' && value !== 'unknown') {
      this.context.consecutiveUnknowns = 0;
    }
  }
  
  getStarter(style = 'analytical') {
    const patterns = RAY_PERSONALITY.speechPatterns[style] || RAY_PERSONALITY.speechPatterns.casual;
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  getContext() {
    return {
      player: this.context.lastPlayer,
      market: this.context.lastMarket,
      lastIntent: this.context.lastIntent,
      consecutiveUnknowns: this.context.consecutiveUnknowns,
      totalQueries: this.context.totalQueries
    };
  }
  
  reset() {
    this.context = {
      lastPlayer: null,
      lastMarket: null,
      lastIntent: null,
      conversationTurns: [],
      consecutiveUnknowns: 0,
      sessionStart: Date.now(),
      totalQueries: 0
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default RayConversationEngine;
export { 
  RayConversationEngine, 
  RESPONSE_TEMPLATES, 
  INTENT_PATTERNS, 
  RAY_PERSONALITY,
  PLAYER_ALIASES 
};
