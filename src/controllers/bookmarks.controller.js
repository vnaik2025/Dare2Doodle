const {
  createBookmark,
  deleteBookmark,
  getUserBookmarks
} = require('../services/appwrite.service');
const { getChallengeById } = require('../services/appwrite.service');
const validate = require('../middleware/validation.middleware');
const { writeLimiter } = require('../middleware/rateLimit.middleware');
const z = require('zod');

const bookmarkSchema = z.object({
  challengeId: z.string()
});

// Add bookmark
const addBookmark = [writeLimiter, validate(bookmarkSchema), async (req, res) => {
  try {
    const { challengeId } = req.body;

    const challenge = await getChallengeById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    // Check if already bookmarked
    const existing = (await getUserBookmarks(req.user.id)).find(b => b.challengeId === challengeId);
    if (existing) return res.status(400).json({ error: 'Already bookmarked' });

    const data = {
      userId: req.user.id,
      challengeId,
      createdAt: new Date().toISOString()
    };

    const newBookmark = await createBookmark(data);
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
}];

// Remove bookmark
const removeBookmark = async (req, res) => {
  try {
    const { challengeId } = req.query;

    await deleteBookmark(req.user.id, challengeId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
};

// Get user's bookmarks
const listBookmarks = async (req, res) => {
  try {
    const bookmarks = await getUserBookmarks(req.user.id); // Use req.user.id instead of hardcoded ID
    console.log("bookmarks", bookmarks);
    // Optionally populate with challenge data
    const populated = await Promise.all(bookmarks.map(async (b) => ({
      ...b,
      challenge: await getChallengeById(b.challengeId)
    })));
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
};

module.exports = { addBookmark, removeBookmark, listBookmarks };