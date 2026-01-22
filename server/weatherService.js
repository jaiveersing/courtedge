import axios from 'axios';

/**
 * Weather Data Service
 * Fetches weather conditions for outdoor games and calculates impact on gameplay
 * Supports NFL, MLB, MLS, college football
 */

class WeatherService {
  constructor() {
    // Multiple weather API providers for redundancy
    this.providers = {
      openweather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        forecast: 'https://api.openweathermap.org/data/2.5/forecast'
      },
      weatherapi: {
        apiKey: process.env.WEATHERAPI_KEY,
        baseUrl: 'https://api.weatherapi.com/v1'
      },
      visualcrossing: {
        apiKey: process.env.VISUALCROSSING_API_KEY,
        baseUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'
      }
    };

    // Stadium locations for weather lookups
    this.stadiumLocations = {
      // NFL
      'Arrowhead Stadium': { lat: 39.0489, lon: -94.4839, city: 'Kansas City', outdoor: true },
      'Lambeau Field': { lat: 44.5013, lon: -88.0622, city: 'Green Bay', outdoor: true },
      'Soldier Field': { lat: 41.8623, lon: -87.6167, city: 'Chicago', outdoor: true },
      'MetLife Stadium': { lat: 40.8128, lon: -74.0742, city: 'East Rutherford', outdoor: true },
      'Levi\'s Stadium': { lat: 37.4030, lon: -121.9695, city: 'Santa Clara', outdoor: true },
      'AT&T Stadium': { lat: 32.7473, lon: -97.0945, city: 'Arlington', outdoor: false },
      
      // MLB
      'Wrigley Field': { lat: 41.9484, lon: -87.6553, city: 'Chicago', outdoor: true },
      'Fenway Park': { lat: 42.3467, lon: -71.0972, city: 'Boston', outdoor: true },
      'Dodger Stadium': { lat: 34.0739, lon: -118.2400, city: 'Los Angeles', outdoor: true },
      'Yankee Stadium': { lat: 40.8296, lon: -73.9262, city: 'Bronx', outdoor: true }
    };

    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Get weather for a game
   */
  async getGameWeather(gameId, stadium, gameTime, sport) {
    const cacheKey = `${gameId}_${stadium}_${gameTime}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    const location = this.stadiumLocations[stadium];
    
    // Indoor stadiums - no weather impact
    if (!location || !location.outdoor) {
      return {
        indoor: true,
        impact: 'none',
        conditions: 'Indoor facility - weather not a factor'
      };
    }

    try {
      // Fetch weather from primary provider
      const weather = await this.fetchWeatherData(location, gameTime);
      
      // Calculate impact on game
      const impact = this.calculateWeatherImpact(weather, sport);
      
      const result = {
        ...weather,
        ...impact,
        stadium,
        location: location.city,
        fetchedAt: new Date().toISOString()
      };

      // Cache result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Weather fetch error for ${stadium}:`, error);
      
      // Fallback to secondary provider
      try {
        return await this.fetchWeatherFallback(location, gameTime, sport);
      } catch (fallbackError) {
        return {
          error: 'Unable to fetch weather data',
          indoor: false,
          impact: 'unknown'
        };
      }
    }
  }

  /**
   * Fetch weather from OpenWeather API
   */
  async fetchWeatherData(location, gameTime) {
    const { apiKey, forecast } = this.providers.openweather;
    
    const response = await axios.get(forecast, {
      params: {
        lat: location.lat,
        lon: location.lon,
        appid: apiKey,
        units: 'imperial'
      }
    });

    // Find forecast closest to game time
    const gameDate = new Date(gameTime);
    const forecasts = response.data.list;
    
    const closestForecast = forecasts.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.dt * 1000) - gameDate);
      const currDiff = Math.abs(new Date(curr.dt * 1000) - gameDate);
      return currDiff < prevDiff ? curr : prev;
    });

    return {
      temperature: closestForecast.main.temp,
      feelsLike: closestForecast.main.feels_like,
      humidity: closestForecast.main.humidity,
      windSpeed: closestForecast.wind.speed,
      windGust: closestForecast.wind.gust || closestForecast.wind.speed,
      windDirection: closestForecast.wind.deg,
      conditions: closestForecast.weather[0].main,
      description: closestForecast.weather[0].description,
      precipitation: closestForecast.pop * 100, // Probability of precipitation
      visibility: closestForecast.visibility / 1609.34, // Convert to miles
      clouds: closestForecast.clouds.all,
      forecast_time: new Date(closestForecast.dt * 1000).toISOString()
    };
  }

  /**
   * Fallback to WeatherAPI
   */
  async fetchWeatherFallback(location, gameTime, sport) {
    const { apiKey, baseUrl } = this.providers.weatherapi;
    
    const date = new Date(gameTime).toISOString().split('T')[0];
    
    const response = await axios.get(`${baseUrl}/forecast.json`, {
      params: {
        key: apiKey,
        q: `${location.lat},${location.lon}`,
        dt: date,
        hour: new Date(gameTime).getHours()
      }
    });

    const forecast = response.data.forecast.forecastday[0].hour[0];
    
    const weather = {
      temperature: forecast.temp_f,
      feelsLike: forecast.feelslike_f,
      humidity: forecast.humidity,
      windSpeed: forecast.wind_mph,
      windGust: forecast.gust_mph,
      windDirection: forecast.wind_degree,
      conditions: forecast.condition.text,
      precipitation: forecast.chance_of_rain || forecast.chance_of_snow,
      visibility: forecast.vis_miles
    };

    return {
      ...weather,
      ...this.calculateWeatherImpact(weather, sport)
    };
  }

  /**
   * Calculate weather impact on gameplay
   */
  calculateWeatherImpact(weather, sport) {
    const impacts = {
      overall: 'low',
      scoring: 'neutral',
      passing: 'neutral',
      kicking: 'neutral',
      factors: []
    };

    // Temperature impact
    if (weather.temperature < 20) {
      impacts.overall = 'high';
      impacts.factors.push('Extreme cold affects ball handling and kicking');
      if (sport === 'football') {
        impacts.passing = 'negative';
        impacts.kicking = 'negative';
        impacts.scoring = 'decreased';
      }
    } else if (weather.temperature > 95) {
      impacts.overall = 'medium';
      impacts.factors.push('High heat may affect player stamina');
      impacts.scoring = 'decreased';
    }

    // Wind impact
    if (weather.windSpeed > 20 || weather.windGust > 25) {
      impacts.overall = 'high';
      impacts.factors.push(`Strong winds (${Math.round(weather.windSpeed)} mph) significantly affect passing and kicking`);
      
      if (sport === 'football') {
        impacts.passing = 'negative';
        impacts.kicking = 'negative';
        impacts.scoring = 'decreased';
      } else if (sport === 'baseball') {
        impacts.factors.push('Wind may affect fly balls and home runs');
      }
    } else if (weather.windSpeed > 10) {
      impacts.overall = 'medium';
      impacts.factors.push(`Moderate winds (${Math.round(weather.windSpeed)} mph) may affect passing accuracy`);
      if (sport === 'football') impacts.passing = 'slight_negative';
    }

    // Precipitation impact
    if (weather.conditions.toLowerCase().includes('rain') || weather.precipitation > 60) {
      impacts.overall = 'high';
      impacts.factors.push('Rain increases fumbles and affects ball control');
      
      if (sport === 'football') {
        impacts.passing = 'negative';
        impacts.scoring = 'decreased';
        impacts.factors.push('Wet conditions favor running game');
      } else if (sport === 'baseball') {
        impacts.factors.push('Rain may delay or postpone game');
      }
    } else if (weather.conditions.toLowerCase().includes('snow')) {
      impacts.overall = 'extreme';
      impacts.factors.push('Snow severely impacts all aspects of play');
      impacts.passing = 'negative';
      impacts.kicking = 'negative';
      impacts.scoring = 'significantly_decreased';
    }

    // Visibility
    if (weather.visibility < 5) {
      impacts.overall = 'high';
      impacts.factors.push('Poor visibility affects passing and tracking ball');
      impacts.passing = 'negative';
    }

    // Betting recommendations
    impacts.recommendations = this.generateBettingRecs(impacts, weather, sport);

    return impacts;
  }

  /**
   * Generate betting recommendations based on weather
   */
  generateBettingRecs(impacts, weather, sport) {
    const recs = [];

    if (sport === 'football') {
      if (impacts.scoring === 'decreased' || impacts.scoring === 'significantly_decreased') {
        recs.push({
          market: 'total',
          recommendation: 'under',
          confidence: impacts.overall === 'extreme' ? 'high' : 'medium',
          reason: 'Weather conditions expected to limit scoring'
        });
      }

      if (impacts.passing === 'negative') {
        recs.push({
          market: 'player_props',
          recommendation: 'under_passing_yards',
          confidence: 'medium',
          reason: 'Wind/precipitation will affect passing game'
        });
        
        recs.push({
          market: 'player_props',
          recommendation: 'over_rushing_yards',
          confidence: 'medium',
          reason: 'Teams likely to favor ground game'
        });
      }

      if (weather.windSpeed > 15) {
        recs.push({
          market: 'player_props',
          recommendation: 'under_field_goals',
          confidence: 'high',
          reason: `High winds (${Math.round(weather.windSpeed)} mph) make field goals difficult`
        });
      }
    } else if (sport === 'baseball') {
      const windDirection = weather.windDirection;
      
      // Wind blowing out to centerfield
      if (windDirection > 135 && windDirection < 225 && weather.windSpeed > 10) {
        recs.push({
          market: 'total',
          recommendation: 'over',
          confidence: 'medium',
          reason: 'Wind blowing out may increase home runs'
        });
      }
      
      // Wind blowing in from outfield
      if ((windDirection < 45 || windDirection > 315) && weather.windSpeed > 10) {
        recs.push({
          market: 'total',
          recommendation: 'under',
          confidence: 'medium',
          reason: 'Wind blowing in will suppress offense'
        });
      }
    }

    return recs;
  }

  /**
   * Get weather alerts for upcoming games
   */
  async getWeatherAlerts(games) {
    const alerts = [];

    for (const game of games) {
      if (!game.stadium || !game.gameTime) continue;

      const weather = await this.getGameWeather(
        game.id,
        game.stadium,
        game.gameTime,
        game.sport
      );

      if (weather.impact && ['high', 'extreme'].includes(weather.overall)) {
        alerts.push({
          gameId: game.id,
          game: `${game.awayTeam} @ ${game.homeTeam}`,
          stadium: game.stadium,
          gameTime: game.gameTime,
          weather,
          alertLevel: weather.overall,
          message: `Severe weather expected: ${weather.conditions}`,
          bettingImpact: weather.recommendations
        });
      }
    }

    return alerts;
  }

  /**
   * Get historical weather data for analysis
   */
  async getHistoricalWeather(stadium, startDate, endDate) {
    const location = this.stadiumLocations[stadium];
    if (!location) return null;

    const { apiKey, baseUrl } = this.providers.visualcrossing;
    
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const url = `${baseUrl}/${location.city}/${start}/${end}`;
    
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        unitGroup: 'us',
        include: 'days'
      }
    });

    return response.data.days.map(day => ({
      date: day.datetime,
      tempHigh: day.tempmax,
      tempLow: day.tempmin,
      windSpeed: day.windspeed,
      precipitation: day.precip,
      conditions: day.conditions
    }));
  }

  /**
   * Add new stadium location
   */
  addStadium(name, lat, lon, city, outdoor = true) {
    this.stadiumLocations[name] = { lat, lon, city, outdoor };
  }
}

export default new WeatherService();
