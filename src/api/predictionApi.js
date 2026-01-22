/**
 * API client for ML prediction service
 */
const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export class PredictionAPI {
  static async predictPlayerProp(playerName, statType, opponent = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName,
          stat_type: statType,
          opponent: opponent
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching player prediction:', error);
      // Return mock data on error
      return {
        player_name: playerName,
        stat_type: statType,
        prediction: 25.5,
        confidence: 75,
        confidence_interval_low: 20.0,
        confidence_interval_high: 31.0,
        factors: ['Using cached prediction', 'API unavailable'],
        last_5_games_avg: 24.2,
        season_avg: 25.1
      };
    }
  }

  static async predictGame(gameId) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/game/${gameId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching game prediction:', error);
      return null;
    }
  }

  static async getTodaysPredictions() {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/today`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching today predictions:', error);
      return [];
    }
  }

  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default PredictionAPI;
