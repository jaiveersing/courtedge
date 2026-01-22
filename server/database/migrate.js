const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

/**
 * Database Migration Manager
 * Handles schema creation, migrations, and rollbacks
 */
class DatabaseMigration {
  constructor(config) {
    this.pool = new Pool(config);
    this.migrationsPath = path.join(__dirname, 'migrations');
  }

  /**
   * Initialize database schema
   */
  async initialize() {
    const client = await this.pool.connect();
    
    try {
      console.log('Starting database initialization...');

      // Create migrations tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Read and execute schema.sql
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      await client.query(schema);
      
      console.log('✓ Database schema created successfully');
      
      // Run any pending migrations
      await this.runMigrations();
      
      return { success: true };
      
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations() {
    if (!fs.existsSync(this.migrationsPath)) {
      console.log('No migrations directory found');
      return;
    }

    const files = fs.readdirSync(this.migrationsPath)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const client = await this.pool.connect();

    try {
      for (const file of files) {
        // Check if migration already executed
        const result = await client.query(
          'SELECT id FROM migrations WHERE name = $1',
          [file]
        );

        if (result.rows.length === 0) {
          console.log(`Running migration: ${file}`);
          
          const migrationPath = path.join(this.migrationsPath, file);
          const migration = fs.readFileSync(migrationPath, 'utf8');
          
          await client.query('BEGIN');
          await client.query(migration);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          
          console.log(`✓ Migration ${file} completed`);
        }
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Migration failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create sample data for testing
   */
  async seedData() {
    const client = await this.pool.connect();

    try {
      console.log('Seeding sample data...');

      // Create test users
      await client.query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, bankroll, starting_bankroll)
        VALUES 
          ('testuser1', 'test1@example.com', '$2a$10$..hashhere..', 'John', 'Doe', 5000, 1000),
          ('testuser2', 'test2@example.com', '$2a$10$..hashhere..', 'Jane', 'Smith', 3500, 1000),
          ('sharpbettor', 'sharp@example.com', '$2a$10$..hashhere..', 'Sharp', 'Bettor', 8000, 2000)
        ON CONFLICT (email) DO NOTHING;
      `);

      // Create sample predictions
      await client.query(`
        INSERT INTO predictions (
          game_id, sport, league, game_date, home_team, away_team,
          predicted_winner, win_probability, predicted_spread, spread_confidence,
          predicted_total, total_confidence, model_version
        )
        VALUES 
          ('nba_2024_001', 'basketball', 'NBA', CURRENT_TIMESTAMP + INTERVAL '2 hours', 'Lakers', 'Warriors', 'Lakers', 62.5, -3.5, 78.2, 220.5, 71.8, 'v2.1.0'),
          ('nba_2024_002', 'basketball', 'NBA', CURRENT_TIMESTAMP + INTERVAL '3 hours', 'Celtics', 'Heat', 'Celtics', 58.3, -5.5, 72.1, 215.5, 68.9, 'v2.1.0'),
          ('nba_2024_003', 'basketball', 'NBA', CURRENT_TIMESTAMP + INTERVAL '4 hours', 'Nets', 'Bucks', 'Bucks', 71.2, 7.5, 81.3, 228.5, 75.4, 'v2.1.0')
        ON CONFLICT (game_id) DO NOTHING;
      `);

      console.log('✓ Sample data seeded successfully');

    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Drop all tables (use with caution!)
   */
  async reset() {
    const client = await this.pool.connect();

    try {
      console.log('⚠️  Resetting database (dropping all tables)...');

      await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
      `);

      console.log('✓ Database reset complete');

    } catch (error) {
      console.error('Reset failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check database health
   */
  async healthCheck() {
    const client = await this.pool.connect();

    try {
      // Test connection
      await client.query('SELECT NOW()');

      // Count tables
      const tablesResult = await client.query(`
        SELECT COUNT(*) as table_count
        FROM information_schema.tables
        WHERE table_schema = 'public';
      `);

      // Count users
      const usersResult = await client.query('SELECT COUNT(*) as user_count FROM users');

      // Count bets
      const betsResult = await client.query('SELECT COUNT(*) as bet_count FROM bets');

      return {
        healthy: true,
        tables: parseInt(tablesResult.rows[0].table_count),
        users: parseInt(usersResult.rows[0].user_count),
        bets: parseInt(betsResult.rows[0].bet_count),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  /**
   * Close pool
   */
  async close() {
    await this.pool.end();
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  const config = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'courtedge',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432')
  };

  const migration = new DatabaseMigration(config);

  (async () => {
    try {
      switch (command) {
        case 'init':
          await migration.initialize();
          break;

        case 'migrate':
          await migration.runMigrations();
          break;

        case 'seed':
          await migration.seedData();
          break;

        case 'reset':
          await migration.reset();
          await migration.initialize();
          break;

        case 'health':
          const health = await migration.healthCheck();
          console.log('Health Check:', health);
          break;

        default:
          console.log(`
Usage: node migrate.js <command>

Commands:
  init      Initialize database schema
  migrate   Run pending migrations
  seed      Seed sample data
  reset     Reset database (drop all tables)
  health    Check database health

Environment variables:
  DB_USER     Database user (default: postgres)
  DB_HOST     Database host (default: localhost)
  DB_NAME     Database name (default: courtedge)
  DB_PASSWORD Database password (default: password)
  DB_PORT     Database port (default: 5432)
          `);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    } finally {
      await migration.close();
    }
  })();
}

module.exports = DatabaseMigration;
