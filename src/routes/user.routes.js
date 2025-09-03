// const express = require('express');
// const {
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
//   getProfileDetails,
//   getUserDetails,
//   updateProfile,
//   followUser,
//   unfollowUser,
//   handleFollowRequest,
//   getFollowersController,
//   blockUserController,
//   getFollowingController,
//   unblockUserController,
//   loginController,
//   togglePrivacyController,
//   logoutController,
//   getIncomingFollowRequestsController,
// } = require('../controllers/user.controller');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// // Get user submissions
// router.get('/submissions', authMiddleware, getSubmissions);

// // Get user liked posts
// router.get('/liked-posts', authMiddleware, getLikedPosts);

// // Get user commented posts
// router.get('/commented-posts', authMiddleware, getCommentedPosts);

// // Get complete user profile details
// router.get('/profile', authMiddleware, getProfileDetails);

// // Get user details by ID
// router.get('/:userId', authMiddleware, getUserDetails);
// router.put('/profile', authMiddleware, updateProfile);
// router.put('/privacy', authMiddleware, togglePrivacyController);


// router.post('/follow', authMiddleware, followUser);
// router.post('/unfollow', authMiddleware, unfollowUser);


// router.post('/follow-request/handle', authMiddleware, handleFollowRequest);

// // Incoming follow requests (for account owner)
// router.get('/follow-requests/incoming', authMiddleware, getIncomingFollowRequestsController);

// router.get('/:userId/followers', authMiddleware, getFollowersController);
// router.get('/:userId/following', authMiddleware, getFollowingController);

// router.post('/block', authMiddleware, blockUserController);
// router.post('/unblock', authMiddleware, unblockUserController);

// // incoming follow requests (for account owner)
// router.get('/follow-requests/incoming', authMiddleware, async (req, res) => {
//   try {
//     const data = await getIncomingFollowRequests(req.user.id);
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch' });
//   }
// });

// // login route (public)
// router.post("/login", loginController);

// // logout route (protected → needs auth)
// router.post("/logout", authMiddleware, logoutController);

// module.exports = router;

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
  loginController,
  togglePrivacyController,
  logoutController,
  getIncomingFollowRequestsController,
  acceptFollow,
  rejectFollow,
} = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Posts
router.get('/submissions', authMiddleware, getSubmissions);
router.get('/liked-posts', authMiddleware, getLikedPosts);
router.get('/commented-posts', authMiddleware, getCommentedPosts);

// Profile
router.get('/profile', authMiddleware, getProfileDetails);
router.put('/profile', authMiddleware, updateProfile);
router.put('/privacy', authMiddleware, togglePrivacyController);
router.get('/:userId', authMiddleware, getUserDetails);

// Follow / Unfollow
router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);

// Follow requests
router.post('/follow-request/handle', authMiddleware, handleFollowRequest); // generic
router.post('/follow-request/accept', authMiddleware, acceptFollow); // explicit accept
router.post('/follow-request/reject', authMiddleware, rejectFollow); // explicit reject
router.get('/follow-requests/incoming', authMiddleware, getIncomingFollowRequestsController);

// Followers / Following
router.get('/:userId/followers', authMiddleware, getFollowersController);
router.get('/:userId/following', authMiddleware, getFollowingController);

// Block / Unblock
router.post('/block', authMiddleware, blockUserController);
router.post('/unblock', authMiddleware, unblockUserController);

// Auth
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);

module.exports = router;
