const {
  createLike,
  deleteLike,
  getLikes,
  getUserLike,
} = require("../services/appwrite.service");
const { fireNotification } = require("../utils/notifications.util");
const {
  getChallengeById,
  getCommentById,
} = require("../services/appwrite.service");
const validate = require("../middleware/validation.middleware");
const { writeLimiter } = require("../middleware/rateLimit.middleware");
const z = require("zod");

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
        if (!challenge)
          return res.status(404).json({ error: "Target not found" });
        receiverId = challenge.creatorId;
      } else if (targetType === "comment") {
        const comment = await getCommentById(targetId);
        if (!comment)
          return res.status(404).json({ error: "Target not found" });
        receiverId = comment.userId;
      }

      const data = {
        userId: req.user.id,
        targetType,
        targetId,
        createdAt: new Date().toISOString(),
      };

      const newLike = await createLike(data);

      // Fire notification
      await fireNotification(
        "like",
        req.user.id,
        targetType,
        targetId,
        receiverId
      );

      res.status(201).json(newLike);
    } catch (error) {
      res.status(500).json({ error: "Failed to add like" });
    }
  },
];

// Remove like
const removeLike = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    await deleteLike(req.user.id, targetType, targetId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to remove like" });
  }
};

// Get likes
const getLikeInfo = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    const likes = await getLikes(targetType, targetId);

    let likedByMe = false;
    // if (req.user) {
      const userLike = await getUserLike("68a2ec5300050ad5dd84", targetType, targetId);
      console.log("userlike", userLike);
      likedByMe = !!userLike;
      console.log("userlike", likedByMe);
    // }

    res.json({ count: likes.length, likedByMe });
  } catch (error) {
    console.error("getLikeInfo error:", error); // 👈 add logging
    res.status(500).json({ error: "Failed to get likes" });
  }
};

module.exports = { addLike, removeLike, getLikeInfo };
