const {
  createLike,
  deleteLike,
  getLikes,
  getUserLike,
  updateCommentService,
} = require("../services/appwrite.service");
const { fireNotification } = require("../utils/notifications.util");
const {
  getChallengeById,
  getCommentById,
} = require("../services/appwrite.service");
const validate = require("../middleware/validation.middleware");
const { writeLimiter } = require("../middleware/rateLimit.middleware");
const z = require("zod");
const jwt = require("jsonwebtoken");

const likeSchema = z.object({
  targetType: z.enum(["challenge", "comment"]),
  targetId: z.string(),
});

// Add like
const addLike = [
  writeLimiter,
  validate(likeSchema),
  async (req, res) => {
    try {
      const { targetType, targetId } = req.body;

      // Check if already liked
      if (await getUserLike(req.user.id, targetType, targetId)) {
        return res.status(400).json({ error: "Already liked" });
      }

      let receiverId;
      if (targetType === "challenge") {
        const challenge = await getChallengeById(targetId);
        if (!challenge) return res.status(404).json({ error: "Target not found" });
        receiverId = challenge.creatorId;
      } else if (targetType === "comment") {
        const comment = await getCommentById(targetId);
        if (!comment) return res.status(404).json({ error: "Target not found" });
        receiverId = comment.userId;

        // Increment likes_count
        const newCount = (comment.likes_count || 0) + 1;
        await updateCommentService(targetId, { likes_count: newCount });
      }

      const data = {
        userId: req.user.id,
        targetType,
        targetId,
        createdAt: new Date().toISOString(),
      };

      const newLike = await createLike(data);

      // Fire notification
      await fireNotification("like", req.user.id, targetType, targetId, receiverId);

      res.status(201).json(newLike);
    } catch (error) {
      console.error("addLike error:", error);
      res.status(500).json({ error: "Failed to add like" });
    }
  },
];

// Remove like
const removeLike = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    if (targetType === "comment") {
      const comment = await getCommentById(targetId);
      if (comment) {
        const newCount = Math.max((comment.likes_count || 0) - 1, 0);
        await updateCommentService(targetId, { likes_count: newCount });
      }
    }

    await deleteLike(req.user.id, targetType, targetId);
    res.status(204).send();
  } catch (error) {
    console.error("removeLike error:", error);
    res.status(500).json({ error: "Failed to remove like" });
  }
};

// Get likes
const getLikeInfo = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    // Fetch all likes for the target
    const likes = await getLikes(targetType, targetId);

    let likedByMe = false;
    let userId = null;

    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        // Verify and decode JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id; // Assuming the JWT payload has an 'id' field
        if (userId) {
          const userLike = await getUserLike(userId, targetType, targetId);
          likedByMe = !!userLike;
        }
      } catch (jwtError) {
        console.warn("JWT verification failed:", jwtError.message);
        // If token is invalid, proceed without setting likedByMe
      }
    }

    res.json({ count: likes.length, likedByMe });
  } catch (error) {
    console.error("getLikeInfo error:", error);
    res.status(500).json({ error: "Failed to get likes" });
  }
};

module.exports = { addLike, removeLike, getLikeInfo };