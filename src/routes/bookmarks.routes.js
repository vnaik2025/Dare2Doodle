const express = require('express');
const { addBookmark, removeBookmark, listBookmarks } = require('../controllers/bookmarks.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addBookmark);
router.delete('/', authMiddleware, removeBookmark);
router.get('/me', authMiddleware, listBookmarks);

module.exports = router;