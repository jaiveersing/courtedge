-- Initialization script for Docker container
-- This creates the database structure on first run

\connect courtedge;

-- Load the main schema
\i /docker-entrypoint-initdb.d/schema.sql

-- Add any additional seed data here for development
INSERT INTO users (email, username, password_hash, first_name, last_name, role)
VALUES 
  ('demo@courtedge.app', 'demo', crypt('demo123', gen_salt('bf')), 'Demo', 'User', 'premium')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'CourtEdge database initialized successfully!' as message;
