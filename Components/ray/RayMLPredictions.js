// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🤖 RAY MACHINE LEARNING PREDICTIONS - ADVANCED STATISTICAL MODELS                                                    ║
// ║  Neural Network Prep • Regression Models • Classification • Feature Engineering • Model Evaluation                   ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🧠 MACHINE LEARNING MODEL BASE CLASS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class MLModelBase {
  constructor(name) {
    this.name = name;
    this.trained = false;
    this.features = [];
    this.weights = [];
    this.bias = 0;
    this.history = [];
  }

  normalize(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const std = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    );
    return data.map(val => std !== 0 ? (val - mean) / std : 0);
  }

  standardize(value, mean, std) {
    return std !== 0 ? (value - mean) / std : 0;
  }

  minMaxScale(data, min = 0, max = 1) {
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const range = dataMax - dataMin;
    
    return data.map(val => 
      range !== 0 ? ((val - dataMin) / range) * (max - min) + min : min
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 LINEAR REGRESSION MODEL
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class LinearRegressionModel extends MLModelBase {
  constructor() {
    super('Linear Regression');
  }

  // Simple linear regression: y = mx + b
  train(X, y) {
    const n = X.length;
    const meanX = X.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (X[i] - meanX) * (y[i] - meanY);
      denominator += Math.pow(X[i] - meanX, 2);
    }
    
    this.weights = [numerator / denominator]; // slope (m)
    this.bias = meanY - this.weights[0] * meanX; // intercept (b)
    this.trained = true;
    
    return {
      slope: this.weights[0].toFixed(4),
      intercept: this.bias.toFixed(4),
      trained: true
    };
  }

  predict(x) {
    if (!this.trained) throw new Error('Model must be trained first');
    return this.weights[0] * x + this.bias;
  }

  rSquared(X, y) {
    const predictions = X.map(x => this.predict(x));
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    const ssTotal = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
    const ssResidual = y.reduce((sum, val, i) => 
      sum + Math.pow(val - predictions[i], 2), 0
    );
    
    return 1 - (ssResidual / ssTotal);
  }

  meanSquaredError(X, y) {
    const predictions = X.map(x => this.predict(x));
    const mse = predictions.reduce((sum, pred, i) => 
      sum + Math.pow(pred - y[i], 2), 0
    ) / predictions.length;
    
    return {
      mse: mse.toFixed(4),
      rmse: Math.sqrt(mse).toFixed(4)
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 MULTIPLE LINEAR REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class MultipleRegressionModel extends MLModelBase {
  constructor(featureNames = []) {
    super('Multiple Regression');
    this.featureNames = featureNames;
  }

  // Multiple regression: y = b0 + b1*x1 + b2*x2 + ... + bn*xn
  // Using gradient descent
  train(X, y, learningRate = 0.01, iterations = 1000) {
    const n = X.length;
    const features = X[0].length;
    
    // Initialize weights and bias
    this.weights = new Array(features).fill(0);
    this.bias = 0;
    
    // Gradient descent
    for (let iter = 0; iter < iterations; iter++) {
      let predictions = X.map(row => this.predictArray(row));
      let error = predictions.map((pred, i) => pred - y[i]);
      
      // Update weights
      for (let j = 0; j < features; j++) {
        let gradient = 0;
        for (let i = 0; i < n; i++) {
          gradient += error[i] * X[i][j];
        }
        this.weights[j] -= (learningRate * gradient) / n;
      }
      
      // Update bias
      let biasGradient = error.reduce((sum, err) => sum + err, 0);
      this.bias -= (learningRate * biasGradient) / n;
      
      // Track history every 100 iterations
      if (iter % 100 === 0) {
        const mse = error.reduce((sum, err) => sum + err * err, 0) / n;
        this.history.push({ iteration: iter, mse });
      }
    }
    
    this.trained = true;
    
    return {
      weights: this.weights.map(w => w.toFixed(4)),
      bias: this.bias.toFixed(4),
      features: this.featureNames,
      trained: true
    };
  }

  predictArray(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    let sum = this.bias;
    for (let i = 0; i < features.length; i++) {
      sum += this.weights[i] * features[i];
    }
    return sum;
  }

  predict(featuresObject) {
    const featuresArray = this.featureNames.map(name => featuresObject[name] || 0);
    return this.predictArray(featuresArray);
  }

  featureImportance() {
    return this.featureNames.map((name, i) => ({
      feature: name,
      weight: this.weights[i].toFixed(4),
      absoluteWeight: Math.abs(this.weights[i]).toFixed(4)
    })).sort((a, b) => b.absoluteWeight - a.absoluteWeight);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌳 DECISION TREE (SIMPLIFIED)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class DecisionTreeClassifier {
  constructor(maxDepth = 5) {
    this.maxDepth = maxDepth;
    this.tree = null;
  }

  giniImpurity(groups, classes) {
    const nInstances = groups.reduce((sum, group) => sum + group.length, 0);
    let gini = 0;
    
    for (const group of groups) {
      const size = group.length;
      if (size === 0) continue;
      
      let score = 0;
      for (const classVal of classes) {
        const proportion = group.filter(row => row.class === classVal).length / size;
        score += proportion * proportion;
      }
      
      gini += (1 - score) * (size / nInstances);
    }
    
    return gini;
  }

  split(index, value, dataset) {
    const left = dataset.filter(row => row.features[index] < value);
    const right = dataset.filter(row => row.features[index] >= value);
    return { left, right };
  }

  getBestSplit(dataset, features) {
    const classes = [...new Set(dataset.map(row => row.class))];
    let bestIndex = 0;
    let bestValue = 0;
    let bestScore = Infinity;
    let bestGroups = null;
    
    for (let index = 0; index < features; index++) {
      const values = dataset.map(row => row.features[index]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const value = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const groups = this.split(index, value, dataset);
        const gini = this.giniImpurity([groups.left, groups.right], classes);
        
        if (gini < bestScore) {
          bestIndex = index;
          bestValue = value;
          bestScore = gini;
          bestGroups = groups;
        }
      }
    }
    
    return {
      index: bestIndex,
      value: bestValue,
      groups: bestGroups,
      gini: bestScore
    };
  }

  toTerminal(group) {
    const outcomes = group.map(row => row.class);
    return outcomes.sort((a, b) => 
      outcomes.filter(v => v === a).length - outcomes.filter(v => v === b).length
    ).pop();
  }

  buildTree(dataset, features, depth = 0) {
    if (dataset.length === 0) return null;
    
    const split = this.getBestSplit(dataset, features);
    
    // Check for max depth or pure node
    if (depth >= this.maxDepth || !split.groups || 
        split.groups.left.length === 0 || split.groups.right.length === 0) {
      return this.toTerminal(dataset);
    }
    
    return {
      index: split.index,
      value: split.value,
      left: this.buildTree(split.groups.left, features, depth + 1),
      right: this.buildTree(split.groups.right, features, depth + 1)
    };
  }

  train(X, y) {
    const dataset = X.map((features, i) => ({ features, class: y[i] }));
    this.tree = this.buildTree(dataset, X[0].length);
    this.trained = true;
  }

  predictOne(node, row) {
    if (typeof node !== 'object') return node;
    
    if (row[node.index] < node.value) {
      return this.predictOne(node.left, row);
    } else {
      return this.predictOne(node.right, row);
    }
  }

  predict(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    return this.predictOne(this.tree, features);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎲 NAIVE BAYES CLASSIFIER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class NaiveBayesClassifier {
  constructor() {
    this.classes = [];
    this.priors = {};
    this.likelihoods = {};
    this.trained = false;
  }

  train(X, y) {
    this.classes = [...new Set(y)];
    const n = y.length;
    
    // Calculate priors (class probabilities)
    for (const cls of this.classes) {
      this.priors[cls] = y.filter(label => label === cls).length / n;
    }
    
    // Calculate likelihoods (feature probabilities given class)
    for (const cls of this.classes) {
      this.likelihoods[cls] = {};
      const classData = X.filter((features, i) => y[i] === cls);
      
      for (let featureIdx = 0; featureIdx < X[0].length; featureIdx++) {
        const featureValues = classData.map(row => row[featureIdx]);
        const mean = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
        const variance = featureValues.reduce((sum, val) => 
          sum + Math.pow(val - mean, 2), 0
        ) / featureValues.length;
        
        this.likelihoods[cls][featureIdx] = { mean, variance };
      }
    }
    
    this.trained = true;
  }

  gaussianProbability(x, mean, variance) {
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    return (1 / Math.sqrt(2 * Math.PI * variance)) * exponent;
  }

  predict(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    
    let bestClass = null;
    let bestProb = -Infinity;
    
    for (const cls of this.classes) {
      let prob = Math.log(this.priors[cls]);
      
      for (let i = 0; i < features.length; i++) {
        const { mean, variance } = this.likelihoods[cls][i];
        prob += Math.log(this.gaussianProbability(features[i], mean, variance));
      }
      
      if (prob > bestProb) {
        bestProb = prob;
        bestClass = cls;
      }
    }
    
    return bestClass;
  }

  predictProba(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    
    const probs = {};
    let total = 0;
    
    for (const cls of this.classes) {
      let prob = this.priors[cls];
      
      for (let i = 0; i < features.length; i++) {
        const { mean, variance } = this.likelihoods[cls][i];
        prob *= this.gaussianProbability(features[i], mean, variance);
      }
      
      probs[cls] = prob;
      total += prob;
    }
    
    // Normalize
    for (const cls of this.classes) {
      probs[cls] /= total;
    }
    
    return probs;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🧮 K-NEAREST NEIGHBORS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class KNNClassifier {
  constructor(k = 3) {
    this.k = k;
    this.X = [];
    this.y = [];
    this.trained = false;
  }

  train(X, y) {
    this.X = X;
    this.y = y;
    this.trained = true;
  }

  euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
      sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
  }

  predict(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    
    // Calculate distances to all training points
    const distances = this.X.map((trainPoint, i) => ({
      distance: this.euclideanDistance(features, trainPoint),
      label: this.y[i]
    }));
    
    // Sort by distance and take k nearest
    distances.sort((a, b) => a.distance - b.distance);
    const kNearest = distances.slice(0, this.k);
    
    // Vote for most common label
    const votes = {};
    for (const neighbor of kNearest) {
      votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
    }
    
    let maxVotes = 0;
    let prediction = null;
    for (const label in votes) {
      if (votes[label] > maxVotes) {
        maxVotes = votes[label];
        prediction = label;
      }
    }
    
    return prediction;
  }

  predictProba(features) {
    if (!this.trained) throw new Error('Model must be trained first');
    
    const distances = this.X.map((trainPoint, i) => ({
      distance: this.euclideanDistance(features, trainPoint),
      label: this.y[i]
    }));
    
    distances.sort((a, b) => a.distance - b.distance);
    const kNearest = distances.slice(0, this.k);
    
    const votes = {};
    for (const neighbor of kNearest) {
      votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
    }
    
    for (const label in votes) {
      votes[label] /= this.k;
    }
    
    return votes;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📈 TIME SERIES FORECASTING
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class TimeSeriesForecaster {
  static simpleMovingAverage(data, window) {
    const result = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
    return result;
  }

  static exponentialMovingAverage(data, alpha = 0.3) {
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  static weightedMovingAverage(data, weights) {
    const result = [];
    const window = weights.length;
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    for (let i = window - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < window; j++) {
        sum += data[i - window + 1 + j] * weights[j];
      }
      result.push(sum / weightSum);
    }
    return result;
  }

  static linearTrend(data) {
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const meanX = indices.reduce((sum, val) => sum + val, 0) / n;
    const meanY = data.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (indices[i] - meanX) * (data[i] - meanY);
      denominator += Math.pow(indices[i] - meanX, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    return {
      slope,
      intercept,
      forecast: (steps) => {
        return Array.from({ length: steps }, (_, i) => 
          slope * (n + i) + intercept
        );
      }
    };
  }

  static seasonalDecomposition(data, period) {
    // Additive decomposition: data = trend + seasonal + residual
    
    // Calculate trend using centered moving average
    const trend = [];
    for (let i = 0; i < data.length; i++) {
      if (i < Math.floor(period / 2) || i >= data.length - Math.floor(period / 2)) {
        trend.push(null);
      } else {
        const window = data.slice(i - Math.floor(period / 2), i + Math.ceil(period / 2));
        trend.push(window.reduce((a, b) => a + b, 0) / window.length);
      }
    }
    
    // Calculate seasonal component
    const detrended = data.map((val, i) => trend[i] !== null ? val - trend[i] : null);
    const seasonal = new Array(period).fill(0);
    const counts = new Array(period).fill(0);
    
    detrended.forEach((val, i) => {
      if (val !== null) {
        seasonal[i % period] += val;
        counts[i % period]++;
      }
    });
    
    for (let i = 0; i < period; i++) {
      seasonal[i] = counts[i] > 0 ? seasonal[i] / counts[i] : 0;
    }
    
    // Calculate residual
    const residual = data.map((val, i) => {
      if (trend[i] === null) return null;
      return val - trend[i] - seasonal[i % period];
    });
    
    return {
      trend,
      seasonal,
      residual,
      period
    };
  }

  static arimaSimple(data, p = 1, d = 0, q = 0) {
    // Simplified ARIMA implementation
    // p = autoregressive order, d = differencing, q = moving average
    
    // Apply differencing
    let diffData = data;
    for (let i = 0; i < d; i++) {
      diffData = diffData.slice(1).map((val, idx) => val - diffData[idx]);
    }
    
    // Fit AR(p) model
    const n = diffData.length;
    const predictions = [];
    
    for (let i = p; i < n; i++) {
      let pred = 0;
      for (let j = 1; j <= p; j++) {
        pred += diffData[i - j] / p;
      }
      predictions.push(pred);
    }
    
    return {
      model: `ARIMA(${p},${d},${q})`,
      predictions,
      forecast: (steps) => {
        const lastValues = diffData.slice(-p);
        const forecasts = [];
        
        for (let i = 0; i < steps; i++) {
          const pred = lastValues.reduce((sum, val) => sum + val, 0) / p;
          forecasts.push(pred);
          lastValues.shift();
          lastValues.push(pred);
        }
        
        return forecasts;
      }
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 FEATURE ENGINEERING TOOLKIT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class FeatureEngineering {
  
  static createLagFeatures(data, lags = [1, 2, 3]) {
    const features = [];
    
    for (let i = Math.max(...lags); i < data.length; i++) {
      const row = {};
      lags.forEach(lag => {
        row[`lag_${lag}`] = data[i - lag];
      });
      row.target = data[i];
      features.push(row);
    }
    
    return features;
  }

  static createRollingFeatures(data, windows = [3, 5, 10]) {
    const features = [];
    const maxWindow = Math.max(...windows);
    
    for (let i = maxWindow - 1; i < data.length; i++) {
      const row = {};
      
      windows.forEach(window => {
        const windowData = data.slice(i - window + 1, i + 1);
        row[`rolling_mean_${window}`] = windowData.reduce((a, b) => a + b, 0) / window;
        row[`rolling_std_${window}`] = Math.sqrt(
          windowData.reduce((sum, val) => 
            sum + Math.pow(val - row[`rolling_mean_${window}`], 2), 0
          ) / window
        );
        row[`rolling_min_${window}`] = Math.min(...windowData);
        row[`rolling_max_${window}`] = Math.max(...windowData);
      });
      
      row.value = data[i];
      features.push(row);
    }
    
    return features;
  }

  static createInteractionFeatures(data) {
    // Create polynomial and interaction features
    const features = [];
    
    data.forEach(row => {
      const newRow = { ...row };
      const keys = Object.keys(row);
      
      // Add squared terms
      keys.forEach(key => {
        if (typeof row[key] === 'number') {
          newRow[`${key}_squared`] = row[key] ** 2;
        }
      });
      
      // Add interaction terms
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          if (typeof row[keys[i]] === 'number' && typeof row[keys[j]] === 'number') {
            newRow[`${keys[i]}_x_${keys[j]}`] = row[keys[i]] * row[keys[j]];
          }
        }
      }
      
      features.push(newRow);
    });
    
    return features;
  }

  static createBinningFeatures(data, field, bins = 5) {
    const values = data.map(row => row[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    return data.map(row => ({
      ...row,
      [`${field}_bin`]: Math.floor((row[field] - min) / binWidth)
    }));
  }

  static createTargetEncoding(data, categoricalField, targetField) {
    // Calculate mean target value for each category
    const categoryMeans = {};
    const categoryCounts = {};
    
    data.forEach(row => {
      const cat = row[categoricalField];
      if (!categoryMeans[cat]) {
        categoryMeans[cat] = 0;
        categoryCounts[cat] = 0;
      }
      categoryMeans[cat] += row[targetField];
      categoryCounts[cat]++;
    });
    
    for (const cat in categoryMeans) {
      categoryMeans[cat] /= categoryCounts[cat];
    }
    
    return data.map(row => ({
      ...row,
      [`${categoricalField}_encoded`]: categoryMeans[row[categoricalField]]
    }));
  }

  static oneHotEncode(data, field) {
    const uniqueValues = [...new Set(data.map(row => row[field]))];
    
    return data.map(row => {
      const encoded = { ...row };
      uniqueValues.forEach(value => {
        encoded[`${field}_${value}`] = row[field] === value ? 1 : 0;
      });
      return encoded;
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 MODEL EVALUATION METRICS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ModelEvaluation {
  
  static confusionMatrix(yTrue, yPred) {
    const classes = [...new Set([...yTrue, ...yPred])];
    const matrix = {};
    
    classes.forEach(actual => {
      matrix[actual] = {};
      classes.forEach(predicted => {
        matrix[actual][predicted] = 0;
      });
    });
    
    yTrue.forEach((actual, i) => {
      matrix[actual][yPred[i]]++;
    });
    
    return matrix;
  }

  static accuracy(yTrue, yPred) {
    const correct = yTrue.filter((val, i) => val === yPred[i]).length;
    return correct / yTrue.length;
  }

  static precision(yTrue, yPred, positiveClass) {
    const tp = yTrue.filter((val, i) => val === positiveClass && yPred[i] === positiveClass).length;
    const fp = yTrue.filter((val, i) => val !== positiveClass && yPred[i] === positiveClass).length;
    
    return tp / (tp + fp);
  }

  static recall(yTrue, yPred, positiveClass) {
    const tp = yTrue.filter((val, i) => val === positiveClass && yPred[i] === positiveClass).length;
    const fn = yTrue.filter((val, i) => val === positiveClass && yPred[i] !== positiveClass).length;
    
    return tp / (tp + fn);
  }

  static f1Score(yTrue, yPred, positiveClass) {
    const prec = this.precision(yTrue, yPred, positiveClass);
    const rec = this.recall(yTrue, yPred, positiveClass);
    
    return 2 * (prec * rec) / (prec + rec);
  }

  static roc_auc(yTrue, yScores) {
    // Simplified AUC calculation
    const positive = yTrue.filter(val => val === 1).length;
    const negative = yTrue.length - positive;
    
    let sum = 0;
    for (let i = 0; i < yTrue.length; i++) {
      if (yTrue[i] === 1) {
        for (let j = 0; j < yTrue.length; j++) {
          if (yTrue[j] === 0 && yScores[i] > yScores[j]) {
            sum++;
          }
        }
      }
    }
    
    return sum / (positive * negative);
  }

  static meanAbsoluteError(yTrue, yPred) {
    const sum = yTrue.reduce((total, val, i) => 
      total + Math.abs(val - yPred[i]), 0
    );
    return sum / yTrue.length;
  }

  static meanSquaredError(yTrue, yPred) {
    const sum = yTrue.reduce((total, val, i) => 
      total + Math.pow(val - yPred[i], 2), 0
    );
    return sum / yTrue.length;
  }

  static rootMeanSquaredError(yTrue, yPred) {
    return Math.sqrt(this.meanSquaredError(yTrue, yPred));
  }

  static r2Score(yTrue, yPred) {
    const meanY = yTrue.reduce((sum, val) => sum + val, 0) / yTrue.length;
    const ssTotal = yTrue.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
    const ssResidual = yTrue.reduce((sum, val, i) => 
      sum + Math.pow(val - yPred[i], 2), 0
    );
    
    return 1 - (ssResidual / ssTotal);
  }

  static crossValidation(model, X, y, folds = 5) {
    const foldSize = Math.floor(X.length / folds);
    const scores = [];
    
    for (let i = 0; i < folds; i++) {
      const testStart = i * foldSize;
      const testEnd = testStart + foldSize;
      
      const XTrain = [...X.slice(0, testStart), ...X.slice(testEnd)];
      const yTrain = [...y.slice(0, testStart), ...y.slice(testEnd)];
      const XTest = X.slice(testStart, testEnd);
      const yTest = y.slice(testStart, testEnd);
      
      model.train(XTrain, yTrain);
      const predictions = XTest.map(x => model.predict(x));
      const score = this.accuracy(yTest, predictions);
      
      scores.push(score);
    }
    
    return {
      scores,
      mean: scores.reduce((a, b) => a + b, 0) / scores.length,
      std: Math.sqrt(
        scores.reduce((sum, score) => 
          sum + Math.pow(score - scores.reduce((a, b) => a + b, 0) / scores.length, 2), 0
        ) / scores.length
      )
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎲 ENSEMBLE METHODS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class EnsembleMethods {
  
  static votingClassifier(models, X) {
    // Hard voting - majority vote
    const predictions = models.map(model => model.predict(X));
    const votes = {};
    
    predictions.forEach(pred => {
      votes[pred] = (votes[pred] || 0) + 1;
    });
    
    let maxVotes = 0;
    let winner = null;
    for (const pred in votes) {
      if (votes[pred] > maxVotes) {
        maxVotes = votes[pred];
        winner = pred;
      }
    }
    
    return winner;
  }

  static averagingRegressor(models, X) {
    // Average predictions from multiple regressors
    const predictions = models.map(model => model.predict(X));
    return predictions.reduce((a, b) => a + b, 0) / predictions.length;
  }

  static weightedAveraging(models, X, weights) {
    // Weighted average of predictions
    const predictions = models.map(model => model.predict(X));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    return predictions.reduce((sum, pred, i) => 
      sum + pred * weights[i], 0
    ) / totalWeight;
  }

  static stacking(baseModels, metaModel, XTrain, yTrain, XTest) {
    // Train base models
    const basePredictions = [];
    
    baseModels.forEach(model => {
      model.train(XTrain, yTrain);
      basePredictions.push(XTest.map(x => model.predict(x)));
    });
    
    // Create meta features (predictions from base models)
    const metaFeatures = basePredictions[0].map((_, i) =>
      basePredictions.map(preds => preds[i])
    );
    
    // Train meta model
    metaModel.train(metaFeatures, yTrain);
    
    // Make final predictions
    return metaFeatures.map(features => metaModel.predict(features));
  }

  static bagging(baseModel, X, y, numEstimators = 10) {
    // Bootstrap aggregating
    const models = [];
    const n = X.length;
    
    for (let i = 0; i < numEstimators; i++) {
      // Create bootstrap sample
      const indices = Array.from({ length: n }, () => 
        Math.floor(Math.random() * n)
      );
      const XSample = indices.map(idx => X[idx]);
      const ySample = indices.map(idx => y[idx]);
      
      // Train model on bootstrap sample
      const model = Object.create(Object.getPrototypeOf(baseModel));
      Object.assign(model, baseModel);
      model.train(XSample, ySample);
      models.push(model);
    }
    
    return models;
  }
}

export default {
  LinearRegressionModel,
  MultipleRegressionModel,
  DecisionTreeClassifier,
  NaiveBayesClassifier,
  KNNClassifier,
  TimeSeriesForecaster,
  FeatureEngineering,
  ModelEvaluation,
  EnsembleMethods
};
