const {
  getUserSubmissions,
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,
  getUserById,
} = require('../services/appwrite.service');

// Get user submissions
const getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    console.log("user id from authMiddleware", userId);
    const submissions = await getUserSubmissions(userId);

    // Fetch media URLs for submissions
    const submissionsWithMedia = await Promise.all(
      submissions.map(async (submission) => {
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

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // No need to check authenticatedUserId or role, as any authenticated user can access
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract first and last name from email if name field is not present
    let firstName = '';
    let lastName = '';
    if (user.name) {
      // If name field exists, split it into first and last name
      const nameParts = user.name.trim().split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else {
      // Derive name from email
      const emailName = user.email.split('@')[0];
      const nameParts = emailName.split(/[\._-]/);
      firstName = nameParts[0]
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase()
        : '';
      lastName = nameParts[1]
        ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1).toLowerCase()
        : '';
    }

    // Prepare response with all user fields
    const userDetails = {
      id: user.$id,
      email: user.email,
      firstName,
      lastName,
      ...user, // Include all other fields from the user document
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('getUserDetails error:', error);
    res.status(500).json({ error: 'Failed to fetch user details', details: error.message });
  }
};

module.exports = {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
  getUserDetails,
};