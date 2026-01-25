# 🎯 RAY v2.0 Testing Guide

## ✅ DEPLOYMENT STATUS
- **Frontend**: Live at courtedge.vercel.app
- **ML Service**: courtedge-ml-api.onrender.com  
- **Voice**: American male voice configured ✓
- **Commit**: Ray v2.0 pushed to main

---

## 🎙️ HOW TO TEST RAY

### 1. Find the Ray Button
- **Location**: Bottom-right corner of dashboard
- **Visual**: Emerald gradient floating button with microphone icon
- **States**:
  - Idle: Pulsing emerald glow
  - Listening: Animated waveform bars
  - Processing: Rotating spinner
  - Speaking: Blue pulsing effect

### 2. Start a Conversation
**Click the button** → Wait for American male voice to say "Listening"

Try these natural phrases:

#### Player Evaluation
- "How's LeBron looking tonight?"
- "Tell me about Steph Curry"
- "What do you think about Giannis?"
- "Should I bet on Luka?"

#### Navigation
- "Show me the dashboard"
- "Take me to player props"
- "Open the bankroll page"
- "Go to analytics"

#### Market Analysis  
- "What's the points line for Tatum?"
- "Show me Harden's assists prop"
- "Tell me about Jokic rebounds"

#### Comparison
- "Who's better, LeBron or Durant?"
- "Compare Steph and Dame"
- "Tatum vs Butler tonight?"

### 3. Voice Quality Check
**Expected**: Deep, calm American male voice (like a professional sports analyst)
**NOT**: Chinese accent, female voice, or default system voice

If voice is wrong:
1. Refresh page (Ctrl+R)
2. Check browser speech voices in Settings
3. Ensure American English male voice is installed

---

## 🧠 WHAT'S IMPLEMENTED

### ✅ Working Features
1. **Voice Recognition** - Hands-free natural language input
2. **Context Tracking** - Remembers sport/game/player in conversation
3. **Intent Recognition** - Understands ~50 natural phrases
4. **American Male Voice** - Professional analyst tone
5. **Response Generation** - Natural, conversational style
6. **UI States** - Visual feedback for all voice states
7. **Analysis Formulas** - 4-layer player evaluation engine
8. **Personality System** - Calm, confident, intelligent responses

### 🔄 Using Mock Data (Next Phase)
- Player analysis uses simulated stats
- Line data is placeholder values  
- Matchup history is generated
- Once connected to real DB: Full power unlocked

### ❌ Not Yet Implemented
- Multi-market comparison (Props vs ML vs Spread)
- Risk modeling with confidence scores
- Live line movement tracking
- Betting psychology guidance
- User preference learning
- Proactive alerts

---

## 💡 CONVERSATION EXAMPLES

### Example 1: Quick Player Check
```
You: "How's Steph looking?"

Ray: "Steph Curry is averaging twenty-five points on forty-four 
percent shooting over his last ten games. His prop lines are 
sitting around twenty-eight points. He's in solid form."
```

### Example 2: Line Analysis
```
You: "What about his threes prop?"

Ray: "The three-pointers line is at four and a half. He's hit 
that mark in six of his last ten. I'd lean the over there."
```

### Example 3: Navigation
```
You: "Show me player props"

Ray: "Taking you to player props now."
[Navigates to props page]
```

### Example 4: Comparison  
```
You: "Who's better tonight, Luka or Jokic?"

Ray: "Both are solid plays. Luka's averaging thirty-two points 
but Jokic has the better matchup. Jokic might be the safer bet."
```

---

## 🎭 PERSONALITY TRAITS

Ray always speaks like:
- **Calm**: Never hyped or aggressive
- **Confident**: Definitive opinions without hedging
- **Intelligent**: Data-backed insights
- **Conversational**: Natural, friendly tone
- **Audio-Optimized**: No complex symbols or long numbers

Ray NEVER says:
- "Absolutely!" "Amazing!" "Fantastic!" (too hyped)
- "I think" "Maybe" "Possibly" (too uncertain)
- "Let's dive in" "Buckle up" (cliché phrases)
- Numbers with decimals in speech

---

## 🔧 TROUBLESHOOTING

### Ray button doesn't appear
- Check you're on Dashboard page
- Refresh browser (Ctrl+R)
- Clear cache and reload

### Voice has wrong accent
- Browser may not have American male voice installed
- Try different browser (Chrome recommended)
- Check Speech Synthesis settings

### Ray doesn't understand me
- Speak clearly and naturally
- Use simple phrases (see examples above)
- Check microphone permissions

### No audio response
- Check system volume
- Try headphones
- Verify browser audio permissions

---

## 🚀 NEXT DEPLOYMENT PHASE

Once you confirm voice works:
1. **Data Integration** - Connect to real NBA stats
2. **Line Intelligence** - Live line movement tracking
3. **Multi-Market** - Compare props vs spreads vs ML
4. **Risk Modeling** - Confidence scores for each bet
5. **User Learning** - Adapt to your betting style
6. **Proactive Alerts** - Ray tells you about opportunities

---

## 📊 CURRENT STATS

- **Total Lines**: 1,427
- **Voice Preferences**: 3 (Google US English Male, Microsoft David, Alex)
- **Avoided Voices**: 8 female voices filtered out
- **Intent Patterns**: ~50 natural phrases recognized
- **Context Layers**: 5 (sport, game, player, market, temporal)
- **Analysis Layers**: 4 (performance, line, contextual, matchup)

---

## ✅ TEST CHECKLIST

- [ ] Ray button visible and pulsing
- [ ] Click opens voice interface  
- [ ] Microphone permission granted
- [ ] Voice is American male (NOT Chinese)
- [ ] Ray understands "How's LeBron?"
- [ ] Ray responds with player analysis
- [ ] Navigation commands work
- [ ] Context is maintained across questions
- [ ] No prohibited phrases used
- [ ] Audio quality is clear

---

**Ready to test?** Click the Ray button and say: "How's LeBron looking tonight?"

Expected response: Calm American male voice with professional player analysis.
