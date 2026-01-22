const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Mock user database (replace with real database)
const users = new Map();

// Environment variables - SECURITY: JWT_SECRET must be set in production
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

// Security check: Ensure JWT_SECRET is set in production
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is required in production!');
  process.exit(1);
}

// Development fallback with warning
const getJwtSecret = () => {
  if (JWT_SECRET) return JWT_SECRET;
  console.warn('⚠️  WARNING: Using development JWT secret. Set JWT_SECRET in production!');
  return 'dev-only-secret-change-in-production-' + Date.now();
};

// Refresh tokens storage (use Redis in production)
const refreshTokens = new Map();

/**
 * Register new user
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 20 }).trim(),
  body('password').isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim()
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password, firstName, lastName } = req.body;

  try {
    // Check if user exists
    if (Array.from(users.values()).some(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    if (users.has(username)) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      username,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      verified: false,
      bankroll: 1000, // Starting bankroll
      settings: {
        notifications: true,
        theme: 'light'
      }
    };

    users.set(username, user);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    refreshTokens.set(refreshToken, {
      userId: user.id,
      username: user.username,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Return user data (without password)
    const userResponse = sanitizeUser(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login user
 */
router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Find user (support email or username)
    let user = users.get(username);
    if (!user) {
      user = Array.from(users.values()).find(u => u.email === username);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    refreshTokens.set(refreshToken, {
      userId: user.id,
      username: user.username,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    });

    res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    // Check if token exists in storage
    const storedToken = refreshTokens.get(refreshToken);
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if expired
    if (storedToken.expiresAt < Date.now()) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // Get user
    const user = users.get(decoded.username);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

/**
 * Logout user
 */
router.post('/logout', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.json({ message: 'Logged out successfully' });
});

/**
 * Get current user profile
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = users.get(req.user.username);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user: sanitizeUser(user) });
});

/**
 * Update user profile
 */
router.patch('/me', authenticateToken, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('settings').optional().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = users.get(req.user.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { firstName, lastName, email, settings } = req.body;

  // Check email uniqueness if changed
  if (email && email !== user.email) {
    const emailExists = Array.from(users.values()).some(u => 
      u.email === email && u.id !== user.id
    );
    if (emailExists) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    user.email = email;
  }

  // Update fields
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (settings) user.settings = { ...user.settings, ...settings };

  user.updatedAt = new Date().toISOString();

  res.json({ 
    message: 'Profile updated successfully',
    user: sanitizeUser(user)
  });
});

/**
 * Change password
 */
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  const user = users.get(req.user.username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.updatedAt = new Date().toISOString();

    // Invalidate all refresh tokens for security
    Array.from(refreshTokens.entries()).forEach(([token, data]) => {
      if (data.userId === user.id) {
        refreshTokens.delete(token);
      }
    });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Password change failed' });
  }
});

/**
 * Middleware: Authenticate JWT token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
}

/**
 * Middleware: Authorize admin role
 */
function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * Generate access token
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

/**
 * Remove sensitive fields from user object
 */
function sanitizeUser(user) {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}

// Export middleware for use in other routes
module.exports = router;
module.exports.authenticateToken = authenticateToken;
module.exports.authorizeAdmin = authorizeAdmin;
