// // const {
// //   getUserSubmissions,
// //   getUserLikedPosts,
// //   getUserCommentedPosts,
// //   getUserProfileDetails,
// //   getUserById,
// //   getUserByEmail,
// //   updateUserProfile,
// //   createFollow,
// //   deleteFollow,
// //   getFollowDoc,
// //   isFollowing,
// //   createFollowRequest,
// //   getPendingFollowRequest,
// //   updateFollowRequestStatus,
// //   getIncomingFollowRequests,
// //   getFollowRequestById,
// //   getFollowers,
// //   getFollowing,
// //   createNotification,
// //   createBlock,
// //   deleteBlock,
// //   updateFollowDoc,
// //   isBlocked,
// //   setAccountPrivacy,
// //   listPendingRequestsForTarget,
// // } = require("../services/appwrite.service");

// // // Get user submissions
// // const getSubmissions = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const submissions = await getUserSubmissions(userId);
// //     res.status(200).json(submissions);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch submissions", details: error.message });
// //   }
// // };

// // // Get user liked posts
// // const getLikedPosts = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const likedPosts = await getUserLikedPosts(userId);
// //     res.status(200).json(likedPosts);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch liked posts", details: error.message });
// //   }
// // };

// // // Get user commented posts
// // const getCommentedPosts = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const commentedPosts = await getUserCommentedPosts(userId);
// //     res.status(200).json(commentedPosts);
// //   } catch (error) {
// //     res.status(500).json({
// //       error: "Failed to fetch commented posts",
// //       details: error.message,
// //     });
// //   }
// // };

// // // Get complete user profile details
// // const getProfileDetails = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const profileDetails = await getUserProfileDetails(userId);
// //     res.status(200).json(profileDetails);
// //   } catch (error) {
// //     res.status(500).json({
// //       error: "Failed to fetch profile details",
// //       details: error.message,
// //     });
// //   }
// // };

// // // Get user details by ID (respects privacy)
// // const getUserDetails = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const viewerId = req.user.id;

// //     const user = await getUserById(userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     if (user.private === true && userId !== viewerId) {
// //       const following = await isFollowing(viewerId, userId);
// //       if (!following) {
// //         return res.status(200).json({
// //           id: user.$id,
// //           username: user.username,
// //           bio: user.bio,
// //           private: true,
// //           message: "This account is private",
// //         });
// //       }
// //     }

// //     const userDetails = {
// //       id: user.$id,
// //       username: user.username,
// //       email: user.email,
// //       bio: user.bio,
// //       private: !!user.private,
// //       createdAt: user.$createdAt,
// //     };

// //     res.status(200).json(userDetails);
// //   } catch (error) {
// //     console.error("getUserDetails error:", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch user details", details: error.message });
// //   }
// // };

// // // Update profile (username/bio)
// // const updateProfile = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { username, bio } = req.body;

// //     if (!username && !bio) {
// //       return res.status(400).json({
// //         error: "At least one field (username or bio) must be provided",
// //       });
// //     }

// //     if (username) {
// //       const existingUser = await getUserByEmail(req.user.email);
// //       if (
// //         existingUser &&
// //         existingUser.$id !== userId &&
// //         existingUser.username === username
// //       ) {
// //         return res.status(400).json({ error: "Username is already taken" });
// //       }
// //     }

// //     const updatedProfile = await updateUserProfile(userId, { username, bio });
// //     res.status(200).json(updatedProfile);
// //   } catch (error) {
// //     console.error("updateProfile error:", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to update profile", details: error.message });
// //   }
// // };

// // // Toggle privacy (private/public)
// // const togglePrivacyController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { private: makePrivate, autoAcceptPending } = req.body;

// //     if (typeof makePrivate !== "boolean") {
// //       return res
// //         .status(400)
// //         .json({ error: '"private" boolean is required in body' });
// //     }

// //     const user = await getUserById(userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     const wasPrivate = !!user.private;
// //     const updated = await setAccountPrivacy(userId, makePrivate);

// //     // If switching from private -> public and caller wants to auto-accept all pending requests,
// //     // create follows for all pending and mark them accepted.
// //     if (wasPrivate && makePrivate === false && autoAcceptPending === true) {
// //       const pendings = await listPendingRequestsForTarget(userId);
// //       for (const reqDoc of pendings) {
// //         const followerId = reqDoc.requesterId;
// //         const already = await isFollowing(followerId, userId);
// //         if (!already) {
// //           await createFollow({ followerId, followingId: userId });
// //         }
// //         await updateFollowRequestStatus(reqDoc.$id, "accepted");
// //         await createNotification({
// //           userId: followerId,
// //           type: "follow_request_accepted",
// //           actorId: userId,
// //           targetType: "user",
// //           targetId: userId,
// //           read: false,
// //           createdAt: new Date().toISOString(),
// //         });
// //       }
// //     }

// //     res.status(200).json({
// //       message: "Privacy updated",
// //       private: updated.private === true,
// //     });
// //   } catch (error) {
// //     console.error("togglePrivacyController error:", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to update privacy", details: error.message });
// //   }
// // };

// // // Follow user (creates request if target is private)
// // const followUser = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { targetId } = req.body;

// //     if (!targetId) return res.status(400).json({ error: "targetId required" });
// //     if (userId === targetId)
// //       return res.status(400).json({ error: "Cannot follow yourself" });

// //     const targetUser = await getUserById(targetId);
// //     if (!targetUser) return res.status(404).json({ error: "User not found" });

// //     const alreadyFollowing = await getFollowDoc(userId, targetId);
// //     if (alreadyFollowing)
// //       return res.status(400).json({ error: "Already following or requested" });

// //     if (targetUser.private) {
// //       // create follow request
// //       const existingReq = await getPendingFollowRequest(userId, targetId);
// //       if (existingReq)
// //         return res.status(400).json({ error: "Request already pending" });

// //       await createFollow({
// //         followerId: userId,
// //         followingId: targetId,
// //         requested: true,
// //       });
// //       const reqDoc = await createFollowRequest({
// //         requesterId: userId,
// //         targetId,
// //       });

// //       await createNotification({
// //         userId: targetId,
// //         type: "follow_request",
// //         actorId: userId,
// //         targetType: "user",
// //         targetId,
// //         read: false,
// //         createdAt: new Date().toISOString(),
// //       });

// //       return res
// //         .status(200)
// //         .json({ message: "Follow request sent", request: reqDoc });
// //     }

// //     // Public account → direct follow
// //     const followDoc = await createFollow({
// //       followerId: userId,
// //       followingId: targetId,
// //     });
// //     await createNotification({
// //       userId: targetId,
// //       type: "follow",
// //       actorId: userId,
// //       targetType: "user",
// //       targetId,
// //       read: false,
// //       createdAt: new Date().toISOString(),
// //     });

// //     res
// //       .status(200)
// //       .json({ message: "Followed successfully", follow: followDoc });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to follow", details: err.message });
// //   }
// // };

// // const unfollowUser = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { targetId } = req.body;
// //     await deleteFollow(userId, targetId);
// //     res.status(200).json({ message: "Unfollowed successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to unfollow", details: err.message });
// //   }
// // };

// // // Accept / reject follow request
// // const handleFollowRequest = async (req, res) => {
// //   try {
// //     const userId = req.user.id; // request target (account owner)
// //     const { requestId, action } = req.body; // 'accept' | 'reject'

// //     if (!requestId || !["accept", "reject"].includes(action)) {
// //       return res.status(400).json({ error: "Invalid payload" });
// //     }

// //     const request = await getFollowRequestById(requestId);
// //     if (!request) return res.status(404).json({ error: "Request not found" });
// //     if (request.targetId !== userId)
// //       return res.status(403).json({ error: "Not authorized" });
// //     if (request.status !== "pending")
// //       return res.status(400).json({ error: "Request is not pending" });

// //     if (action === "accept") {
// //       const already = await isFollowing(request.requesterId, userId);
// //       if (!already) {
// //         await createFollow({
// //           followerId: request.requesterId,
// //           followingId: userId,
// //         });
// //       }
// //       await updateFollowRequestStatus(requestId, "accepted");
// //       await createNotification({
// //         userId: request.requesterId,
// //         type: "follow_request_accepted",
// //         actorId: userId,
// //         targetType: "user",
// //         targetId: userId,
// //         read: false,
// //         createdAt: new Date().toISOString(),
// //       });
// //       return res.status(200).json({ message: "Accepted" });
// //     } else {
// //       await updateFollowRequestStatus(requestId, "rejected");
// //       return res.status(200).json({ message: "Rejected" });
// //     }
// //   } catch (error) {
// //     console.error("handleFollowRequest error", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to handle request", details: error.message });
// //   }
// // };

// // // Incoming pending follow requests for the owner
// // const getIncomingFollowRequestsController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const data = await getIncomingFollowRequests(userId);
// //     res.status(200).json(data);
// //   } catch (err) {
// //     console.error("getIncomingFollowRequestsController error", err);
// //     res.status(500).json({ error: "Failed to fetch" });
// //   }
// // };

// // // Followers / Following
// // const getFollowersController = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const followers = await getFollowers(userId);
// //     const expanded = await Promise.all(
// //       followers.map(async (f) => {
// //         const u = await getUserById(f.followerId);
// //         return { followDocId: f.$id, user: u };
// //       })
// //     );
// //     res.status(200).json(expanded);
// //   } catch (error) {
// //     console.error("getFollowersController error", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch followers", details: error.message });
// //   }
// // };

// // const getFollowingController = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const following = await getFollowing(userId);
// //     const expanded = await Promise.all(
// //       following.map(async (f) => {
// //         const u = await getUserById(f.followingId);
// //         return { followDocId: f.$id, user: u };
// //       })
// //     );
// //     res.status(200).json(expanded);
// //   } catch (error) {
// //     console.error("getFollowingController error", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch following", details: error.message });
// //   }
// // };

// // // Block / Unblock
// // const blockUserController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { targetId } = req.body;
// //     if (!targetId) return res.status(400).json({ error: "targetId required" });

// //     await deleteFollow(userId, targetId);
// //     await deleteFollow(targetId, userId);
// //     await createBlock({ blockerId: userId, blockedId: targetId });

// //     res.status(200).json({ message: "User blocked" });
// //   } catch (error) {
// //     console.error("blockUserController error", error);
// //     res.status(500).json({ error: "Failed to block", details: error.message });
// //   }
// // };

// // const unblockUserController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { targetId } = req.body;
// //     if (!targetId) return res.status(400).json({ error: "targetId required" });
// //     await deleteBlock(userId, targetId);
// //     res.status(200).json({ message: "User unblocked" });
// //   } catch (error) {
// //     console.error("unblockUserController error", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to unblock", details: error.message });
// //   }
// // };

// // // login controller
// // const loginController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     await setLoginStatus(userId, true);
// //     res.status(200).json({ message: "Logged in successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: "Login failed", details: err.message });
// //   }
// // };

// // // logout controller
// // const logoutController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     await setLoginStatus(userId, false);
// //     res.status(200).json({ message: "Logged out successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: "Logout failed", details: err.message });
// //   }
// // };

// // const acceptFollow = async (req, res) => {
// //   try {
// //     const { requestId } = req.body;
// //     const requestDoc = await getFollowRequestById(requestId);
// //     if (!requestDoc)
// //       return res.status(404).json({ error: "Request not found" });

// //     if (requestDoc.targetId !== req.user.id)
// //       return res.status(403).json({ error: "Not authorized" });

// //     await updateFollowRequestStatus(requestId, "accepted");

// //     // update follow doc (requested -> false)
// //     const followDoc = await getFollowDoc(requestDoc.requesterId, req.user.id);
// //     if (followDoc) {
// //       await updateFollowDoc(followDoc.$id, { requested: false });
// //     }

// //     await createNotification({
// //       userId: requestDoc.requesterId,
// //       type: "follow_request_accepted",
// //       actorId: req.user.id,
// //       targetType: "user",
// //       targetId: req.user.id,
// //       read: false,
// //       createdAt: new Date().toISOString(),
// //     });

// //     res.status(200).json({ message: "Follow request accepted" });
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to accept request", details: err.message });
// //   }
// // };

// // // Reject follow request
// // const rejectFollow = async (req, res) => {
// //   try {
// //     const { requestId } = req.body;
// //     const requestDoc = await getFollowRequestById(requestId);
// //     if (!requestDoc)
// //       return res.status(404).json({ error: "Request not found" });

// //     if (requestDoc.targetId !== req.user.id)
// //       return res.status(403).json({ error: "Not authorized" });

// //     await updateFollowRequestStatus(requestId, "rejected");

// //     // remove temp follow doc
// //     await deleteFollow(requestDoc.requesterId, req.user.id);

// //     res.status(200).json({ message: "Follow request rejected" });
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to reject request", details: err.message });
// //   }
// // };

// // const getFollowStatusController = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { targetId } = req.params;

// //     if (userId === targetId) {
// //       return res
// //         .status(400)
// //         .json({ error: "Cannot check follow status for self" });
// //     }

// //     const followDoc = await getFollowDoc(userId, targetId);
// //     const isUserBlocked = await isBlocked(userId, targetId); // Rename variable to avoid conflict
// //     const pendingRequest = await getPendingFollowRequest(userId, targetId);

// //     res.status(200).json({
// //       isFollowing: !!followDoc && !followDoc.requested,
// //       isRequested: !!followDoc && followDoc.requested,
// //       isBlocked: !!isUserBlocked, // Use renamed variable
// //       pendingRequest: !!pendingRequest,
// //     });
// //   } catch (error) {
// //     console.error("getFollowStatusController error:", error);
// //     res
// //       .status(500)
// //       .json({ error: "Failed to fetch follow status", details: error.message });
// //   }
// // };

// // module.exports = {
// //   getSubmissions,
// //   getLikedPosts,
// //   getCommentedPosts,
// //   getProfileDetails,
// //   getUserDetails,
// //   updateProfile,
// //   togglePrivacyController,
// //   loginController,
// //   followUser,
// //   unfollowUser,
// //   rejectFollow,
// //   acceptFollow,
// //   handleFollowRequest,
// //   getIncomingFollowRequestsController,
// //   getFollowersController,
// //   getFollowingController,
// //   blockUserController,
// //   unblockUserController,
// //   logoutController,
// //   getFollowStatusController,
// // };


// const {
//   getUserSubmissions,
//   getUserLikedPosts,
//   getUserCommentedPosts,
//   getUserProfileDetails,
//   getUserById,
//   getUserByEmail,
//   updateUserProfile,
//   createFollow,
//   deleteFollow,
//   getFollowDoc,
//   isFollowing,
//   createFollowRequest,
//   getPendingFollowRequest,
//   updateFollowRequestStatus,
//   getIncomingFollowRequests,
//   getFollowRequestById,
//   getFollowers,
//   getFollowing,
//   createNotification,
//   createBlock,
//   deleteBlock,
//   updateFollowDoc,
//   isBlocked,
//   setAccountPrivacy,
//   listPendingRequestsForTarget,
// } = require("../services/appwrite.service");

// // Get user submissions
// const getSubmissions = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const submissions = await getUserSubmissions(userId);
//     res.status(200).json(submissions);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch submissions", details: error.message });
//   }
// };

// // Get user liked posts
// const getLikedPosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const likedPosts = await getUserLikedPosts(userId);
//     res.status(200).json(likedPosts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch liked posts", details: error.message });
//   }
// };

// // Get user commented posts
// const getCommentedPosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const commentedPosts = await getUserCommentedPosts(userId);
//     res.status(200).json(commentedPosts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         error: "Failed to fetch commented posts",
//         details: error.message,
//       });
//   }
// };

// // Get complete user profile details (for owner only)
// const getProfileDetails = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const profileDetails = await getUserProfileDetails(userId);
//     res.status(200).json(profileDetails);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         error: "Failed to fetch profile details",
//         details: error.message,
//       });
//   }
// };

// // Get user details by ID (respects privacy, includes submissions for followers)
// const getUserDetails = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const viewerId = req.user.id;

//     const user = await getUserById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const baseUserDetails = {
//       id: user.$id,
//       username: user.username,
//       email: user.email,
//       bio: user.bio,
//       private: !!user.private,
//       createdAt: user.$createdAt,
//     };

//     // If viewer is the owner, return full profile details
//     if (userId === viewerId) {
//       const profileDetails = await getUserProfileDetails(userId);
//       return res.status(200).json(profileDetails);
//     }

//     // If profile is private and viewer is not following, return limited details
//     if (user.private === true) {
//       const following = await isFollowing(viewerId, userId);
//       if (!following) {
//         return res.status(200).json({
//           ...baseUserDetails,
//           message: "This account is private",
//         });
//       }
//     }

//     // Viewer is following or profile is public, include submissions
//     const submissions = await getUserSubmissions(userId);
//     res.status(200).json({
//       ...baseUserDetails,
//       submissions,
//     });
//   } catch (error) {
//     console.error("getUserDetails error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch user details", details: error.message });
//   }
// };

// // Update profile (username/bio)
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { username, bio } = req.body;

//     if (!username && !bio) {
//       return res
//         .status(400)
//         .json({
//           error: "At least one field (username or bio) must be provided",
//         });
//     }

//     if (username) {
//       const existingUser = await getUserByEmail(req.user.email);
//       if (
//         existingUser &&
//         existingUser.$id !== userId &&
//         existingUser.username === username
//       ) {
//         return res.status(400).json({ error: "Username is already taken" });
//       }
//     }

//     const updatedProfile = await updateUserProfile(userId, { username, bio });
//     res.status(200).json(updatedProfile);
//   } catch (error) {
//     console.error("updateProfile error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to update profile", details: error.message });
//   }
// };

// // Toggle privacy (private/public)
// const togglePrivacyController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { private: makePrivate, autoAcceptPending } = req.body;

//     if (typeof makePrivate !== "boolean") {
//       return res
//         .status(400)
//         .json({ error: '"private" boolean is required in body' });
//     }

//     const user = await getUserById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const wasPrivate = !!user.private;
//     const updated = await setAccountPrivacy(userId, makePrivate);

//     // If switching from private -> public and caller wants to auto-accept all pending requests
//     if (wasPrivate && makePrivate === false && autoAcceptPending === true) {
//       const pendings = await listPendingRequestsForTarget(userId);
//       for (const reqDoc of pendings) {
//         const followerId = reqDoc.requesterId;
//         const already = await isFollowing(followerId, userId);
//         if (!already) {
//           await createFollow({ followerId, followingId: userId });
//         }
//         await updateFollowRequestStatus(reqDoc.$id, "accepted");
//         await createNotification({
//           userId: followerId,
//           type: "follow_request_accepted",
//           actorId: userId,
//           targetType: "user",
//           targetId: userId,
//           read: false,
//           createdAt: new Date().toISOString(),
//         });
//       }
//     }

//     res.status(200).json({
//       message: "Privacy updated",
//       private: updated.private === true,
//     });
//   } catch (error) {
//     console.error("togglePrivacyController error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to update privacy", details: error.message });
//   }
// };

// // Follow user (creates request if target is private)
// const followUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;

//     if (!targetId) return res.status(400).json({ error: "targetId required" });
//     if (userId === targetId)
//       return res.status(400).json({ error: "Cannot follow yourself" });

//     const targetUser = await getUserById(targetId);
//     if (!targetUser) return res.status(404).json({ error: "User not found" });

//     const alreadyFollowing = await getFollowDoc(userId, targetId);
//     if (alreadyFollowing)
//       return res.status(400).json({ error: "Already following or requested" });

//     if (targetUser.private) {
//       // create follow request
//       const existingReq = await getPendingFollowRequest(userId, targetId);
//       if (existingReq)
//         return res.status(400).json({ error: "Request already pending" });

//       await createFollow({ followerId: userId, followingId: targetId, requested: true });
//       const reqDoc = await createFollowRequest({ requesterId: userId, targetId });

//       await createNotification({
//         userId: targetId,
//         type: "follow_request",
//         actorId: userId,
//         targetType: "user",
//         targetId,
//         read: false,
//         createdAt: new Date().toISOString(),
//       });

//       return res.status(200).json({ message: "Follow request sent", request: reqDoc });
//     }

//     // Public account → direct follow
//     const followDoc = await createFollow({ followerId: userId, followingId: targetId });
//     await createNotification({
//       userId: targetId,
//       type: "follow",
//       actorId: userId,
//       targetType: "user",
//       targetId,
//       read: false,
//       createdAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "Followed successfully", follow: followDoc });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to follow", details: err.message });
//   }
// };

// const unfollowUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     await deleteFollow(userId, targetId);
//     res.status(200).json({ message: "Unfollowed successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to unfollow", details: err.message });
//   }
// };

// // Accept / reject follow request
// const handleFollowRequest = async (req, res) => {
//   try {
//     const userId = req.user.id; // request target (account owner)
//     const { requestId, action } = req.body; // 'accept' | 'reject'

//     if (!requestId || !["accept", "reject"].includes(action)) {
//       return res.status(400).json({ error: "Invalid payload" });
//     }

//     const request = await getFollowRequestById(requestId);
//     if (!request) return res.status(404).json({ error: "Request not found" });
//     if (request.targetId !== userId)
//       return res.status(403).json({ error: "Not authorized" });
//     if (request.status !== "pending")
//       return res.status(400).json({ error: "Request is not pending" });

//     if (action === "accept") {
//       const already = await isFollowing(request.requesterId, userId);
//       if (!already) {
//         await createFollow({
//           followerId: request.requesterId,
//           followingId: userId,
//         });
//       }
//       await updateFollowRequestStatus(requestId, "accepted");
//       await createNotification({
//         userId: request.requesterId,
//         type: "follow_request_accepted",
//         actorId: userId,
//         targetType: "user",
//         targetId: userId,
//         read: false,
//         createdAt: new Date().toISOString(),
//       });
//       return res.status(200).json({ message: "Accepted" });
//     } else {
//       await updateFollowRequestStatus(requestId, "rejected");
//       return res.status(200).json({ message: "Rejected" });
//     }
//   } catch (error) {
//     console.error("handleFollowRequest error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to handle request", details: error.message });
//   }
// };

// // Incoming pending follow requests for the owner
// const getIncomingFollowRequestsController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const data = await getIncomingFollowRequests(userId);
//     res.status(200).json(data);
//   } catch (err) {
//     console.error("getIncomingFollowRequestsController error", err);
//     res.status(500).json({ error: "Failed to fetch" });
//   }
// };

// // Followers / Following
// const getFollowersController = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const followers = await getFollowers(userId);
//     const expanded = await Promise.all(
//       followers.map(async (f) => {
//         const u = await getUserById(f.followerId);
//         return { followDocId: f.$id, user: u };
//       })
//     );
//     res.status(200).json(expanded);
//   } catch (error) {
//     console.error("getFollowersController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch followers", details: error.message });
//   }
// };

// const getFollowingController = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const following = await getFollowing(userId);
//     const expanded = await Promise.all(
//       following.map(async (f) => {
//         const u = await getUserById(f.followingId);
//         return { followDocId: f.$id, user: u };
//       })
//     );
//     res.status(200).json(expanded);
//   } catch (error) {
//     console.error("getFollowingController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch following", details: error.message });
//   }
// };

// // Block / Unblock
// const blockUserController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     if (!targetId) return res.status(400).json({ error: "targetId required" });

//     await deleteFollow(userId, targetId);
//     await deleteFollow(targetId, userId);
//     await createBlock({ blockerId: userId, blockedId: targetId });

//     res.status(200).json({ message: "User blocked" });
//   } catch (error) {
//     console.error("blockUserController error", error);
//     res.status(500).json({ error: "Failed to block", details: error.message });
//   }
// };

// const unblockUserController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     if (!targetId) return res.status(400).json({ error: "targetId required" });
//     await deleteBlock(userId, targetId);
//     res.status(200).json({ message: "User unblocked" });
//   } catch (error) {
//     console.error("unblockUserController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to unblock", details: error.message });
//   }
// };

// // Login controller
// const loginController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await setLoginStatus(userId, true);
//     res.status(200).json({ message: "Logged in successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Login failed", details: err.message });
//   }
// };

// // Logout controller
// const logoutController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await setLoginStatus(userId, false);
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Logout failed", details: err.message });
//   }
// };

// const acceptFollow = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const requestDoc = await getFollowRequestById(requestId);
//     if (!requestDoc) return res.status(404).json({ error: "Request not found" });

//     if (requestDoc.targetId !== req.user.id)
//       return res.status(403).json({ error: "Not authorized" });

//     await updateFollowRequestStatus(requestId, "accepted");

//     // update follow doc (requested -> false)
//     const followDoc = await getFollowDoc(requestDoc.requesterId, req.user.id);
//     if (followDoc) {
//       await updateFollowDoc(followDoc.$id, { requested: false });
//     }

//     await createNotification({
//       userId: requestDoc.requesterId,
//       type: "follow_request_accepted",
//       actorId: req.user.id,
//       targetType: "user",
//       targetId: req.user.id,
//       read: false,
//       createdAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "Follow request accepted" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to accept request", details: err.message });
//   }
// };

// // Reject follow request
// const rejectFollow = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const requestDoc = await getFollowRequestById(requestId);
//     if (!requestDoc) return res.status(404).json({ error: "Request not found" });

//     if (requestDoc.targetId !== req.user.id)
//       return res.status(403).json({ error: "Not authorized" });

//     await updateFollowRequestStatus(requestId, "rejected");

//     // remove temp follow doc
//     await deleteFollow(requestDoc.requesterId, req.user.id);

//     res.status(200).json({ message: "Follow request rejected" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to reject request", details: err.message });
//   }
// };

// const getFollowStatusController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.params;

//     if (userId === targetId) {
//       return res.status(400).json({ error: "Cannot check follow status for self" });
//     }

//     const followDoc = await getFollowDoc(userId, targetId);
//     const isUserBlocked = await isBlocked(userId, targetId);
//     const pendingRequest = await getPendingFollowRequest(userId, targetId);

//     res.status(200).json({
//       isFollowing: !!followDoc && !followDoc.requested,
//       isRequested: !!followDoc && followDoc.requested,
//       isBlocked: !!isUserBlocked,
//       pendingRequest: !!pendingRequest,
//     });
//   } catch (error) {
//     console.error("getFollowStatusController error:", error);
//     res.status(500).json({ error: "Failed to fetch follow status", details: error.message });
//   }
// };

// module.exports = {
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
//   getProfileDetails,
//   getUserDetails,
//   updateProfile,
//   togglePrivacyController,
//   loginController,
//   followUser,
//   unfollowUser,
//   rejectFollow,
//   acceptFollow,
//   handleFollowRequest,
//   getIncomingFollowRequestsController,
//   getFollowersController,
//   getFollowingController,
//   blockUserController,
//   unblockUserController,
//   logoutController,
//   getFollowStatusController,
// };




// const {
//   getUserSubmissions,
//   getUserLikedPosts,
//   getUserCommentedPosts,
//   getUserProfileDetails,
//   getUserById,
//   getUserByEmail,
//   updateUserProfile,
//   createFollow,
//   deleteFollow,
//   getFollowDoc,
//   isFollowing,
//   createFollowRequest,
//   getPendingFollowRequest,
//   updateFollowRequestStatus,
//   getIncomingFollowRequests,
//   getFollowRequestById,
//   getFollowers,
//   getFollowing,
//   createNotification,
//   createBlock,
//   deleteBlock,
//   updateFollowDoc,
//   isBlocked,
//   setAccountPrivacy,
//   listPendingRequestsForTarget,
// } = require("../services/appwrite.service");

// // Get user submissions
// const getSubmissions = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const submissions = await getUserSubmissions(userId);
//     res.status(200).json(submissions);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch submissions", details: error.message });
//   }
// };

// // Get user liked posts
// const getLikedPosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const likedPosts = await getUserLikedPosts(userId);
//     res.status(200).json(likedPosts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch liked posts", details: error.message });
//   }
// };

// // Get user commented posts
// const getCommentedPosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const commentedPosts = await getUserCommentedPosts(userId);
//     res.status(200).json(commentedPosts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         error: "Failed to fetch commented posts",
//         details: error.message,
//       });
//   }
// };

// // Get complete user profile details (for owner)
// const getProfileDetails = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const profileDetails = await getUserProfileDetails(userId);
//     res.status(200).json(profileDetails);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         error: "Failed to fetch profile details",
//         details: error.message,
//       });
//   }
// };

// // Get user details by ID (respects privacy, includes submissions for authorized viewers)
// const getUserDetails = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const viewerId = req.user.id;

//     const user = await getUserById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const userDetails = {
//       id: user.$id,
//       username: user.username,
//       email: user.email,
//       bio: user.bio,
//       private: !!user.private,
//       createdAt: user.$createdAt,
//       submissions: [],
//     };

//     // Check if viewer is authorized to see submissions (owner, public account, or following private account)
//     const isAuthorized =
//       userId === viewerId ||
//       !user.private ||
//       (user.private && (await isFollowing(viewerId, userId)));

//     if (!isAuthorized) {
//       return res.status(200).json({
//         id: user.$id,
//         username: user.username,
//         bio: user.bio,
//         private: true,
//         message: "This account is private",
//       });
//     }

//     // Fetch submissions if authorized
//     userDetails.submissions = await getUserSubmissions(userId);

//     res.status(200).json(userDetails);
//   } catch (error) {
//     console.error("getUserDetails error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch user details", details: error.message });
//   }
// };

// // Update profile (username/bio)
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { username, bio } = req.body;

//     if (!username && !bio) {
//       return res
//         .status(400)
//         .json({
//           error: "At least one field (username or bio) must be provided",
//         });
//     }

//     if (username) {
//       const existingUser = await getUserByEmail(req.user.email);
//       if (
//         existingUser &&
//         existingUser.$id !== userId &&
//         existingUser.username === username
//       ) {
//         return res.status(400).json({ error: "Username is already taken" });
//       }
//     }

//     const updatedProfile = await updateUserProfile(userId, { username, bio });
//     res.status(200).json(updatedProfile);
//   } catch (error) {
//     console.error("updateProfile error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to update profile", details: error.message });
//   }
// };

// // Toggle privacy (private/public)
// const togglePrivacyController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { private: makePrivate, autoAcceptPending } = req.body;

//     if (typeof makePrivate !== "boolean") {
//       return res
//         .status(400)
//         .json({ error: '"private" boolean is required in body' });
//     }

//     const user = await getUserById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const wasPrivate = !!user.private;
//     const updated = await setAccountPrivacy(userId, makePrivate);

//     // If switching from private -> public and caller wants to auto-accept all pending requests
//     if (wasPrivate && makePrivate === false && autoAcceptPending === true) {
//       const pendings = await listPendingRequestsForTarget(userId);
//       for (const reqDoc of pendings) {
//         const followerId = reqDoc.requesterId;
//         const already = await isFollowing(followerId, userId);
//         if (!already) {
//           await createFollow({ followerId, followingId: userId });
//         }
//         await updateFollowRequestStatus(reqDoc.$id, "accepted");
//         await createNotification({
//           userId: followerId,
//           type: "follow_request_accepted",
//           actorId: userId,
//           targetType: "user",
//           targetId: userId,
//           read: false,
//           createdAt: new Date().toISOString(),
//         });
//       }
//     }

//     res.status(200).json({
//       message: "Privacy updated",
//       private: updated.private === true,
//     });
//   } catch (error) {
//     console.error("togglePrivacyController error:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to update privacy", details: error.message });
//   }
// };

// // Follow user (creates request if target is private)
// const followUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;

//     if (!targetId) return res.status(400).json({ error: "targetId required" });
//     if (userId === targetId)
//       return res.status(400).json({ error: "Cannot follow yourself" });

//     const targetUser = await getUserById(targetId);
//     if (!targetUser) return res.status(404).json({ error: "User not found" });

//     const alreadyFollowing = await getFollowDoc(userId, targetId);
//     if (alreadyFollowing)
//       return res.status(400).json({ error: "Already following or requested" });

//     if (targetUser.private) {
//       // create follow request
//       const existingReq = await getPendingFollowRequest(userId, targetId);
//       if (existingReq)
//         return res.status(400).json({ error: "Request already pending" });

//       await createFollow({ followerId: userId, followingId: targetId, requested: true });
//       const reqDoc = await createFollowRequest({ requesterId: userId, targetId });

//       await createNotification({
//         userId: targetId,
//         type: "follow_request",
//         actorId: userId,
//         targetType: "user",
//         targetId,
//         read: false,
//         createdAt: new Date().toISOString(),
//       });

//       return res.status(200).json({ message: "Follow request sent", request: reqDoc });
//     }

//     // Public account → direct follow
//     const followDoc = await createFollow({ followerId: userId, followingId: targetId });
//     await createNotification({
//       userId: targetId,
//       type: "follow",
//       actorId: userId,
//       targetType: "user",
//       targetId,
//       read: false,
//       createdAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "Followed successfully", follow: followDoc });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to follow", details: err.message });
//   }
// };

// const unfollowUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     await deleteFollow(userId, targetId);
//     res.status(200).json({ message: "Unfollowed successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to unfollow", details: err.message });
//   }
// };

// // Accept / reject follow request
// const handleFollowRequest = async (req, res) => {
//   try {
//     const userId = req.user.id; // request target (account owner)
//     const { requestId, action } = req.body; // 'accept' | 'reject'

//     if (!requestId || !["accept", "reject"].includes(action)) {
//       return res.status(400).json({ error: "Invalid payload" });
//     }

//     const request = await getFollowRequestById(requestId);
//     if (!request) return res.status(404).json({ error: "Request not found" });
//     if (request.targetId !== userId)
//       return res.status(403).json({ error: "Not authorized" });
//     if (request.status !== "pending")
//       return res.status(400).json({ error: "Request is not pending" });

//     if (action === "accept") {
//       const already = await isFollowing(request.requesterId, userId);
//       if (!already) {
//         await createFollow({
//           followerId: request.requesterId,
//           followingId: userId,
//         });
//       }
//       await updateFollowRequestStatus(requestId, "accepted");
//       await createNotification({
//         userId: request.requesterId,
//         type: "follow_request_accepted",
//         actorId: userId,
//         targetType: "user",
//         targetId: userId,
//         read: false,
//         createdAt: new Date().toISOString(),
//       });
//       return res.status(200).json({ message: "Accepted" });
//     } else {
//       await updateFollowRequestStatus(requestId, "rejected");
//       return res.status(200).json({ message: "Rejected" });
//     }
//   } catch (error) {
//     console.error("handleFollowRequest error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to handle request", details: error.message });
//   }
// };

// // Incoming pending follow requests for the owner
// const getIncomingFollowRequestsController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const data = await getIncomingFollowRequests(userId);
//     res.status(200).json(data);
//   } catch (err) {
//     console.error("getIncomingFollowRequestsController error", err);
//     res.status(500).json({ error: "Failed to fetch" });
//   }
// };

// // Followers / Following
// const getFollowersController = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const followers = await getFollowers(userId);
//     const expanded = await Promise.all(
//       followers.map(async (f) => {
//         const u = await getUserById(f.followerId);
//         return { followDocId: f.$id, user: u };
//       })
//     );
//     res.status(200).json(expanded);
//   } catch (error) {
//     console.error("getFollowersController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch followers", details: error.message });
//   }
// };

// const getFollowingController = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const following = await getFollowing(userId);
//     const expanded = await Promise.all(
//       following.map(async (f) => {
//         const u = await getUserById(f.followingId);
//         return { followDocId: f.$id, user: u };
//       })
//     );
//     res.status(200).json(expanded);
//   } catch (error) {
//     console.error("getFollowingController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch following", details: error.message });
//   }
// };

// // Block / Unblock
// const blockUserController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     if (!targetId) return res.status(400).json({ error: "targetId required" });

//     await deleteFollow(userId, targetId);
//     await deleteFollow(targetId, userId);
//     await createBlock({ blockerId: userId, blockedId: targetId });

//     res.status(200).json({ message: "User blocked" });
//   } catch (error) {
//     console.error("blockUserController error", error);
//     res.status(500).json({ error: "Failed to block", details: error.message });
//   }
// };

// const unblockUserController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.body;
//     if (!targetId) return res.status(400).json({ error: "targetId required" });
//     await deleteBlock(userId, targetId);
//     res.status(200).json({ message: "User unblocked" });
//   } catch (error) {
//     console.error("unblockUserController error", error);
//     res
//       .status(500)
//       .json({ error: "Failed to unblock", details: error.message });
//   }
// };

// // Login controller
// const loginController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await setLoginStatus(userId, true);
//     res.status(200).json({ message: "Logged in successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Login failed", details: err.message });
//   }
// };

// // Logout controller
// const logoutController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await setLoginStatus(userId, false);
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Logout failed", details: err.message });
//   }
// };

// const acceptFollow = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const requestDoc = await getFollowRequestById(requestId);
//     if (!requestDoc) return res.status(404).json({ error: "Request not found" });

//     if (requestDoc.targetId !== req.user.id)
//       return res.status(403).json({ error: "Not authorized" });

//     await updateFollowRequestStatus(requestId, "accepted");

//     // Update follow doc (requested -> false)
//     const followDoc = await getFollowDoc(requestDoc.requesterId, req.user.id);
//     if (followDoc) {
//       await updateFollowDoc(followDoc.$id, { requested: false });
//     }

//     await createNotification({
//       userId: requestDoc.requesterId,
//       type: "follow_request_accepted",
//       actorId: req.user.id,
//       targetType: "user",
//       targetId: req.user.id,
//       read: false,
//       createdAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "Follow request accepted" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to accept request", details: err.message });
//   }
// };

// // Reject follow request
// const rejectFollow = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const requestDoc = await getFollowRequestById(requestId);
//     if (!requestDoc) return res.status(404).json({ error: "Request not found" });

//     if (requestDoc.targetId !== req.user.id)
//       return res.status(403).json({ error: "Not authorized" });

//     await updateFollowRequestStatus(requestId, "rejected");

//     // Remove temp follow doc
//     await deleteFollow(requestDoc.requesterId, req.user.id);

//     res.status(200).json({ message: "Follow request rejected" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to reject request", details: err.message });
//   }
// };

// const getFollowStatusController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { targetId } = req.params;

//     if (userId === targetId) {
//       return res.status(400).json({ error: "Cannot check follow status for self" });
//     }

//     const followDoc = await getFollowDoc(userId, targetId);
//     const isUserBlocked = await isBlocked(userId, targetId);
//     const pendingRequest = await getPendingFollowRequest(userId, targetId);

//     res.status(200).json({
//       isFollowing: !!followDoc && !followDoc.requested,
//       isRequested: !!followDoc && followDoc.requested,
//       isBlocked: !!isUserBlocked,
//       pendingRequest: !!pendingRequest,
//     });
//   } catch (error) {
//     console.error("getFollowStatusController error:", error);
//     res.status(500).json({ error: "Failed to fetch follow status", details: error.message });
//   }
// };


// const removeFollowerController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { followerId, targetId } = req.body;

//     if (!followerId || !targetId) {
//       return res.status(400).json({ error: "followerId and targetId required" });
//     }
//     if (userId !== targetId) {
//       return res.status(403).json({ error: "Not authorized to remove followers" });
//     }

//     const followDoc = await getFollowDoc(followerId, targetId);
//     if (!followDoc) {
//       return res.status(400).json({ error: "Not a follower" });
//     }

//     await deleteFollow(followerId, targetId);
//     res.status(200).json({ message: "Follower removed successfully" });
//   } catch (error) {
//     console.error("removeFollowerController error:", error);
//     res.status(500).json({ error: "Failed to remove follower", details: error.message });
//   }
// };

// // Cancel follow request
// const cancelFollowRequestController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { requestId } = req.body;

//     if (!requestId) {
//       return res.status(400).json({ error: "requestId required" });
//     }

//     const request = await getFollowRequestById(requestId);
//     if (!request) {
//       return res.status(404).json({ error: "Request not found" });
//     }
//     if (request.requesterId !== userId) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     await updateFollowRequestStatus(requestId, "cancelled");
//     await deleteFollow(userId, request.targetId);

//     res.status(200).json({ message: "Follow request cancelled" });
//   } catch (error) {
//     console.error("cancelFollowRequestController error:", error);
//     res.status(500).json({ error: "Failed to cancel request", details: error.message });
//   }
// };

// module.exports = {
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
//   getProfileDetails,
//   getUserDetails,
//   updateProfile,
//   togglePrivacyController,
//   loginController,
//   followUser,
//   unfollowUser,
//   rejectFollow,
//   acceptFollow,
//   removeFollowerController,
//   handleFollowRequest,
//   getIncomingFollowRequestsController,
//   cancelFollowRequestController,
//   getFollowersController,
//   getFollowingController,
//   blockUserController,
//   unblockUserController,
//   logoutController,
//   getFollowStatusController,
// };


const {
  getUserSubmissions,
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,
  getUserById,
  getUserByEmail,
  updateUserProfile,
  createFollow,
  deleteFollow,
  getFollowDoc,
  isFollowing,
  createFollowRequest,
  getPendingFollowRequest,
  updateFollowRequestStatus,
  getIncomingFollowRequests,
  getOutgoingFollowRequests,
  getFollowRequestById,
  getFollowers,
  getFollowing,
  createNotification,
  createBlock,
  deleteBlock,
  updateFollowDoc,
  isBlocked,
  setAccountPrivacy,
  listPendingRequestsForTarget,
  getBlockedUsers,
  deleteFollowRequest,
} = require("../services/appwrite.service");

// Get user submissions
const getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await getUserSubmissions(userId);
    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch submissions", details: error.message });
  }
};

// Get user liked posts
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const likedPosts = await getUserLikedPosts(userId);
    res.status(200).json(likedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch liked posts", details: error.message });
  }
};

// Get user commented posts
const getCommentedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentedPosts = await getUserCommentedPosts(userId);
    res.status(200).json(commentedPosts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch commented posts",
        details: error.message,
      });
  }
};

// Get complete user profile details (for owner)
const getProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileDetails = await getUserProfileDetails(userId);
    res.status(200).json(profileDetails);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch profile details",
        details: error.message,
      });
  }
};

// Get user details by ID (respects privacy, includes submissions for authorized viewers)
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.id;

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userDetails = {
      id: user.$id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      private: !!user.private,
      createdAt: user.$createdAt,
      submissions: [],
    };

    // Check if viewer is authorized to see submissions (owner, public account, or following private account)
    const isAuthorized =
      userId === viewerId ||
      !user.private ||
      (user.private && (await isFollowing(viewerId, userId)));

    if (!isAuthorized) {
      return res.status(200).json({
        id: user.$id,
        username: user.username,
        bio: user.bio,
        private: true,
        message: "This account is private",
      });
    }

    // Fetch submissions if authorized
    userDetails.submissions = await getUserSubmissions(userId);

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("getUserDetails error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user details", details: error.message });
  }
};

// Update profile (username/bio)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio } = req.body;

    if (!username && !bio) {
      return res
        .status(400)
        .json({
          error: "At least one field (username or bio) must be provided",
        });
    }

    if (username) {
      const existingUser = await getUserByEmail(req.user.email);
      if (
        existingUser &&
        existingUser.$id !== userId &&
        existingUser.username === username
      ) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    const updatedProfile = await updateUserProfile(userId, { username, bio });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("updateProfile error:", error);
    res
      .status(500)
      .json({ error: "Failed to update profile", details: error.message });
  }
};

// Toggle privacy (private/public)
const togglePrivacyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { private: makePrivate, autoAcceptPending } = req.body;

    if (typeof makePrivate !== "boolean") {
      return res
        .status(400)
        .json({ error: '"private" boolean is required in body' });
    }

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const wasPrivate = !!user.private;
    const updated = await setAccountPrivacy(userId, makePrivate);

    // Log the transition for debugging
    console.log(
      `User ${userId} toggling privacy from ${wasPrivate ? "private" : "public"} to ${
        makePrivate ? "private" : "public"
      }. Existing followers will be preserved.`
    );

    // If switching from private -> public and auto-accepting pending requests
    if (wasPrivate && makePrivate === false && autoAcceptPending === true) {
      const pendings = await listPendingRequestsForTarget(userId);
      for (const reqDoc of pendings) {
        const followerId = reqDoc.requesterId;
        const already = await isFollowing(followerId, userId);
        if (!already) {
          await createFollow({ followerId, followingId: userId });
        }
        await updateFollowRequestStatus(reqDoc.$id, "accepted");
        await createNotification({
          userId: followerId,
          type: "follow_request_accepted",
          actorId: userId,
          targetType: "user",
          targetId: userId,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // If switching from public -> private, no action needed as existing followers remain
    if (!wasPrivate && makePrivate) {
      console.log(
        `User ${userId} switched to private. Existing followers unaffected; new followers will require requests.`
      );
    }

    res.status(200).json({
      message: "Privacy updated",
      private: updated.private === true,
    });
  } catch (error) {
    console.error("togglePrivacyController error:", error);
    res
      .status(500)
      .json({ error: "Failed to update privacy", details: error.message });
  }
};

// Follow user (creates request if target is private)
const followUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;

    if (!targetId) return res.status(400).json({ error: "targetId required" });
    if (userId === targetId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    const targetUser = await getUserById(targetId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const alreadyFollowing = await getFollowDoc(userId, targetId);
    if (alreadyFollowing)
      return res.status(400).json({ error: "Already following or requested" });

    if (targetUser.private) {
      // create follow request
      const existingReq = await getPendingFollowRequest(userId, targetId);
      if (existingReq)
        return res.status(400).json({ error: "Request already pending" });

      await createFollow({ followerId: userId, followingId: targetId, requested: true });
      const reqDoc = await createFollowRequest({ requesterId: userId, targetId });

      await createNotification({
        userId: targetId,
        type: "follow_request",
        actorId: userId,
        targetType: "user",
        targetId,
        read: false,
        createdAt: new Date().toISOString(),
      });

      return res.status(200).json({ message: "Follow request sent", request: reqDoc });
    }

    // Public account → direct follow
    const followDoc = await createFollow({ followerId: userId, followingId: targetId });
    await createNotification({
      userId: targetId,
      type: "follow",
      actorId: userId,
      targetType: "user",
      targetId,
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Followed successfully", follow: followDoc });
  } catch (err) {
    res.status(500).json({ error: "Failed to follow", details: err.message });
  }
};

// Remove follower
const removeFollower = async (req, res) => {
  try {
    const userId = req.user.id;
    const { followerId } = req.body;

    if (!followerId) return res.status(400).json({ error: "followerId required" });
    if (userId === followerId)
      return res.status(400).json({ error: "Cannot remove yourself" });

    const followDoc = await getFollowDoc(followerId, userId);
    if (!followDoc) return res.status(404).json({ error: "User is not a follower" });

    await deleteFollow(followerId, userId);
    res.status(200).json({ message: "Follower removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove follower", details: error.message });
  }
};

// Unfollow user
const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    await deleteFollow(userId, targetId);
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to unfollow", details: err.message });
  }
};

// Accept / reject follow request
const handleFollowRequest = async (req, res) => {
  try {
    const userId = req.user.id; // request target (account owner)
    const { requestId, action } = req.body; // 'accept' | 'reject'

    if (!requestId || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const request = await getFollowRequestById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.targetId !== userId)
      return res.status(403).json({ error: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ error: "Request is not pending" });

    if (action === "accept") {
      const followDoc = await getFollowDoc(request.requesterId, userId);
      if (followDoc && followDoc.requested) {
        await updateFollowDoc(followDoc.$id, { requested: false });
      } else {
        await createFollow({ followerId: request.requesterId, followingId: userId });
      }
      await updateFollowRequestStatus(requestId, "accepted");
      await createNotification({
        userId: request.requesterId,
        type: "follow_request_accepted",
        actorId: userId,
        targetType: "user",
        targetId: userId,
        read: false,
        createdAt: new Date().toISOString(),
      });
      return res.status(200).json({ message: "Accepted" });
    } else {
      await updateFollowRequestStatus(requestId, "rejected");
      await deleteFollow(request.requesterId, userId);
      return res.status(200).json({ message: "Rejected" });
    }
  } catch (error) {
    console.error("handleFollowRequest error", error);
    res
      .status(500)
      .json({ error: "Failed to handle request", details: error.message });
  }
};

// Retract follow request
const retractFollowRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.body;

    if (!requestId) return res.status(400).json({ error: "requestId required" });

    const request = await getFollowRequestById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.requesterId !== userId)
      return res.status(403).json({ error: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ error: "Request is not pending" });

    await deleteFollowRequest(requestId);
    await deleteFollow(userId, request.targetId);
    res.status(200).json({ message: "Follow request retracted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retract request", details: error.message });
  }
};

// Incoming pending follow requests for the owner
const getIncomingFollowRequestsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getIncomingFollowRequests(userId);
    res.status(200).json(data);
  } catch (err) {
    console.error("getIncomingFollowRequestsController error", err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};

// Outgoing pending follow requests for the owner
const getOutgoingFollowRequestsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getOutgoingFollowRequests(userId);
    res.status(200).json(data);
  } catch (err) {
    console.error("getOutgoingFollowRequestsController error", err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};

// Followers / Following
const getFollowersController = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await getFollowers(userId);
    const expanded = await Promise.all(
      followers.map(async (f) => {
        const u = await getUserById(f.followerId);
        return { followDocId: f.$id, user: u };
      })
    );
    res.status(200).json(expanded);
  } catch (error) {
    console.error("getFollowersController error", error);
    res
      .status(500)
      .json({ error: "Failed to fetch followers", details: error.message });
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
    console.error("getFollowingController error", error);
    res
      .status(500)
      .json({ error: "Failed to fetch following", details: error.message });
  }
};

// Block / Unblock
const blockUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "targetId required" });

    await deleteFollow(userId, targetId);
    await deleteFollow(targetId, userId);
    await createBlock({ blockerId: userId, blockedId: targetId });

    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    console.error("blockUserController error", error);
    res.status(500).json({ error: "Failed to block", details: error.message });
  }
};

const unblockUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "targetId required" });
    await deleteBlock(userId, targetId);
    res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    console.error("unblockUserController error", error);
    res
      .status(500)
      .json({ error: "Failed to unblock", details: error.message });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const userId = req.user.id;
    await setLoginStatus(userId, true);
    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};

// Logout controller
const logoutController = async (req, res) => {
  try {
    const userId = req.user.id;
    await setLoginStatus(userId, false);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed", details: err.message });
  }
};

const acceptFollow = async (req, res) => {
  try {
    const { requestId } = req.body;
    const requestDoc = await getFollowRequestById(requestId);
    if (!requestDoc) return res.status(404).json({ error: "Request not found" });

    if (requestDoc.targetId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const followDoc = await getFollowDoc(requestDoc.requesterId, req.user.id);
    if (followDoc && followDoc.requested) {
      await updateFollowDoc(followDoc.$id, { requested: false });
    } else {
      await createFollow({ followerId: requestDoc.requesterId, followingId: req.user.id });
    }

    await updateFollowRequestStatus(requestId, "accepted");

    await createNotification({
      userId: requestDoc.requesterId,
      type: "follow_request_accepted",
      actorId: req.user.id,
      targetType: "user",
      targetId: req.user.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Follow request accepted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to accept request", details: err.message });
  }
};

// Reject follow request
const rejectFollow = async (req, res) => {
  try {
    const { requestId } = req.body;
    const requestDoc = await getFollowRequestById(requestId);
    if (!requestDoc) return res.status(404).json({ error: "Request not found" });

    if (requestDoc.targetId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await updateFollowRequestStatus(requestId, "rejected");

    // Remove temp follow doc
    await deleteFollow(requestDoc.requesterId, req.user.id);

    res.status(200).json({ message: "Follow request rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request", details: err.message });
  }
};

const getFollowStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.params;

    if (userId === targetId) {
      return res.status(400).json({ error: "Cannot check follow status for self" });
    }

    const followDoc = await getFollowDoc(userId, targetId);
    const isUserBlocked = await isBlocked(userId, targetId);
    const pendingRequest = await getPendingFollowRequest(userId, targetId);

    res.status(200).json({
      isFollowing: !!followDoc && !followDoc.requested,
      isRequested: !!followDoc && followDoc.requested,
      isBlocked: !!isUserBlocked,
      pendingRequest: !!pendingRequest,
    });
  } catch (error) {
    console.error("getFollowStatusController error:", error);
    res.status(500).json({ error: "Failed to fetch follow status", details: error.message });
  }
};

const getBlockedUsersController = async (req, res) => {
  console.log("get blocked user is called");
  try {
    const userId = req.user.id;
    const blockedUsers = await getBlockedUsers(userId);
    res.status(200).json(blockedUsers);
  } catch (error) {
    console.error("getBlockedUsersController error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch blocked users", details: error.message });
  }
};

module.exports = {
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
  getProfileDetails,
  getUserDetails,
  updateProfile,
  togglePrivacyController,
  loginController,
  followUser,
  unfollowUser,
  removeFollower,
  rejectFollow,
  acceptFollow,
  handleFollowRequest,
  getIncomingFollowRequestsController,
  getOutgoingFollowRequestsController,
  getFollowersController,
  getFollowingController,
  blockUserController,
  unblockUserController,
  logoutController,
  getFollowStatusController,
  retractFollowRequest,
  getBlockedUsersController,
};