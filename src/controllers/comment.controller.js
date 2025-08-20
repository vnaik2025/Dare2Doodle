const multer = require('multer');
const ImageKit = require('imagekit');
const path = require('path');

const {
  getComments,
  getReplies,
  createComment,
  updateCommentService,
  getCommentById,
  deleteComment,
  getChallengeById
} = require('../services/appwrite.service');
const { fireNotification } = require('../utils/notifications.util');
const validate = require('../middleware/validation.middleware');
const { writeLimiter } = require('../middleware/rateLimit.middleware');
const z = require('zod');

// --------- Multer Setup ---------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --------- ImageKit Setup ---------
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --------- Validation Schema ---------
const createSchema = z.object({
  challengeId: z.string(),
  text: z.string().max(1500).optional(),
  parentCommentId: z.string().optional(),
  nsfw: z.boolean().optional(),
});

// --------- List Comments (with replies) ---------
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

// --------- Add Comment / Submission / Reply ---------
const addComment = [
  writeLimiter,
  upload.single('media'), // <-- optional file
  validate(createSchema),
  async (req, res) => {
    try {
      const { challengeId, parentCommentId } = req.body;
      const { file } = req;

      // Clean body
      const { ...cleanBody } = req.body;

      // Validate parent if reply
      let receiverId;
      if (parentCommentId) {
        const parent = await getCommentById(parentCommentId);
        if (!parent) return res.status(400).json({ error: 'Parent comment not found' });
        receiverId = parent.userId;
      } else {
        // Submissions must have media (image/video)
        if (!file && !req.body.mediaUrl) {
          return res.status(400).json({ error: 'Submissions must have media' });
        }
        const challenge = await getChallengeById(challengeId);
        if (!challenge) return res.status(400).json({ error: 'Challenge not found' });
        receiverId = challenge.creatorId;
      }

      // Upload to ImageKit if file is provided
      let mediaUrl = null;
      if (file) {
        console.log('Uploading to ImageKit:', file.originalname);

        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: `comment_${Date.now()}_${file.originalname}`,
          folder: '/submissions',
        });

        console.log('ImageKit upload response:', uploadResponse);

        // Store as "url|fileId" just like challenges
        mediaUrl = `${uploadResponse.url}|${uploadResponse.fileId}`;
      } else if (req.body.mediaUrl) {
        // fallback if mediaUrl already provided (e.g. external link)
        mediaUrl = req.body.mediaUrl;
      }

      const data = {
        ...cleanBody,
        userId: req.user.id,
        createdAt: new Date().toISOString(),
        mediaUrl,
      };

      const newComment = await createComment(data);

      // Notifications
      if (parentCommentId) {
        await fireNotification('reply', req.user.id, 'comment', newComment.$id, receiverId);
      } else {
        await fireNotification('new_submission', req.user.id, 'challenge', challengeId, receiverId);
      }

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error in addComment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
];

// --------- Update Comment ---------
const updateComment = [
  upload.single('media'), // optional new file
  async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await getCommentById(id);
      if (!comment) return res.status(404).json({ error: 'Comment not found' });

      // Authorization
      if (comment.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { file } = req;
      let mediaUrl = comment.mediaUrl; // keep existing if no new file

      // --- If new media is uploaded, delete old and upload new ---
      if (file) {
        // If old media exists and is from ImageKit
        if (comment.mediaUrl && comment.mediaUrl.includes('|')) {
          const oldFileId = comment.mediaUrl.split('|')[1];
          try {
            await imagekit.deleteFile(oldFileId);
            console.log(`Deleted ImageKit file: ${oldFileId} for comment ${id}`);
          } catch (err) {
            console.warn("Failed to delete old ImageKit file:", err.message);
          }
        }

        // Upload new file
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: `comment_${Date.now()}_${file.originalname}`,
          folder: '/submissions',
        });

        mediaUrl = `${uploadResponse.url}|${uploadResponse.fileId}`;
      }

      // Only include fields that exist in the schema
      const updateData = {
        ...req.body,
        mediaUrl,
        // Conditionally include updatedAt only if the attribute exists in the schema
        // ...(comment.$updatedAt !== undefined ? { updatedAt: new Date().toISOString() } : {}),
      };

      // Update in Appwrite
      const updatedComment = await updateCommentService(id, updateData);

      res.json(updatedComment);
    } catch (error) {
      console.error('Error in updateComment:', error);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  }
];

// --------- Delete Comment ---------
const removeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete ImageKit file if it exists
    if (comment.mediaUrl && comment.mediaUrl.includes('|')) {
      const [, fileId] = comment.mediaUrl.split('|');
      try {
        await imagekit.deleteFile(fileId);
        console.log(`Deleted ImageKit file: ${fileId} for comment ${id}`);
      } catch (err) {
        console.warn("Failed to delete ImageKit file:", err.message);
      }
    }

    await deleteComment(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in removeComment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = { listComments, addComment, removeComment, updateComment, createSchema };