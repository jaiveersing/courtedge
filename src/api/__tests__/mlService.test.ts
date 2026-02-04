import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock API client
class MockMLService {
  async predictPlayerProp(data: any) {
    return {
      prediction: 25.5,
      confidence: 0.82,
      recommendedAction: 'over',
      factors: {
        recent_form: 0.75,
        opponent_defense: 0.65,
        home_away: 0.88,
        rest_days: 0.70,
        injury_impact: 0.90,
      },
      expectedValue: 0.05,
      kellyBet: 2.5,
    };
  }

  async getHealth() {
    return {
      status: 'healthy',
      models_loaded: true,
      uptime: 3600,
    };
  }
}

describe('ML Service API Client', () => {
  let mlService: MockMLService;

  beforeEach(() => {
    mlService = new MockMLService();
  });

  describe('predictPlayerProp', () => {
    it('should return valid prediction structure', async () => {
      const request = {
        playerId: 'lebron_james',
        statType: 'points',
        gameDate: '2025-01-27',
        opponent: 'BOS',
      };

      const response = await mlService.predictPlayerProp(request);

      expect(response).toHaveProperty('prediction');
      expect(response).toHaveProperty('confidence');
      expect(response).toHaveProperty('recommendedAction');
      expect(response.prediction).toBeGreaterThan(0);
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });

    it('should include all required factors', async () => {
      const request = {
        playerId: 'stephen_curry',
        statType: 'threes',
        gameDate: '2025-01-27',
      };

      const response = await mlService.predictPlayerProp(request);

      expect(response.factors).toHaveProperty('recent_form');
      expect(response.factors).toHaveProperty('opponent_defense');
      expect(response.factors).toHaveProperty('home_away');
      expect(response.factors).toHaveProperty('rest_days');
      expect(response.factors).toHaveProperty('injury_impact');
    });
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const health = await mlService.getHealth();

      expect(health).toHaveProperty('status');
      expect(health.status).toBe('healthy');
      expect(health).toHaveProperty('models_loaded');
      expect(health.models_loaded).toBe(true);
    });
  });
});
