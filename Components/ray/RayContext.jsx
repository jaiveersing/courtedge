/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY CONTEXT PROVIDER - Session Memory & Context Stack Architecture
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Maintains comprehensive, continuously-updated context stack:
 * - Sport Context (current sport, rules, season)
 * - Game Context (active games, environment, state)
 * - Player Context (active players, history stack, roles)
 * - Market Context (active markets, lines, history)
 * - Temporal Context (timeframes, comparison windows)
 * - Analytical Depth Preference (user profile)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  // Sport Context
  sport: {
    current: 'NBA',
    rules: {
      quarterLength: 12,
      totalQuarters: 4,
      shotClock: 24,
      overtimeLength: 5
    },
    season: 'regular', // regular, playoffs, preseason
    isLive: false
  },
  
  // Game Context
  game: {
    active: null,       // Currently focused game
    games: [],          // Tonight's games
    environment: {
      paceExpectation: null,
      projectedTotal: null,
      blowoutProbability: null
    },
    state: 'pregame'    // pregame, live, completed
  },
  
  // Player Context
  player: {
    active: null,       // Currently focused player
    historyStack: [],   // Recently discussed players (max 10)
    comparisons: [],    // Active comparison set
    roleContext: {
      usage: null,
      minutes: null,
      injuryStatus: null
    }
  },
  
  // Market Context
  market: {
    active: null,       // Current prop market (points, assists, etc.)
    line: null,         // Current line value
    movement: null,     // Line movement direction
    historyStack: [],   // Recently discussed markets
    alternatives: []    // Alternative market options
  },
  
  // Temporal Context
  temporal: {
    window: 'last10',   // Current analysis window
    stack: [],          // Recent timeframe requests
    options: ['last5', 'last10', 'last15', 'season', 'matchup', 'home', 'away']
  },
  
  // User Analytical Preferences
  preferences: {
    depthProfile: 'balanced',  // concise, balanced, comprehensive
    expertiseLevel: 'intermediate', // beginner, intermediate, advanced
    preferredMarkets: ['points', 'assists', 'rebounds'],
    riskTolerance: 'moderate', // conservative, moderate, aggressive
    voiceEnabled: true,
    notificationsEnabled: true
  },
  
  // Session State
  session: {
    startTime: Date.now(),
    messageCount: 0,
    queriesProcessed: 0,
    lastActivity: Date.now()
  },
  
  // Conversation History (for context resolution)
  conversation: {
    history: [],        // Last N messages for context
    currentIntent: null,
    pendingClarification: null
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

const ActionTypes = {
  // Sport Actions
  SET_SPORT: 'SET_SPORT',
  SET_SEASON: 'SET_SEASON',
  
  // Game Actions
  SET_ACTIVE_GAME: 'SET_ACTIVE_GAME',
  UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
  SET_GAMES_LIST: 'SET_GAMES_LIST',
  UPDATE_GAME_ENVIRONMENT: 'UPDATE_GAME_ENVIRONMENT',
  
  // Player Actions
  SET_ACTIVE_PLAYER: 'SET_ACTIVE_PLAYER',
  ADD_TO_PLAYER_HISTORY: 'ADD_TO_PLAYER_HISTORY',
  SET_PLAYER_COMPARISON: 'SET_PLAYER_COMPARISON',
  UPDATE_PLAYER_ROLE: 'UPDATE_PLAYER_ROLE',
  CLEAR_PLAYER_CONTEXT: 'CLEAR_PLAYER_CONTEXT',
  
  // Market Actions
  SET_ACTIVE_MARKET: 'SET_ACTIVE_MARKET',
  SET_LINE: 'SET_LINE',
  UPDATE_LINE_MOVEMENT: 'UPDATE_LINE_MOVEMENT',
  ADD_TO_MARKET_HISTORY: 'ADD_TO_MARKET_HISTORY',
  
  // Temporal Actions
  SET_TEMPORAL_WINDOW: 'SET_TEMPORAL_WINDOW',
  ADD_TO_TEMPORAL_STACK: 'ADD_TO_TEMPORAL_STACK',
  
  // Preference Actions
  SET_DEPTH_PROFILE: 'SET_DEPTH_PROFILE',
  SET_EXPERTISE_LEVEL: 'SET_EXPERTISE_LEVEL',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // Session Actions
  INCREMENT_MESSAGE_COUNT: 'INCREMENT_MESSAGE_COUNT',
  INCREMENT_QUERIES: 'INCREMENT_QUERIES',
  UPDATE_LAST_ACTIVITY: 'UPDATE_LAST_ACTIVITY',
  
  // Conversation Actions
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_CURRENT_INTENT: 'SET_CURRENT_INTENT',
  SET_PENDING_CLARIFICATION: 'SET_PENDING_CLARIFICATION',
  
  // Full Reset
  RESET_CONTEXT: 'RESET_CONTEXT',
  RESET_GAME_CONTEXT: 'RESET_GAME_CONTEXT'
};

// ═══════════════════════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

const rayReducer = (state, action) => {
  switch (action.type) {
    // ─────────────────────────────────────────────────────────────────────────
    // SPORT ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_SPORT:
      return {
        ...state,
        sport: { ...state.sport, current: action.payload },
        // Reset game/player context on sport change
        game: { ...initialState.game },
        player: { ...initialState.player },
        market: { ...initialState.market }
      };
      
    case ActionTypes.SET_SEASON:
      return {
        ...state,
        sport: { ...state.sport, season: action.payload }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // GAME ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_ACTIVE_GAME:
      return {
        ...state,
        game: { ...state.game, active: action.payload }
      };
      
    case ActionTypes.UPDATE_GAME_STATE:
      return {
        ...state,
        game: { ...state.game, state: action.payload }
      };
      
    case ActionTypes.SET_GAMES_LIST:
      return {
        ...state,
        game: { ...state.game, games: action.payload }
      };
      
    case ActionTypes.UPDATE_GAME_ENVIRONMENT:
      return {
        ...state,
        game: {
          ...state.game,
          environment: { ...state.game.environment, ...action.payload }
        }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // PLAYER ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_ACTIVE_PLAYER:
      const newHistoryStack = [
        action.payload,
        ...state.player.historyStack.filter(p => p.id !== action.payload?.id)
      ].slice(0, 10); // Keep last 10 players
      
      return {
        ...state,
        player: {
          ...state.player,
          active: action.payload,
          historyStack: newHistoryStack
        }
      };
      
    case ActionTypes.ADD_TO_PLAYER_HISTORY:
      return {
        ...state,
        player: {
          ...state.player,
          historyStack: [
            action.payload,
            ...state.player.historyStack.filter(p => p.id !== action.payload?.id)
          ].slice(0, 10)
        }
      };
      
    case ActionTypes.SET_PLAYER_COMPARISON:
      return {
        ...state,
        player: { ...state.player, comparisons: action.payload }
      };
      
    case ActionTypes.UPDATE_PLAYER_ROLE:
      return {
        ...state,
        player: {
          ...state.player,
          roleContext: { ...state.player.roleContext, ...action.payload }
        }
      };
      
    case ActionTypes.CLEAR_PLAYER_CONTEXT:
      return {
        ...state,
        player: { ...initialState.player }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // MARKET ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_ACTIVE_MARKET:
      const newMarketHistory = [
        action.payload,
        ...state.market.historyStack.filter(m => m !== action.payload)
      ].slice(0, 5);
      
      return {
        ...state,
        market: {
          ...state.market,
          active: action.payload,
          historyStack: newMarketHistory
        }
      };
      
    case ActionTypes.SET_LINE:
      return {
        ...state,
        market: { ...state.market, line: action.payload }
      };
      
    case ActionTypes.UPDATE_LINE_MOVEMENT:
      return {
        ...state,
        market: { ...state.market, movement: action.payload }
      };
      
    case ActionTypes.ADD_TO_MARKET_HISTORY:
      return {
        ...state,
        market: {
          ...state.market,
          historyStack: [
            action.payload,
            ...state.market.historyStack.filter(m => m !== action.payload)
          ].slice(0, 5)
        }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // TEMPORAL ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_TEMPORAL_WINDOW:
      return {
        ...state,
        temporal: {
          ...state.temporal,
          window: action.payload,
          stack: [action.payload, ...state.temporal.stack.filter(t => t !== action.payload)].slice(0, 5)
        }
      };
      
    case ActionTypes.ADD_TO_TEMPORAL_STACK:
      return {
        ...state,
        temporal: {
          ...state.temporal,
          stack: [action.payload, ...state.temporal.stack].slice(0, 5)
        }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // PREFERENCE ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.SET_DEPTH_PROFILE:
      return {
        ...state,
        preferences: { ...state.preferences, depthProfile: action.payload }
      };
      
    case ActionTypes.SET_EXPERTISE_LEVEL:
      return {
        ...state,
        preferences: { ...state.preferences, expertiseLevel: action.payload }
      };
      
    case ActionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // SESSION ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.INCREMENT_MESSAGE_COUNT:
      return {
        ...state,
        session: {
          ...state.session,
          messageCount: state.session.messageCount + 1,
          lastActivity: Date.now()
        }
      };
      
    case ActionTypes.INCREMENT_QUERIES:
      return {
        ...state,
        session: {
          ...state.session,
          queriesProcessed: state.session.queriesProcessed + 1,
          lastActivity: Date.now()
        }
      };
      
    case ActionTypes.UPDATE_LAST_ACTIVITY:
      return {
        ...state,
        session: { ...state.session, lastActivity: Date.now() }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // CONVERSATION ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        conversation: {
          ...state.conversation,
          history: [...state.conversation.history, action.payload].slice(-20) // Keep last 20 messages
        }
      };
      
    case ActionTypes.SET_CURRENT_INTENT:
      return {
        ...state,
        conversation: { ...state.conversation, currentIntent: action.payload }
      };
      
    case ActionTypes.SET_PENDING_CLARIFICATION:
      return {
        ...state,
        conversation: { ...state.conversation, pendingClarification: action.payload }
      };
    
    // ─────────────────────────────────────────────────────────────────────────
    // RESET ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    case ActionTypes.RESET_CONTEXT:
      return {
        ...initialState,
        preferences: state.preferences, // Preserve user preferences
        session: { ...initialState.session, startTime: Date.now() }
      };
      
    case ActionTypes.RESET_GAME_CONTEXT:
      return {
        ...state,
        game: { ...initialState.game },
        player: { ...initialState.player },
        market: { ...initialState.market }
      };
      
    default:
      return state;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT CREATION
// ═══════════════════════════════════════════════════════════════════════════════

const RayContext = createContext(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const RayContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rayReducer, initialState);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ACTION CREATORS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Sport Actions
  const setSport = useCallback((sport) => {
    dispatch({ type: ActionTypes.SET_SPORT, payload: sport });
  }, []);
  
  const setSeason = useCallback((season) => {
    dispatch({ type: ActionTypes.SET_SEASON, payload: season });
  }, []);
  
  // Game Actions
  const setActiveGame = useCallback((game) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_GAME, payload: game });
  }, []);
  
  const updateGameState = useCallback((gameState) => {
    dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
  }, []);
  
  const setGamesList = useCallback((games) => {
    dispatch({ type: ActionTypes.SET_GAMES_LIST, payload: games });
  }, []);
  
  const updateGameEnvironment = useCallback((environment) => {
    dispatch({ type: ActionTypes.UPDATE_GAME_ENVIRONMENT, payload: environment });
  }, []);
  
  // Player Actions
  const setActivePlayer = useCallback((player) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_PLAYER, payload: player });
  }, []);
  
  const addToPlayerHistory = useCallback((player) => {
    dispatch({ type: ActionTypes.ADD_TO_PLAYER_HISTORY, payload: player });
  }, []);
  
  const setPlayerComparison = useCallback((players) => {
    dispatch({ type: ActionTypes.SET_PLAYER_COMPARISON, payload: players });
  }, []);
  
  const updatePlayerRole = useCallback((role) => {
    dispatch({ type: ActionTypes.UPDATE_PLAYER_ROLE, payload: role });
  }, []);
  
  const clearPlayerContext = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_PLAYER_CONTEXT });
  }, []);
  
  // Market Actions
  const setActiveMarket = useCallback((market) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_MARKET, payload: market });
  }, []);
  
  const setLine = useCallback((line) => {
    dispatch({ type: ActionTypes.SET_LINE, payload: line });
  }, []);
  
  const updateLineMovement = useCallback((movement) => {
    dispatch({ type: ActionTypes.UPDATE_LINE_MOVEMENT, payload: movement });
  }, []);
  
  // Temporal Actions
  const setTemporalWindow = useCallback((window) => {
    dispatch({ type: ActionTypes.SET_TEMPORAL_WINDOW, payload: window });
  }, []);
  
  // Preference Actions
  const setDepthProfile = useCallback((profile) => {
    dispatch({ type: ActionTypes.SET_DEPTH_PROFILE, payload: profile });
  }, []);
  
  const setExpertiseLevel = useCallback((level) => {
    dispatch({ type: ActionTypes.SET_EXPERTISE_LEVEL, payload: level });
  }, []);
  
  const updatePreferences = useCallback((prefs) => {
    dispatch({ type: ActionTypes.UPDATE_PREFERENCES, payload: prefs });
  }, []);
  
  // Session Actions
  const incrementMessageCount = useCallback(() => {
    dispatch({ type: ActionTypes.INCREMENT_MESSAGE_COUNT });
  }, []);
  
  const incrementQueries = useCallback(() => {
    dispatch({ type: ActionTypes.INCREMENT_QUERIES });
  }, []);
  
  // Conversation Actions
  const addMessage = useCallback((message) => {
    dispatch({ type: ActionTypes.ADD_MESSAGE, payload: message });
    dispatch({ type: ActionTypes.INCREMENT_MESSAGE_COUNT });
  }, []);
  
  const setCurrentIntent = useCallback((intent) => {
    dispatch({ type: ActionTypes.SET_CURRENT_INTENT, payload: intent });
  }, []);
  
  const setPendingClarification = useCallback((clarification) => {
    dispatch({ type: ActionTypes.SET_PENDING_CLARIFICATION, payload: clarification });
  }, []);
  
  // Reset Actions
  const resetContext = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_CONTEXT });
  }, []);
  
  const resetGameContext = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_GAME_CONTEXT });
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONTEXT HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Resolve pronoun references
  const resolvePlayerReference = useCallback((reference) => {
    const lowerRef = reference.toLowerCase();
    
    // Direct reference to active player
    if (['him', 'he', 'his', 'this player', 'current player'].includes(lowerRef)) {
      return state.player.active;
    }
    
    // Reference to previous player in stack
    if (['other player', 'the other one', 'previous', 'before'].includes(lowerRef)) {
      return state.player.historyStack[1] || null;
    }
    
    // Reference by name fragment
    const matchedPlayer = state.player.historyStack.find(p => 
      p?.name?.toLowerCase().includes(lowerRef)
    );
    
    return matchedPlayer || null;
  }, [state.player]);
  
  // Resolve market reference
  const resolveMarketReference = useCallback((reference) => {
    const lowerRef = reference.toLowerCase();
    
    // Check for common market aliases
    const marketAliases = {
      'points': ['pts', 'scoring', 'points'],
      'rebounds': ['reb', 'rebs', 'boards', 'rebounds'],
      'assists': ['ast', 'asts', 'dimes', 'assists'],
      'threes': ['3pt', '3s', 'threes', 'three pointers'],
      'pra': ['pra', 'pts+reb+ast', 'combo'],
      'steals': ['stl', 'steals'],
      'blocks': ['blk', 'blocks']
    };
    
    for (const [market, aliases] of Object.entries(marketAliases)) {
      if (aliases.some(alias => lowerRef.includes(alias))) {
        return market;
      }
    }
    
    // Default to active market or points
    return state.market.active || 'points';
  }, [state.market.active]);
  
  // Get current analysis context summary
  const getContextSummary = useCallback(() => {
    return {
      sport: state.sport.current,
      game: state.game.active?.name || 'No game selected',
      player: state.player.active?.name || 'No player selected',
      market: state.market.active || 'No market selected',
      line: state.market.line,
      timeframe: state.temporal.window,
      depth: state.preferences.depthProfile
    };
  }, [state]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // MEMOIZED VALUE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const value = useMemo(() => ({
    // State
    state,
    sport: state.sport,
    game: state.game,
    player: state.player,
    market: state.market,
    temporal: state.temporal,
    preferences: state.preferences,
    session: state.session,
    conversation: state.conversation,
    
    // Sport Actions
    setSport,
    setSeason,
    
    // Game Actions
    setActiveGame,
    updateGameState,
    setGamesList,
    updateGameEnvironment,
    
    // Player Actions
    setActivePlayer,
    addToPlayerHistory,
    setPlayerComparison,
    updatePlayerRole,
    clearPlayerContext,
    
    // Market Actions
    setActiveMarket,
    setLine,
    updateLineMovement,
    
    // Temporal Actions
    setTemporalWindow,
    
    // Preference Actions
    setDepthProfile,
    setExpertiseLevel,
    updatePreferences,
    
    // Session Actions
    incrementMessageCount,
    incrementQueries,
    
    // Conversation Actions
    addMessage,
    setCurrentIntent,
    setPendingClarification,
    
    // Reset Actions
    resetContext,
    resetGameContext,
    
    // Helpers
    resolvePlayerReference,
    resolveMarketReference,
    getContextSummary
  }), [
    state,
    setSport, setSeason,
    setActiveGame, updateGameState, setGamesList, updateGameEnvironment,
    setActivePlayer, addToPlayerHistory, setPlayerComparison, updatePlayerRole, clearPlayerContext,
    setActiveMarket, setLine, updateLineMovement,
    setTemporalWindow,
    setDepthProfile, setExpertiseLevel, updatePreferences,
    incrementMessageCount, incrementQueries,
    addMessage, setCurrentIntent, setPendingClarification,
    resetContext, resetGameContext,
    resolvePlayerReference, resolveMarketReference, getContextSummary
  ]);
  
  return (
    <RayContext.Provider value={value}>
      {children}
    </RayContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export const useRayContext = () => {
  const context = useContext(RayContext);
  if (!context) {
    // Return a mock context for components not wrapped in provider
    return {
      state: initialState,
      sport: initialState.sport,
      game: initialState.game,
      player: initialState.player,
      market: initialState.market,
      temporal: initialState.temporal,
      preferences: initialState.preferences,
      session: initialState.session,
      conversation: initialState.conversation,
      // Empty functions for safety
      setSport: () => {},
      setSeason: () => {},
      setActiveGame: () => {},
      updateGameState: () => {},
      setGamesList: () => {},
      updateGameEnvironment: () => {},
      setActivePlayer: () => {},
      addToPlayerHistory: () => {},
      setPlayerComparison: () => {},
      updatePlayerRole: () => {},
      clearPlayerContext: () => {},
      setActiveMarket: () => {},
      setLine: () => {},
      updateLineMovement: () => {},
      setTemporalWindow: () => {},
      setDepthProfile: () => {},
      setExpertiseLevel: () => {},
      updatePreferences: () => {},
      incrementMessageCount: () => {},
      incrementQueries: () => {},
      addMessage: () => {},
      setCurrentIntent: () => {},
      setPendingClarification: () => {},
      resetContext: () => {},
      resetGameContext: () => {},
      resolvePlayerReference: () => null,
      resolveMarketReference: () => 'points',
      getContextSummary: () => ({})
    };
  }
  return context;
};

export default RayContext;
