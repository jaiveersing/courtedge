/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY INTENT SYSTEM - Zero-Friction Intent Recognition
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automatically recognizes and executes user intent from natural language
 * commands without requiring specific syntax or formal patterns.
 * 
 * INTENT CATEGORIES:
 * - Navigation (open game, go to player, back to slate)
 * - Evaluation (what's good, is this fake, any red flags)
 * - Analysis Depth (deep dive, quick take, drill down)
 * - Comparison (compare, vs, which one)
 * - Market Exploration (points, rebounds, assists, alt markets)
 * - Temporal Adjustment (last 5, season, matchup history)
 * - Contextual Filters (home, away, b2b, without teammate)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useMemo } from 'react';
import { useRayContext } from './RayContext';

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT PATTERNS - Comprehensive Natural Language Mapping
// ═══════════════════════════════════════════════════════════════════════════════

const INTENT_PATTERNS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // GREETING INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  greeting: {
    patterns: [
      /^(hey|hi|hello|yo|sup|what's up|howdy|good\s*(morning|evening|afternoon))/i,
      /^ray[\s,!.?]*/i
    ],
    action: 'greet',
    priority: 1
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  openGame: {
    patterns: [
      /(open|show|pull\s*up|look\s*at|check|load|get).*(game|match|matchup)/i,
      /(open|show|pull\s*up|look\s*at).*(lakers|celtics|warriors|bucks|nuggets|suns|heat|mavericks|76ers|nets|knicks|clippers|kings|grizzlies|pelicans|thunder|timberwolves|pacers|cavaliers|magic|hawks|bulls|pistons|hornets|wizards|raptors|rockets|spurs|jazz|blazers)/i
    ],
    extract: {
      team: /(lakers|celtics|warriors|bucks|nuggets|suns|heat|mavericks|76ers|sixers|nets|knicks|clippers|kings|grizzlies|pelicans|thunder|timberwolves|wolves|pacers|cavaliers|cavs|magic|hawks|bulls|pistons|hornets|wizards|raptors|rockets|spurs|jazz|blazers)/i
    },
    action: 'navigateToGame',
    priority: 2
  },
  
  openPlayer: {
    patterns: [
      /(go\s*to|look\s*at|show\s*me|analyze|check|pull\s*up)\s*(\w+\s*\w*)/i,
      /(lebron|curry|giannis|jokic|luka|tatum|durant|embiid|edwards|brunson|morant|mitchell|booker|lillard|harden|westbrook|irving|butler|bam|sabonis|fox|towns|gobert|adebayo|siakam|garland|murray|maxey|haliburton|lamelo|ant|cade|paolo|wemby|scottie)/i
    ],
    extract: {
      player: /(lebron|james|curry|stephen|steph|giannis|antetokounmpo|jokic|nikola|luka|doncic|tatum|jayson|durant|kd|kevin|embiid|joel|edwards|anthony|brunson|jalen|morant|ja|mitchell|donovan|booker|devin|lillard|damian|dame|harden|james|westbrook|russell|russ|irving|kyrie|butler|jimmy|bam|adebayo|sabonis|domantas|fox|deaaron|towns|karl|gobert|rudy|siakam|pascal|garland|darius|murray|jamal|dejounte|maxey|tyrese|haliburton|lamelo|ball|ant|cade|cunningham|paolo|banchero|wemby|wembanyama|victor|scottie|barnes)/i
    },
    action: 'navigateToPlayer',
    priority: 2
  },
  
  backToSlate: {
    patterns: [
      /(back|return|go\s*back).*(slate|games|home|dashboard)/i,
      /(show|what.?s).*(all|tonight.?s?)\s*games/i,
      /^(games|slate|home|back)$/i
    ],
    action: 'navigateToSlate',
    priority: 2
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // EVALUATION INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  whatGood: {
    patterns: [
      /what.?s\s*good/i,
      /(any|what|show).*(value|opportunities|edges|plays)/i,
      /what\s*(do\s*you|should\s*i)\s*(like|bet|play|take)/i,
      /(best|top)\s*(bets?|picks?|plays?)/i,
      /where.?s\s*(the\s*)?(value|edge|money)/i
    ],
    action: 'evaluateOpportunities',
    priority: 3
  },
  
  isLineFake: {
    patterns: [
      /(is\s*this\s*line|line).*(fake|real|trap|sharp|soft)/i,
      /(does\s*this|this).*(make\s*sense|look\s*right|seem\s*off)/i,
      /(is\s*this|this).*(sharp|square|public)/i,
      /line\s*(check|analysis|review)/i
    ],
    action: 'analyzeLineAuthenticity',
    priority: 3
  },
  
  riskAssessment: {
    patterns: [
      /(what|any).*(risk|concern|worry|red\s*flag|warning|issue)/i,
      /what\s*am\s*i\s*missing/i,
      /(should\s*i\s*be\s*)?(worried|concerned)/i,
      /downside|danger|avoid/i
    ],
    action: 'assessRisks',
    priority: 3
  },
  
  consistency: {
    patterns: [
      /(who|what).?s\s*(consistent|safe|reliable|stable)/i,
      /(low|lowest)\s*variance/i,
      /safe\s*(bets?|plays?|picks?)/i,
      /chalk/i
    ],
    action: 'findConsistentOptions',
    priority: 3
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ANALYSIS DEPTH INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  deepDive: {
    patterns: [
      /(deep\s*dive|tell\s*me\s*everything|full\s*analysis|comprehensive)/i,
      /(talk\s*to\s*me|elaborate|expand|more\s*details?)\s*(about|on)?/i,
      /go\s*(deep|deeper|in\s*depth)/i,
      /breakdown/i
    ],
    action: 'provideDeepAnalysis',
    priority: 4
  },
  
  quickTake: {
    patterns: [
      /(quick|fast|brief|short)\s*(take|summary|overview|rundown)/i,
      /(just\s*the\s*)?(summary|tldr|bottom\s*line|highlights?)/i,
      /high\s*level\s*only/i,
      /in\s*a\s*nutshell/i
    ],
    action: 'provideQuickSummary',
    priority: 4
  },
  
  drillDown: {
    patterns: [
      /(drill\s*down|dig\s*in|what.?s\s*behind)/i,
      /(why|how\s*come|explain)/i,
      /more\s*(on|about)\s*(this|that)/i
    ],
    action: 'drillDown',
    priority: 4
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COMPARISON INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  comparison: {
    patterns: [
      /(compare|versus|vs\.?)\s*(\w+)/i,
      /(\w+)\s*(or|vs\.?|versus)\s*(\w+)/i,
      /(which|who).*(better|prefer|pick|take)/i,
      /better\s*option/i,
      /^compare$/i
    ],
    extract: {
      players: /(\w+)\s*(or|vs\.?|versus|and)\s*(\w+)/i
    },
    action: 'compareEntities',
    priority: 5
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // MARKET EXPLORATION INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  switchMarket: {
    patterns: [
      /(what\s*about|show|check|switch\s*to)\s*(points|rebounds|assists|threes|steals|blocks|pra)/i,
      /^(points|rebounds|assists|threes|3s|steals|blocks|pra)$/i,
      /(his|their)\s*(points|rebounds|assists|threes|steals|blocks)/i
    ],
    extract: {
      market: /(points|pts|rebounds|rebs|boards|assists|asts|dimes|threes|3s|3pt|steals|stl|blocks|blk|pra|pts\+reb\+ast)/i
    },
    action: 'switchMarket',
    priority: 5
  },
  
  alternativeMarkets: {
    patterns: [
      /(any\s*other|alternative|different)\s*(markets?|props?|lines?)/i,
      /what\s*else\s*(is\s*there|you\s*got)/i,
      /other\s*options/i
    ],
    action: 'exploreAlternatives',
    priority: 5
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TEMPORAL ADJUSTMENT INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  temporalFilter: {
    patterns: [
      /(last|past|recent)\s*(\d+)\s*(games?)/i,
      /(season|full\s*year|overall)\s*(average|stats?)/i,
      /(this|past)\s*(week|month)/i,
      /(matchup|head\s*to\s*head|h2h)\s*history/i,
      /against\s*(this\s*team|them)/i
    ],
    extract: {
      games: /last\s*(\d+)/i,
      window: /(season|week|month|matchup|h2h)/i
    },
    action: 'adjustTimeframe',
    priority: 6
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONTEXTUAL FILTER INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  locationFilter: {
    patterns: [
      /(home|away|road)\s*(games?\s*)?(only|splits?)/i,
      /how.?s\s*(he|she|they)\s*(at\s*home|on\s*the\s*road)/i,
      /(when\s*)?(playing\s*)?(at\s*home|away)/i
    ],
    extract: {
      location: /(home|away|road)/i
    },
    action: 'filterByLocation',
    priority: 6
  },
  
  restFilter: {
    patterns: [
      /(back\s*to\s*back|b2b|btb)/i,
      /(rested|fresh|after\s*rest|days?\s*off)/i,
      /(tired|fatigued)/i
    ],
    extract: {
      restStatus: /(b2b|back\s*to\s*back|rested|fresh)/i
    },
    action: 'filterByRest',
    priority: 6
  },
  
  rosterFilter: {
    patterns: [
      /(without|when\s*[\w\s]+\s*is\s*out)/i,
      /(with|when\s*[\w\s]+\s*plays?)/i,
      /lineup\s*(changes?|impact)/i
    ],
    extract: {
      player: /without\s+(\w+)/i
    },
    action: 'filterByRoster',
    priority: 6
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TRENDING / HOT PLAYERS
  // ─────────────────────────────────────────────────────────────────────────────
  trending: {
    patterns: [
      /(who.?s|what.?s)\s*(trending|hot|on\s*fire|streaking)/i,
      /(hot\s*streak|momentum|heating\s*up)/i,
      /who.?s\s*been\s*(hot|good|great)/i
    ],
    action: 'findTrending',
    priority: 3
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // HELP / META INTENTS
  // ─────────────────────────────────────────────────────────────────────────────
  help: {
    patterns: [
      /(help|what\s*can\s*you\s*do|commands?|how\s*does\s*this\s*work)/i,
      /^(\?|help)$/i
    ],
    action: 'showHelp',
    priority: 1
  },
  
  status: {
    patterns: [
      /(what.?s\s*the\s*)?(status|situation|context)/i,
      /where\s*(are\s*we|am\s*i)/i,
      /current\s*(focus|context)/i
    ],
    action: 'showStatus',
    priority: 1
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

const PLAYER_ALIASES = {
  'lebron': 'LeBron James',
  'james': 'LeBron James',
  'king james': 'LeBron James',
  'curry': 'Stephen Curry',
  'steph': 'Stephen Curry',
  'chef curry': 'Stephen Curry',
  'giannis': 'Giannis Antetokounmpo',
  'greek freak': 'Giannis Antetokounmpo',
  'jokic': 'Nikola Jokic',
  'joker': 'Nikola Jokic',
  'luka': 'Luka Doncic',
  'tatum': 'Jayson Tatum',
  'jt': 'Jayson Tatum',
  'durant': 'Kevin Durant',
  'kd': 'Kevin Durant',
  'embiid': 'Joel Embiid',
  'joel': 'Joel Embiid',
  'edwards': 'Anthony Edwards',
  'ant': 'Anthony Edwards',
  'ant man': 'Anthony Edwards',
  'brunson': 'Jalen Brunson',
  'morant': 'Ja Morant',
  'ja': 'Ja Morant',
  'mitchell': 'Donovan Mitchell',
  'spida': 'Donovan Mitchell',
  'booker': 'Devin Booker',
  'book': 'Devin Booker',
  'lillard': 'Damian Lillard',
  'dame': 'Damian Lillard',
  'harden': 'James Harden',
  'beard': 'James Harden',
  'westbrook': 'Russell Westbrook',
  'russ': 'Russell Westbrook',
  'irving': 'Kyrie Irving',
  'kyrie': 'Kyrie Irving',
  'butler': 'Jimmy Butler',
  'jimmy': 'Jimmy Butler',
  'bam': 'Bam Adebayo',
  'sabonis': 'Domantas Sabonis',
  'fox': 'De\'Aaron Fox',
  'towns': 'Karl-Anthony Towns',
  'kat': 'Karl-Anthony Towns',
  'gobert': 'Rudy Gobert',
  'siakam': 'Pascal Siakam',
  'garland': 'Darius Garland',
  'murray': 'Jamal Murray',
  'maxey': 'Tyrese Maxey',
  'haliburton': 'Tyrese Haliburton',
  'lamelo': 'LaMelo Ball',
  'melo': 'LaMelo Ball',
  'cade': 'Cade Cunningham',
  'paolo': 'Paolo Banchero',
  'wemby': 'Victor Wembanyama',
  'wembanyama': 'Victor Wembanyama',
  'scottie': 'Scottie Barnes'
};

const TEAM_ALIASES = {
  'lakers': 'Los Angeles Lakers',
  'celtics': 'Boston Celtics',
  'warriors': 'Golden State Warriors',
  'dubs': 'Golden State Warriors',
  'bucks': 'Milwaukee Bucks',
  'nuggets': 'Denver Nuggets',
  'suns': 'Phoenix Suns',
  'heat': 'Miami Heat',
  'mavericks': 'Dallas Mavericks',
  'mavs': 'Dallas Mavericks',
  '76ers': 'Philadelphia 76ers',
  'sixers': 'Philadelphia 76ers',
  'nets': 'Brooklyn Nets',
  'knicks': 'New York Knicks',
  'clippers': 'LA Clippers',
  'clips': 'LA Clippers',
  'kings': 'Sacramento Kings',
  'grizzlies': 'Memphis Grizzlies',
  'grizz': 'Memphis Grizzlies',
  'pelicans': 'New Orleans Pelicans',
  'pels': 'New Orleans Pelicans',
  'thunder': 'Oklahoma City Thunder',
  'okc': 'Oklahoma City Thunder',
  'timberwolves': 'Minnesota Timberwolves',
  'wolves': 'Minnesota Timberwolves',
  'pacers': 'Indiana Pacers',
  'cavaliers': 'Cleveland Cavaliers',
  'cavs': 'Cleveland Cavaliers',
  'magic': 'Orlando Magic',
  'hawks': 'Atlanta Hawks',
  'bulls': 'Chicago Bulls',
  'pistons': 'Detroit Pistons',
  'hornets': 'Charlotte Hornets',
  'wizards': 'Washington Wizards',
  'raptors': 'Toronto Raptors',
  'rockets': 'Houston Rockets',
  'spurs': 'San Antonio Spurs',
  'jazz': 'Utah Jazz',
  'blazers': 'Portland Trail Blazers'
};

const MARKET_ALIASES = {
  'points': 'points',
  'pts': 'points',
  'scoring': 'points',
  'rebounds': 'rebounds',
  'rebs': 'rebounds',
  'boards': 'rebounds',
  'assists': 'assists',
  'asts': 'assists',
  'dimes': 'assists',
  'threes': 'threes',
  '3s': 'threes',
  '3pt': 'threes',
  'three pointers': 'threes',
  'steals': 'steals',
  'stl': 'steals',
  'blocks': 'blocks',
  'blk': 'blocks',
  'pra': 'pra',
  'pts+reb+ast': 'pra',
  'combo': 'pra'
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT RECOGNITION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const recognizeIntent = (input, context = {}) => {
  const normalizedInput = input.toLowerCase().trim();
  
  // Track all matched intents with confidence scores
  const matchedIntents = [];
  
  // Check each intent pattern
  for (const [intentName, intentConfig] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of intentConfig.patterns) {
      const match = normalizedInput.match(pattern);
      if (match) {
        // Extract entities if defined
        let entities = {};
        if (intentConfig.extract) {
          for (const [entityName, entityPattern] of Object.entries(intentConfig.extract)) {
            const entityMatch = normalizedInput.match(entityPattern);
            if (entityMatch) {
              entities[entityName] = entityMatch[1] || entityMatch[0];
            }
          }
        }
        
        // Calculate confidence based on match quality
        const matchLength = match[0].length;
        const inputLength = normalizedInput.length;
        const matchRatio = matchLength / inputLength;
        const confidence = Math.min(95, 50 + (matchRatio * 50) - (intentConfig.priority * 2));
        
        matchedIntents.push({
          intent: intentName,
          action: intentConfig.action,
          confidence,
          priority: intentConfig.priority,
          match: match[0],
          entities,
          fullMatch: match
        });
        
        break; // Only count first matching pattern per intent
      }
    }
  }
  
  // Sort by confidence and priority
  matchedIntents.sort((a, b) => {
    if (Math.abs(a.confidence - b.confidence) < 10) {
      return a.priority - b.priority;
    }
    return b.confidence - a.confidence;
  });
  
  // Return best match or fallback
  if (matchedIntents.length > 0) {
    const best = matchedIntents[0];
    
    // Enrich entities with aliases
    if (best.entities.player) {
      const alias = best.entities.player.toLowerCase();
      best.entities.playerName = PLAYER_ALIASES[alias] || best.entities.player;
    }
    if (best.entities.team) {
      const alias = best.entities.team.toLowerCase();
      best.entities.teamName = TEAM_ALIASES[alias] || best.entities.team;
    }
    if (best.entities.market) {
      const alias = best.entities.market.toLowerCase();
      best.entities.marketType = MARKET_ALIASES[alias] || best.entities.market;
    }
    
    return {
      recognized: true,
      ...best,
      alternatives: matchedIntents.slice(1, 3) // Include top 2 alternatives
    };
  }
  
  // No intent matched - use context to infer
  return inferIntentFromContext(normalizedInput, context);
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT-BASED INFERENCE
// ═══════════════════════════════════════════════════════════════════════════════

const inferIntentFromContext = (input, context) => {
  // Check for player name mentions
  for (const [alias, fullName] of Object.entries(PLAYER_ALIASES)) {
    if (input.includes(alias)) {
      return {
        recognized: true,
        intent: 'playerMention',
        action: 'navigateToPlayer',
        confidence: 75,
        entities: { player: alias, playerName: fullName }
      };
    }
  }
  
  // Check for team mentions
  for (const [alias, fullName] of Object.entries(TEAM_ALIASES)) {
    if (input.includes(alias)) {
      return {
        recognized: true,
        intent: 'teamMention',
        action: 'navigateToGame',
        confidence: 70,
        entities: { team: alias, teamName: fullName }
      };
    }
  }
  
  // Check for market mentions
  for (const [alias, marketType] of Object.entries(MARKET_ALIASES)) {
    if (input.includes(alias)) {
      return {
        recognized: true,
        intent: 'marketMention',
        action: 'switchMarket',
        confidence: 70,
        entities: { market: alias, marketType }
      };
    }
  }
  
  // Check for numbers (might be line values)
  const numberMatch = input.match(/(\d+\.?\d*)/);
  if (numberMatch) {
    return {
      recognized: true,
      intent: 'lineValue',
      action: 'setLine',
      confidence: 60,
      entities: { line: parseFloat(numberMatch[1]) }
    };
  }
  
  // Fallback - general query
  return {
    recognized: false,
    intent: 'unknown',
    action: 'clarify',
    confidence: 30,
    entities: {},
    suggestedClarification: generateClarification(input, context)
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLARIFICATION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

const generateClarification = (input, context) => {
  // Generate a smart clarification based on context
  if (context.player?.active) {
    return `I can analyze ${context.player.active.name}'s props unless you want something else?`;
  }
  if (context.game?.active) {
    return `Looking at the ${context.game.active.name} game. Which player or prop interests you?`;
  }
  return `I can analyze any player prop or game. Who are you looking at?`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

const parseChainedCommands = (input) => {
  // Split by common conjunctions
  const separators = /\s+and\s+|\s+then\s+|\s+also\s+|,\s*/i;
  const parts = input.split(separators).filter(p => p.trim());
  
  if (parts.length <= 1) {
    return [input];
  }
  
  return parts.map(p => p.trim());
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export const useRayIntent = () => {
  const rayContext = useRayContext?.() || {};
  
  const parseIntent = useCallback((input) => {
    // Check for chained commands
    const commands = parseChainedCommands(input);
    
    if (commands.length > 1) {
      return {
        isChained: true,
        commands: commands.map(cmd => recognizeIntent(cmd, rayContext))
      };
    }
    
    return {
      isChained: false,
      ...recognizeIntent(input, rayContext)
    };
  }, [rayContext]);
  
  const resolvePlayer = useCallback((input) => {
    const lower = input.toLowerCase();
    
    // Check direct aliases
    if (PLAYER_ALIASES[lower]) {
      return { found: true, name: PLAYER_ALIASES[lower], alias: lower };
    }
    
    // Check partial matches
    for (const [alias, name] of Object.entries(PLAYER_ALIASES)) {
      if (lower.includes(alias) || alias.includes(lower)) {
        return { found: true, name, alias };
      }
    }
    
    // Check context
    if (rayContext.player?.active && 
        (lower === 'him' || lower === 'his' || lower === 'he')) {
      return { found: true, name: rayContext.player.active.name, fromContext: true };
    }
    
    return { found: false };
  }, [rayContext]);
  
  const resolveTeam = useCallback((input) => {
    const lower = input.toLowerCase();
    
    if (TEAM_ALIASES[lower]) {
      return { found: true, name: TEAM_ALIASES[lower], alias: lower };
    }
    
    for (const [alias, name] of Object.entries(TEAM_ALIASES)) {
      if (lower.includes(alias)) {
        return { found: true, name, alias };
      }
    }
    
    return { found: false };
  }, []);
  
  const resolveMarket = useCallback((input) => {
    const lower = input.toLowerCase();
    
    if (MARKET_ALIASES[lower]) {
      return { found: true, type: MARKET_ALIASES[lower], alias: lower };
    }
    
    for (const [alias, type] of Object.entries(MARKET_ALIASES)) {
      if (lower.includes(alias)) {
        return { found: true, type, alias };
      }
    }
    
    // Default to context or points
    if (rayContext.market?.active) {
      return { found: true, type: rayContext.market.active, fromContext: true };
    }
    
    return { found: false, default: 'points' };
  }, [rayContext]);
  
  return {
    parseIntent,
    resolvePlayer,
    resolveTeam,
    resolveMarket,
    
    // Expose pattern matching
    INTENT_PATTERNS,
    PLAYER_ALIASES,
    TEAM_ALIASES,
    MARKET_ALIASES
  };
};

export default useRayIntent;
