const express = require('express');
const {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
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

module.exports = router;