const express = require('express');
const { listComments, addComment, removeComment,  } = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:challengeId', listComments);
router.post('/', authMiddleware, addComment);
router.delete('/:id', authMiddleware, removeComment);

module.exports = router;
