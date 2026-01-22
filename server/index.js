import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initializeWebSocket } from './websocket.js';
import nbaPlayersRouter from './nbaPlayers.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount NBA Players API routes
app.use('/api', nbaPlayersRouter);

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const BASE44_BASE = process.env.SERVER_BASE44_BASE_URL || 'https://app.base44.com/api/apps';
const APP_ID = process.env.SERVER_BASE44_APP_ID;
const API_KEY = process.env.SERVER_BASE44_API_KEY;

if (!APP_ID || !API_KEY) {
  console.warn('Warning: SERVER_BASE44_APP_ID or SERVER_BASE44_API_KEY not set. Proxy endpoints will fail until configured.');
}

console.log(`ML Service URL: ${ML_SERVICE_URL}`);

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
    console.error('ML service health check failed:', err);
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
    console.error('ML prediction error:', err);
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
    console.error('ML game prediction error:', err);
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
    console.error('ML live prediction error:', err);
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
    console.error('ML sharp money error:', err);
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
    console.error('ML bankroll optimization error:', err);
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

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
  
  // Initialize WebSocket server
  try {
    initializeWebSocket(8080);
    console.log(`WebSocket server running on port 8080`);
  } catch (err) {
    console.error('WebSocket initialization error:', err);
  }
});
