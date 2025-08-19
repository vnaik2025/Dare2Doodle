const { createNotification, getChallengeById, getCommentById, getUserById } = require('../services/appwrite.service');

const fireNotification = async (type, actorId, targetType, targetId, receiverId) => {
  if (actorId === receiverId) return; // No self-notify

  const data = {
    userId: receiverId,
    type,
    actorId,
    targetType,
    targetId,
    read: false,
    createdAt: new Date().toISOString()
  };

  await createNotification(data);

  // TODO: Batch logic for likes (e.g., if many likes, aggregate)
};

module.exports = { fireNotification };