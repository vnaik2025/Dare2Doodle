const express = require('express');
const { listComments, addComment, removeComment, updateComment } = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:challengeId', listComments); // No auth required for listing comments
router.post('/', authMiddleware, addComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, removeComment);

module.exports = router;