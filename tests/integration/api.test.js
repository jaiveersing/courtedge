import request from 'supertest';
import app from '../../server/index';
import jwt from 'jsonwebtoken';

describe('Authentication API Integration', () => {
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'SecurePass123',
    firstName: 'Test',
    lastName: 'User'
  };

  let accessToken;
  let refreshToken;

  describe('POST /auth/register', () => {
    test('registers new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    test('rejects duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    test('validates email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('validates password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, password: '123' })
        .expect(400);

      expect(response.body.error).toMatch(/password/i);
    });
  });

  describe('POST /auth/login', () => {
    test('logs in existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
    });

    test('rejects invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    test('refreshes access token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBe(accessToken);
    });

    test('rejects invalid refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid_token' })
        .expect(403);
    });
  });

  describe('Protected Routes', () => {
    test('allows access with valid token', async () => {
      await request(app)
        .get('/api/predictions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    test('denies access without token', async () => {
      await request(app)
        .get('/api/predictions')
        .expect(401);
    });

    test('denies access with invalid token', async () => {
      await request(app)
        .get('/api/predictions')
        .set('Authorization', 'Bearer invalid_token')
        .expect(403);
    });
  });
});

describe('Predictions API Integration', () => {
  let authToken;

  beforeAll(async () => {
    // Login to get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'SecurePass123'
      });
    
    authToken = response.body.tokens.accessToken;
  });

  describe('GET /predictions', () => {
    test('returns predictions for NBA', async () => {
      const response = await request(app)
        .get('/api/predictions?sport=basketball_nba')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('predictions');
      expect(Array.isArray(response.body.predictions)).toBe(true);
    });

    test('filters by date', async () => {
      const date = '2024-01-15';
      const response = await request(app)
        .get(`/api/predictions?date=${date}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.predictions.forEach(pred => {
        expect(pred.gameDate).toContain(date);
      });
    });

    test('filters by confidence threshold', async () => {
      const minConfidence = 70;
      const response = await request(app)
        .get(`/api/predictions?confidence=${minConfidence}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.predictions.forEach(pred => {
        expect(pred.spreadConfidence).toBeGreaterThanOrEqual(minConfidence);
      });
    });
  });

  describe('GET /predictions/props', () => {
    test('returns player prop predictions', async () => {
      const response = await request(app)
        .get('/api/predictions/props?playerId=player_001&gameId=game_001')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('playerName');
      expect(response.body).toHaveProperty('predictions');
    });
  });
});

describe('Bets API Integration', () => {
  let authToken;
  let betId;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'SecurePass123'
      });
    
    authToken = response.body.tokens.accessToken;
  });

  describe('POST /bets', () => {
    test('creates new bet', async () => {
      const bet = {
        sport: 'basketball',
        league: 'NBA',
        gameId: 'nba_001',
        gameDate: '2024-01-15T19:00:00Z',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        betType: 'single',
        market: 'spread',
        selection: 'Lakers -3.5',
        line: -3.5,
        odds: -110,
        stakeAmount: 100,
        units: 1,
        bookmaker: 'DraftKings'
      };

      const response = await request(app)
        .post('/api/bets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bet)
        .expect(201);

      expect(response.body).toHaveProperty('bet');
      expect(response.body.bet).toHaveProperty('id');
      expect(response.body.bet.status).toBe('pending');

      betId = response.body.bet.id;
    });

    test('validates required fields', async () => {
      const response = await request(app)
        .post('/api/bets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'basketball' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /bets', () => {
    test('returns user bets', async () => {
      const response = await request(app)
        .get('/api/bets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bets');
      expect(Array.isArray(response.body.bets)).toBe(true);
    });

    test('filters by status', async () => {
      const response = await request(app)
        .get('/api/bets?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.bets.forEach(bet => {
        expect(bet.status).toBe('pending');
      });
    });
  });

  describe('PATCH /bets/:betId', () => {
    test('updates bet status', async () => {
      const response = await request(app)
        .patch(`/api/bets/${betId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'won',
          payout: 190.91
        })
        .expect(200);

      expect(response.body.bet.status).toBe('won');
      expect(response.body.bet.payout).toBe(190.91);
    });
  });

  describe('GET /bets/stats', () => {
    test('returns betting statistics', async () => {
      const response = await request(app)
        .get('/api/bets/stats?period=month')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalBets');
      expect(response.body).toHaveProperty('winRate');
      expect(response.body).toHaveProperty('profitLoss');
      expect(response.body).toHaveProperty('roi');
    });
  });
});

describe('Rate Limiting', () => {
  test('enforces rate limits', async () => {
    const requests = Array(101).fill(null);
    
    const responses = await Promise.all(
      requests.map(() => 
        request(app)
          .get('/api/predictions')
          .set('Authorization', `Bearer valid_token`)
      )
    );

    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
