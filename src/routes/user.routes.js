const express = require('express');
const {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
  getUserDetails,
  updateProfile,
  followUser,
  unfollowUser,
  handleFollowRequest,
  getFollowersController,
  blockUserController,
  getFollowingController,
  unblockUserController,
} = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user submissions
router.get('/submissions', authMiddleware, getSubmissions);

// Get user liked posts
router.get('/liked-posts', authMiddleware, getLikedPosts);

// Get user commented posts
router.get('/commented-posts', authMiddleware, getCommentedPosts);

// Get complete user profile details
router.get('/profile', authMiddleware, getProfileDetails);

// Get user details by ID
router.get('/:userId', authMiddleware, getUserDetails);
router.put('/profile', authMiddleware, updateProfile);


router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.post('/follow-request/handle', authMiddleware, handleFollowRequest); // body: { requestId, action }
router.get('/:userId/followers', authMiddleware, getFollowersController);
router.get('/:userId/following', authMiddleware, getFollowingController);

router.post('/block', authMiddleware, blockUserController);
router.post('/unblock', authMiddleware, unblockUserController);

// incoming follow requests (for account owner)
router.get('/follow-requests/incoming', authMiddleware, async (req, res) => {
  try {
    const data = await getIncomingFollowRequests(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;