const { databases, ID, Query } = require('../config/appwrite');
const { writeLimiter } = require("../middleware/rateLimit.middleware");


// Example constants
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_CHALLENGES_COLLECTION_ID;

// List challenges
const listChallenges = async (req, res) => {
  try {
    const { artStyle, tag, sort = 'top' } = req.query;
    let queries = [];

    if (artStyle) queries.push(Query.equal('artStyle', artStyle));
    if (tag) queries.push(Query.contains('tags', tag));
    if (sort === 'new') queries.push(Query.orderDesc('$createdAt'));
    if (sort === 'top') queries.push(Query.orderDesc('likes')); // example

    const challenges = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    res.json(challenges.documents);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching challenges' });
  }
};

// Get single challenge
const getChallenge = async (req, res) => {
  try {
    const challenge = await databases.getDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
    res.json(challenge);
  } catch (err) {
    res.status(404).json({ error: 'Challenge not found' });
  }
};

const addChallenge = [
  writeLimiter,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        creatorId: req.user.id, // 👈 dynamic user
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newChallenge = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        data
      );

      res.status(201).json(newChallenge);
    } catch (err) {
      console.error("Error creating challenge:", err);
      res.status(500).json({ error: "Error creating challenge" });
    }
  },
];



// Edit challenge
const editChallenge = async (req, res) => {
  try {
    const updatedData = { ...req.body, updatedAt: new Date().toISOString() };

    const updated = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, req.params.id, updatedData);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating challenge' });
  }
};

// Delete challenge
const removeChallenge = async (req, res) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting challenge' });
  }
};

module.exports = { listChallenges, getChallenge, addChallenge, editChallenge, removeChallenge };
