const express = require('express');
const { addLike, removeLike, getLikeInfo } = require('../controllers/likes.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addLike);
router.delete('/', authMiddleware, removeLike);
router.get('/', getLikeInfo); // Optional auth

module.exports = router;