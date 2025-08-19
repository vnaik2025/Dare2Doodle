const express = require('express');
const {
  listNotifications,
  markRead,
  createNotificationController
} = require('../controllers/notifications.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listNotifications);
router.post('/', authMiddleware, createNotificationController);
router.patch('/:id', authMiddleware, markRead);

module.exports = router;
