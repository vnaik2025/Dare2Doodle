const {
  getNotifications,
  updateNotification,
  createNotification,
  cleanupOldNotifications,
} = require('../services/appwrite.service');




// List notifications
const listNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    res.json(notifications);

        cleanupOldNotifications(req.user.id).catch(console.error);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark as read
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user's notifications
    const notifications = await getNotifications(req.user.id);

    // Verify ownership
    const notif = notifications.find(n => n.$id === id);
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update notification
    const updated = await updateNotification(id, { read: true });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};


const createNotificationController = async (req, res) => {
  try {
    const { type, actorId, targetType, targetId } = req.body;

    // Validate required fields
    if (!type || !actorId || !targetType || !targetId) {
      return res.status(400).json({ error: 'Missing required fields: type, actorId, targetType, targetId' });
    }

    const data = {
      userId: req.user.id,      // notification belongs to logged-in user
      type,                     // required enum
      actorId,                  // who triggered it
      targetType,               // e.g. "challenge", "comment"
      targetId,                 // id of target entity
      read: false,
      createdAt: new Date().toISOString()
    };

    const notification = await createNotification(data);
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};


module.exports = { listNotifications, markRead ,createNotificationController };