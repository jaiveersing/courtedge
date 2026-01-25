/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY STATISTICAL ENGINE v3.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Advanced statistical analysis engine for sports betting analytics.
 * Implements comprehensive statistical methods including:
 * 
 * - Descriptive Statistics (mean, median, mode, variance, std dev, etc.)
 * - Distribution Analysis (normal, poisson, skewness, kurtosis)
 * - Trend Analysis (linear regression, moving averages, momentum)
 * - Probability Calculations (confidence intervals, z-scores, percentiles)
 * - Monte Carlo Simulations
 * - Bayesian Inference
 * - Time Series Analysis
 * - Correlation Analysis
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class RayStatEngine {
  constructor() {
    this.cache = new Map();
    this.EPSILON = 1e-10;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BASIC DESCRIPTIVE STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate arithmetic mean
   */
  mean(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Calculate weighted mean with recency bias
   */
  weightedMean(arr, weights = null) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    if (!weights) {
      // Apply exponential decay weights for recency
      weights = values.map((_, i) => Math.pow(0.95, i));
    }
    
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
    
    return weightedSum / weightSum;
  }

  /**
   * Calculate median (50th percentile)
   */
  median(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    
    return values.length % 2 !== 0
      ? values[mid]
      : (values[mid - 1] + values[mid]) / 2;
  }

  /**
   * Calculate mode (most frequent value)
   */
  mode(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const frequency = {};
    
    values.forEach(val => {
      const rounded = Math.round(val);
      frequency[rounded] = (frequency[rounded] || 0) + 1;
    });
    
    let maxFreq = 0;
    let mode = values[0];
    
    for (const [val, freq] of Object.entries(frequency)) {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = parseFloat(val);
      }
    }
    
    return mode;
  }

  /**
   * Calculate variance
   */
  variance(arr, sample = true) {
    if (!arr || arr.length < 2) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const avg = this.mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
    const divisor = sample ? values.length - 1 : values.length;
    
    return squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
  }

  /**
   * Calculate standard deviation
   */
  stdDev(arr, sample = true) {
    return Math.sqrt(this.variance(arr, sample));
  }

  /**
   * Calculate coefficient of variation (CV)
   */
  coefficientOfVariation(arr) {
    const avg = this.mean(arr);
    if (avg === 0) return 0;
    return this.stdDev(arr) / avg;
  }

  /**
   * Calculate range (max - min)
   */
  range(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    return Math.max(...values) - Math.min(...values);
  }

  /**
   * Calculate interquartile range (IQR)
   */
  iqr(arr) {
    return this.percentile(arr, 75) - this.percentile(arr, 25);
  }

  /**
   * Calculate sum
   */
  sum(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    return values.reduce((a, b) => a + b, 0);
  }

  /**
   * Calculate minimum value
   */
  min(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    return Math.min(...values);
  }

  /**
   * Calculate maximum value
   */
  max(arr) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    return Math.max(...values);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DISTRIBUTION ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Analyze distribution characteristics
   */
  analyzeDistribution(arr) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    return {
      mean: this.round(this.mean(values)),
      median: this.round(this.median(values)),
      mode: this.round(this.mode(values)),
      stdDev: this.round(this.stdDev(values)),
      variance: this.round(this.variance(values)),
      cv: this.round(this.coefficientOfVariation(values), 4),
      skewness: this.round(this.skewness(values), 4),
      kurtosis: this.round(this.kurtosis(values), 4),
      min: this.min(values),
      max: this.max(values),
      range: this.range(values),
      iqr: this.round(this.iqr(values)),
      sampleSize: values.length,
      percentiles: {
        p5: this.round(this.percentile(values, 5)),
        p10: this.round(this.percentile(values, 10)),
        p25: this.round(this.percentile(values, 25)),
        p50: this.round(this.percentile(values, 50)),
        p75: this.round(this.percentile(values, 75)),
        p90: this.round(this.percentile(values, 90)),
        p95: this.round(this.percentile(values, 95))
      },
      confidenceInterval: this.confidenceInterval(values, 0.95),
      distributionType: this.classifyDistribution(values)
    };
  }

  /**
   * Calculate skewness (asymmetry of distribution)
   */
  skewness(arr) {
    if (!arr || arr.length < 3) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const n = values.length;
    const avg = this.mean(values);
    const std = this.stdDev(values);
    
    if (std === 0) return 0;
    
    const cubedDiffs = values.map(val => Math.pow((val - avg) / std, 3));
    const sum = cubedDiffs.reduce((a, b) => a + b, 0);
    
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  /**
   * Calculate kurtosis (tailedness of distribution)
   */
  kurtosis(arr) {
    if (!arr || arr.length < 4) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const n = values.length;
    const avg = this.mean(values);
    const std = this.stdDev(values);
    
    if (std === 0) return 0;
    
    const fourthPowers = values.map(val => Math.pow((val - avg) / std, 4));
    const sum = fourthPowers.reduce((a, b) => a + b, 0);
    
    // Excess kurtosis (normal distribution = 0)
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
           (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }

  /**
   * Classify distribution type
   */
  classifyDistribution(arr) {
    const skew = this.skewness(arr);
    const kurt = this.kurtosis(arr);
    
    let type = 'normal';
    let description = '';
    
    if (Math.abs(skew) < 0.5 && Math.abs(kurt) < 1) {
      type = 'normal';
      description = 'Approximately normal distribution';
    } else if (skew > 0.5) {
      type = 'right-skewed';
      description = 'Right-skewed (positive) - more low values with high outliers';
    } else if (skew < -0.5) {
      type = 'left-skewed';
      description = 'Left-skewed (negative) - more high values with low outliers';
    }
    
    if (kurt > 1) {
      type += '-leptokurtic';
      description += '. Heavy tails - more outliers than normal';
    } else if (kurt < -1) {
      type += '-platykurtic';
      description += '. Light tails - fewer outliers than normal';
    }
    
    return { type, description, skewness: skew, kurtosis: kurt };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PERCENTILES & QUANTILES
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate percentile
   */
  percentile(arr, p) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x).sort((a, b) => a - b);
    
    if (p <= 0) return values[0];
    if (p >= 100) return values[values.length - 1];
    
    const index = (p / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (lower === upper) return values[lower];
    return values[lower] * (1 - weight) + values[upper] * weight;
  }

  /**
   * Calculate percentile rank of a value
   */
  percentileRank(arr, value) {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(x => typeof x === 'object' ? x.value : x).sort((a, b) => a - b);
    
    let below = 0;
    for (const v of values) {
      if (v < value) below++;
    }
    
    return (below / values.length) * 100;
  }

  /**
   * Calculate z-score
   */
  zScore(value, arr) {
    const avg = this.mean(arr);
    const std = this.stdDev(arr);
    
    if (std === 0) return 0;
    return (value - avg) / std;
  }

  /**
   * Convert z-score to probability (CDF of standard normal)
   */
  zScoreToProb(z) {
    // Approximation using error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    
    const t = 1.0 / (1.0 + p * z);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;
    
    const erf = 1 - (a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) * Math.exp(-z * z);
    
    return 0.5 * (1.0 + sign * erf);
  }

  /**
   * Calculate confidence interval
   */
  confidenceInterval(arr, confidence = 0.95) {
    const n = arr.length;
    if (n < 2) return { lower: 0, upper: 0 };
    
    const avg = this.mean(arr);
    const std = this.stdDev(arr);
    
    // Z-values for common confidence levels
    const zValues = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    
    const z = zValues[confidence] || 1.96;
    const marginOfError = z * (std / Math.sqrt(n));
    
    return {
      lower: this.round(avg - marginOfError),
      upper: this.round(avg + marginOfError),
      mean: this.round(avg),
      marginOfError: this.round(marginOfError),
      confidence
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TREND ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Analyze trends in data
   */
  analyzeTrends(arr) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    if (values.length < 3) {
      return {
        direction: 'insufficient',
        strength: 0,
        slope: 0,
        description: 'Insufficient data for trend analysis'
      };
    }
    
    const regression = this.linearRegression(values);
    const momentum = this.calculateMomentum(values);
    const movingAvg = this.movingAverage(values, Math.min(5, values.length));
    const recentTrend = this.recentTrend(values, 5);
    
    // Determine direction
    let direction = 'stable';
    if (regression.slope > 0.5) direction = 'improving';
    else if (regression.slope < -0.5) direction = 'declining';
    
    // Calculate trend strength (0-1)
    const strength = Math.min(1, Math.abs(regression.slope) / 5);
    
    return {
      direction,
      strength: this.round(strength, 3),
      slope: this.round(regression.slope, 3),
      intercept: this.round(regression.intercept, 2),
      rSquared: this.round(regression.rSquared, 4),
      momentum: this.round(momentum, 2),
      movingAverage: movingAvg,
      recentTrend: recentTrend,
      description: this.describeTrend(direction, strength, regression)
    };
  }

  /**
   * Linear regression
   */
  linearRegression(arr) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const n = values.length;
    
    if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };
    
    // X values are just indices
    const xMean = (n - 1) / 2;
    const yMean = this.mean(values);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;
    
    // Calculate R-squared
    let ssRes = 0;
    let ssTot = 0;
    
    for (let i = 0; i < n; i++) {
      const predicted = intercept + slope * i;
      ssRes += Math.pow(values[i] - predicted, 2);
      ssTot += Math.pow(values[i] - yMean, 2);
    }
    
    const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
    
    return { slope, intercept, rSquared };
  }

  /**
   * Calculate momentum (rate of change)
   */
  calculateMomentum(arr, period = 5) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    if (values.length < period) return 0;
    
    const recent = values.slice(0, period);
    const older = values.slice(period, period * 2);
    
    if (older.length === 0) return 0;
    
    return this.mean(recent) - this.mean(older);
  }

  /**
   * Calculate moving average
   */
  movingAverage(arr, period = 5) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const result = [];
    
    for (let i = 0; i <= values.length - period; i++) {
      const slice = values.slice(i, i + period);
      result.push(this.round(this.mean(slice)));
    }
    
    return result;
  }

  /**
   * Calculate exponential moving average
   */
  ema(arr, period = 5) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const multiplier = 2 / (period + 1);
    
    if (values.length === 0) return [];
    
    const result = [values[0]];
    
    for (let i = 1; i < values.length; i++) {
      const emaValue = (values[i] - result[i - 1]) * multiplier + result[i - 1];
      result.push(this.round(emaValue));
    }
    
    return result;
  }

  /**
   * Analyze recent trend
   */
  recentTrend(arr, period = 5) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const recent = values.slice(0, Math.min(period, values.length));
    const older = values.slice(period, period * 2);
    
    if (recent.length === 0) return { direction: 'unknown', change: 0, percentage: 0 };
    
    const recentMean = this.mean(recent);
    const olderMean = older.length > 0 ? this.mean(older) : recentMean;
    
    const change = recentMean - olderMean;
    const percentage = olderMean !== 0 ? (change / olderMean) * 100 : 0;
    
    let direction = 'stable';
    if (percentage > 5) direction = 'improving';
    else if (percentage < -5) direction = 'declining';
    
    return {
      direction,
      change: this.round(change),
      percentage: this.round(percentage),
      recentMean: this.round(recentMean),
      olderMean: this.round(olderMean)
    };
  }

  /**
   * Describe trend in natural language
   */
  describeTrend(direction, strength, regression) {
    const strengthDesc = strength > 0.7 ? 'strongly' : strength > 0.4 ? 'moderately' : 'slightly';
    
    if (direction === 'improving') {
      return `Performance is ${strengthDesc} trending upward (R² = ${this.round(regression.rSquared, 2)})`;
    } else if (direction === 'declining') {
      return `Performance is ${strengthDesc} trending downward (R² = ${this.round(regression.rSquared, 2)})`;
    }
    return 'Performance is stable with minimal trend';
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STREAK ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Find streaks in data relative to a threshold
   */
  findStreaks(arr, threshold = null) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    if (values.length === 0) return { current: 0, longest: 0, direction: 'none' };
    
    // Use mean as threshold if not provided
    threshold = threshold !== null ? threshold : this.mean(values);
    
    let currentStreak = 0;
    let currentDirection = null;
    let longestOver = 0;
    let longestUnder = 0;
    let totalStreaks = [];
    
    for (let i = 0; i < values.length; i++) {
      const direction = values[i] > threshold ? 'over' : 'under';
      
      if (direction === currentDirection) {
        currentStreak++;
      } else {
        if (currentStreak > 0) {
          totalStreaks.push({ direction: currentDirection, length: currentStreak });
          if (currentDirection === 'over') longestOver = Math.max(longestOver, currentStreak);
          else longestUnder = Math.max(longestUnder, currentStreak);
        }
        currentDirection = direction;
        currentStreak = 1;
      }
    }
    
    // Add final streak
    if (currentStreak > 0) {
      totalStreaks.push({ direction: currentDirection, length: currentStreak });
      if (currentDirection === 'over') longestOver = Math.max(longestOver, currentStreak);
      else longestUnder = Math.max(longestUnder, currentStreak);
    }
    
    // Current streak (from most recent games)
    const currentActive = totalStreaks[totalStreaks.length - 1] || { direction: 'none', length: 0 };
    
    return {
      current: currentActive.length,
      direction: currentActive.direction,
      longestOver,
      longestUnder,
      threshold: this.round(threshold),
      totalStreaks: totalStreaks.length,
      averageStreakLength: totalStreaks.length > 0 
        ? this.round(totalStreaks.reduce((a, b) => a + b.length, 0) / totalStreaks.length) 
        : 0
    };
  }

  /**
   * Analyze hit rate vs a line
   */
  hitRate(arr, line) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    if (values.length === 0) return { rate: 0, over: 0, under: 0, push: 0 };
    
    let over = 0;
    let under = 0;
    let push = 0;
    
    values.forEach(val => {
      if (val > line) over++;
      else if (val < line) under++;
      else push++;
    });
    
    return {
      rate: this.round((over / values.length) * 100),
      over,
      under,
      push,
      total: values.length,
      overPct: this.round((over / values.length) * 100),
      underPct: this.round((under / values.length) * 100)
    };
  }

  /**
   * Analyze hit rate by windows
   */
  hitRateByWindow(arr, line) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    return {
      last5: this.hitRate(values.slice(0, 5), line),
      last10: this.hitRate(values.slice(0, 10), line),
      last15: this.hitRate(values.slice(0, 15), line),
      last20: this.hitRate(values.slice(0, 20), line),
      season: this.hitRate(values, line)
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOLATILITY ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate and classify volatility
   */
  calculateVolatility(arr) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    const cv = this.coefficientOfVariation(values);
    const std = this.stdDev(values);
    const range = this.range(values);
    const iqr = this.iqr(values);
    
    // Classify volatility
    let classification = 'moderate';
    if (cv < 0.10) classification = 'veryLow';
    else if (cv < 0.15) classification = 'low';
    else if (cv < 0.25) classification = 'moderate';
    else if (cv < 0.35) classification = 'high';
    else classification = 'veryHigh';
    
    return {
      cv: this.round(cv, 4),
      stdDev: this.round(std),
      range,
      iqr: this.round(iqr),
      classification,
      description: this.describeVolatility(classification, cv, std),
      bettingImplication: this.volatilityBettingImplication(classification)
    };
  }

  /**
   * Describe volatility in natural language
   */
  describeVolatility(classification, cv, std) {
    const descriptions = {
      veryLow: 'Extremely consistent - tight distribution with minimal variance',
      low: 'Consistent - reliable output with low variance',
      moderate: 'Moderate variance - some game-to-game fluctuation',
      high: 'Elevated variance - significant game-to-game fluctuation',
      veryHigh: 'High variance - boom-bust profile with unpredictable output'
    };
    
    return descriptions[classification] || descriptions.moderate;
  }

  /**
   * Betting implications of volatility
   */
  volatilityBettingImplication(classification) {
    const implications = {
      veryLow: 'Ideal for prop betting - high predictability',
      low: 'Good for props - reliable with occasional variance',
      moderate: 'Standard sizing - account for variance in expectations',
      high: 'Reduced sizing recommended - higher risk of miss',
      veryHigh: 'Caution advised - only bet with strong edge; boom-bust profile'
    };
    
    return implications[classification] || implications.moderate;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MONTE CARLO SIMULATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Run Monte Carlo simulation
   */
  monteCarloSimulation(mean, stdDev, iterations = 10000) {
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      results.push(this.randomNormal(mean, stdDev));
    }
    
    return results;
  }

  /**
   * Monte Carlo probability estimation
   */
  monteCarloProbability(mean, stdDev, threshold, iterations = 10000) {
    const results = this.monteCarloSimulation(mean, stdDev, iterations);
    const over = results.filter(r => r > threshold).length;
    const under = results.filter(r => r < threshold).length;
    const push = results.filter(r => Math.abs(r - threshold) < 0.5).length;
    
    return {
      over: this.round((over / iterations) * 100),
      under: this.round((under / iterations) * 100),
      push: this.round((push / iterations) * 100),
      meanSimulated: this.round(this.mean(results)),
      stdDevSimulated: this.round(this.stdDev(results)),
      percentiles: {
        p10: this.round(this.percentile(results, 10)),
        p25: this.round(this.percentile(results, 25)),
        p50: this.round(this.percentile(results, 50)),
        p75: this.round(this.percentile(results, 75)),
        p90: this.round(this.percentile(results, 90))
      }
    };
  }

  /**
   * Generate random number from normal distribution (Box-Muller)
   */
  randomNormal(mean = 0, stdDev = 1) {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    return mean + z0 * stdDev;
  }

  /**
   * Generate random number from Poisson distribution
   */
  randomPoisson(lambda) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    return k - 1;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CORRELATION ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate Pearson correlation coefficient
   */
  correlation(arr1, arr2) {
    if (arr1.length !== arr2.length || arr1.length < 2) return 0;
    
    const mean1 = this.mean(arr1);
    const mean2 = this.mean(arr2);
    const std1 = this.stdDev(arr1);
    const std2 = this.stdDev(arr2);
    
    if (std1 === 0 || std2 === 0) return 0;
    
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
      sum += ((arr1[i] - mean1) / std1) * ((arr2[i] - mean2) / std2);
    }
    
    return sum / (arr1.length - 1);
  }

  /**
   * Calculate covariance
   */
  covariance(arr1, arr2) {
    if (arr1.length !== arr2.length || arr1.length < 2) return 0;
    
    const mean1 = this.mean(arr1);
    const mean2 = this.mean(arr2);
    
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
      sum += (arr1[i] - mean1) * (arr2[i] - mean2);
    }
    
    return sum / (arr1.length - 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEASONALITY ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Analyze seasonality patterns
   */
  analyzeSeasonality(arr) {
    const values = arr.map(x => typeof x === 'object' ? x.value : x);
    
    // Simple seasonality detection
    // In real implementation, this would analyze by month, day of week, etc.
    
    return {
      hasSeasonality: false, // Would require date information
      pattern: 'none',
      description: 'Seasonality analysis requires date-indexed data'
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BETTING-SPECIFIC CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate expected value for a bet
   */
  expectedValue(probability, odds) {
    // Convert American odds to decimal
    const decimal = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
    
    // EV = (probability * payout) - (1 - probability)
    const ev = (probability * decimal) - 1;
    
    return this.round(ev * 100); // Return as percentage
  }

  /**
   * Calculate Kelly criterion for optimal bet sizing
   */
  kellyCriterion(probability, odds, bankroll = 100, fractional = 0.25) {
    // Convert American odds to decimal
    const decimal = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
    
    // Full Kelly: f = (bp - q) / b
    // where b = decimal - 1, p = probability, q = 1 - probability
    const b = decimal - 1;
    const p = probability;
    const q = 1 - p;
    
    const fullKelly = (b * p - q) / b;
    
    // Apply fractional Kelly
    const fractionalKelly = fullKelly * fractional;
    
    // Don't bet negative amounts
    const betSize = Math.max(0, fractionalKelly);
    
    return {
      fullKelly: this.round(fullKelly * 100),
      fractionalKelly: this.round(betSize * 100),
      suggestedBet: this.round(bankroll * betSize),
      edge: this.round((p - (1 / decimal)) * 100)
    };
  }

  /**
   * Calculate implied probability from odds
   */
  impliedProbability(odds) {
    if (odds > 0) {
      return 100 / (odds + 100);
    } else {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  }

  /**
   * Calculate true odds from probability
   */
  probabilityToOdds(probability) {
    if (probability >= 0.5) {
      return -((probability * 100) / (1 - probability));
    } else {
      return ((1 - probability) * 100) / probability;
    }
  }

  /**
   * Calculate break-even win rate for given odds
   */
  breakEvenWinRate(odds) {
    return this.round(this.impliedProbability(odds) * 100);
  }

  /**
   * Calculate ROI
   */
  calculateROI(wins, losses, avgWinAmount, avgLossAmount) {
    const totalWon = wins * avgWinAmount;
    const totalLost = losses * avgLossAmount;
    const totalWagered = (wins + losses) * avgLossAmount; // Assuming flat betting
    
    return this.round(((totalWon - totalLost) / totalWagered) * 100);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Round number to specified decimal places
   */
  round(num, decimals = 1) {
    if (typeof num !== 'number' || isNaN(num)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  /**
   * Format number as percentage
   */
  formatPercent(num, decimals = 1) {
    return this.round(num, decimals) + '%';
  }

  /**
   * Normalize array to 0-1 range
   */
  normalize(arr) {
    const min = this.min(arr);
    const max = this.max(arr);
    const range = max - min;
    
    if (range === 0) return arr.map(() => 0.5);
    
    return arr.map(x => (x - min) / range);
  }

  /**
   * Standardize array (z-score normalization)
   */
  standardize(arr) {
    const avg = this.mean(arr);
    const std = this.stdDev(arr);
    
    if (std === 0) return arr.map(() => 0);
    
    return arr.map(x => (x - avg) / std);
  }

  /**
   * Clamp value to range
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation
   */
  lerp(start, end, t) {
    return start + t * (end - start);
  }

  /**
   * Check if value is outlier (beyond 2 standard deviations)
   */
  isOutlier(value, arr, threshold = 2) {
    const z = Math.abs(this.zScore(value, arr));
    return z > threshold;
  }

  /**
   * Remove outliers from array
   */
  removeOutliers(arr, threshold = 2) {
    return arr.filter(x => !this.isOutlier(x, arr, threshold));
  }
}

export default RayStatEngine;
