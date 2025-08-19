const {
  getComments,
  getReplies,
  createComment,
  getCommentById,
  deleteComment,
  getChallengeById
} = require('../services/appwrite.service');
const { fireNotification } = require('../utils/notifications.util');
const validate = require('../middleware/validation.middleware');
const { writeLimiter } = require('../middleware/rateLimit.middleware');
const z = require('zod');

const createSchema = z.object({
  challengeId: z.string(),
  text: z.string().max(1500).optional(),
  mediaUrl: z.string().optional(),
  parentCommentId: z.string().optional(),
  nsfw: z.boolean().optional()
});


// List comments (top-level submissions with replies)
const listComments = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const comments = await getComments(challengeId);
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await getReplies(comment.$id);
        return { ...comment, replies };
      })
    );
    res.json(commentsWithReplies);
  } catch (error) {
    console.error('Error in listComments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Add comment/submission/reply
const addComment = [writeLimiter, validate(createSchema), async (req, res) => {
  try {
    const { challengeId, parentCommentId } = req.body;

    // Clean body to avoid unknown attributes
    const { mediaType, ...cleanBody } = req.body;

    // Validate parent if reply
    let receiverId;
    if (parentCommentId) {
      const parent = await getCommentById(parentCommentId);
      if (!parent) return res.status(400).json({ error: 'Parent comment not found' });
      receiverId = parent.userId;
    } else {
      if (!req.body.mediaUrl) return res.status(400).json({ error: 'Submissions must have media' });
      const challenge = await getChallengeById(challengeId);
      if (!challenge) return res.status(400).json({ error: 'Challenge not found' });
      receiverId = challenge.creatorId;
    }

    const data = {
      ...cleanBody, // <-- no mediaType here
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    const newComment = await createComment(data);

    if (parentCommentId) {
      await fireNotification('reply', req.user.id, 'comment', newComment.$id, receiverId);
    } else {
      await fireNotification('new_submission', req.user.id, 'challenge', challengeId, receiverId);
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
}];


// Delete comment
const removeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await deleteComment(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in removeComment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = { listComments, addComment, removeComment, createSchema };
