import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

/**
 * ML Model Version Control System
 * - Model versioning and tracking
 * - Performance metrics per version
 * - A/B testing support
 * - Rollback capabilities
 * - Model registry
 */

class ModelVersionControl {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    this.bucketName = process.env.S3_MODEL_BUCKET || 'courtedge-ml-models';
    this.modelsDir = process.env.MODELS_DIR || './ml_service/models';
    this.metadataFile = path.join(this.modelsDir, 'registry.json');

    // Model registry - tracks all versions
    this.registry = this.loadRegistry();

    // Active models per sport
    this.activeModels = new Map();
  }

  /**
   * Load model registry from disk
   */
  loadRegistry() {
    if (fs.existsSync(this.metadataFile)) {
      const data = fs.readFileSync(this.metadataFile, 'utf-8');
      return JSON.parse(data);
    }

    return {
      models: {},
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save registry to disk
   */
  saveRegistry() {
    this.registry.lastUpdated = new Date().toISOString();
    fs.writeFileSync(
      this.metadataFile,
      JSON.stringify(this.registry, null, 2)
    );
  }

  /**
   * Register new model version
   */
  async registerModel(modelName, version, metadata = {}) {
    const modelId = `${modelName}_v${version}`;
    const modelPath = path.join(this.modelsDir, modelId);

    // Validate model files exist
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model files not found at ${modelPath}`);
    }

    // Calculate model checksum
    const checksum = await this.calculateChecksum(modelPath);

    // Create model entry
    const modelEntry = {
      id: modelId,
      name: modelName,
      version,
      checksum,
      createdAt: new Date().toISOString(),
      status: 'registered',
      metadata: {
        framework: metadata.framework || 'pytorch',
        sport: metadata.sport,
        modelType: metadata.modelType || 'prediction',
        features: metadata.features || [],
        trainingDataSize: metadata.trainingDataSize,
        trainingDuration: metadata.trainingDuration,
        hyperparameters: metadata.hyperparameters || {},
        ...metadata
      },
      performance: {
        accuracy: null,
        precision: null,
        recall: null,
        f1Score: null,
        mae: null,
        rmse: null,
        custom: {}
      },
      deployment: {
        environment: 'staging',
        trafficPercentage: 0,
        deployedAt: null
      }
    };

    // Add to registry
    if (!this.registry.models[modelName]) {
      this.registry.models[modelName] = {};
    }

    this.registry.models[modelName][version] = modelEntry;
    this.saveRegistry();

    // Upload to S3
    await this.uploadModelToS3(modelPath, modelId);

    console.log(`Model registered: ${modelId}`);

    return modelEntry;
  }

  /**
   * Calculate checksum for model files
   */
  async calculateChecksum(modelPath) {
    const hash = crypto.createHash('sha256');
    
    // Get all files in model directory
    const files = fs.readdirSync(modelPath);
    
    for (const file of files) {
      const filepath = path.join(modelPath, file);
      const data = fs.readFileSync(filepath);
      hash.update(data);
    }

    return hash.digest('hex');
  }

  /**
   * Upload model to S3
   */
  async uploadModelToS3(modelPath, modelId) {
    const files = fs.readdirSync(modelPath);

    for (const file of files) {
      const filepath = path.join(modelPath, file);
      const fileStream = fs.createReadStream(filepath);
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${modelId}/${file}`,
        Body: fileStream,
        ServerSideEncryption: 'AES256'
      });

      await this.s3Client.send(command);
    }

    console.log(`Model uploaded to S3: ${modelId}`);
  }

  /**
   * Update model performance metrics
   */
  updatePerformanceMetrics(modelName, version, metrics) {
    if (!this.registry.models[modelName]?.[version]) {
      throw new Error(`Model ${modelName} v${version} not found`);
    }

    const model = this.registry.models[modelName][version];
    
    model.performance = {
      ...model.performance,
      ...metrics,
      lastEvaluated: new Date().toISOString()
    };

    this.saveRegistry();

    console.log(`Updated metrics for ${modelName} v${version}`);

    return model;
  }

  /**
   * Deploy model version
   */
  async deployModel(modelName, version, environment = 'production', trafficPercentage = 100) {
    if (!this.registry.models[modelName]?.[version]) {
      throw new Error(`Model ${modelName} v${version} not found`);
    }

    const model = this.registry.models[modelName][version];

    // Download model from S3 if not local
    const modelId = `${modelName}_v${version}`;
    const modelPath = path.join(this.modelsDir, modelId);
    
    if (!fs.existsSync(modelPath)) {
      await this.downloadModelFromS3(modelId, modelPath);
    }

    // Update deployment info
    model.deployment = {
      environment,
      trafficPercentage,
      deployedAt: new Date().toISOString(),
      deployedBy: process.env.USER || 'system'
    };

    model.status = 'deployed';

    // If deploying to production with 100% traffic, deactivate other versions
    if (environment === 'production' && trafficPercentage === 100) {
      Object.values(this.registry.models[modelName]).forEach(m => {
        if (m.version !== version && m.deployment.environment === 'production') {
          m.deployment.trafficPercentage = 0;
          m.status = 'inactive';
        }
      });
    }

    this.saveRegistry();

    // Load model into memory
    this.activeModels.set(`${modelName}_${environment}`, {
      model,
      path: modelPath,
      loadedAt: new Date().toISOString()
    });

    console.log(`Deployed ${modelName} v${version} to ${environment} (${trafficPercentage}% traffic)`);

    return model;
  }

  /**
   * Download model from S3
   */
  async downloadModelFromS3(modelId, destinationPath) {
    console.log(`Downloading model ${modelId} from S3...`);
    
    // Create directory
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // List objects in model directory
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: `${modelId}/`
    });

    const { Contents } = await this.s3Client.send(listCommand);

    // Download each file
    for (const item of Contents || []) {
      const filename = path.basename(item.Key);
      const filepath = path.join(destinationPath, filename);

      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: item.Key
      });

      const response = await this.s3Client.send(getCommand);
      const stream = response.Body;

      const writeStream = fs.createWriteStream(filepath);
      stream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    }

    console.log(`Model downloaded: ${modelId}`);
  }

  /**
   * Setup A/B test between model versions
   */
  setupABTest(modelName, versionA, versionB, splitPercentage = 50) {
    if (!this.registry.models[modelName]?.[versionA]) {
      throw new Error(`Model ${modelName} v${versionA} not found`);
    }
    if (!this.registry.models[modelName]?.[versionB]) {
      throw new Error(`Model ${modelName} v${versionB} not found`);
    }

    const modelA = this.registry.models[modelName][versionA];
    const modelB = this.registry.models[modelName][versionB];

    modelA.deployment.trafficPercentage = splitPercentage;
    modelB.deployment.trafficPercentage = 100 - splitPercentage;

    modelA.abTest = {
      active: true,
      startedAt: new Date().toISOString(),
      variant: 'A',
      vsVersion: versionB
    };

    modelB.abTest = {
      active: true,
      startedAt: new Date().toISOString(),
      variant: 'B',
      vsVersion: versionA
    };

    this.saveRegistry();

    console.log(`A/B test started: ${modelName} v${versionA} (${splitPercentage}%) vs v${versionB} (${100-splitPercentage}%)`);

    return { modelA, modelB };
  }

  /**
   * Get model for prediction (handles A/B testing)
   */
  getModelForPrediction(modelName, environment = 'production') {
    // Get all models for this name in environment
    const versions = Object.values(this.registry.models[modelName] || {})
      .filter(m => m.deployment.environment === environment && m.deployment.trafficPercentage > 0);

    if (versions.length === 0) {
      throw new Error(`No active models for ${modelName} in ${environment}`);
    }

    // If single model, use it
    if (versions.length === 1) {
      return versions[0];
    }

    // A/B test - random selection based on traffic percentage
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const model of versions) {
      cumulative += model.deployment.trafficPercentage;
      if (random <= cumulative) {
        return model;
      }
    }

    return versions[0]; // Fallback
  }

  /**
   * Rollback to previous model version
   */
  async rollback(modelName, environment = 'production') {
    // Find currently deployed version
    const currentVersion = Object.values(this.registry.models[modelName] || {})
      .find(m => 
        m.deployment.environment === environment && 
        m.deployment.trafficPercentage === 100
      );

    if (!currentVersion) {
      throw new Error(`No active model found for ${modelName} in ${environment}`);
    }

    // Find previous version
    const versions = Object.values(this.registry.models[modelName])
      .filter(m => m.deployment.deployedAt)
      .sort((a, b) => new Date(b.deployment.deployedAt) - new Date(a.deployment.deployedAt));

    const previousVersion = versions.find(v => v.version !== currentVersion.version);

    if (!previousVersion) {
      throw new Error(`No previous version found for rollback`);
    }

    console.log(`Rolling back ${modelName} from v${currentVersion.version} to v${previousVersion.version}`);

    await this.deployModel(modelName, previousVersion.version, environment, 100);

    return previousVersion;
  }

  /**
   * Compare model versions
   */
  compareVersions(modelName, versionA, versionB) {
    const modelA = this.registry.models[modelName]?.[versionA];
    const modelB = this.registry.models[modelName]?.[versionB];

    if (!modelA || !modelB) {
      throw new Error('One or both model versions not found');
    }

    return {
      modelA: {
        version: versionA,
        performance: modelA.performance,
        deployment: modelA.deployment
      },
      modelB: {
        version: versionB,
        performance: modelB.performance,
        deployment: modelB.deployment
      },
      comparison: {
        accuracyDiff: modelA.performance.accuracy - modelB.performance.accuracy,
        precisionDiff: modelA.performance.precision - modelB.performance.precision,
        recallDiff: modelA.performance.recall - modelB.performance.recall
      }
    };
  }

  /**
   * List all models
   */
  listModels(modelName = null) {
    if (modelName) {
      return this.registry.models[modelName] || {};
    }

    return this.registry.models;
  }

  /**
   * Get model metadata
   */
  getModelMetadata(modelName, version) {
    return this.registry.models[modelName]?.[version];
  }

  /**
   * Archive old model version
   */
  archiveModel(modelName, version) {
    const model = this.registry.models[modelName]?.[version];
    
    if (!model) {
      throw new Error(`Model ${modelName} v${version} not found`);
    }

    model.status = 'archived';
    model.archivedAt = new Date().toISOString();
    model.deployment.trafficPercentage = 0;

    this.saveRegistry();

    console.log(`Archived ${modelName} v${version}`);

    return model;
  }
}

export default new ModelVersionControl();
