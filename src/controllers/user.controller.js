const {
  getUserSubmissions,
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,
  getUserById,
  updateUserProfile,
   createFollow,
  deleteFollow,
  isFollowing,
  createFollowRequest,
  getPendingFollowRequest,
  updateFollowRequestStatus,
  getIncomingFollowRequests,
  getFollowers,
  getFollowing,
  createNotification,
  createBlock,
  deleteBlock,
  isBlocked,
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
    const viewerId = req.user.id; // logged-in user

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If profile is private and viewer is not owner and not following
    if (user.private && userId !== viewerId) {
      const following = await isFollowing(viewerId, userId); // service check
      if (!following) {
        return res.status(200).json({
          id: user.$id,
          username: user.username,
          bio: user.bio,
          private: true,
          message: 'This account is private',
        });
      }
    }

    // Otherwise return full user details
    const userDetails = {
      id: user.$id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      private: user.private ?? false,
      createdAt: user.$createdAt,
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('getUserDetails error:', error);
    res.status(500).json({ error: 'Failed to fetch user details', details: error.message });
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const { username, bio } = req.body;

    // Validate input
    if (!username && !bio) {
      return res.status(400).json({ error: 'At least one field (username or bio) must be provided' });
    }

    // Check if username is taken
    if (username) {
      const existingUser = await getUserByEmail(req.user.email); // Adjust if email isn't the unique field
      if (existingUser && existingUser.$id !== userId && existingUser.username === username) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    const updatedProfile = await updateUserProfile(userId, { username, bio });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};




const followUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: 'targetId required' });
    if (userId === targetId) return res.status(400).json({ error: "Can't follow yourself" });

    // Check block in either direction
    const blockedByTarget = await isBlocked(targetId, userId);
    const blockedByUser = await isBlocked(userId, targetId);
    if (blockedByTarget || blockedByUser) {
      return res.status(403).json({ error: 'Action not allowed (blocked)' });
    }

    // Check target's privacy (private field in user doc)
    const targetUser = await getUserById(targetId);
    const isPrivate = targetUser?.private === true;

    // If private -> create follow request
    if (isPrivate) {
      const existing = await getPendingFollowRequest(userId, targetId);
      if (existing) return res.status(400).json({ error: 'Follow request already pending' });
      const request = await createFollowRequest({ requesterId: userId, targetId });
      // create a notification for target
      await createNotification({
        userId: targetId,
        type: 'follow_request',
        actorId: userId,
        targetType: 'user',
        targetId,
        read: false,
        createdAt: new Date().toISOString(),
      });
      return res.status(200).json({ message: 'Follow request sent', request });
    }

    // public: directly create follow
    const already = await isFollowing(userId, targetId);
    if (already) return res.status(400).json({ error: 'Already following' });

    const follow = await createFollow({ followerId: userId, followingId: targetId });
    // notification
    await createNotification({
      userId: targetId,
      type: 'follow',
      actorId: userId,
      targetType: 'user',
      targetId,
      read: false,
      createdAt: new Date().toISOString(),
    });
    res.status(200).json({ message: 'Followed', follow });
  } catch (error) {
    console.error('followUser error', error);
    res.status(500).json({ error: 'Failed to follow', details: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: 'targetId required' });

    await deleteFollow(userId, targetId);
    res.status(200).json({ message: 'Unfollowed' });
  } catch (error) {
    console.error('unfollowUser error', error);
    res.status(500).json({ error: 'Failed to unfollow', details: error.message });
  }
};

// Accept / reject follow request
const handleFollowRequest = async (req, res) => {
  try {
    const userId = req.user.id; // this is the target who received the request
    const { requestId, action } = req.body; // action = 'accept' | 'reject'
    if (!requestId || !['accept', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid payload' });

    // get request doc
    const { documents } = await databases.listDocuments(DATABASE_ID, process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID, [
      Query.equal("$id", requestId)
    ]);
    const request = documents[0];
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.targetId !== userId) return res.status(403).json({ error: 'Not authorized' });

    if (action === 'accept') {
      // create follow
      await createFollow({ followerId: request.requesterId, followingId: userId });
      await updateFollowRequestStatus(requestId, 'accepted');
      // notify requester
      await createNotification({
        userId: request.requesterId,
        type: 'follow_request_accepted',
        actorId: userId,
        targetType: 'user',
        targetId: userId,
        read: false,
        createdAt: new Date().toISOString(),
      });
      return res.status(200).json({ message: 'Accepted' });
    } else {
      await updateFollowRequestStatus(requestId, 'rejected');
      return res.status(200).json({ message: 'Rejected' });
    }
  } catch (error) {
    console.error('handleFollowRequest error', error);
    res.status(500).json({ error: 'Failed to handle request', details: error.message });
  }
};

// Get followers/following list (optionally expand to user docs)
const getFollowersController = async (req, res) => {
  try {
    const { userId } = req.params; // the profile whose followers we want
    const followers = await getFollowers(userId); // returns doc list with followerId
    // expand to user docs:
    const expanded = await Promise.all(
      followers.map(async (f) => {
        const u = await getUserById(f.followerId);
        return { followDocId: f.$id, user: u };
      })
    );
    res.status(200).json(expanded);
  } catch (error) {
    console.error('getFollowersController error', error);
    res.status(500).json({ error: 'Failed to fetch followers', details: error.message });
  }
};

const getFollowingController = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await getFollowing(userId);
    const expanded = await Promise.all(
      following.map(async (f) => {
        const u = await getUserById(f.followingId);
        return { followDocId: f.$id, user: u };
      })
    );
    res.status(200).json(expanded);
  } catch (error) {
    console.error('getFollowingController error', error);
    res.status(500).json({ error: 'Failed to fetch following', details: error.message });
  }
};

// Block user
const blockUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: 'targetId required' });

    // delete any follows both ways
    await deleteFollow(userId, targetId);
    await deleteFollow(targetId, userId);

    // create block
    await createBlock({ blockerId: userId, blockedId: targetId });
    // optional: create notification? typically not

    res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    console.error('blockUserController error', error);
    res.status(500).json({ error: 'Failed to block', details: error.message });
  }
};

const unblockUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: 'targetId required' });
    await deleteBlock(userId, targetId);
    res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    console.error('unblockUserController error', error);
    res.status(500).json({ error: 'Failed to unblock', details: error.message });
  }
};




module.exports = {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
  getUserDetails,
  updateProfile,
   followUser,
  unfollowUser,
  handleFollowRequest,
  getFollowersController,
  getFollowingController,
  blockUserController,
  unblockUserController,

};