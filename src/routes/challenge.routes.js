const express = require('express');
const { 
  listChallenges, 
  getChallenge, 
  addChallenge, 
  editChallenge, 
  removeChallenge 
} = require('../controllers/challenge.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', listChallenges);
router.get('/:id', getChallenge);

// Protected routes
router.post('/', authMiddleware, addChallenge);
router.patch('/:id', authMiddleware, editChallenge);
router.delete('/:id', authMiddleware, removeChallenge);
router.get('/challenge/:id', getChallenge);

module.exports = router;
