// const { databases, storage, ID, Query } = require('../config/appwrite');

// const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
// const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
// const CHALLENGES_COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;
// const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID;
// const LIKES_COLLECTION_ID = process.env.APPWRITE_LIKES_COLLECTION_ID;
// const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;
// const NOTIFICATIONS_COLLECTION_ID = process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID;
// const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID;
// const CHALLENGE_IMAGES_BUCKET_ID = process.env.APPWRITE_CHALLENGE_IMAGES_BUCKET_ID;
// const SUBMISSION_MEDIA_BUCKET_ID = process.env.APPWRITE_SUBMISSION_MEDIA_BUCKET_ID;

// // Users
// const createUser = async (data) => {
//   return await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), data);
// };

// const getUserByEmail = async (email) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.equal('email', email)]);
//   return documents[0] || null;
// };

// const getUserById = async (userId) => {
//   try {
//     return await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
//   } catch {
//     return null;
//   }
// };

// const updateUser = async (userId, data) => {
//   return await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, data);
// };

// // Challenges
// const getChallenges = async (queries = []) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, CHALLENGES_COLLECTION_ID, queries);
//   return documents;
// };

// const getChallengeById = async (challengeId) => {
//   try {
//     return await databases.getDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId);
//   } catch {
//     return null;
//   }
// };

// const createChallenge = async (data) => {
//   return await databases.createDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, ID.unique(), data);
// };

// const updateChallenge = async (challengeId, data) => {
//   return await databases.updateDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId, data);
// };

// const deleteChallenge = async (challengeId) => {
//   return await databases.deleteDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId);
// };

// // Comments
// const getComments = async (challengeId, parentCommentId = null) => {
//   let queries = [Query.equal('challengeId', challengeId)];
//   if (parentCommentId) {
//     queries.push(Query.equal('parentCommentId', parentCommentId));
//   } else {
//     queries.push(Query.isNull('parentCommentId'));
//   }
//   const { documents } = await databases.listDocuments(DATABASE_ID, COMMENTS_COLLECTION_ID, queries);
//   return documents;
// };

// const getReplies = async (parentCommentId) => {
//   return getComments(null, parentCommentId); // Reuse
// };

// const getCommentById = async (commentId) => {
//   try {
//     return await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);
//   } catch {
//     return null;
//   }
// };

// const createComment = async (data) => {
//   return await databases.createDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, ID.unique(), data);
// };

// const deleteComment = async (commentId) => {
//   return await databases.deleteDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);
// };

// const updateCommentService = async (id, data) =>{
//   return await databases.updateDocument(
//   DATABASE_ID,
//     COMMENTS_COLLECTION_ID,
//     id,
//     data
//   );
// };


// // Likes
// const createLike = async (data) => {
//   return await databases.createDocument(DATABASE_ID, LIKES_COLLECTION_ID, ID.unique(), data);
// };

// const deleteLike = async (userId, targetType, targetId) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
//     Query.equal('userId', userId),
//     Query.equal('targetType', targetType),
//     Query.equal('targetId', targetId)
//   ]);
//   if (documents[0]) {
//     await databases.deleteDocument(DATABASE_ID, LIKES_COLLECTION_ID, documents[0].$id);
//   }
// };

// const getLikes = async (targetType, targetId) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
//     Query.equal('targetType', targetType),
//     Query.equal('targetId', targetId)
//   ]);
//   return documents;
// };

// const getUserLike = async (userId, targetType, targetId) => {
//   console.log("getUserLike params:", { userId, targetType, targetId });

//   const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
//     Query.equal('userId', userId),
//     Query.equal('targetType', targetType),
//     Query.equal('targetId', targetId)
//   ]);

//   console.log("getUserLike documents:", documents);

//   return documents[0] || null;
// };


// // Bookmarks
// const createBookmark = async (data) => {
//   return await databases.createDocument(DATABASE_ID, BOOKMARKS_COLLECTION_ID, ID.unique(), data);
// };

// const deleteBookmark = async (userId, challengeId) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, BOOKMARKS_COLLECTION_ID, [
//     Query.equal('userId', userId),
//     Query.equal('challengeId', challengeId)
//   ]);
//   if (documents[0]) {
//     await databases.deleteDocument(DATABASE_ID, BOOKMARKS_COLLECTION_ID, documents[0].$id);
//   }
// };

// const getUserBookmarks = async (userId) => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, BOOKMARKS_COLLECTION_ID, [
//     Query.equal('userId', userId)
//   ]);
//   return documents;
// };

// // Notifications
// const createNotification = async (data) => {
//   return await databases.createDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, ID.unique(), data);
// };

// const getNotifications = async (userId, unreadOnly = false) => {
//   let queries = [Query.equal('userId', userId)];
//   if (unreadOnly) queries.push(Query.equal('read', false));
//   const { documents } = await databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, queries);
//   return documents;
// };

// const updateNotification = async (notificationId, data) => {
//   return await databases.updateDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, notificationId, data);
// };

// // Reports
// const createReport = async (data) => {
//   return await databases.createDocument(DATABASE_ID, REPORTS_COLLECTION_ID, ID.unique(), data);
// };

// const getReports = async (status = 'open') => {
//   const { documents } = await databases.listDocuments(DATABASE_ID, REPORTS_COLLECTION_ID, [Query.equal('status', status)]);
//   return documents;
// };

// const updateReport = async (reportId, data) => {
//   return await databases.updateDocument(DATABASE_ID, REPORTS_COLLECTION_ID, reportId, data);
// };

// // Storage (Updated for multiple buckets)
// const uploadFile = async (bucketId, filePath, fileName) => {
//   const file = await storage.createFile(bucketId, ID.unique(), filePath, fileName);
//   return storage.getFileView(bucketId, file.$id); // Or getFilePreview for thumbs
// };

// module.exports = {
//   // Users
//   createUser,
//   getUserByEmail,
//   getUserById,
//   updateUser,
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
//   uploadFile
// };


const { databases, storage, ID, Query } = require('../config/appwrite');

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
const CHALLENGES_COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;
const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID;
const LIKES_COLLECTION_ID = process.env.APPWRITE_LIKES_COLLECTION_ID;
const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;
const NOTIFICATIONS_COLLECTION_ID = process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID;
const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID;
const CHALLENGE_IMAGES_BUCKET_ID = process.env.APPWRITE_CHALLENGE_IMAGES_BUCKET_ID;

// Users
const createUser = async (data) => {
  return await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), data);
};

const getUserByEmail = async (email) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.equal('email', email)]);
  return documents[0] || null;
};

const getUserById = async (userId) => {
  try {
    return await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
  } catch {
    return null;
  }
};

const updateUser = async (userId, data) => {
  return await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, data);
};

// Challenges
const getChallenges = async (queries = []) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, CHALLENGES_COLLECTION_ID, queries);
  return documents;
};

const getChallengeById = async (challengeId) => {
  try {
    return await databases.getDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId);
  } catch {
    return null;
  }
};

const createChallenge = async (data) => {
  return await databases.createDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, ID.unique(), data);
};

const updateChallenge = async (challengeId, data) => {
  return await databases.updateDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId, data);
};

const deleteChallenge = async (challengeId) => {
  return await databases.deleteDocument(DATABASE_ID, CHALLENGES_COLLECTION_ID, challengeId);
};

// Comments
const getComments = async (challengeId, parentCommentId = null) => {
  let queries = [Query.equal('challengeId', challengeId)];
  if (parentCommentId) {
    queries.push(Query.equal('parentCommentId', parentCommentId));
  } else {
    queries.push(Query.isNull('parentCommentId'));
  }
  const { documents } = await databases.listDocuments(DATABASE_ID, COMMENTS_COLLECTION_ID, queries);
  return documents;
};

const getReplies = async (parentCommentId) => {
  return getComments(null, parentCommentId); // Reuse
};

const getCommentById = async (commentId) => {
  try {
    return await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);
  } catch {
    return null;
  }
};

const createComment = async (data) => {
  return await databases.createDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, ID.unique(), data);
};

const deleteComment = async (commentId) => {
  return await databases.deleteDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);
};

const updateCommentService = async (id, data) => {
  return await databases.updateDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, id, data);
};

// Likes
const createLike = async (data) => {
  return await databases.createDocument(DATABASE_ID, LIKES_COLLECTION_ID, ID.unique(), data);
};

const deleteLike = async (userId, targetType, targetId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.equal('targetType', targetType),
    Query.equal('targetId', targetId)
  ]);
  if (documents[0]) {
    await databases.deleteDocument(DATABASE_ID, LIKES_COLLECTION_ID, documents[0].$id);
  }
};

const getLikes = async (targetType, targetId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
    Query.equal('targetType', targetType),
    Query.equal('targetId', targetId)
  ]);
  return documents;
};

const getUserLike = async (userId, targetType, targetId) => {
  console.log("getUserLike params:", { userId, targetType, targetId });
  const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.equal('targetType', targetType),
    Query.equal('targetId', targetId)
  ]);
  console.log("getUserLike documents:", documents);
  return documents[0] || null;
};

// Bookmarks
const createBookmark = async (data) => {
  return await databases.createDocument(DATABASE_ID, BOOKMARKS_COLLECTION_ID, ID.unique(), data);
};

const deleteBookmark = async (userId, challengeId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, BOOKMARKS_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.equal('challengeId', challengeId)
  ]);
  if (documents[0]) {
    await databases.deleteDocument(DATABASE_ID, BOOKMARKS_COLLECTION_ID, documents[0].$id);
  }
};

const getUserBookmarks = async (userId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, BOOKMARKS_COLLECTION_ID, [
    Query.equal('userId', userId)
  ]);
  return documents;
};

// Notifications
const createNotification = async (data) => {
  return await databases.createDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, ID.unique(), data);
};

const getNotifications = async (userId, unreadOnly = false) => {
  let queries = [Query.equal('userId', userId)];
  if (unreadOnly) queries.push(Query.equal('read', unreadOnly));
  const { documents } = await databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, queries);
  return documents;
};

const updateNotification = async (notificationId, data) => {
  return await databases.updateDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, notificationId, data);
};

// Reports
const createReport = async (data) => {
  return await databases.createDocument(DATABASE_ID, REPORTS_COLLECTION_ID, ID.unique(), data);
};

const getReports = async (status = 'open') => {
  const { documents } = await databases.listDocuments(DATABASE_ID, REPORTS_COLLECTION_ID, [Query.equal('status', status)]);
  return documents;
};

const updateReport = async (reportId, data) => {
  return await databases.updateDocument(DATABASE_ID, REPORTS_COLLECTION_ID, reportId, data);
};

// Storage
const uploadFile = async (bucketId, filePath, fileName) => {
  const file = await storage.createFile(bucketId, ID.unique(), filePath, fileName);
  return storage.getFileView(bucketId, file.$id); // Or getFilePreview for thumbs
};

// Submissions (Comments with mediaUrl)
const getUserSubmissions = async (userId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, COMMENTS_COLLECTION_ID, [
    Query.equal('userId', userId)
  ]);
  return documents;
};

// Liked Posts
const getUserLikedPosts = async (userId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, LIKES_COLLECTION_ID, [
    Query.equal('userId', userId),
  ]);

  const likedPosts = await Promise.all(
    documents.map(async (like) => {
      if (like.targetType === 'challenge') {
        const challenge = await getChallengeById(like.targetId);
        return challenge ? { type: 'challenge', data: challenge } : null;
      } else if (like.targetType === 'comment') {
        const comment = await getCommentById(like.targetId);
        return comment ? { type: comment.mediaUrl ? 'submission' : 'comment', data: comment } : null;
      }
      return null;
    })
  );

  return likedPosts.filter((post) => post !== null);
};

// Commented Posts
const getUserCommentedPosts = async (userId) => {
  const { documents } = await databases.listDocuments(DATABASE_ID, COMMENTS_COLLECTION_ID, [
    Query.equal('userId', userId),
  ]);

  const commentedPosts = await Promise.all(
    documents.map(async (comment) => {
      const challenge = await getChallengeById(comment.challengeId);
      return challenge ? { comment, challenge } : null;
    })
  );

  return commentedPosts.filter((post) => post !== null);
};

// Profile Details
const getUserProfileDetails = async (userId) => {
  try {
    // Fetch user details
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    // Fetch submissions (comments with mediaUrl)
    const submissions = await getUserSubmissions(userId);

    // Fetch liked posts
    const likedPosts = await getUserLikedPosts(userId);

    // Fetch commented posts (all comments, including submissions)
    const commentedPosts = await getUserCommentedPosts(userId);

    // Fetch bookmarks
    const bookmarks = await getUserBookmarks(userId);

    // Fetch notifications (unread only)
    const notifications = await getNotifications(userId, true);

    return {
      user,
      submissions,
      likedPosts,
      commentedPosts,
      bookmarks,
      notifications,
    };
  } catch (error) {
    console.error('Error fetching profile details:', error);
    throw error;
  }
};

module.exports = {
  // Users
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
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
  // Reports
  createReport,
  getReports,
  updateReport,
  // Storage
  uploadFile,
  // Submissions
  getUserSubmissions,
  // Profile
  getUserLikedPosts,
  getUserCommentedPosts,
  getUserProfileDetails,
};