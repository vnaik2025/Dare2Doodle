const {
  getUserSubmissions,
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,
} = require('../services/appwrite.service');

// Get user submissions
const getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware

    console.log("user id from authMiddleware",userId)
    const submissions = await getUserSubmissions(userId);

    // Fetch media URLs for submissions
    const submissionsWithMedia = await Promise.all(
      submissions.map(async (submission) => {
        // if (submission.mediaId) {
        //   const mediaUrl = await storage.getFileView(process.env.APPWRITE_SUBMISSION_MEDIA_BUCKET_ID, submission.mediaId);
        //   return { ...submission, mediaUrl };
        // }
        return submission;
      })
    );

    res.status(200).json(submissionsWithMedia);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
  }
};

// Get user liked posts
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const likedPosts = await getUserLikedPosts(userId);
    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liked posts', details: error.message });
  }
};

// Get user commented posts
const getCommentedPosts = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const commentedPosts = await getUserCommentedPosts(userId);
    res.status(200).json(commentedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commented posts', details: error.message });
  }
};

// Get complete user profile details
const getProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const profileDetails = await getUserProfileDetails(userId);
    res.status(200).json(profileDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile details', details: error.message });
  }
};

module.exports = {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
};