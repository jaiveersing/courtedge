const express = require('express');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Mock data storage (replace with database)
const follows = new Map(); // key: followerId, value: Set of followingIds
const betLikes = new Map(); // key: betId, value: Set of userIds
const betComments = new Map(); // key: betId, value: Array of comments

/**
 * Get leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  const { period = 'all-time' } = req.query;

  try {
    // Mock leaderboard data
    const leaderboard = [
      {
        id: '1',
        username: 'SharpBettor',
        verified: true,
        totalBets: 342,
        wins: 195,
        losses: 147,
        winRate: 57.0,
        totalProfit: 8450.00,
        roi: 24.5,
        followers: 1250
      },
      {
        id: '2',
        username: 'PropsKing',
        verified: true,
        totalBets: 289,
        wins: 158,
        losses: 131,
        winRate: 54.7,
        totalProfit: 5320.00,
        roi: 18.3,
        followers: 890
      },
      {
        id: '3',
        username: 'UnderGuru',
        verified: false,
        totalBets: 201,
        wins: 112,
        losses: 89,
        winRate: 55.7,
        totalProfit: 3890.00,
        roi: 19.4,
        followers: 654
      }
    ];

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * Search users
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  try {
    // Mock search results
    const results = [
      {
        id: '4',
        username: 'BetMaster',
        verified: false,
        totalBets: 145,
        winRate: 52.3,
        roi: 8.5,
        followers: 234
      }
    ];

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * Get user's following list
 */
router.get('/following', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const followingIds = follows.get(userId) || new Set();
    
    // Mock following data
    const followingUsers = Array.from(followingIds).map(id => ({
      id,
      username: `User${id}`,
      verified: false,
      totalBets: 50,
      winRate: 55.0,
      roi: 10.0,
      followers: 100
    }));

    res.json(followingUsers);
  } catch (error) {
    console.error('Following fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

/**
 * Get user's followers list
 */
router.get('/followers', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all users following the current user
    const followerIds = [];
    for (const [followerId, followingSet] of follows.entries()) {
      if (followingSet.has(userId)) {
        followerIds.push(followerId);
      }
    }

    const followers = followerIds.map(id => ({
      id,
      username: `User${id}`,
      verified: false,
      totalBets: 50,
      winRate: 55.0,
      roi: 10.0
    }));

    res.json(followers);
  } catch (error) {
    console.error('Followers fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

/**
 * Follow a user
 */
router.post('/follow', authenticateToken, async (req, res) => {
  const followerId = req.user.id;
  const { userId: followingId } = req.body;

  if (!followingId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (followerId === followingId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  try {
    if (!follows.has(followerId)) {
      follows.set(followerId, new Set());
    }

    const followingSet = follows.get(followerId);
    followingSet.add(followingId);

    res.json({ 
      message: 'Successfully followed user',
      userId: followingId
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Follow failed' });
  }
});

/**
 * Unfollow a user
 */
router.delete('/follow/:userId', authenticateToken, async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.userId;

  try {
    const followingSet = follows.get(followerId);
    if (followingSet) {
      followingSet.delete(followingId);
    }

    res.json({ 
      message: 'Successfully unfollowed user',
      userId: followingId
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Unfollow failed' });
  }
});

/**
 * Get shared bets feed
 */
router.get('/shared-bets', async (req, res) => {
  const { filter = 'all' } = req.query;

  try {
    // Mock shared bets
    const sharedBets = [
      {
        id: 'bet1',
        user: {
          id: '1',
          username: 'SharpBettor',
          verified: true
        },
        game: 'Lakers vs Warriors',
        selection: 'Lakers -3.5',
        odds: -110,
        stake: 100,
        units: 1,
        status: 'won',
        profitLoss: 90.91,
        likes: 45,
        comments: 12,
        liked: false,
        timeAgo: '2 hours ago',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'bet2',
        user: {
          id: '2',
          username: 'PropsKing',
          verified: true
        },
        game: 'Celtics vs Heat',
        selection: 'Jayson Tatum Over 28.5 Points',
        odds: -115,
        stake: 200,
        units: 2,
        status: 'pending',
        profitLoss: 0,
        likes: 32,
        comments: 8,
        liked: false,
        timeAgo: '4 hours ago',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json(sharedBets);
  } catch (error) {
    console.error('Shared bets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch shared bets' });
  }
});

/**
 * Like a bet
 */
router.post('/bets/:betId/like', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { betId } = req.params;

  try {
    if (!betLikes.has(betId)) {
      betLikes.set(betId, new Set());
    }

    const likes = betLikes.get(betId);
    
    if (likes.has(userId)) {
      // Unlike
      likes.delete(userId);
      res.json({ 
        message: 'Bet unliked',
        liked: false,
        likes: likes.size
      });
    } else {
      // Like
      likes.add(userId);
      res.json({ 
        message: 'Bet liked',
        liked: true,
        likes: likes.size
      });
    }
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Like failed' });
  }
});

/**
 * Comment on a bet
 */
router.post('/bets/:betId/comments', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const username = req.user.username;
  const { betId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comment content required' });
  }

  try {
    if (!betComments.has(betId)) {
      betComments.set(betId, []);
    }

    const comment = {
      id: Date.now().toString(),
      userId,
      username,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const comments = betComments.get(betId);
    comments.push(comment);

    res.status(201).json({ 
      message: 'Comment added',
      comment
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Comment failed' });
  }
});

/**
 * Get comments for a bet
 */
router.get('/bets/:betId/comments', async (req, res) => {
  const { betId } = req.params;

  try {
    const comments = betComments.get(betId) || [];
    res.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

/**
 * Delete a comment
 */
router.delete('/bets/:betId/comments/:commentId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { betId, commentId } = req.params;

  try {
    const comments = betComments.get(betId);
    if (!comments) {
      return res.status(404).json({ error: 'Comments not found' });
    }

    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check ownership
    if (comments[commentIndex].userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    comments.splice(commentIndex, 1);

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Comment delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

/**
 * Get user profile stats
 */
router.get('/users/:userId/stats', async (req, res) => {
  const { userId } = req.params;

  try {
    // Mock user stats
    const stats = {
      userId,
      totalBets: 150,
      wins: 85,
      losses: 65,
      winRate: 56.7,
      totalProfit: 2340.00,
      roi: 15.6,
      followers: 234,
      following: 89,
      bestStreak: 7,
      currentStreak: 3,
      favoriteMarkets: ['spread', 'props', 'totals'],
      recentBets: []
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
