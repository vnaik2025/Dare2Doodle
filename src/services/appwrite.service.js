// const { databases, storage, ID, Query } = require("../config/appwrite");

// const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
// const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
// const CHALLENGES_COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;
// const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID;
// const LIKES_COLLECTION_ID = process.env.APPWRITE_LIKES_COLLECTION_ID;
// const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;
// const NOTIFICATIONS_COLLECTION_ID =
//   process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID;
// const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID;
// const FOLLOW_COLLECTION_ID = process.env.APPWRITE_FOLLOWS_COLLECTION_ID;
// const CHALLENGE_IMAGES_BUCKET_ID =
//   process.env.APPWRITE_CHALLENGE_IMAGES_BUCKET_ID;

// // Users
// const createUser = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const getUserByEmail = async (email) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     [Query.equal("email", email)]
//   );
//   return documents[0] || null;
// };

// const getUserById = async (userId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       userId
//     );
//   } catch {
//     return null;
//   }
// };

// const updateUser = async (userId, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     userId,
//     data
//   );
// };

// // Challenges
// const getChallenges = async (queries = []) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const getChallengeById = async (challengeId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       CHALLENGES_COLLECTION_ID,
//       challengeId
//     );
//   } catch {
//     return null;
//   }
// };

// const createChallenge = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const updateChallenge = async (challengeId, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     challengeId,
//     data
//   );
// };

// const deleteChallenge = async (challengeId) => {
//   return await databases.deleteDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     challengeId
//   );
// };

// // Comments
// const getComments = async (challengeId, parentCommentId = null) => {
//   if (
//     !challengeId ||
//     typeof challengeId !== "string" ||
//     challengeId.trim() === ""
//   ) {
//     throw new Error("Invalid challengeId");
//   }
//   console.log(
//     "Fetching comments for challengeId:",
//     challengeId,
//     "parentCommentId:",
//     parentCommentId
//   );
//   let queries = [Query.equal("challengeId", challengeId)];
//   if (parentCommentId) {
//     queries.push(Query.equal("parentCommentId", parentCommentId));
//   } else {
//     queries.push(Query.isNull("parentCommentId"));
//   }
//   console.log("Queries:", queries);
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const getReplies = async (challengeId, parentCommentId) => {
//   if (
//     !challengeId ||
//     typeof challengeId !== "string" ||
//     challengeId.trim() === ""
//   ) {
//     throw new Error("Invalid challengeId");
//   }
//   if (
//     !parentCommentId ||
//     typeof parentCommentId !== "string" ||
//     parentCommentId.trim() === ""
//   ) {
//     throw new Error("Invalid parentCommentId");
//   }
//   return getComments(challengeId, parentCommentId); // Pass challengeId
// };

// const getCommentById = async (commentId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       COMMENTS_COLLECTION_ID,
//       commentId
//     );
//   } catch {
//     return null;
//   }
// };

// const createComment = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteComment = async (commentId) => {
//   return await databases.deleteDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     commentId
//   );
// };

// const updateCommentService = async (id, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     id,
//     data
//   );
// };

// // Likes
// const createLike = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteLike = async (userId, targetType, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [
//       Query.equal("userId", userId),
//       Query.equal("targetType", targetType),
//       Query.equal("targetId", targetId),
//     ]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       LIKES_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// const getLikes = async (targetType, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [Query.equal("targetType", targetType), Query.equal("targetId", targetId)]
//   );
//   return documents;
// };

// const getUserLike = async (userId, targetType, targetId) => {
//   console.log("getUserLike params:", { userId, targetType, targetId });
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [
//       Query.equal("userId", userId),
//       Query.equal("targetType", targetType),
//       Query.equal("targetId", targetId),
//     ]
//   );
//   console.log("getUserLike documents:", documents);
//   return documents[0] || null;
// };

// // Bookmarks
// const createBookmark = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteBookmark = async (userId, challengeId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     [Query.equal("userId", userId), Query.equal("challengeId", challengeId)]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       BOOKMARKS_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// const getUserBookmarks = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );
//   return documents;
// };

// // Notifications
// const createNotification = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const getNotifications = async (userId, unreadOnly = false) => {
//   let queries = [Query.equal("userId", userId)];
//   if (unreadOnly) queries.push(Query.equal("read", false));
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const updateNotification = async (notificationId, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     notificationId,
//     data
//   );
// };

// // Reports
// const createReport = async (data) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     REPORTS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const getReports = async (status = "open") => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     REPORTS_COLLECTION_ID,
//     [Query.equal("status", status)]
//   );
//   return documents;
// };

// const updateReport = async (reportId, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     REPORTS_COLLECTION_ID,
//     reportId,
//     data
//   );
// };

// // Storage
// const uploadFile = async (bucketId, filePath, fileName) => {
//   const file = await storage.createFile(
//     bucketId,
//     ID.unique(),
//     filePath,
//     fileName
//   );
//   return storage.getFileView(bucketId, file.$id); // Or getFilePreview for thumbs
// };

// // Submissions (Comments with mediaUrl)
// const getUserSubmissions = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );
//   return documents;
// };

// // Liked Posts
// const getUserLikedPosts = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );

//   const likedPosts = await Promise.all(
//     documents.map(async (like) => {
//       if (like.targetType === "challenge") {
//         const challenge = await getChallengeById(like.targetId);
//         return challenge ? { type: "challenge", data: challenge } : null;
//       } else if (like.targetType === "comment") {
//         const comment = await getCommentById(like.targetId);
//         return comment
//           ? { type: comment.mediaUrl ? "submission" : "comment", data: comment }
//           : null;
//       }
//       return null;
//     })
//   );

//   return likedPosts.filter((post) => post !== null);
// };

// // Commented Posts
// const getUserCommentedPosts = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );

//   const commentedPosts = await Promise.all(
//     documents.map(async (comment) => {
//       const challenge = await getChallengeById(comment.challengeId);
//       return challenge ? { comment, challenge } : null;
//     })
//   );

//   return commentedPosts.filter((post) => post !== null);
// };

// // Profile Details
// const getUserProfileDetails = async (userId) => {
//   try {
//     // Fetch user details
//     const user = await getUserById(userId);
//     if (!user) throw new Error("User not found");

//     // Fetch submissions (comments with mediaUrl)
//     const submissions = await getUserSubmissions(userId);

//     // Fetch liked posts
//     const likedPosts = await getUserLikedPosts(userId);

//     // Fetch commented posts (all comments, including submissions)
//     const commentedPosts = await getUserCommentedPosts(userId);

//     // Fetch bookmarks
//     const bookmarks = await getUserBookmarks(userId);

//     // Fetch notifications (unread only)
//     const notifications = await getNotifications(userId, true);

//     return {
//       user,
//       submissions,
//       likedPosts,
//       commentedPosts,
//       bookmarks,
//       notifications,
//     };
//   } catch (error) {
//     console.error("Error fetching profile details:", error);
//     throw error;
//   }
// };

// // services/appwrite.service.js
// const updateUserProfile = async (userId, data) => {
//   try {
//     // Only allow updating username and bio
//     const updateData = {
//       username: data.username,
//       bio: data.bio,
//     };
//     return await databases.updateDocument(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       userId,
//       updateData
//     );
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw error;
//   }
// };

// const createFollow = async ({ followerId, followingId }) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOWS_COLLECTION_ID,
//     ID.unique(),
//     { followerId, followingId }
//   );
// };

// const deleteFollow = async (followerId, followingId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOWS_COLLECTION_ID,
//     [
//       Query.equal("followerId", followerId),
//       Query.equal("followingId", followingId),
//     ]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       process.env.APPWRITE_FOLLOWS_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// // appwrite.service.js (fix attribute names)
// async function getFollowers(userId) {
//   return databases
//     .listDocuments(DATABASE_ID, process.env.APPWRITE_FOLLOWS_COLLECTION_ID, [
//       Query.equal("followingId", userId), // must match schema
//     ])
//     .then((res) => res.documents);
// }

// async function getFollowing(userId) {
//   return databases
//     .listDocuments(DATABASE_ID, process.env.APPWRITE_FOLLOWS_COLLECTION_ID, [
//       Query.equal("followerId", userId), // must match schema
//     ])
//     .then((res) => res.documents);
// }

// const isFollowing = async (followerId, followingId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOWS_COLLECTION_ID,
//     [
//       Query.equal("followerId", followerId),
//       Query.equal("followingId", followingId),
//     ]
//   );
//   return !!documents[0];
// };

// //
// // FOLLOW REQUESTS
// //
// const createFollowRequest = async ({ requesterId, targetId }) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID,
//     ID.unique(),
//     {
//       requesterId,
//       targetId,
//       status: "pending",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//   );
// };

// const updateFollowRequestStatus = async (requestId, status) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID,
//     requestId,
//     { status, updatedAt: new Date().toISOString() }
//   );
// };

// const getPendingFollowRequest = async (requesterId, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID,
//     [
//       Query.equal("requesterId", requesterId),
//       Query.equal("targetId", targetId),
//       Query.equal("status", "pending"),
//     ]
//   );
//   return documents[0] || null;
// };

// const getIncomingFollowRequests = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID,
//     [Query.equal("targetId", userId), Query.equal("status", "pending")]
//   );
//   return documents;
// };

// //
// // BLOCKS
// //
// const createBlock = async ({ blockerId, blockedId }) => {
//   return await databases.createDocument(
//     DATABASE_ID,
//     process.env.APPWRITE_BLOCKS_COLLECTION_ID,
//     ID.unique(),
//     { blockerId, blockedId, createdAt: new Date().toISOString() }
//   );
// };

// const isBlocked = async (blockerId, blockedId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_BLOCKS_COLLECTION_ID,
//     [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
//   );
//   return !!documents[0];
// };

// const deleteBlock = async (blockerId, blockedId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     process.env.APPWRITE_BLOCKS_COLLECTION_ID,
//     [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       process.env.APPWRITE_BLOCKS_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// const deleteNotification = async (notificationId) => {
//   return await databases.deleteDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     notificationId
//   );
// };

// const cleanupOldNotifications = async (userId) => {
//   try {
//     const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

//     // Fetch notifications older than 2 days for this user
//     const { documents } = await databases.listDocuments(
//       DATABASE_ID,
//       NOTIFICATIONS_COLLECTION_ID,
//       [
//         Query.equal("userId", userId),
//         Query.lessThan("createdAt", twoDaysAgo),
//       ]
//     );

//     if (documents.length > 0) {
//       for (const notif of documents) {
//         await deleteNotification(notif.$id);
//       }
//       console.log(`🧹 Cleaned up ${documents.length} old notifications for user ${userId}`);
//     }
//   } catch (err) {
//     console.error("Failed to cleanup old notifications:", err);
//   }
// };

// module.exports = {
//   // Users
//   createUser,
//   getUserByEmail,
//   getUserById,
//   updateUser,
//   updateUserProfile,
//   // Challenges
//   getChallenges,
//   getChallengeById,
//   createChallenge,
//   updateChallenge,
//   deleteChallenge,
//   // Comments
//   getComments,
//   getReplies,
//   getCommentById,
//   updateCommentService,
//   createComment,
//   deleteComment,
//   // Likes
//   createLike,
//   deleteLike,
//   getLikes,
//   getUserLike,
//   // Bookmarks
//   createBookmark,
//   deleteBookmark,
//   getUserBookmarks,
//   // Notifications
//   createNotification,
//   getNotifications,
//   updateNotification,
//   // Reports
//   createReport,
//   getReports,
//   updateReport,
//   // Storage
//   uploadFile,
//   // Submissions
//   getUserSubmissions,
//   // Profile
//   getUserLikedPosts,
//   getUserCommentedPosts,
//   getUserProfileDetails,

//   createFollow,
//   deleteFollow,
//   getFollowers,
//   getFollowing,
//   isFollowing,
//   createFollowRequest,
//   updateFollowRequestStatus,
//   getPendingFollowRequest,
//   getIncomingFollowRequests,
//   createBlock,
//   isBlocked,
//   deleteBlock,

//   //notifications

//   cleanupOldNotifications,
//   deleteNotification,
// };

// // src/services/appwrite.service.js
// const { databases, storage, ID, Query } = require("../config/appwrite");

// const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
// const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
// const CHALLENGES_COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;
// const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID;
// const LIKES_COLLECTION_ID = process.env.APPWRITE_LIKES_COLLECTION_ID;
// const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;
// const NOTIFICATIONS_COLLECTION_ID =
//   process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID;
// const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID;
// const FOLLOWS_COLLECTION_ID = process.env.APPWRITE_FOLLOWS_COLLECTION_ID;
// const CHALLENGE_IMAGES_BUCKET_ID =
//   process.env.APPWRITE_CHALLENGE_IMAGES_BUCKET_ID;
// const FOLLOW_REQUESTS_COLLECTION_ID =
//   process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID;
// const BLOCKS_COLLECTION_ID = process.env.APPWRITE_BLOCKS_COLLECTION_ID;

// /**
//  * USERS
//  */
// const createUser = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const getUserByEmail = async (email) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     [Query.equal("email", email)]
//   );
//   return documents[0] || null;
// };

// const getUserById = async (userId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       userId
//     );
//   } catch {
//     return null;
//   }
// };

// const updateUser = async (userId, data) => {
//   return databases.updateDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     userId,
//     data
//   );
// };

// /**
//  * Toggle account privacy (expects a boolean `private`)
//  */
// const setAccountPrivacy = async (userId, makePrivate) => {
//   return databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
//     private: !!makePrivate,
//   });
// };

// const setLoginStatus = async (userId, isLoggedIn) => {
//   return databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
//     isLoggedIn: !!isLoggedIn,
//   });
// };

// /**
//  * CHALLENGES
//  */
// const getChallenges = async (queries = []) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const getChallengeById = async (challengeId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       CHALLENGES_COLLECTION_ID,
//       challengeId
//     );
//   } catch {
//     return null;
//   }
// };

// const createChallenge = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const updateChallenge = async (challengeId, data) => {
//   return databases.updateDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     challengeId,
//     data
//   );
// };

// const deleteChallenge = async (challengeId) => {
//   return databases.deleteDocument(
//     DATABASE_ID,
//     CHALLENGES_COLLECTION_ID,
//     challengeId
//   );
// };

// /**
//  * COMMENTS
//  */
// const getComments = async (challengeId, parentCommentId = null) => {
//   if (
//     !challengeId ||
//     typeof challengeId !== "string" ||
//     challengeId.trim() === ""
//   ) {
//     throw new Error("Invalid challengeId");
//   }
//   const queries = [Query.equal("challengeId", challengeId)];
//   if (parentCommentId) {
//     queries.push(Query.equal("parentCommentId", parentCommentId));
//   } else {
//     queries.push(Query.isNull("parentCommentId"));
//   }
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const getReplies = async (challengeId, parentCommentId) => {
//   if (
//     !challengeId ||
//     typeof challengeId !== "string" ||
//     challengeId.trim() === ""
//   ) {
//     throw new Error("Invalid challengeId");
//   }
//   if (
//     !parentCommentId ||
//     typeof parentCommentId !== "string" ||
//     parentCommentId.trim() === ""
//   ) {
//     throw new Error("Invalid parentCommentId");
//   }
//   return getComments(challengeId, parentCommentId);
// };

// const getCommentById = async (commentId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       COMMENTS_COLLECTION_ID,
//       commentId
//     );
//   } catch {
//     return null;
//   }
// };

// const createComment = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteComment = async (commentId) => {
//   return databases.deleteDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     commentId
//   );
// };

// const updateCommentService = async (id, data) => {
//   return databases.updateDocument(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     id,
//     data
//   );
// };

// /**
//  * LIKES
//  */
// const createLike = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteLike = async (userId, targetType, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [
//       Query.equal("userId", userId),
//       Query.equal("targetType", targetType),
//       Query.equal("targetId", targetId),
//     ]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       LIKES_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// const getLikes = async (targetType, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [Query.equal("targetType", targetType), Query.equal("targetId", targetId)]
//   );
//   return documents;
// };

// const getUserLike = async (userId, targetType, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [
//       Query.equal("userId", userId),
//       Query.equal("targetType", targetType),
//       Query.equal("targetId", targetId),
//     ]
//   );
//   return documents[0] || null;
// };

// /**
//  * BOOKMARKS
//  */
// const createBookmark = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const deleteBookmark = async (userId, challengeId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     [Query.equal("userId", userId), Query.equal("challengeId", challengeId)]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       BOOKMARKS_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };

// const getUserBookmarks = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BOOKMARKS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );
//   return documents;
// };

// /**
//  * NOTIFICATIONS
//  * NOTE: Ensure `type` enum supports: 'follow', 'follow_request', 'follow_request_accepted'
//  */
// const createNotification = async (data) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     ID.unique(),
//     data
//   );
// };

// const getNotifications = async (userId, unreadOnly = false) => {
//   const queries = [Query.equal("userId", userId)];
//   if (unreadOnly) queries.push(Query.equal("read", false));
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     queries
//   );
//   return documents;
// };

// const updateNotification = async (notificationId, data) => {
//   return databases.updateDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     notificationId,
//     data
//   );
// };

// const deleteNotification = async (notificationId) => {
//   return databases.deleteDocument(
//     DATABASE_ID,
//     NOTIFICATIONS_COLLECTION_ID,
//     notificationId
//   );
// };

// const cleanupOldNotifications = async (userId) => {
//   try {
//     const twoDaysAgo = new Date(
//       Date.now() - 2 * 24 * 60 * 60 * 1000
//     ).toISOString();
//     const { documents } = await databases.listDocuments(
//       DATABASE_ID,
//       NOTIFICATIONS_COLLECTION_ID,
//       [Query.equal("userId", userId), Query.lessThan("createdAt", twoDaysAgo)]
//     );
//     for (const n of documents) {
//       await deleteNotification(n.$id);
//     }
//   } catch (err) {
//     console.error("cleanupOldNotifications error:", err);
//   }
// };

// /**
//  * STORAGE
//  */
// const uploadFile = async (bucketId, filePath, fileName) => {
//   const file = await storage.createFile(
//     bucketId,
//     ID.unique(),
//     filePath,
//     fileName
//   );
//   return storage.getFileView(bucketId, file.$id);
// };

// /**
//  * PROFILE-RELATED AGGREGATES
//  */
// const getUserSubmissions = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );
//   return documents;
// };

// const getUserLikedPosts = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     LIKES_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );

//   const likedPosts = await Promise.all(
//     documents.map(async (like) => {
//       if (like.targetType === "challenge") {
//         const challenge = await getChallengeById(like.targetId);
//         return challenge ? { type: "challenge", data: challenge } : null;
//       } else if (like.targetType === "comment") {
//         const comment = await getCommentById(like.targetId);
//         return comment
//           ? { type: comment.mediaUrl ? "submission" : "comment", data: comment }
//           : null;
//       }
//       return null;
//     })
//   );

//   return likedPosts.filter(Boolean);
// };

// const getUserCommentedPosts = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     [Query.equal("userId", userId)]
//   );

//   const commentedPosts = await Promise.all(
//     documents.map(async (comment) => {
//       const challenge = await getChallengeById(comment.challengeId);
//       return challenge ? { comment, challenge } : null;
//     })
//   );

//   return commentedPosts.filter(Boolean);
// };

// const getUserProfileDetails = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) throw new Error("User not found");

//   const submissions = await getUserSubmissions(userId);
//   const likedPosts = await getUserLikedPosts(userId);
//   const commentedPosts = await getUserCommentedPosts(userId);
//   const bookmarks = await getUserBookmarks(userId);
//   const notifications = await getNotifications(userId, true);

//   return {
//     user,
//     submissions,
//     likedPosts,
//     commentedPosts,
//     bookmarks,
//     notifications,
//   };
// };

// const updateUserProfile = async (userId, data) => {
//   const updateData = {
//     ...(data.username !== undefined ? { username: data.username } : {}),
//     ...(data.bio !== undefined ? { bio: data.bio } : {}),
//   };
//   return databases.updateDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     userId,
//     updateData
//   );
// };

// /**
//  * FOLLOWS
//  * - We support "active" flag if present in schema; otherwise create/delete document.
//  */
// const getFollowDoc = async (followerId, followingId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     FOLLOWS_COLLECTION_ID,
//     [
//       Query.equal("followerId", followerId),
//       Query.equal("followingId", followingId),
//     ]
//   );
//   return documents[0] || null;
// };

// const createFollow = async ({ followerId, followingId, requested = false }) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     FOLLOWS_COLLECTION_ID,
//     ID.unique(),
//     {
//       followerId,
//       followingId,
//       requested,
     
//     }
//   );
// };




// const enableFollowIfPossible = async (doc) => {
//   if (doc && Object.prototype.hasOwnProperty.call(doc, "active")) {
//     return databases.updateDocument(
//       DATABASE_ID,
//       FOLLOWS_COLLECTION_ID,
//       doc.$id,
//       { active: true }
//     );
//   }
//   return doc; // nothing to do
// };

// const createOrEnableFollow = async ({ followerId, followingId }) => {
//   const existing = await getFollowDoc(followerId, followingId);
//   if (existing) {
//     return enableFollowIfPossible(existing) || existing;
//   }
//   return createFollow({ followerId, followingId });
// };

// const deleteFollow = async (followerId, followingId) => {
//   const existing = await getFollowDoc(followerId, followingId);
//   if (existing) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       FOLLOWS_COLLECTION_ID,
//       existing.$id
//     );
//   }
// };

// const isFollowing = async (followerId, followingId) => {
//   const doc = await getFollowDoc(followerId, followingId);
//   return !!doc && doc.requested === false;
// };

// // Get followers
// const getFollowers = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     FOLLOWS_COLLECTION_ID,
//     [Query.equal("followingId", userId), Query.equal("requested", false)]
//   );
//   return documents;
// };


// // Get following
// const getFollowing = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     FOLLOWS_COLLECTION_ID,
//     [Query.equal("followerId", userId), Query.equal("requested", false)]
//   );
//   return documents;
// };

// /**
//  * FOLLOW REQUESTS
//  */
// const createFollowRequest = async ({ requesterId, targetId }) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     FOLLOW_REQUESTS_COLLECTION_ID,
//     ID.unique(),
//     {
//       requesterId,
//       targetId,
//       status: "pending",
//     }
//   );
// };

// const getPendingFollowRequest = async (requesterId, targetId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     FOLLOW_REQUESTS_COLLECTION_ID,
//     [
//       Query.equal("requesterId", requesterId),
//       Query.equal("targetId", targetId),
//       Query.equal("status", "pending"),
//     ]
//   );
//   return documents[0] || null;
// };

// const getIncomingFollowRequests = async (userId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     FOLLOW_REQUESTS_COLLECTION_ID,
//     [Query.equal("targetId", userId), Query.equal("status", "pending")]
//   );
//   return documents;
// };

// const updateFollowRequestStatus = async (requestId, status) => {
//   return databases.updateDocument(
//     DATABASE_ID,
//     FOLLOW_REQUESTS_COLLECTION_ID,
//     requestId,
//     { status }
//   );
// };

// const getFollowRequestById = async (requestId) => {
//   try {
//     return await databases.getDocument(
//       DATABASE_ID,
//       FOLLOW_REQUESTS_COLLECTION_ID,
//       requestId
//     );
//   } catch {
//     return null;
//   }
// };



// /**
//  * BLOCKS
//  */
// const createBlock = async ({ blockerId, blockedId }) => {
//   return databases.createDocument(
//     DATABASE_ID,
//     BLOCKS_COLLECTION_ID,
//     ID.unique(),
//     { blockerId, blockedId }
//   );
// };

// const isBlocked = async (blockerId, blockedId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BLOCKS_COLLECTION_ID,
//     [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
//   );
//   return !!documents[0];
// };

// const deleteBlock = async (blockerId, blockedId) => {
//   const { documents } = await databases.listDocuments(
//     DATABASE_ID,
//     BLOCKS_COLLECTION_ID,
//     [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
//   );
//   if (documents[0]) {
//     await databases.deleteDocument(
//       DATABASE_ID,
//       BLOCKS_COLLECTION_ID,
//       documents[0].$id
//     );
//   }
// };


// const updateFollowDoc = async (followId, data) => {
//   return await databases.updateDocument(
//     DATABASE_ID,
//     FOLLOWS_COLLECTION_ID,
//     followId,
//     data
//   );
// };

// module.exports = {
//   // Users
//   updateFollowDoc,
//   createUser,
//   getUserByEmail,
//   getUserById,
//   updateUser,
//   setAccountPrivacy,
//   updateUserProfile,

//   // Challenges
//   getChallenges,
//   getChallengeById,
//   createChallenge,
//   updateChallenge,
//   deleteChallenge,

//   // Comments
//   getComments,
//   getReplies,
//   getCommentById,
//   updateCommentService,
//   createComment,
//   deleteComment,

//   // Likes
//   createLike,
//   deleteLike,
//   getLikes,
//   getUserLike,

//   // Bookmarks
//   createBookmark,
//   deleteBookmark,
//   getUserBookmarks,

//   // Notifications
//   createNotification,
//   getNotifications,
//   updateNotification,
//   deleteNotification,
//   cleanupOldNotifications,

//   // Storage
//   uploadFile,

//   // Profile aggregates
//   getUserSubmissions,
//   getUserLikedPosts,
//   getUserCommentedPosts,
//   getUserProfileDetails,

//   // Follows
//   getFollowDoc,
//   createFollow,
//   createOrEnableFollow,
//   deleteFollow,
//   getFollowers,
//   getFollowing,
//   isFollowing,

//   // Follow requests
//   createFollowRequest,
//   updateFollowRequestStatus,
//   getPendingFollowRequest,
//   getIncomingFollowRequests,
//   getFollowRequestById,

//   // Blocks
//   createBlock,
//   isBlocked,
//   deleteBlock,
//   setLoginStatus,
// };


const { databases, storage, ID, Query } = require("../config/appwrite");

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
const CHALLENGES_COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;
const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID;
const LIKES_COLLECTION_ID = process.env.APPWRITE_LIKES_COLLECTION_ID;
const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;
const NOTIFICATIONS_COLLECTION_ID =
  process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID;
const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID;
const FOLLOWS_COLLECTION_ID = process.env.APPWRITE_FOLLOWS_COLLECTION_ID;
const CHALLENGE_IMAGES_BUCKET_ID =
  process.env.APPWRITE_CHALLENGE_IMAGES_BUCKET_ID;
const FOLLOW_REQUESTS_COLLECTION_ID =
  process.env.APPWRITE_FOLLOW_REQUESTS_COLLECTION_ID;
const BLOCKS_COLLECTION_ID = process.env.APPWRITE_BLOCKS_COLLECTION_ID;

/**
 * USERS
 */
const createUser = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const getUserByEmail = async (email) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    [Query.equal("email", email)]
  );
  return documents[0] || null;
};

const getUserById = async (userId) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
  } catch {
    return null;
  }
};

const updateUser = async (userId, data) => {
  return databases.updateDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    userId,
    data
  );
};

/**
 * Toggle account privacy (expects a boolean `private`)
 */
const setAccountPrivacy = async (userId, makePrivate) => {
  return databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
    private: !!makePrivate,
  });
};

const setLoginStatus = async (userId, isLoggedIn) => {
  return databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
    isLoggedIn: !!isLoggedIn,
  });
};

/**
 * CHALLENGES
 */
const getChallenges = async (queries = []) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    CHALLENGES_COLLECTION_ID,
    queries
  );
  return documents;
};

const getChallengeById = async (challengeId) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      CHALLENGES_COLLECTION_ID,
      challengeId
    );
  } catch {
    return null;
  }
};

const createChallenge = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    CHALLENGES_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const updateChallenge = async (challengeId, data) => {
  return databases.updateDocument(
    DATABASE_ID,
    CHALLENGES_COLLECTION_ID,
    challengeId,
    data
  );
};

const deleteChallenge = async (challengeId) => {
  return databases.deleteDocument(
    DATABASE_ID,
    CHALLENGES_COLLECTION_ID,
    challengeId
  );
};

/**
 * COMMENTS
 */
const getComments = async (challengeId, parentCommentId = null) => {
  if (
    !challengeId ||
    typeof challengeId !== "string" ||
    challengeId.trim() === ""
  ) {
    throw new Error("Invalid challengeId");
  }
  const queries = [Query.equal("challengeId", challengeId)];
  if (parentCommentId) {
    queries.push(Query.equal("parentCommentId", parentCommentId));
  } else {
    queries.push(Query.isNull("parentCommentId"));
  }
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    queries
  );
  return documents;
};

const getReplies = async (challengeId, parentCommentId) => {
  if (
    !challengeId ||
    typeof challengeId !== "string" ||
    challengeId.trim() === ""
  ) {
    throw new Error("Invalid challengeId");
  }
  if (
    !parentCommentId ||
    typeof parentCommentId !== "string" ||
    parentCommentId.trim() === ""
  ) {
    throw new Error("Invalid parentCommentId");
  }
  return getComments(challengeId, parentCommentId);
};

const getCommentById = async (commentId) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      commentId
    );
  } catch {
    return null;
  }
};

const createComment = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const deleteComment = async (commentId) => {
  return databases.deleteDocument(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    commentId
  );
};

const updateCommentService = async (id, data) => {
  return databases.updateDocument(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    id,
    data
  );
};

/**
 * LIKES
 */
const createLike = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const deleteLike = async (userId, targetType, targetId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.equal("targetType", targetType),
      Query.equal("targetId", targetId),
    ]
  );
  if (documents[0]) {
    await databases.deleteDocument(
      DATABASE_ID,
      LIKES_COLLECTION_ID,
      documents[0].$id
    );
  }
};

const getLikes = async (targetType, targetId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [Query.equal("targetType", targetType), Query.equal("targetId", targetId)]
  );
  return documents;
};

const getUserLike = async (userId, targetType, targetId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.equal("targetType", targetType),
      Query.equal("targetId", targetId),
    ]
  );
  return documents[0] || null;
};

/**
 * BOOKMARKS
 */
const createBookmark = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    BOOKMARKS_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const deleteBookmark = async (userId, challengeId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    BOOKMARKS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.equal("challengeId", challengeId)]
  );
  if (documents[0]) {
    await databases.deleteDocument(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      documents[0].$id
    );
  }
};

const getUserBookmarks = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    BOOKMARKS_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );
  return documents;
};

/**
 * NOTIFICATIONS
 * NOTE: Ensure `type` enum supports: 'follow', 'follow_request', 'follow_request_accepted'
 */
const createNotification = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    NOTIFICATIONS_COLLECTION_ID,
    ID.unique(),
    data
  );
};

const getNotifications = async (userId, unreadOnly = false) => {
  const queries = [Query.equal("userId", userId)];
  if (unreadOnly) queries.push(Query.equal("read", false));
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    NOTIFICATIONS_COLLECTION_ID,
    queries
  );
  return documents;
};

const updateNotification = async (notificationId, data) => {
  return databases.updateDocument(
    DATABASE_ID,
    NOTIFICATIONS_COLLECTION_ID,
    notificationId,
    data
  );
};

const deleteNotification = async (notificationId) => {
  return databases.deleteDocument(
    DATABASE_ID,
    NOTIFICATIONS_COLLECTION_ID,
    notificationId
  );
};

const cleanupOldNotifications = async (userId) => {
  try {
    const twoDaysAgo = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString();
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.lessThan("createdAt", twoDaysAgo)]
    );
    for (const n of documents) {
      await deleteNotification(n.$id);
    }
  } catch (err) {
    console.error("cleanupOldNotifications error:", err);
  }
};

/**
 * STORAGE
 */
const uploadFile = async (bucketId, filePath, fileName) => {
  const file = await storage.createFile(
    bucketId,
    ID.unique(),
    filePath,
    fileName
  );
  return storage.getFileView(bucketId, file.$id);
};

/**
 * PROFILE-RELATED AGGREGATES
 */
const getUserSubmissions = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );
  return documents;
};

const getUserLikedPosts = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );

  const likedPosts = await Promise.all(
    documents.map(async (like) => {
      if (like.targetType === "challenge") {
        const challenge = await getChallengeById(like.targetId);
        return challenge ? { type: "challenge", data: challenge } : null;
      } else if (like.targetType === "comment") {
        const comment = await getCommentById(like.targetId);
        return comment
          ? { type: comment.mediaUrl ? "submission" : "comment", data: comment }
          : null;
      }
      return null;
    })
  );

  return likedPosts.filter(Boolean);
};

const getUserCommentedPosts = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    COMMENTS_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );

  const commentedPosts = await Promise.all(
    documents.map(async (comment) => {
      const challenge = await getChallengeById(comment.challengeId);
      return challenge ? { comment, challenge } : null;
    })
  );

  return commentedPosts.filter(Boolean);
};

const getUserProfileDetails = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const submissions = await getUserSubmissions(userId);
  const likedPosts = await getUserLikedPosts(userId);
  const commentedPosts = await getUserCommentedPosts(userId);
  const bookmarks = await getUserBookmarks(userId);
  const notifications = await getNotifications(userId, true);

  return {
    user,
    submissions,
    likedPosts,
    commentedPosts,
    bookmarks,
    notifications,
  };
};

const updateUserProfile = async (userId, data) => {
  const updateData = {
    ...(data.username !== undefined ? { username: data.username } : {}),
    ...(data.bio !== undefined ? { bio: data.bio } : {}),
  };
  return databases.updateDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    userId,
    updateData
  );
};

/**
 * FOLLOWS
 * - We support "active" flag if present in schema; otherwise create/delete document.
 */
const getFollowDoc = async (followerId, followingId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [
      Query.equal("followerId", followerId),
      Query.equal("followingId", followingId),
    ]
  );
  return documents[0] || null;
};

const createFollow = async ({ followerId, followingId, requested = false }) => {
  return databases.createDocument(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    ID.unique(),
    {
      followerId,
      followingId,
      requested,
    }
  );
};

const enableFollowIfPossible = async (doc) => {
  if (doc && Object.prototype.hasOwnProperty.call(doc, "active")) {
    return databases.updateDocument(
      DATABASE_ID,
      FOLLOWS_COLLECTION_ID,
      doc.$id,
      { active: true }
    );
  }
  return doc; // nothing to do
};

const createOrEnableFollow = async ({ followerId, followingId }) => {
  const existing = await getFollowDoc(followerId, followingId);
  if (existing) {
    return enableFollowIfPossible(existing) || existing;
  }
  return createFollow({ followerId, followingId });
};

const deleteFollow = async (followerId, followingId) => {
  const existing = await getFollowDoc(followerId, followingId);
  if (existing) {
    await databases.deleteDocument(
      DATABASE_ID,
      FOLLOWS_COLLECTION_ID,
      existing.$id
    );
  }
};

const isFollowing = async (followerId, followingId) => {
  const doc = await getFollowDoc(followerId, followingId);
  return !!doc && doc.requested === false;
};

// Get followers
const getFollowers = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [Query.equal("followingId", userId), Query.equal("requested", false)]
  );
  return documents;
};

// Get following
const getFollowing = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [Query.equal("followerId", userId), Query.equal("requested", false)]
  );
  return documents;
};

/**
 * FOLLOW REQUESTS
 */
const createFollowRequest = async ({ requesterId, targetId }) => {
  return databases.createDocument(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    ID.unique(),
    {
      requesterId,
      targetId,
      status: "pending",
    }
  );
};

const getPendingFollowRequest = async (requesterId, targetId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    [
      Query.equal("requesterId", requesterId),
      Query.equal("targetId", targetId),
      Query.equal("status", "pending"),
    ]
  );
  return documents[0] || null;
};

const getIncomingFollowRequests = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    [Query.equal("targetId", userId), Query.equal("status", "pending")]
  );
  return Promise.all(
    documents.map(async (doc) => {
      const requester = await getUserById(doc.requesterId);
      return { ...doc, requester };
    })
  );
};

const getOutgoingFollowRequests = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    [Query.equal("requesterId", userId), Query.equal("status", "pending")]
  );
  return Promise.all(
    documents.map(async (doc) => {
      const target = await getUserById(doc.targetId);
      return { ...doc, target };
    })
  );
};

const updateFollowRequestStatus = async (requestId, status) => {
  return databases.updateDocument(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    requestId,
    { status }
  );
};

const getFollowRequestById = async (requestId) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      FOLLOW_REQUESTS_COLLECTION_ID,
      requestId
    );
  } catch {
    return null;
  }
};

const deleteFollowRequest = async (requestId) => {
  return databases.deleteDocument(
    DATABASE_ID,
    FOLLOW_REQUESTS_COLLECTION_ID,
    requestId
  );
};

/**
 * BLOCKS
 */
const createBlock = async ({ blockerId, blockedId }) => {
  return databases.createDocument(
    DATABASE_ID,
    BLOCKS_COLLECTION_ID,
    ID.unique(),
    { blockerId, blockedId }
  );
};

const isBlocked = async (blockerId, blockedId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    BLOCKS_COLLECTION_ID,
    [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
  );
  return !!documents[0];
};

const deleteBlock = async (blockerId, blockedId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    BLOCKS_COLLECTION_ID,
    [Query.equal("blockerId", blockerId), Query.equal("blockedId", blockedId)]
  );
  if (documents[0]) {
    await databases.deleteDocument(
      DATABASE_ID,
      BLOCKS_COLLECTION_ID,
      documents[0].$id
    );
  }
};

const updateFollowDoc = async (followId, data) => {
  return await databases.updateDocument(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    followId,
    data
  );
};

const getBlockedUsers = async (userId) => {
  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    BLOCKS_COLLECTION_ID,
    [Query.equal("blockerId", userId)]
  );
  return Promise.all(
    documents.map(async (block) => {
      const user = await getUserById(block.blockedId);
      return { blockDocId: block.$id, user };
    })
  );
};


module.exports = {
  // Users
  updateFollowDoc,
  createUser,
  getUserByEmail,
  getBlockedUsers,
  getUserById,
  updateUser,
  setAccountPrivacy,
  updateUserProfile,

  // Challenges
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,

  // Comments
  getComments,
  getReplies,
  getCommentById,
  updateCommentService,
  createComment,
  deleteComment,

  // Likes
  createLike,
  deleteLike,
  getLikes,
  getUserLike,

  // Bookmarks
  createBookmark,
  deleteBookmark,
  getUserBookmarks,

  // Notifications
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  cleanupOldNotifications,

  // Storage
  uploadFile,

  // Profile aggregates
  getUserSubmissions,
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,

  // Follows
  getFollowDoc,
  createFollow,
  createOrEnableFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
  isFollowing,

  // Follow requests
  createFollowRequest,
  updateFollowRequestStatus,
  getPendingFollowRequest,
  getIncomingFollowRequests,
  getOutgoingFollowRequests,
  getFollowRequestById,
  deleteFollowRequest,

  // Blocks
  createBlock,
  isBlocked,
  deleteBlock,
  setLoginStatus,
};