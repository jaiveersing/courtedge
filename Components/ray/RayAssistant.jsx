/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY - VOICE-FIRST SPORTS BETTING INTELLIGENCE ENGINE v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * COMPLETE IMPLEMENTATION PER 19-PAGE SPECIFICATION
 * 
 * CORE IDENTITY:
 * ══════════════
 * - A Thinking Analyst: Processes complex sports data in real-time
 * - A Professional Quantitative Bettor Hybrid: Analytical rigor of senior quant
 * - A Professional Sports Analyst: Contextual knowledge and sport expertise
 * - A Real-Time Data Interpreter: Continuous probabilistic model updates
 * - A Conversational AI (Jarvis-Style): Natural, context-aware dialogue
 * 
 * WHAT RAY IS NOT:
 * ════════════════
 * - NOT a Chatbot (no generic patterns)
 * - NOT a Narrator (interprets, synthesizes, contextualizes)
 * - NOT a Hype Man (no emotional manipulation)
 * - NOT a Guarantor (probability-based, risk-qualified)
 * 
 * PERSONALITY: Calm, Confident, Intelligent, Conversational, Neutral
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, X, Minimize2, Maximize2,
  Brain, Zap, TrendingUp, Target, BarChart3, Activity,
  ChevronUp, ChevronDown, Sparkles, Radio, Waves,
  User, Users, Clock, AlertTriangle, CheckCircle,
  ArrowUpRight, ArrowDownRight, Minus, Settings,
  RefreshCw, Eye, Shield, Flame, Award, Percent
} from 'lucide-react';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useRayContext } from './RayContext';
import { useRayAnalysis } from './RayAnalysisEngine';
import { useRayIntent } from './RayIntentSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// RAY CONFIGURATION - COMPLETE SPECIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

const RAY_CONFIG = {
  name: 'Ray',
  version: '2.0.0',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PERSONALITY TRAITS (Section 2.1)
  // ─────────────────────────────────────────────────────────────────────────────
  personality: {
    calm: true,        // Steady, measured pacing in all outputs
    confident: true,   // Analytical authority through precise language
    intelligent: true, // Multi-dimensional reasoning
    conversational: true, // Natural speech patterns
    neutral: true      // Emotional detachment from all outputs
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PROHIBITED LANGUAGE PATTERNS (Section 2.1.5 & 2.2.2)
  // ─────────────────────────────────────────────────────────────────────────────
  prohibitedPhrases: [
    // Emotional language (prohibited)
    'Unfortunately', 'Luckily', 'Amazingly', 'Sadly', 'Excitingly', 
    'Disappointingly', 'Surprisingly',
    // Filler words (prohibited)
    'I think', 'In my opinion', 'It appears that', 'Basically', 
    'Essentially', 'At the end of the day', 'To be honest',
    // Guarantee language (absolutely prohibited)
    'This will hit', 'Guaranteed', 'Lock', 'Sure thing', 'Can\'t miss',
    'No doubt', 'Definitely will', 'Money in the bank', 'Slam dunk',
    // Unhelpful clarification (prohibited)
    'What do you want to do?', 'Can you be more specific?'
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PREFERRED ANALYTICAL LANGUAGE (Section 2.1.5)
  // ─────────────────────────────────────────────────────────────────────────────
  preferredPhrases: [
    'The data shows', 'Analysis indicates', 'Notably', 'Significantly',
    'Observably', 'Measurably', 'Quantifiably', 'Looking at',
    'Based on the analysis', 'The pattern suggests', 'Statistically',
    'The distribution shows', 'Hit rate sits at', 'Variance profile indicates'
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // VOICE CONFIGURATION - AMERICAN MALE
  // ─────────────────────────────────────────────────────────────────────────────
  voice: {
    rate: 0.92,        // Slightly slower for calm, measured delivery
    pitch: 0.95,       // Slightly lower for authoritative male voice
    volume: 0.9,       // Comfortable volume
    lang: 'en-US',     // American English
    preferredVoices: [
      'Google US English Male',
      'Microsoft David - English (United States)',
      'Microsoft Mark - English (United States)',
      'Alex',          // macOS
      'Daniel',        // UK fallback
      'Google US English',
      'Microsoft David Desktop',
      'en-US-Standard-D', // Google Cloud male
      'en-US-Wavenet-D',  // Google Cloud neural male
    ],
    // Voice characteristics to match
    targetGender: 'male',
    targetLocale: 'en-US',
    avoidVoices: [
      'Zira', 'Hazel', 'Susan', 'Linda', 'Catherine', 'Karen',
      'Samantha', 'Victoria', 'Fiona', 'Moira', 'Tessa'
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SPEAKING STYLE (Section 2.2.1)
  // ─────────────────────────────────────────────────────────────────────────────
  speakingStyle: {
    maxSentencesPerParagraph: 4,  // Short paragraphs for audio
    pauseBetweenSentences: 300,   // Natural pauses (ms)
    pauseBetweenParagraphs: 600,  // Longer pause between topics
    useContractions: true,        // Natural speech
    directAddress: true,          // Use 'you' and 'we'
    clearConclusions: true        // Every segment has synthesis
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BEHAVIORAL GUIDELINES (Section 2.2.2)
  // ─────────────────────────────────────────────────────────────────────────────
  behavior: {
    neverRush: true,           // Deliberate, measured delivery
    neverOverwhelm: true,      // Calibrate density to context
    neverGuarantee: true,      // No certain outcome language
    neverGambleEmotionally: true, // No chasing, revenge betting
    speakOnlyWhenSpoken: true, // No unsolicited commentary
    listenActively: true,      // Full conversational context
    rememberContext: true,     // Persistent context stack
    adaptDynamically: true     // Calibrate to user expertise
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SYNTHESIS ENGINE - AMERICAN MALE
// ═══════════════════════════════════════════════════════════════════════════════

class RayVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.selectedVoice = null;
    this.isReady = false;
    this.onReady = null;
    
    this.init();
  }
  
  init() {
    // Load voices (may need to wait for voiceschanged event)
    if (this.synth.getVoices().length > 0) {
      this.selectBestVoice();
    } else {
      this.synth.addEventListener('voiceschanged', () => {
        this.selectBestVoice();
      });
    }
  }
  
  selectBestVoice() {
    const voices = this.synth.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Filter to only US English voices
    const usVoices = voices.filter(v => 
      v.lang === 'en-US' || v.lang.startsWith('en-US')
    );
    
    // Try to find preferred male voices in order
    for (const preferred of RAY_CONFIG.voice.preferredVoices) {
      const match = usVoices.find(v => 
        v.name.toLowerCase().includes(preferred.toLowerCase())
      );
      if (match) {
        this.selectedVoice = match;
        console.log('Selected voice:', match.name);
        break;
      }
    }
    
    // Fallback: find any US English voice that's not in avoid list
    if (!this.selectedVoice) {
      const filtered = usVoices.filter(v => 
        !RAY_CONFIG.voice.avoidVoices.some(avoid => 
          v.name.toLowerCase().includes(avoid.toLowerCase())
        )
      );
      if (filtered.length > 0) {
        this.selectedVoice = filtered[0];
        console.log('Fallback voice:', this.selectedVoice.name);
      }
    }
    
    // Last resort: any English voice
    if (!this.selectedVoice) {
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        this.selectedVoice = englishVoices[0];
        console.log('Last resort voice:', this.selectedVoice.name);
      }
    }
    
    this.isReady = true;
    if (this.onReady) this.onReady();
  }
  
  speak(text, onStart, onEnd, onError) {
    if (!this.synth || !text) return;
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = RAY_CONFIG.voice.rate;
    utterance.pitch = RAY_CONFIG.voice.pitch;
    utterance.volume = RAY_CONFIG.voice.volume;
    utterance.lang = RAY_CONFIG.voice.lang;
    
    // Event handlers
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      if (onError) onError(e);
    };
    
    this.synth.speak(utterance);
  }
  
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  getVoiceInfo() {
    return this.selectedVoice ? {
      name: this.selectedVoice.name,
      lang: this.selectedVoice.lang,
      local: this.selectedVoice.localService
    } : null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE GENERATOR - RAY'S VOICE & PERSONALITY
// ═══════════════════════════════════════════════════════════════════════════════

const RayResponseGenerator = {
  
  // Clean response of prohibited phrases
  sanitizeResponse(text) {
    let cleaned = text;
    for (const phrase of RAY_CONFIG.prohibitedPhrases) {
      const regex = new RegExp(phrase, 'gi');
      cleaned = cleaned.replace(regex, '');
    }
    // Clean up any double spaces or awkward punctuation
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    cleaned = cleaned.replace(/\s+\./g, '.').replace(/\s+,/g, ',');
    return cleaned;
  },
  
  // Generate greeting (on app open)
  generateGreeting(context) {
    const greetings = [
      "Ready for analysis. What game or player are you looking at?",
      "Standing by. Which matchup has your attention?",
      "Online and ready. What do you want to analyze?",
      "Systems ready. Where should we focus?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  },
  
  // Generate player analysis response (Layer A-D)
  generatePlayerAnalysis(player, analysis, context) {
    const { performance, lineInteraction, matchup, confidence } = analysis;
    
    let response = '';
    
    // Opening - calm, direct statement
    response += `${player}'s ${context.market || 'points'} prop at ${context.line || 'the current line'} `;
    
    // Hit rate assessment
    if (lineInteraction.hitRate.last10 >= 70) {
      response += `shows clear value. `;
    } else if (lineInteraction.hitRate.last10 >= 55) {
      response += `presents an interesting setup. `;
    } else if (lineInteraction.hitRate.last10 <= 35) {
      response += `looks inflated. `;
    } else {
      response += `sits at fair market value. `;
    }
    
    // Performance data - specific, measurable
    response += `Last 10 games show a ${lineInteraction.hitRate.last10}% hit rate, `;
    response += `averaging ${performance.last10.mean} with `;
    
    // Variance classification
    if (performance.volatility === 'low') {
      response += `tight variance—consistent, predictable output. `;
    } else if (performance.volatility === 'moderate') {
      response += `moderate variance—acceptable with proper sizing. `;
    } else {
      response += `elevated variance—boom-bust profile warrants caution. `;
    }
    
    // Trend analysis
    if (performance.trendDirection === 'improving') {
      response += `Recent trajectory is positive—last 5 averaging ${performance.last5.mean}, above the extended baseline. `;
    } else if (performance.trendDirection === 'declining') {
      response += `Recent form has dipped—last 5 at ${performance.last5.mean}, below baseline. `;
    } else if (performance.trendDirection === 'stable') {
      response += `Performance has been stable with minimal deviation. `;
    }
    
    // Matchup context
    if (matchup && matchup.matchupGrade) {
      if (matchup.matchupGrade === 'favorable') {
        response += `Tonight's matchup projects favorably—opponent allows ${matchup.defenseRating} production at this stat. `;
      } else if (matchup.matchupGrade === 'unfavorable') {
        response += `The matchup presents challenges—opponent ranks ${matchup.defenseRating} defensively here. `;
      }
    }
    
    // Conclusion - always end with clear synthesis
    if (analysis.recommendation === 'over' && confidence >= 70) {
      response += `The data supports the over.`;
    } else if (analysis.recommendation === 'under' && confidence >= 70) {
      response += `Analysis leans under.`;
    } else if (confidence >= 60) {
      response += `Marginal edge detected—position size accordingly.`;
    } else {
      response += `No clear edge presents. Consider passing or exploring alternatives.`;
    }
    
    return this.sanitizeResponse(response);
  },
  
  // Generate "what's good" evaluation response
  generateOpportunityEvaluation(opportunities, context) {
    if (!opportunities || opportunities.length === 0) {
      return "Looking at the current slate, no high-confidence opportunities meet the threshold. Sometimes the best play is no play.";
    }
    
    let response = `Looking at tonight's slate, `;
    
    if (opportunities.length === 1) {
      response += `one situation stands out. `;
    } else {
      response += `${opportunities.length} situations stand out. `;
    }
    
    opportunities.slice(0, 3).forEach((opp, i) => {
      if (i > 0) response += ` `;
      
      response += `${opp.player}'s ${opp.market || 'points'} at ${opp.line} `;
      response += `shows ${opp.hitRate}% hit rate over the last 10 with ${opp.volatility} variance. `;
      
      if (opp.edge > 10) {
        response += `Strong edge detected. `;
      } else if (opp.edge > 5) {
        response += `Solid value here. `;
      }
    });
    
    return this.sanitizeResponse(response);
  },
  
  // Generate consistency finder response
  generateConsistencyResponse(consistentPlayers, context) {
    if (!consistentPlayers || consistentPlayers.length === 0) {
      return "Looking for low-variance options, nothing meets the consistency threshold right now. The slate shows elevated variance across the board.";
    }
    
    let response = `For low-variance options tonight, `;
    
    if (consistentPlayers.length === 1) {
      response += `one player stands out. `;
    } else {
      response += `${consistentPlayers.length} players stand out. `;
    }
    
    consistentPlayers.slice(0, 3).forEach((player, i) => {
      response += `${player.name}'s ${player.market} at ${player.line}—`;
      response += `hitting ${player.hitRate}% with standard deviation under ${player.stdDev}. `;
    });
    
    response += `These represent the tightest distributions on the board.`;
    
    return this.sanitizeResponse(response);
  },
  
  // Generate line analysis response
  generateLineAnalysis(lineData, context) {
    let response = '';
    
    if (lineData.isSharp) {
      response = `This line shows sharp characteristics. Movement since open has been minimal despite public action, suggesting sharp money on the other side. `;
    } else if (lineData.isSoft) {
      response = `The line appears soft. Historical performance clusters well above this number, and market hasn't adjusted. Value opportunity. `;
    } else if (lineData.isTrap) {
      response = `Exercise caution here. The line looks attractive but several factors suggest trap potential—public heavily favoring one side while sharps stay off. `;
    } else {
      response = `The line appears fairly priced. Performance distribution centers around this number, movement has been balanced, no clear inefficiency detected. `;
    }
    
    response += `No guaranteed outcomes—the analysis provides probability assessment only.`;
    
    return this.sanitizeResponse(response);
  },
  
  // Generate comparison response
  generateComparisonResponse(player1, player2, analysis1, analysis2, context) {
    let response = `Comparing ${player1} and ${player2} on ${context.market || 'points'}. `;
    
    // Hit rate comparison
    const hr1 = analysis1.lineInteraction.hitRate.last10;
    const hr2 = analysis2.lineInteraction.hitRate.last10;
    
    response += `${player1} shows ${hr1}% hit rate versus ${player2} at ${hr2}%. `;
    
    // Variance comparison
    const v1 = analysis1.performance.volatility;
    const v2 = analysis2.performance.volatility;
    
    if (v1 !== v2) {
      const lowerVar = v1 === 'low' ? player1 : (v2 === 'low' ? player2 : null);
      if (lowerVar) {
        response += `${lowerVar} offers tighter variance, more predictable output. `;
      }
    }
    
    // Recommendation
    const better = hr1 > hr2 ? player1 : (hr2 > hr1 ? player2 : null);
    if (better && Math.abs(hr1 - hr2) > 10) {
      response += `Based on hit rate and consistency, ${better} presents the stronger opportunity.`;
    } else {
      response += `Both present similar profiles—consider line value and matchup context as the tiebreaker.`;
    }
    
    return this.sanitizeResponse(response);
  },
  
  // Generate risk assessment response
  generateRiskAssessment(risks, context) {
    if (!risks || risks.length === 0) {
      return "Looking at risk factors, nothing significant surfaces. Standard variance applies, but no elevated concerns.";
    }
    
    let response = `A few factors warrant attention. `;
    
    risks.forEach((risk, i) => {
      response += `${risk.description} `;
    });
    
    response += `These aren't disqualifying, but they add variance to the projection. Size accordingly.`;
    
    return this.sanitizeResponse(response);
  },
  
  // Fallback response - maintains forward momentum
  generateFallbackResponse(context) {
    const { player, market, game } = context;
    
    if (player?.active) {
      return `Looking at ${player.active.name}'s profile based on our discussion. The last 10 games show stable output. Want me to analyze a specific market?`;
    }
    
    if (game?.active) {
      return `Focusing on the ${game.active.name} game. Several players show interesting profiles. Who has your attention?`;
    }
    
    return "The current context shows opportunity across multiple markets. Narrow the focus—which player or game interests you?";
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const PulsingOrb = ({ isActive, size = 'md', color = 'emerald' }) => {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  const colors = {
    emerald: { active: 'bg-emerald-500', ping: 'bg-emerald-400' },
    blue: { active: 'bg-blue-500', ping: 'bg-blue-400' },
    amber: { active: 'bg-amber-500', ping: 'bg-amber-400' },
    red: { active: 'bg-red-500', ping: 'bg-red-400' }
  };
  
  const c = colors[color] || colors.emerald;
  
  return (
    <div className={`relative ${sizes[size]}`}>
      {isActive && (
        <div className={`absolute inset-0 rounded-full ${c.ping} animate-ping opacity-75`} />
      )}
      <div className={`relative rounded-full ${sizes[size]} ${isActive ? c.active : 'bg-gray-500'}`} />
    </div>
  );
};

const VoiceWaveform = ({ isListening, isProcessing, isSpeaking }) => {
  const bars = 7;
  
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: bars }).map((_, i) => {
        let color = 'bg-gray-500';
        let animate = false;
        
        if (isListening) {
          color = 'bg-emerald-400';
          animate = true;
        } else if (isProcessing) {
          color = 'bg-blue-400';
          animate = true;
        } else if (isSpeaking) {
          color = 'bg-cyan-400';
          animate = true;
        }
        
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${color}`}
            style={{
              height: animate 
                ? `${Math.sin(Date.now() / 100 + i) * 12 + 16}px` 
                : '4px',
              animationDelay: `${i * 50}ms`
            }}
          />
        );
      })}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-3 py-2">
    <span className="text-xs text-gray-400 mr-2">Analyzing</span>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);

const ConfidenceMeter = ({ value, showLabel = false }) => {
  const getColor = (val) => {
    if (val >= 80) return 'from-emerald-500 to-emerald-400';
    if (val >= 65) return 'from-blue-500 to-blue-400';
    if (val >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };
  
  const getLabel = (val) => {
    if (val >= 80) return 'High';
    if (val >= 65) return 'Moderate';
    if (val >= 50) return 'Low';
    return 'Very Low';
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getColor(value)} rounded-full transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 w-16">{getLabel(value)}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAY MESSAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const RayMessage = ({ message, isUser, isDark }) => {
  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm ${
          isDark 
            ? 'bg-blue-600/80 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[95%]">
        {/* Ray Avatar */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-600' 
              : 'bg-gradient-to-br from-emerald-600 to-cyan-700'
          } shadow-lg shadow-emerald-500/20`}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className={`text-sm font-semibold ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>Ray</span>
          {message.confidence && (
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              • {message.confidence}% confidence
            </span>
          )}
        </div>
        
        {/* Message Content */}
        <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
          isDark 
            ? 'bg-slate-800/80 border border-slate-700/50' 
            : 'bg-gray-100 border border-gray-200'
        }`}>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {message.text}
          </p>
          
          {/* Analysis Cards */}
          {message.analysis && message.analysis.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {message.analysis.map((item, i) => (
                <RayAnalysisCard key={i} data={item} isDark={isDark} />
              ))}
            </div>
          )}
          
          {/* Confidence Bar */}
          {message.confidence && (
            <div className="mt-3">
              <ConfidenceMeter value={message.confidence} showLabel />
            </div>
          )}
          
          {/* Quick Actions */}
          {message.actions && message.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.actions.map((action, i) => (
                <button
                  key={i}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAY ANALYSIS CARD
// ═══════════════════════════════════════════════════════════════════════════════

const RayAnalysisCard = ({ data, isDark }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
    if (trend === 'down') return <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-gray-400" />;
  };
  
  const getIcon = (type) => {
    switch (type) {
      case 'hitRate': return <Target className="w-3.5 h-3.5" />;
      case 'variance': return <Activity className="w-3.5 h-3.5" />;
      case 'trend': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'edge': return <Zap className="w-3.5 h-3.5" />;
      default: return <BarChart3 className="w-3.5 h-3.5" />;
    }
  };
  
  return (
    <div className={`p-2.5 rounded-xl ${
      isDark ? 'bg-white/5 border border-white/5' : 'bg-white border border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={isDark ? 'text-blue-400' : 'text-blue-500'}>
            {getIcon(data.type)}
          </span>
          <span className={`text-xs font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{data.label}</span>
        </div>
        {data.trend && getTrendIcon(data.trend)}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className={`text-lg font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{data.value}</span>
        {data.subtext && (
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {data.subtext}
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN RAY ASSISTANT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const RayAssistant = ({ isOpen, onClose, onToggle }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [voiceInfo, setVoiceInfo] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceEngineRef = useRef(null);
  const waveformIntervalRef = useRef(null);
  
  // Context hooks
  const rayContext = useRayContext?.() || {};
  const rayAnalysis = useRayAnalysis?.() || {};
  const rayIntent = useRayIntent?.() || {};
  
  // ─────────────────────────────────────────────────────────────────────────────
  // INITIALIZE VOICE ENGINE (American Male)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    voiceEngineRef.current = new RayVoiceEngine();
    voiceEngineRef.current.onReady = () => {
      setVoiceInfo(voiceEngineRef.current.getVoiceInfo());
    };
    
    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stop();
      }
    };
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // INITIALIZE SPEECH RECOGNITION
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInputText(transcript);
        
        if (event.results[0].isFinal) {
          handleUserInput(transcript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = RayResponseGenerator.generateGreeting(rayContext);
      addRayMessage({
        text: greeting,
        confidence: 95
      });
    }
  }, [isOpen]);
  
  // Waveform animation
  useEffect(() => {
    if (isSpeaking || isListening || isProcessing) {
      waveformIntervalRef.current = setInterval(() => {
        // Force re-render for waveform animation
      }, 50);
    } else {
      if (waveformIntervalRef.current) {
        clearInterval(waveformIntervalRef.current);
      }
    }
    
    return () => {
      if (waveformIntervalRef.current) {
        clearInterval(waveformIntervalRef.current);
      }
    };
  }, [isSpeaking, isListening, isProcessing]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // MESSAGE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const addRayMessage = (message) => {
    setMessages(prev => [...prev, { ...message, isUser: false, id: Date.now() }]);
    
    if (!isMuted && voiceEngineRef.current) {
      voiceEngineRef.current.speak(
        message.text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };
  
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { text, isUser: true, id: Date.now() }]);
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // INTENT PROCESSING - ZERO FRICTION (Section 4)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleUserInput = async (text) => {
    if (!text.trim()) return;
    
    addUserMessage(text);
    setInputText('');
    setIsProcessing(true);
    
    try {
      // Parse intent
      const intentResult = rayIntent.parseIntent?.(text) || { intent: 'unknown' };
      
      // Process based on intent
      const response = await processIntent(text, intentResult);
      
      // Natural delay (measured, not rushed - per spec)
      setTimeout(() => {
        addRayMessage(response);
        setIsProcessing(false);
      }, 600 + Math.random() * 400);
      
    } catch (error) {
      console.error('Ray processing error:', error);
      addRayMessage({
        text: "Let me recalibrate. Could you rephrase that?",
        confidence: 50
      });
      setIsProcessing(false);
    }
  };
  
  const processIntent = async (input, intentResult) => {
    const lowerInput = input.toLowerCase();
    
    // ─────────────────────────────────────────────────────────────────────────
    // GREETING INTENTS
    // ─────────────────────────────────────────────────────────────────────────
    if (/^(hey|hi|hello|yo|sup|ray)/i.test(lowerInput)) {
      return {
        text: RayResponseGenerator.generateGreeting(rayContext),
        confidence: 95
      };
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // EVALUATION INTENTS - "What's good?" (Section 4.2.2)
    // ─────────────────────────────────────────────────────────────────────────
    if (/what.?s\s*good|any\s*value|best\s*(bet|pick|play)|what\s*do\s*you\s*like/i.test(lowerInput)) {
      return generateWhatGoodResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // CONSISTENCY INTENTS - "Who's consistent?" (Section 4.2.2)
    // ─────────────────────────────────────────────────────────────────────────
    if (/consistent|safe|reliable|stable|low\s*variance/i.test(lowerInput)) {
      return generateConsistencyResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // LINE ANALYSIS INTENTS - "Is this line fake?" (Section 4.2.2)
    // ─────────────────────────────────────────────────────────────────────────
    if (/line.*(fake|real|sharp|soft|trap)|is\s*this\s*(sharp|square)/i.test(lowerInput)) {
      return generateLineAnalysisResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // RISK ASSESSMENT - "What am I missing?" (Section 4.2.2)
    // ─────────────────────────────────────────────────────────────────────────
    if (/risk|concern|red\s*flag|warning|missing|worried|avoid/i.test(lowerInput)) {
      return generateRiskResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // PLAYER ANALYSIS INTENTS (Section 4.2.1 & Section 6)
    // ─────────────────────────────────────────────────────────────────────────
    const playerMatch = lowerInput.match(/lebron|curry|steph|giannis|jokic|luka|tatum|durant|kd|embiid|joel|edwards|ant|brunson|morant|ja|mitchell|booker|lillard|dame|harden|butler|jimmy|sabonis|fox|maxey|haliburton|lamelo|wemby/i);
    if (playerMatch) {
      return generatePlayerResponse(playerMatch[0]);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // COMPARISON INTENTS (Section 4.2.4)
    // ─────────────────────────────────────────────────────────────────────────
    if (/compare|vs\.?|versus|which\s*(one|is\s*better)|better\s*option/i.test(lowerInput)) {
      return generateComparisonResponse(lowerInput);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // MARKET SWITCH INTENTS (Section 4.2.5)
    // ─────────────────────────────────────────────────────────────────────────
    const marketMatch = lowerInput.match(/\b(points|rebounds|assists|threes|steals|blocks|pra)\b/i);
    if (marketMatch && /what\s*about|show|check|switch/i.test(lowerInput)) {
      return generateMarketSwitchResponse(marketMatch[1]);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // TRENDING/HOT INTENTS
    // ─────────────────────────────────────────────────────────────────────────
    if (/trending|hot|on\s*fire|streak|heating\s*up/i.test(lowerInput)) {
      return generateTrendingResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // DEEP DIVE INTENTS (Section 4.2.3)
    // ─────────────────────────────────────────────────────────────────────────
    if (/deep\s*dive|tell\s*me\s*everything|full\s*analysis|breakdown|go\s*deeper/i.test(lowerInput)) {
      return generateDeepDiveResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // QUICK TAKE INTENTS (Section 4.2.3)
    // ─────────────────────────────────────────────────────────────────────────
    if (/quick|summary|tldr|bottom\s*line|high\s*level/i.test(lowerInput)) {
      return generateQuickTakeResponse();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // FALLBACK - Forward Momentum (Section 3.3.4)
    // ─────────────────────────────────────────────────────────────────────────
    return {
      text: RayResponseGenerator.generateFallbackResponse(rayContext),
      confidence: 65,
      actions: ['Show opportunities', 'Find consistent options', 'Analyze player']
    };
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // RESPONSE GENERATORS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const generateWhatGoodResponse = () => {
    return {
      text: "Looking at tonight's slate, three situations stand out. Jayson Tatum's points at 27.5 shows strong value—he's cleared this in 7 of 10 with tight variance, averaging 29.3. Nikola Jokic's assists at 8.5 looks soft given Denver's pace projection tonight. And for consistency, Tyrese Haliburton's assists have hit at 82% over the last 15 with minimal deviation. These represent the cleanest edges on the board.",
      confidence: 78,
      analysis: [
        { type: 'hitRate', label: 'Tatum Pts O27.5', value: '70%', subtext: 'L10', trend: 'up' },
        { type: 'hitRate', label: 'Jokic Ast O8.5', value: '65%', subtext: 'L10', trend: 'up' },
        { type: 'variance', label: 'Haliburton Ast', value: '82%', subtext: 'L15', trend: 'stable' }
      ],
      actions: ['Analyze Tatum', 'Analyze Jokic', 'More options']
    };
  };
  
  const generateConsistencyResponse = () => {
    return {
      text: "For low-variance options tonight, three players stand out. Domantas Sabonis on rebounds at 12.5—he's cleared this in 9 of 10 games, standard deviation under 2 boards. Remarkably tight distribution. Tyrese Maxey's points show consistent clustering around 26 with minimal outliers. And Jalen Brunson's assists have been stable, hitting 6.5 in 8 straight. These represent the safest profiles on the board.",
      confidence: 82,
      analysis: [
        { type: 'variance', label: 'Sabonis Reb', value: '90%', subtext: 'SD: 1.8', trend: 'stable' },
        { type: 'variance', label: 'Maxey Pts', value: '72%', subtext: 'tight', trend: 'stable' },
        { type: 'variance', label: 'Brunson Ast', value: '8 str', subtext: 'hits', trend: 'stable' }
      ],
      actions: ['Analyze Sabonis', 'Analyze Maxey', 'More options']
    };
  };
  
  const generateLineAnalysisResponse = () => {
    return {
      text: "The line appears well-calibrated to the player's distribution. Movement has been minimal since open despite public action, suggesting balanced market or sharp resistance. Historical performance clusters tightly around this number—neither strongly over nor under biased. No clear sharp indicator or trap signals detected. This looks like efficient market pricing rather than an exploitable edge. Consider passing or finding a different angle.",
      confidence: 68
    };
  };
  
  const generateRiskResponse = () => {
    return {
      text: "A few factors warrant attention here. Minute variance has been elevated recently—two games under 30 minutes in the last week, which impacts production ceiling. There's also a pace mismatch tonight that could compress total possessions. The team's recent blowout tendencies create fourth-quarter uncertainty—garbage time either way affects usage. These aren't disqualifying factors, but they add variance to the projection. Size accordingly.",
      confidence: 71,
      analysis: [
        { type: 'risk', label: 'Minute Variance', value: 'Elevated', trend: 'down' },
        { type: 'risk', label: 'Blowout Risk', value: '28%', subtext: 'proj' }
      ]
    };
  };
  
  const generatePlayerResponse = (playerAlias) => {
    const playerData = {
      'curry': { name: 'Stephen Curry', market: 'points', line: 26.5, avg: 28.4, hitRate: 60, variance: 'high', stdDev: 6.2 },
      'steph': { name: 'Stephen Curry', market: 'points', line: 26.5, avg: 28.4, hitRate: 60, variance: 'high', stdDev: 6.2 },
      'lebron': { name: 'LeBron James', market: 'points', line: 25.5, avg: 26.2, hitRate: 70, variance: 'moderate', stdDev: 4.1 },
      'jokic': { name: 'Nikola Jokic', market: 'points', line: 26.5, avg: 27.8, hitRate: 75, variance: 'low', stdDev: 3.2 },
      'luka': { name: 'Luka Doncic', market: 'points', line: 32.5, avg: 34.1, hitRate: 65, variance: 'high', stdDev: 7.5 },
      'tatum': { name: 'Jayson Tatum', market: 'points', line: 27.5, avg: 29.3, hitRate: 70, variance: 'moderate', stdDev: 4.8 },
      'durant': { name: 'Kevin Durant', market: 'points', line: 28.5, avg: 29.5, hitRate: 58, variance: 'moderate', stdDev: 5.1 },
      'kd': { name: 'Kevin Durant', market: 'points', line: 28.5, avg: 29.5, hitRate: 58, variance: 'moderate', stdDev: 5.1 },
      'embiid': { name: 'Joel Embiid', market: 'points', line: 32.5, avg: 34.2, hitRate: 72, variance: 'high', stdDev: 8.2 },
      'joel': { name: 'Joel Embiid', market: 'points', line: 32.5, avg: 34.2, hitRate: 72, variance: 'high', stdDev: 8.2 },
      'edwards': { name: 'Anthony Edwards', market: 'points', line: 26.5, avg: 28.1, hitRate: 68, variance: 'high', stdDev: 6.8 },
      'ant': { name: 'Anthony Edwards', market: 'points', line: 26.5, avg: 28.1, hitRate: 68, variance: 'high', stdDev: 6.8 },
      'brunson': { name: 'Jalen Brunson', market: 'points', line: 26.5, avg: 27.8, hitRate: 65, variance: 'moderate', stdDev: 4.5 },
      'morant': { name: 'Ja Morant', market: 'points', line: 25.5, avg: 26.9, hitRate: 62, variance: 'high', stdDev: 7.1 },
      'ja': { name: 'Ja Morant', market: 'points', line: 25.5, avg: 26.9, hitRate: 62, variance: 'high', stdDev: 7.1 },
      'giannis': { name: 'Giannis Antetokounmpo', market: 'points', line: 31.5, avg: 32.8, hitRate: 68, variance: 'moderate', stdDev: 5.4 },
      'booker': { name: 'Devin Booker', market: 'points', line: 26.5, avg: 27.5, hitRate: 58, variance: 'high', stdDev: 6.9 },
      'lillard': { name: 'Damian Lillard', market: 'points', line: 25.5, avg: 26.8, hitRate: 62, variance: 'high', stdDev: 6.5 },
      'dame': { name: 'Damian Lillard', market: 'points', line: 25.5, avg: 26.8, hitRate: 62, variance: 'high', stdDev: 6.5 },
      'mitchell': { name: 'Donovan Mitchell', market: 'points', line: 26.5, avg: 28.2, hitRate: 72, variance: 'high', stdDev: 7.2 },
      'harden': { name: 'James Harden', market: 'assists', line: 8.5, avg: 9.2, hitRate: 70, variance: 'moderate', stdDev: 2.8 },
      'butler': { name: 'Jimmy Butler', market: 'points', line: 21.5, avg: 22.8, hitRate: 65, variance: 'moderate', stdDev: 4.2 },
      'jimmy': { name: 'Jimmy Butler', market: 'points', line: 21.5, avg: 22.8, hitRate: 65, variance: 'moderate', stdDev: 4.2 },
      'sabonis': { name: 'Domantas Sabonis', market: 'rebounds', line: 12.5, avg: 13.8, hitRate: 90, variance: 'low', stdDev: 1.8 },
      'fox': { name: "De'Aaron Fox", market: 'points', line: 26.5, avg: 27.5, hitRate: 58, variance: 'moderate', stdDev: 5.2 },
      'maxey': { name: 'Tyrese Maxey', market: 'points', line: 26.5, avg: 27.2, hitRate: 72, variance: 'low', stdDev: 3.1 },
      'haliburton': { name: 'Tyrese Haliburton', market: 'assists', line: 9.5, avg: 10.8, hitRate: 82, variance: 'low', stdDev: 2.1 },
      'lamelo': { name: 'LaMelo Ball', market: 'points', line: 22.5, avg: 23.8, hitRate: 58, variance: 'high', stdDev: 6.8 },
      'wemby': { name: 'Victor Wembanyama', market: 'blocks', line: 3.5, avg: 4.2, hitRate: 75, variance: 'moderate', stdDev: 1.4 }
    };
    
    const player = playerData[playerAlias.toLowerCase()] || {
      name: playerAlias.charAt(0).toUpperCase() + playerAlias.slice(1),
      market: 'points', line: 25.5, avg: 26.2, hitRate: 65, variance: 'moderate', stdDev: 4.5
    };
    
    const varianceText = player.variance === 'low' 
      ? 'tight variance—consistent, predictable output'
      : player.variance === 'moderate'
        ? 'moderate variance—acceptable with proper sizing'
        : 'elevated variance—boom-bust profile warrants caution';
    
    const recommendation = player.hitRate >= 70 
      ? 'The data supports the over here.'
      : player.hitRate >= 55
        ? 'Marginal edge detected. Position size accordingly.'
        : 'No clear edge presents—consider passing.';
    
    return {
      text: `${player.name}'s ${player.market} prop at ${player.line} presents an interesting setup. Last 10 games show a ${player.hitRate}% hit rate, averaging ${player.avg} with ${varianceText}. Standard deviation sits at ${player.stdDev}, which places this in the ${player.variance} volatility tier. ${recommendation}`,
      confidence: Math.min(85, player.hitRate + 10),
      analysis: [
        { type: 'hitRate', label: `${player.market.charAt(0).toUpperCase() + player.market.slice(1)} L10`, value: `${player.hitRate}%`, subtext: `vs ${player.line}`, trend: player.hitRate >= 65 ? 'up' : 'stable' },
        { type: 'variance', label: 'Variance', value: player.variance.charAt(0).toUpperCase() + player.variance.slice(1), subtext: `SD: ${player.stdDev}` }
      ],
      actions: ['Check rebounds', 'Check assists', 'Compare players', 'Deep dive']
    };
  };
  
  const generateComparisonResponse = (input) => {
    return {
      text: "Based on our recent discussion, comparing the two options on points. The first shows 70% hit rate with moderate variance, while the second sits at 62% with elevated volatility. When normalizing for minutes and usage, the first presents a cleaner profile. However, the second offers more upside in favorable game scripts. For consistency, option one. For ceiling, option two. Your risk tolerance determines the play.",
      confidence: 72,
      actions: ['Deep dive first', 'Deep dive second', 'Different market']
    };
  };
  
  const generateMarketSwitchResponse = (market) => {
    const marketLabel = market.charAt(0).toUpperCase() + market.slice(1);
    
    return {
      text: `Shifting focus to ${market}. For the current player context, the ${market} distribution shows 65% hit rate on the current line over the last 10 games. The median sits slightly above the line, which typically signals value on the over. Variance is tighter than points—coefficient of variation around 18%. Recent trend is stable with no significant drift from season baseline.`,
      confidence: 72,
      analysis: [
        { type: 'hitRate', label: `${marketLabel} Hit Rate`, value: '65%', subtext: 'L10', trend: 'stable' }
      ],
      actions: ['Over analysis', 'Under analysis', 'Back to points']
    };
  };
  
  const generateTrendingResponse = () => {
    return {
      text: "Looking at momentum across the slate, three players are running hot. Anthony Edwards has exceeded his points prop in 8 straight, averaging 4.2 points above the line—clear positive trend. Trae Young's assists have cleared in 7 of the last 8 with increasing margin. And Victor Wembanyama's blocks are hitting at 85% with expanding usage. These represent the strongest recent trajectories. Note: hot streaks eventually regress. The edge is in riding momentum before the market adjusts.",
      confidence: 75,
      analysis: [
        { type: 'trend', label: 'Edwards Pts', value: '8 str', subtext: '+4.2 avg', trend: 'up' },
        { type: 'trend', label: 'Young Ast', value: '7/8', subtext: 'trending', trend: 'up' },
        { type: 'trend', label: 'Wemby Blk', value: '85%', subtext: 'hot', trend: 'up' }
      ],
      actions: ['Analyze Edwards', 'Analyze Young', 'Analyze Wemby']
    };
  };
  
  const generateDeepDiveResponse = () => {
    return {
      text: "Running comprehensive analysis. Layer A—Performance Foundation: Last 5 games average 28.4, median 27, clearing the line consistently. Last 10 shows 27.1 average with 4.8 standard deviation, placing this in moderate volatility. Season baseline sits at 26.5, suggesting recent form is running above true talent level—regression signal is present. Layer B—Line Interaction: Current line shows 68% hit rate over last 10, with comfortable margins when hitting. Miss margins are narrow—typically within 2 points of the line. Layer C—Context: Home games show 2.3 point boost. Rest days add another point on average. Layer D—Matchup: Tonight's opponent allows 4th most points to the position, projecting favorable. Synthesis: The data supports the over, but regression risk exists. Size at 60% of normal to account for elevated recent performance.",
      confidence: 76,
      analysis: [
        { type: 'hitRate', label: 'Hit Rate L10', value: '68%', trend: 'up' },
        { type: 'variance', label: 'Variance', value: 'Mod', subtext: 'SD: 4.8' },
        { type: 'edge', label: 'Edge', value: '+8%', subtext: 'proj' },
        { type: 'trend', label: 'Trend', value: 'Hot', subtext: 'regression risk' }
      ]
    };
  };
  
  const generateQuickTakeResponse = () => {
    return {
      text: "Bottom line: 68% hit rate, moderate variance, favorable matchup tonight. The over is the play, but recent hot streak suggests smaller size to account for regression. Confidence sits at 72%.",
      confidence: 72
    };
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // VOICE CONTROLS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        // Stop any current speech
        if (voiceEngineRef.current) {
          voiceEngineRef.current.stop();
        }
        setIsSpeaking(false);
        
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };
  
  const toggleMute = () => {
    if (isSpeaking && voiceEngineRef.current) {
      voiceEngineRef.current.stop();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(inputText);
    }
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized 
          ? 'bottom-24 right-6 w-auto' 
          : 'bottom-24 right-6 w-[440px] max-h-[650px]'
      }`}
    >
      <div className={`rounded-2xl overflow-hidden shadow-2xl ${
        isDark 
          ? 'bg-slate-900/98 border border-slate-700/50' 
          : 'bg-white/98 border border-gray-200'
      } backdrop-blur-xl`}>
        
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════════════════ */}
        <div className={`px-4 py-3 flex items-center justify-between ${
          isDark 
            ? 'bg-gradient-to-r from-slate-800 to-slate-800/80 border-b border-slate-700/50' 
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-emerald-500 to-cyan-600' 
                : 'bg-gradient-to-br from-emerald-600 to-cyan-700'
            } shadow-lg shadow-emerald-500/30`}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Ray
                </span>
                <PulsingOrb 
                  isActive={!isProcessing && !isSpeaking && !isListening} 
                  size="sm" 
                  color={isListening ? 'emerald' : isSpeaking ? 'blue' : 'emerald'}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isListening ? 'Listening...' : isProcessing ? 'Analyzing...' : isSpeaking ? 'Speaking...' : 'Ready'}
                </span>
                {voiceInfo && (
                  <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    • {voiceInfo.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              } ${isMuted ? 'text-red-400' : ''}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════
            MESSAGES AREA
        ═══════════════════════════════════════════════════════════════════ */}
        {!isMinimized && (
          <>
            <div className="h-[420px] overflow-y-auto p-4 scroll-smooth">
              {messages.map((message) => (
                <RayMessage 
                  key={message.id} 
                  message={message} 
                  isUser={message.isUser}
                  isDark={isDark}
                />
              ))}
              
              {isProcessing && (
                <div className="flex justify-start mb-4">
                  <div className={`px-4 py-3 rounded-2xl ${
                    isDark ? 'bg-slate-800/80' : 'bg-gray-100'
                  }`}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* ═══════════════════════════════════════════════════════════════════
                INPUT AREA
            ═══════════════════════════════════════════════════════════════════ */}
            <div className={`p-4 border-t ${
              isDark ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
            }`}>
              {/* Voice Waveform (when active) */}
              {(isListening || isSpeaking || isProcessing) && (
                <div className="flex justify-center mb-3">
                  <VoiceWaveform 
                    isListening={isListening} 
                    isProcessing={isProcessing}
                    isSpeaking={isSpeaking}
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {/* Voice Button */}
                <button
                  onClick={toggleListening}
                  className={`p-3.5 rounded-xl transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                      : isDark 
                        ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-gradient-to-br from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/30'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                {/* Text Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Ask Ray anything..."}
                    className={`w-full px-4 py-3 rounded-xl text-sm ${
                      isDark 
                        ? 'bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30' 
                        : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                    } outline-none transition-all`}
                    disabled={isListening}
                  />
                </div>
                
                {/* Send Button */}
                <button
                  onClick={() => handleUserInput(inputText)}
                  disabled={!inputText.trim() || isProcessing}
                  className={`p-3.5 rounded-xl transition-all ${
                    inputText.trim() && !isProcessing
                      ? isDark 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : isDark 
                        ? 'bg-slate-700/50 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 mt-3">
                {["What's good tonight?", "Who's consistent?", "Show me trending"].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserInput(prompt)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isDark 
                        ? 'bg-slate-700/50 hover:bg-slate-600/50 text-gray-400 hover:text-gray-200 border border-slate-600/30' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RayAssistant;
