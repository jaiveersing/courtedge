import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initializeWebSocket } from './websocket.js';
import nbaPlayersRouter from './nbaPlayers.js';
import {
  securityHeaders,
  apiRateLimiter,
  mlRateLimiter,
  corsOptions,
  requestLogger,
  errorHandler,
  sanitizeInput
} from './middleware/security.js';

// Create simple console logger
const log = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  debug: (...args) => console.log('[DEBUG]', ...args)
};

dotenv.config();

const app = express();

// ═══════════════════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE - Applied before routes
// ═══════════════════════════════════════════════════════════════════════════════════
app.use(securityHeaders);
app.use(requestLogger);
app.use(sanitizeInput);
app.use(cors(corsOptions));
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════════
app.use('/api', apiRateLimiter);
app.use('/api/ml', mlRateLimiter);

// Mount NBA Players API routes
app.use('/api', nbaPlayersRouter);

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const BASE44_BASE = process.env.SERVER_BASE44_BASE_URL || 'https://app.base44.com/api/apps';
const APP_ID = process.env.SERVER_BASE44_APP_ID;
const API_KEY = process.env.SERVER_BASE44_API_KEY;

if (!APP_ID || !API_KEY) {
  log.warn('Base44 API credentials not configured', { 
    hasAppId: !!APP_ID, 
    hasApiKey: !!API_KEY 
  });
}

log.info('Server configuration loaded', { mlServiceUrl: ML_SERVICE_URL });

function base44Url(pathSuffix){
  return `${BASE44_BASE}/${APP_ID}${pathSuffix}`;
}

// Proxy list entities: GET /api/base44/entities/:entity
app.get('/api/base44/entities/:entity', async (req, res) => {
  try{
    const entity = req.params.entity;
    const url = new URL(base44Url(`/entities/${entity}`));
    // forward query params
    Object.entries(req.query || {}).forEach(([k,v]) => url.searchParams.append(k,v));

    const r = await fetch(url.toString(), {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const data = await r.text();
    res.status(r.status).send(data);
  }catch(err){
    console.error(err);
    res.status(500).json({error: String(err)});
  }
});

// Proxy update entity: PATCH /api/base44/entities/:entity/:id
app.patch('/api/base44/entities/:entity/:id', async (req,res)=>{
  try{
    const {entity,id} = req.params;
    const url = base44Url(`/entities/${entity}/${id}`);
    const r = await fetch(url, {
      method: 'PATCH',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await r.text();
    res.status(r.status).send(data);
  }catch(err){
    console.error(err);
    res.status(500).json({error: String(err)});
  }
});

// ============================================
// ML API Proxy Endpoints
// ============================================

// Health check for ML service
app.get('/api/ml/health', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML service health check failed', err);
    res.status(503).json({ 
      error: 'ML service unavailable',
      message: err.message 
    });
  }
});

// Player prop prediction
app.post('/api/ml/predict/player_prop', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/player_prop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      throw new Error(`ML service error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML player prop prediction failed', err);
    res.status(503).json({ 
      error: 'ML service unavailable',
      message: err.message 
    });
  }
});

// Game outcome prediction
app.post('/api/ml/predict/game_outcome', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/game_outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML game prediction failed', err);
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// Live game prediction
app.post('/api/ml/predict/live_game', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/live_game`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML live prediction failed', err);
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// Sharp money detection
app.get('/api/ml/sharp_money', async (req, res) => {
  try {
    const sport = req.query.sport || 'nba';
    const limit = req.query.limit || 10;
    const response = await fetch(`${ML_SERVICE_URL}/detect/sharp_money?sport=${sport}&limit=${limit}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML sharp money detection failed', err);
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// Bankroll optimization
app.post('/api/ml/optimize/bankroll', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/optimize/bankroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    log.error('ML bankroll optimization failed', err);
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ============================================
// End ML API Proxy
// ============================================

// Serve static build when in production
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ═══════════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER - Must be last middleware
// ═══════════════════════════════════════════════════════════════════════════════════
app.use(errorHandler);

app.listen(PORT, ()=>{
  log.info('Server started', { port: PORT, mlServiceUrl: ML_SERVICE_URL });
  
  // Initialize WebSocket server
  try {
    initializeWebSocket(8080);
    log.info('WebSocket server initialized', { port: 8080 });
  } catch (err) {
    log.error('WebSocket initialization failed', err);
  }
});
