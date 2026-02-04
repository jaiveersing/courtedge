# API Documentation

## Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.courtedge.app/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ml_service": "healthy"
  }
}
```

### Authentication

#### Register User
```
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user"
  }
}
```

### Bets

#### Create Bet
```
POST /bets
Authorization: Bearer <token>
```

**Body:**
```json
{
  "betType": "player_prop",
  "playerId": "lebron_james",
  "playerName": "LeBron James",
  "propType": "points",
  "line": 25.5,
  "position": "over",
  "odds": -110,
  "stake": 100,
  "sportsbook": "DraftKings",
  "gameDate": "2025-01-27"
}
```

#### Get User Bets
```
GET /bets
Authorization: Bearer <token>
Query Parameters:
  - status: pending|won|lost|push (optional)
  - limit: number (default: 50)
  - offset: number (default: 0)
```

#### Update Bet
```
PATCH /bets/:betId
Authorization: Bearer <token>
```

### ML Predictions

#### Player Prop Prediction
```
POST /ml/predict/player_prop
```

**Body:**
```json
{
  "playerId": "lebron_james",
  "statType": "points",
  "gameDate": "2025-01-27",
  "opponent": "BOS"
}
```

**Response:**
```json
{
  "prediction": 27.8,
  "confidence": 0.82,
  "recommendedAction": "over",
  "factors": {
    "recent_form": 0.75,
    "opponent_defense": 0.65,
    "home_away": 0.88,
    "rest_days": 0.70,
    "injury_impact": 0.90
  },
  "expectedValue": 0.05,
  "kellyBet": 2.5
}
```

#### Game Outcome Prediction
```
POST /ml/predict/game_outcome
```

**Body:**
```json
{
  "gameId": "game_123",
  "homeTeam": "LAL",
  "awayTeam": "BOS",
  "gameDate": "2025-01-27"
}
```

### NBA Data

#### Get Players
```
GET /nba/players
Query Parameters:
  - team: string (optional)
  - position: string (optional)
  - search: string (optional)
```

#### Get Player Stats
```
GET /nba/players/:playerId/stats
Query Parameters:
  - season: string (e.g., "2024-25")
  - lastN: number (last N games)
```

## Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **ML Predictions**: 10 requests per minute per IP
- **Authentication**: 5 attempts per 15 minutes per IP

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {} // Optional additional information
}
```

### Common Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## WebSocket API

Connect to real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'SUBSCRIBE_PLAYER',
    playerId: 'lebron_james'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};
```

## SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- Mobile SDKs (iOS/Android)
