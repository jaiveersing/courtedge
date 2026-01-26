// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  📊 RAY ADVANCED STATISTICS - COMPREHENSIVE STATISTICAL ANALYSIS TOOLKIT                                              ║
// ║  Hypothesis Testing • Distribution Analysis • Correlation • Variance Analysis • Statistical Inference                ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📈 DESCRIPTIVE STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class DescriptiveStatistics {
  
  static mean(data) {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  static median(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  static mode(data) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
      maxFreq = Math.max(maxFreq, frequency[val]);
    });
    
    for (const val in frequency) {
      if (frequency[val] === maxFreq) {
        modes.push(parseFloat(val));
      }
    }
    
    return modes.length === data.length ? null : modes;
  }

  static variance(data, sample = true) {
    const avg = this.mean(data);
    const squaredDiffs = data.map(val => Math.pow(val - avg, 2));
    const divisor = sample ? data.length - 1 : data.length;
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / divisor;
  }

  static standardDeviation(data, sample = true) {
    return Math.sqrt(this.variance(data, sample));
  }

  static range(data) {
    return Math.max(...data) - Math.min(...data);
  }

  static quartiles(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    return {
      q1: this.percentile(sorted, 25),
      q2: this.median(sorted),
      q3: this.percentile(sorted, 75),
      iqr: this.percentile(sorted, 75) - this.percentile(sorted, 25)
    };
  }

  static percentile(data, p) {
    const sorted = [...data].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper >= sorted.length) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  static skewness(data) {
    const n = data.length;
    const mean = this.mean(data);
    const std = this.standardDeviation(data);
    
    const sum = data.reduce((acc, val) => 
      acc + Math.pow((val - mean) / std, 3), 0
    );
    
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  static kurtosis(data) {
    const n = data.length;
    const mean = this.mean(data);
    const std = this.standardDeviation(data);
    
    const sum = data.reduce((acc, val) => 
      acc + Math.pow((val - mean) / std, 4), 0
    );
    
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
           (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }

  static coefficientOfVariation(data) {
    return (this.standardDeviation(data) / this.mean(data)) * 100;
  }

  static summary(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const q = this.quartiles(sorted);
    
    return {
      count: data.length,
      mean: this.mean(data).toFixed(2),
      median: this.median(data).toFixed(2),
      mode: this.mode(data),
      std: this.standardDeviation(data).toFixed(2),
      variance: this.variance(data).toFixed(2),
      min: Math.min(...data).toFixed(2),
      max: Math.max(...data).toFixed(2),
      range: this.range(data).toFixed(2),
      q1: q.q1.toFixed(2),
      q2: q.q2.toFixed(2),
      q3: q.q3.toFixed(2),
      iqr: q.iqr.toFixed(2),
      skewness: this.skewness(data).toFixed(2),
      kurtosis: this.kurtosis(data).toFixed(2),
      cv: this.coefficientOfVariation(data).toFixed(2) + '%'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🧪 HYPOTHESIS TESTING
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class HypothesisTesting {
  
  // t-distribution critical values (two-tailed, α = 0.05)
  static tCriticalValues = {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
    6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
    15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042, 40: 2.021,
    50: 2.009, 60: 2.000, 80: 1.990, 100: 1.984, 120: 1.980,
    1000: 1.962
  };

  static getTCritical(df, alpha = 0.05) {
    if (df in this.tCriticalValues) {
      return this.tCriticalValues[df];
    }
    
    // Interpolate or use closest value
    const dfs = Object.keys(this.tCriticalValues).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < dfs.length - 1; i++) {
      if (df >= dfs[i] && df < dfs[i + 1]) {
        return this.tCriticalValues[dfs[i]];
      }
    }
    
    return 1.96; // z-score for large samples
  }

  // One-sample t-test
  static oneSampleTTest(data, populationMean, alpha = 0.05) {
    const n = data.length;
    const sampleMean = DescriptiveStatistics.mean(data);
    const sampleStd = DescriptiveStatistics.standardDeviation(data);
    const standardError = sampleStd / Math.sqrt(n);
    
    const tStatistic = (sampleMean - populationMean) / standardError;
    const df = n - 1;
    const tCritical = this.getTCritical(df, alpha);
    const pValue = this.tToPValue(tStatistic, df);
    
    return {
      tStatistic: tStatistic.toFixed(4),
      df,
      pValue: pValue.toFixed(4),
      tCritical: tCritical.toFixed(4),
      reject: Math.abs(tStatistic) > tCritical,
      confidence: `95% CI: [${(sampleMean - tCritical * standardError).toFixed(2)}, ${(sampleMean + tCritical * standardError).toFixed(2)}]`,
      interpretation: Math.abs(tStatistic) > tCritical 
        ? `Reject H0: Sample mean (${sampleMean.toFixed(2)}) significantly differs from ${populationMean}`
        : `Fail to reject H0: No significant difference`
    };
  }

  // Two-sample t-test (independent)
  static twoSampleTTest(data1, data2, alpha = 0.05) {
    const n1 = data1.length;
    const n2 = data2.length;
    const mean1 = DescriptiveStatistics.mean(data1);
    const mean2 = DescriptiveStatistics.mean(data2);
    const var1 = DescriptiveStatistics.variance(data1);
    const var2 = DescriptiveStatistics.variance(data2);
    
    // Pooled standard deviation
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));
    
    const tStatistic = (mean1 - mean2) / standardError;
    const df = n1 + n2 - 2;
    const tCritical = this.getTCritical(df, alpha);
    const pValue = this.tToPValue(tStatistic, df);
    
    return {
      tStatistic: tStatistic.toFixed(4),
      df,
      pValue: pValue.toFixed(4),
      tCritical: tCritical.toFixed(4),
      reject: Math.abs(tStatistic) > tCritical,
      meanDifference: (mean1 - mean2).toFixed(2),
      interpretation: Math.abs(tStatistic) > tCritical
        ? `Significant difference: Group 1 (${mean1.toFixed(2)}) vs Group 2 (${mean2.toFixed(2)})`
        : `No significant difference between groups`
    };
  }

  // Paired t-test
  static pairedTTest(before, after, alpha = 0.05) {
    if (before.length !== after.length) {
      throw new Error('Arrays must have equal length');
    }
    
    const differences = before.map((val, i) => after[i] - val);
    return this.oneSampleTTest(differences, 0, alpha);
  }

  // Chi-square test for independence
  static chiSquareTest(observed, expected) {
    let chiSquare = 0;
    
    for (let i = 0; i < observed.length; i++) {
      for (let j = 0; j < observed[i].length; j++) {
        const diff = observed[i][j] - expected[i][j];
        chiSquare += (diff * diff) / expected[i][j];
      }
    }
    
    const df = (observed.length - 1) * (observed[0].length - 1);
    const critical = this.chiSquareCritical(df);
    
    return {
      chiSquare: chiSquare.toFixed(4),
      df,
      critical: critical.toFixed(4),
      reject: chiSquare > critical,
      interpretation: chiSquare > critical
        ? 'Reject H0: Variables are dependent'
        : 'Fail to reject H0: No significant association'
    };
  }

  static chiSquareCritical(df, alpha = 0.05) {
    // Approximate chi-square critical values for α = 0.05
    const criticalValues = {
      1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.070,
      6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307,
      15: 24.996, 20: 31.410, 25: 37.652, 30: 43.773
    };
    
    return criticalValues[df] || 1.96 * Math.sqrt(2 * df);
  }

  // ANOVA (Analysis of Variance)
  static anova(groups) {
    const k = groups.length; // number of groups
    const n = groups.reduce((sum, group) => sum + group.length, 0); // total observations
    
    // Grand mean
    const allData = groups.flat();
    const grandMean = DescriptiveStatistics.mean(allData);
    
    // Between-group sum of squares (SSB)
    let ssb = 0;
    groups.forEach(group => {
      const groupMean = DescriptiveStatistics.mean(group);
      ssb += group.length * Math.pow(groupMean - grandMean, 2);
    });
    
    // Within-group sum of squares (SSW)
    let ssw = 0;
    groups.forEach(group => {
      const groupMean = DescriptiveStatistics.mean(group);
      group.forEach(val => {
        ssw += Math.pow(val - groupMean, 2);
      });
    });
    
    // Degrees of freedom
    const dfb = k - 1;
    const dfw = n - k;
    
    // Mean squares
    const msb = ssb / dfb;
    const msw = ssw / dfw;
    
    // F-statistic
    const fStatistic = msb / msw;
    const fCritical = this.fCritical(dfb, dfw);
    
    return {
      fStatistic: fStatistic.toFixed(4),
      dfBetween: dfb,
      dfWithin: dfw,
      ssb: ssb.toFixed(2),
      ssw: ssw.toFixed(2),
      msb: msb.toFixed(4),
      msw: msw.toFixed(4),
      fCritical: fCritical.toFixed(4),
      reject: fStatistic > fCritical,
      interpretation: fStatistic > fCritical
        ? 'Reject H0: At least one group mean differs significantly'
        : 'Fail to reject H0: No significant difference between group means'
    };
  }

  static fCritical(df1, df2, alpha = 0.05) {
    // Simplified F-critical value approximation
    return 3.0 + (1 / df1) + (1 / df2);
  }

  // Convert t-statistic to p-value (approximation)
  static tToPValue(t, df) {
    const x = df / (df + t * t);
    let p = 1 - 0.5 * Math.pow(x, df/2);
    
    if (t < 0) p = 1 - p;
    return 2 * Math.min(p, 1 - p); // two-tailed
  }

  // Z-test for proportions
  static zTestProportion(x, n, p0, alpha = 0.05) {
    const pHat = x / n;
    const standardError = Math.sqrt((p0 * (1 - p0)) / n);
    const zStatistic = (pHat - p0) / standardError;
    const zCritical = 1.96; // for α = 0.05, two-tailed
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zStatistic)));
    
    return {
      zStatistic: zStatistic.toFixed(4),
      pValue: pValue.toFixed(4),
      zCritical,
      sampleProportion: (pHat * 100).toFixed(2) + '%',
      reject: Math.abs(zStatistic) > zCritical,
      interpretation: Math.abs(zStatistic) > zCritical
        ? `Reject H0: Sample proportion (${(pHat * 100).toFixed(1)}%) significantly differs from ${(p0 * 100).toFixed(1)}%`
        : `Fail to reject H0: No significant difference`
    };
  }

  // Normal CDF approximation
  static normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    return x > 0 ? 1 - p : p;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 PROBABILITY DISTRIBUTIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ProbabilityDistributions {
  
  // Normal distribution
  static normalPDF(x, mean = 0, std = 1) {
    const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * std * std);
    return coefficient * Math.exp(exponent);
  }

  static normalCDF(x, mean = 0, std = 1) {
    const z = (x - mean) / std;
    return HypothesisTesting.normalCDF(z);
  }

  // Binomial distribution
  static binomialPMF(k, n, p) {
    const combination = this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
    return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  static binomialCDF(k, n, p) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.binomialPMF(i, n, p);
    }
    return sum;
  }

  // Poisson distribution
  static poissonPMF(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
  }

  static poissonCDF(k, lambda) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.poissonPMF(i, lambda);
    }
    return sum;
  }

  // Exponential distribution
  static exponentialPDF(x, lambda) {
    return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
  }

  static exponentialCDF(x, lambda) {
    return x >= 0 ? 1 - Math.exp(-lambda * x) : 0;
  }

  // Uniform distribution
  static uniformPDF(x, a, b) {
    return (x >= a && x <= b) ? 1 / (b - a) : 0;
  }

  static uniformCDF(x, a, b) {
    if (x < a) return 0;
    if (x > b) return 1;
    return (x - a) / (b - a);
  }

  // Beta distribution (simplified)
  static betaPDF(x, alpha, beta) {
    if (x < 0 || x > 1) return 0;
    return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1);
  }

  // Gamma distribution (simplified)
  static gammaPDF(x, shape, scale) {
    if (x <= 0) return 0;
    return Math.pow(x, shape - 1) * Math.exp(-x / scale) / 
           (Math.pow(scale, shape) * this.gammaFunction(shape));
  }

  static gammaFunction(n) {
    // Stirling's approximation
    if (n < 1) return Math.PI / Math.sin(Math.PI * n) / this.gammaFunction(1 - n);
    if (n === 1) return 1;
    if (n === 2) return 1;
    
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E) * Math.sqrt(n), n);
  }

  static factorial(n) {
    if (n > 170) return Infinity; // Overflow protection
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔗 CORRELATION AND COVARIANCE
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class CorrelationAnalysis {
  
  static covariance(x, y, sample = true) {
    if (x.length !== y.length) throw new Error('Arrays must have equal length');
    
    const n = x.length;
    const meanX = DescriptiveStatistics.mean(x);
    const meanY = DescriptiveStatistics.mean(y);
    
    const sum = x.reduce((acc, val, i) => 
      acc + (val - meanX) * (y[i] - meanY), 0
    );
    
    return sum / (sample ? n - 1 : n);
  }

  static pearsonCorrelation(x, y) {
    const cov = this.covariance(x, y);
    const stdX = DescriptiveStatistics.standardDeviation(x);
    const stdY = DescriptiveStatistics.standardDeviation(y);
    
    const r = cov / (stdX * stdY);
    
    return {
      r: r.toFixed(4),
      rSquared: (r * r).toFixed(4),
      strength: Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.4 ? 'Moderate' : Math.abs(r) > 0.2 ? 'Weak' : 'Very Weak',
      direction: r > 0 ? 'Positive' : r < 0 ? 'Negative' : 'None',
      interpretation: this.interpretCorrelation(r)
    };
  }

  static spearmanCorrelation(x, y) {
    if (x.length !== y.length) throw new Error('Arrays must have equal length');
    
    // Rank the data
    const rankX = this.rank(x);
    const rankY = this.rank(y);
    
    // Calculate Pearson correlation of ranks
    return this.pearsonCorrelation(rankX, rankY);
  }

  static rank(data) {
    const sorted = data.map((val, idx) => ({ val, idx }))
                      .sort((a, b) => a.val - b.val);
    
    const ranks = new Array(data.length);
    sorted.forEach((item, rank) => {
      ranks[item.idx] = rank + 1;
    });
    
    return ranks;
  }

  static partialCorrelation(x, y, z) {
    // Correlation between x and y, controlling for z
    const rxy = parseFloat(this.pearsonCorrelation(x, y).r);
    const rxz = parseFloat(this.pearsonCorrelation(x, z).r);
    const ryz = parseFloat(this.pearsonCorrelation(y, z).r);
    
    const numerator = rxy - (rxz * ryz);
    const denominator = Math.sqrt((1 - rxz * rxz) * (1 - ryz * ryz));
    
    const partial = numerator / denominator;
    
    return {
      partialR: partial.toFixed(4),
      interpretation: `Correlation between X and Y, controlling for Z: ${this.interpretCorrelation(partial)}`
    };
  }

  static correlationMatrix(data) {
    // data is array of arrays (each variable is an array)
    const n = data.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const result = this.pearsonCorrelation(data[i], data[j]);
          matrix[i][j] = parseFloat(result.r);
        }
      }
    }
    
    return matrix;
  }

  static interpretCorrelation(r) {
    const abs = Math.abs(r);
    const direction = r >= 0 ? 'positive' : 'negative';
    
    if (abs >= 0.9) return `Very strong ${direction} correlation`;
    if (abs >= 0.7) return `Strong ${direction} correlation`;
    if (abs >= 0.5) return `Moderate ${direction} correlation`;
    if (abs >= 0.3) return `Weak ${direction} correlation`;
    return `Very weak or no ${direction} correlation`;
  }

  // Autocorrelation for time series
  static autocorrelation(data, lag = 1) {
    const n = data.length - lag;
    const x1 = data.slice(0, n);
    const x2 = data.slice(lag, lag + n);
    
    return this.pearsonCorrelation(x1, x2);
  }

  // Cross-correlation between two time series
  static crossCorrelation(x, y, maxLag = 10) {
    const correlations = [];
    
    for (let lag = -maxLag; lag <= maxLag; lag++) {
      let x_shifted, y_shifted;
      
      if (lag >= 0) {
        x_shifted = x.slice(0, x.length - lag);
        y_shifted = y.slice(lag);
      } else {
        x_shifted = x.slice(-lag);
        y_shifted = y.slice(0, y.length + lag);
      }
      
      const minLen = Math.min(x_shifted.length, y_shifted.length);
      x_shifted = x_shifted.slice(0, minLen);
      y_shifted = y_shifted.slice(0, minLen);
      
      const corr = this.pearsonCorrelation(x_shifted, y_shifted);
      correlations.push({ lag, correlation: parseFloat(corr.r) });
    }
    
    return correlations;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 REGRESSION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class RegressionAnalysis {
  
  static simpleLinearRegression(x, y) {
    const n = x.length;
    const meanX = DescriptiveStatistics.mean(x);
    const meanY = DescriptiveStatistics.mean(y);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += Math.pow(x[i] - meanX, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Calculate R-squared
    const predictions = x.map(xi => slope * xi + intercept);
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => 
      sum + Math.pow(yi - predictions[i], 2), 0
    );
    const rSquared = 1 - (ssResidual / ssTotal);
    
    // Standard error
    const mse = ssResidual / (n - 2);
    const standardError = Math.sqrt(mse);
    
    return {
      slope: slope.toFixed(4),
      intercept: intercept.toFixed(4),
      rSquared: rSquared.toFixed(4),
      standardError: standardError.toFixed(4),
      equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
      predictions,
      residuals: y.map((yi, i) => yi - predictions[i])
    };
  }

  static polynomialRegression(x, y, degree = 2) {
    // Create polynomial features
    const X = x.map(xi => {
      const row = [];
      for (let d = 0; d <= degree; d++) {
        row.push(Math.pow(xi, d));
      }
      return row;
    });
    
    // Use normal equation: β = (X'X)^(-1)X'y
    const XT = this.transpose(X);
    const XTX = this.matrixMultiply(XT, X);
    const XTXInv = this.matrixInverse(XTX);
    const XTy = this.matrixVectorMultiply(XT, y);
    const coefficients = this.matrixVectorMultiply(XTXInv, XTy);
    
    // Make predictions
    const predictions = x.map(xi => {
      let pred = 0;
      for (let d = 0; d <= degree; d++) {
        pred += coefficients[d] * Math.pow(xi, d);
      }
      return pred;
    });
    
    // Calculate R-squared
    const meanY = DescriptiveStatistics.mean(y);
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => 
      sum + Math.pow(yi - predictions[i], 2), 0
    );
    const rSquared = 1 - (ssResidual / ssTotal);
    
    return {
      coefficients: coefficients.map(c => c.toFixed(4)),
      degree,
      rSquared: rSquared.toFixed(4),
      equation: this.polynomialEquation(coefficients),
      predictions
    };
  }

  static polynomialEquation(coefficients) {
    const terms = coefficients.map((coef, i) => {
      if (i === 0) return coef.toFixed(2);
      if (i === 1) return `${coef.toFixed(2)}x`;
      return `${coef.toFixed(2)}x^${i}`;
    });
    return `y = ${terms.join(' + ')}`;
  }

  static logisticRegression(X, y, learningRate = 0.1, iterations = 1000) {
    const n = X.length;
    const features = X[0].length;
    let weights = new Array(features).fill(0);
    let bias = 0;
    
    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    
    // Gradient descent
    for (let iter = 0; iter < iterations; iter++) {
      const predictions = X.map(row => {
        const z = row.reduce((sum, x, i) => sum + x * weights[i], bias);
        return sigmoid(z);
      });
      
      // Update weights
      for (let j = 0; j < features; j++) {
        let gradient = 0;
        for (let i = 0; i < n; i++) {
          gradient += (predictions[i] - y[i]) * X[i][j];
        }
        weights[j] -= (learningRate * gradient) / n;
      }
      
      // Update bias
      const biasGradient = predictions.reduce((sum, pred, i) => 
        sum + (pred - y[i]), 0
      );
      bias -= (learningRate * biasGradient) / n;
    }
    
    return {
      weights: weights.map(w => w.toFixed(4)),
      bias: bias.toFixed(4),
      predict: (features) => {
        const z = features.reduce((sum, x, i) => sum + x * weights[i], bias);
        return sigmoid(z);
      }
    };
  }

  // Matrix operations
  static transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  static matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  static matrixVectorMultiply(matrix, vector) {
    return matrix.map(row => 
      row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
  }

  static matrixInverse(matrix) {
    // Simplified 2x2 and 3x3 inverse
    const n = matrix.length;
    
    if (n === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }
    
    // For larger matrices, use Gauss-Jordan elimination (simplified)
    const augmented = matrix.map((row, i) => {
      const identityRow = new Array(n).fill(0);
      identityRow[i] = 1;
      return [...row, ...identityRow];
    });
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i - 1; k >= 0; k--) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
      
      const divisor = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= divisor;
      }
    }
    
    // Extract inverse
    return augmented.map(row => row.slice(n));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎲 MONTE CARLO SIMULATION
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class MonteCarloSimulation {
  
  static simulateBankroll(initial, bets, winRate, avgOdds, variance, iterations = 10000) {
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      let bankroll = initial;
      const history = [bankroll];
      
      for (let bet = 0; bet < bets; bet++) {
        const betSize = bankroll * 0.02; // 2% Kelly
        const win = Math.random() < winRate;
        
        if (win) {
          const profit = betSize * (avgOdds / 100) * (1 + (Math.random() - 0.5) * variance);
          bankroll += profit;
        } else {
          bankroll -= betSize;
        }
        
        history.push(bankroll);
        
        if (bankroll <= 0) break;
      }
      
      results.push({
        final: bankroll,
        peak: Math.max(...history),
        valley: Math.min(...history),
        ruined: bankroll <= 0
      });
    }
    
    const finalBankrolls = results.map(r => r.final);
    const ruinRate = results.filter(r => r.ruined).length / iterations;
    
    return {
      mean: DescriptiveStatistics.mean(finalBankrolls).toFixed(2),
      median: DescriptiveStatistics.median(finalBankrolls).toFixed(2),
      std: DescriptiveStatistics.standardDeviation(finalBankrolls).toFixed(2),
      min: Math.min(...finalBankrolls).toFixed(2),
      max: Math.max(...finalBankrolls).toFixed(2),
      ruinProbability: (ruinRate * 100).toFixed(2) + '%',
      profitProbability: ((results.filter(r => r.final > initial).length / iterations) * 100).toFixed(2) + '%',
      percentiles: {
        p10: DescriptiveStatistics.percentile(finalBankrolls, 10).toFixed(2),
        p25: DescriptiveStatistics.percentile(finalBankrolls, 25).toFixed(2),
        p50: DescriptiveStatistics.percentile(finalBankrolls, 50).toFixed(2),
        p75: DescriptiveStatistics.percentile(finalBankrolls, 75).toFixed(2),
        p90: DescriptiveStatistics.percentile(finalBankrolls, 90).toFixed(2)
      }
    };
  }

  static simulatePropBet(playerAvg, playerStd, line, iterations = 10000) {
    let overCount = 0;
    let underCount = 0;
    const outcomes = [];
    
    for (let i = 0; i < iterations; i++) {
      // Generate normally distributed outcome
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const outcome = playerAvg + z * playerStd;
      
      outcomes.push(outcome);
      if (outcome > line) overCount++;
      if (outcome < line) underCount++;
    }
    
    return {
      overProbability: ((overCount / iterations) * 100).toFixed(2) + '%',
      underProbability: ((underCount / iterations) * 100).toFixed(2) + '%',
      pushProbability: (((iterations - overCount - underCount) / iterations) * 100).toFixed(2) + '%',
      averageOutcome: DescriptiveStatistics.mean(outcomes).toFixed(2),
      medianOutcome: DescriptiveStatistics.median(outcomes).toFixed(2),
      percentiles: {
        p10: DescriptiveStatistics.percentile(outcomes, 10).toFixed(2),
        p25: DescriptiveStatistics.percentile(outcomes, 25).toFixed(2),
        p75: DescriptiveStatistics.percentile(outcomes, 75).toFixed(2),
        p90: DescriptiveStatistics.percentile(outcomes, 90).toFixed(2)
      }
    };
  }

  static simulateParlay(legs, iterations = 10000) {
    // legs = [{winProb, odds}, ...]
    let wins = 0;
    const payouts = [];
    
    for (let i = 0; i < iterations; i++) {
      let parlayWins = true;
      let payout = 1;
      
      for (const leg of legs) {
        if (Math.random() < leg.winProb) {
          payout *= (1 + leg.odds / 100);
        } else {
          parlayWins = false;
          break;
        }
      }
      
      if (parlayWins) {
        wins++;
        payouts.push(payout);
      } else {
        payouts.push(0);
      }
    }
    
    const winRate = wins / iterations;
    const avgPayout = DescriptiveStatistics.mean(payouts);
    const expectedValue = avgPayout - 1;
    
    return {
      winRate: (winRate * 100).toFixed(2) + '%',
      wins,
      losses: iterations - wins,
      averagePayout: avgPayout.toFixed(2) + 'x',
      expectedValue: (expectedValue * 100).toFixed(2) + '%',
      breakEvenWinRate: (1 / payouts.filter(p => p > 0)[0] * 100).toFixed(2) + '%'
    };
  }
}

export default {
  DescriptiveStatistics,
  HypothesisTesting,
  ProbabilityDistributions,
  CorrelationAnalysis,
  RegressionAnalysis,
  MonteCarloSimulation
};
