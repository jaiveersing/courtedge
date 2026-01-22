# CourtEdge API Documentation

## Base URL
```
Production: https://api.courtedge.com/v1
Development: http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "bankroll": 1000
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "username",
  "password": "SecurePass123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

---

## Predictions

### Get Predictions
```http
GET /predictions?sport=basketball_nba&date=2024-01-15
Authorization: Bearer <token>
```

**Query Parameters:**
- `sport` (optional): Sport type (default: basketball_nba)
- `date` (optional): Game date (YYYY-MM-DD)
- `team` (optional): Filter by team name
- `confidence` (optional): Minimum confidence threshold (0-100)

**Response:**
```json
{
  "predictions": [
    {
      "id": "uuid",
      "gameId": "nba_2024_001",
      "gameDate": "2024-01-15T19:00:00Z",
      "homeTeam": "Lakers",
      "awayTeam": "Warriors",
      "predictedWinner": "Lakers",
      "winProbability": 62.5,
      "predictedSpread": -3.5,
      "spreadConfidence": 78.2,
      "predictedTotal": 220.5,
      "totalConfidence": 71.8,
      "modelVersion": "v2.1.0"
    }
  ]
}
```

### Get Player Props Predictions
```http
GET /predictions/props?playerId=<player_id>&gameId=<game_id>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "playerName": "LeBron James",
  "predictions": {
    "points": { "value": 28.5, "confidence": 82.3, "line": 27.5, "recommendation": "over" },
    "rebounds": { "value": 8.2, "confidence": 76.8, "line": 7.5, "recommendation": "over" },
    "assists": { "value": 7.8, "confidence": 79.1, "line": 8.5, "recommendation": "under" }
  }
}
```

---

## Odds & Line Shopping

### Get Current Odds
```http
GET /odds?sport=basketball_nba
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sport": "basketball_nba",
  "games": [
    {
      "id": "game_001",
      "commence_time": "2024-01-15T19:00:00Z",
      "home_team": "Lakers",
      "away_team": "Warriors",
      "bookmakers": [
        {
          "key": "draftkings",
          "title": "DraftKings",
          "markets": [
            {
              "key": "spreads",
              "outcomes": [
                { "name": "Lakers", "price": -110, "point": -3.5 },
                { "name": "Warriors", "price": -110, "point": 3.5 }
              ]
            },
            {
              "key": "totals",
              "outcomes": [
                { "name": "Over", "price": -110, "point": 220.5 },
                { "name": "Under", "price": -110, "point": 220.5 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Get Best Odds
```http
GET /odds/best?gameId=<game_id>&market=spreads
Authorization: Bearer <token>
```

### Get Arbitrage Opportunities
```http
GET /odds/arbitrage?minProfit=0.5
Authorization: Bearer <token>
```

**Response:**
```json
{
  "opportunities": [
    {
      "id": "arb_001",
      "gameId": "game_001",
      "game": "Lakers vs Warriors",
      "profitPercent": 2.3,
      "outcomes": [
        { "bookmaker": "DraftKings", "selection": "Lakers -3.5", "odds": -110 },
        { "bookmaker": "FanDuel", "selection": "Warriors +4.5", "odds": -105 }
      ]
    }
  ]
}
```

### Get Line Movements
```http
GET /odds/movements?gameId=<game_id>&hours=24
Authorization: Bearer <token>
```

---

## Bets

### Create Bet
```http
POST /bets
Authorization: Bearer <token>
Content-Type: application/json

{
  "sport": "basketball",
  "league": "NBA",
  "gameId": "nba_2024_001",
  "gameDate": "2024-01-15T19:00:00Z",
  "homeTeam": "Lakers",
  "awayTeam": "Warriors",
  "betType": "single",
  "market": "spread",
  "selection": "Lakers -3.5",
  "line": -3.5,
  "odds": -110,
  "stakeAmount": 100,
  "units": 1,
  "bookmaker": "DraftKings"
}
```

**Response:**
```json
{
  "bet": {
    "id": "uuid",
    "status": "pending",
    "toWin": 90.91,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### Get User Bets
```http
GET /bets?status=pending&limit=50&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: pending, won, lost, push
- `sport`: basketball, football, etc.
- `dateFrom`: YYYY-MM-DD
- `dateTo`: YYYY-MM-DD
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

### Update Bet Status
```http
PATCH /bets/<bet_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "won",
  "payout": 190.91
}
```

### Get Bet Stats
```http
GET /bets/stats?period=month
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalBets": 156,
  "wins": 89,
  "losses": 67,
  "winRate": 57.1,
  "totalStaked": 15600,
  "totalPayout": 18234.50,
  "profitLoss": 2634.50,
  "roi": 16.9,
  "bestStreak": 8,
  "currentStreak": 3
}
```

---

## Bankroll Management

### Get Bankroll
```http
GET /bankroll
Authorization: Bearer <token>
```

**Response:**
```json
{
  "current": 3450.00,
  "starting": 1000.00,
  "peak": 3650.00,
  "profitLoss": 2450.00,
  "roi": 245.0,
  "currentDrawdown": 5.5,
  "maxDrawdown": 15.2
}
```

### Calculate Kelly Criterion
```http
POST /bankroll/kelly
Authorization: Bearer <token>
Content-Type: application/json

{
  "odds": -110,
  "winProbability": 55,
  "kellyFraction": 0.25
}
```

**Response:**
```json
{
  "kellyPercent": 2.73,
  "recommendedPercent": 2.73,
  "stakeAmount": 94.16,
  "units": 2.73
}
```

### Get Bankroll History
```http
GET /bankroll/history?days=30
Authorization: Bearer <token>
```

---

## Social

### Get Leaderboard
```http
GET /social/leaderboard?period=month&limit=50
Authorization: Bearer <token>
```

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uuid",
      "username": "SharpBettor",
      "verified": true,
      "totalBets": 342,
      "winRate": 57.0,
      "roi": 24.5,
      "totalProfit": 8450.00,
      "followers": 1250
    }
  ]
}
```

### Follow User
```http
POST /social/follow
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_to_follow"
}
```

### Get Shared Bets
```http
GET /social/shared-bets?filter=following
Authorization: Bearer <token>
```

### Like Bet
```http
POST /social/bets/<bet_id>/like
Authorization: Bearer <token>
```

### Comment on Bet
```http
POST /social/bets/<bet_id>/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great pick!"
}
```

---

## Injuries

### Get Current Injuries
```http
GET /injuries?team=Lakers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "injuries": [
    {
      "playerId": "player_001",
      "playerName": "Anthony Davis",
      "team": "Lakers",
      "position": "C",
      "status": "Questionable",
      "injuryType": "Ankle sprain",
      "severity": "medium",
      "impact": "high",
      "expectedReturn": "2024-01-20",
      "updated": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Player Injury Status
```http
GET /injuries/player/<player_id>
Authorization: Bearer <token>
```

---

## Notifications

### Get Notifications
```http
GET /notifications?filter=unread
Authorization: Bearer <token>
```

### Mark as Read
```http
PATCH /notifications/<notification_id>/read
Authorization: Bearer <token>
```

### Register Push Token
```http
POST /notifications/register-token
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "fcm_token",
  "deviceType": "ios"
}
```

### Update Notification Settings
```http
PATCH /notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "betSettled": true,
  "arbitrage": true,
  "injuries": false
}
```

---

## Player Stats

### Get Player Stats
```http
GET /players/<player_id>/stats?season=2023-24
Authorization: Bearer <token>
```

### Get Game Logs
```http
GET /players/<player_id>/games?last=10
Authorization: Bearer <token>
```

### Get Player Trends
```http
GET /players/<player_id>/trends?stat=points&games=20
Authorization: Bearer <token>
```

---

## WebSocket API

### Connection
```
ws://api.courtedge.com/ws?token=<access_token>
```

### Subscribe to Channel
```json
{
  "type": "subscribe",
  "payload": {
    "channel": "odds",
    "params": { "sport": "basketball_nba" }
  }
}
```

### Available Channels
- `odds` - Live odds updates
- `line_movement` - Line movements
- `alerts` - Arbitrage & steam moves
- `predictions` - New predictions
- `injuries` - Injury updates
- `live_scores` - Live game scores

### Example Message
```json
{
  "type": "broadcast",
  "channel": "odds",
  "params": { "sport": "basketball_nba" },
  "data": {
    "type": "odds_update",
    "sport": "basketball_nba",
    "odds": [...],
    "timestamp": 1705329600000
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limits

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705333200
```

---

## Pagination

All list endpoints support pagination:
```
?limit=50&offset=0
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Postman Collection

Import our Postman collection:
```
https://api.courtedge.com/postman/collection.json
```

---

## SDK Libraries

### JavaScript
```bash
npm install @courtedge/sdk
```

```javascript
import CourtEdge from '@courtedge/sdk';

const client = new CourtEdge({ apiKey: 'your_api_key' });
const predictions = await client.predictions.get({ sport: 'nba' });
```

### Python
```bash
pip install courtedge
```

```python
from courtedge import Client

client = Client(api_key='your_api_key')
predictions = client.predictions.get(sport='nba')
```

---

## Support

- **Documentation**: https://docs.courtedge.com
- **Email**: support@courtedge.com
- **Discord**: https://discord.gg/courtedge
- **Status**: https://status.courtedge.com
