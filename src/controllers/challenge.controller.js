const express = require("express");
const { databases, ID, Query } = require('../config/appwrite');
const { writeLimiter } = require("../middleware/rateLimit.middleware");
const ImageKit = require("imagekit");
const multer = require("multer");

// Validate ImageKit configuration
const imageKitConfig = {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};

if (!imageKitConfig.publicKey || !imageKitConfig.privateKey || !imageKitConfig.urlEndpoint) {
  console.error("ImageKit configuration is incomplete. Please check environment variables.");
}

// Initialize ImageKit
const imageKit = new ImageKit(imageKitConfig);

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log("Multer processing file:", file ? file.originalname : "No file provided");
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!file) {
      return cb(null, false); // Skip if no file, allow processing to continue
    }
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
}).single("image");

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
    if (sort === 'top') queries.push(Query.orderDesc('views'));

    

    const challenges = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    res.json(challenges.documents);
  } catch (err) {
    console.error("Error fetching challenges:", err);
    res.status(500).json({ error: 'Error fetching challenges' });
  }
};

// Get single challenge
const getChallenge = async (req, res) => {
  try {
    const challenge = await databases.getDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
    res.json(challenge);
  } catch (err) {
    console.error("Error fetching challenge:", err);
    res.status(404).json({ error: 'Challenge not found' });
  }
};

// Add challenge with image upload
const addChallenge = [
  writeLimiter,
  upload,
  async (req, res) => {
    try {
      let challengeData = {
        ...req.body,
        creatorId: req.user.id,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: null, // Initialize imageUrl
      };


      // Ensure tags is an array
if (typeof challengeData.tags === "string") {
  try {
    challengeData.tags = JSON.parse(challengeData.tags);
  } catch {
    challengeData.tags = []; // fallback
  }
}

      // Handle image upload
      if (req.file) {
        try {
          console.log("Uploading to ImageKit:", req.file.originalname);
          const uploadResponse = await imageKit.upload({
            file: req.file.buffer,
            fileName: `challenge_${Date.now()}_${req.file.originalname}`,
            folder: "/ad_units",
            tags: ["challenge", "image"],
          });

          console.log("ImageKit upload response:", {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
          });

          // Combine URL and fileId into a single string
          challengeData.imageUrl = `${uploadResponse.url}|${uploadResponse.fileId}`;
        } catch (imageKitError) {
          console.error("ImageKit upload failed:", imageKitError.message);
          // Optionally, proceed with challenge creation but include error
          challengeData.image_upload_error = `Failed to upload image: ${imageKitError.message}`;
        }
      }

      console.log("Creating challenge with data:", challengeData);
      const newChallenge = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        challengeData
      );

      res.status(201).json(newChallenge);
    } catch (err) {
      console.error("Error creating challenge:", err);
      res.status(500).json({ error: "Error creating challenge" });
    }
  },
];

// Edit challenge with image update
const editChallenge = [
  upload,
  async (req, res) => {
    try {
      let updatedData = { ...req.body, updatedAt: new Date().toISOString() };

      // Fetch existing challenge to get current image details
      const existingChallenge = await databases.getDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
      if (!existingChallenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      // Delete existing image from ImageKit if it exists and a new image is uploaded
      if (req.file && existingChallenge.imageUrl) {
        const [, fileId] = existingChallenge.imageUrl.split('|');
        if (fileId) {
          try {
            await imageKit.deleteFile(fileId);
            console.log(`Deleted ImageKit file: ${fileId} for challenge ${req.params.id}`);
          } catch (imageKitError) {
            console.error(`Failed to delete ImageKit file for challenge ${req.params.id}:`, imageKitError.message);
          }
        }
      }

      // Handle new image upload
      if (req.file) {
        try {
          const uploadResponse = await imageKit.upload({
            file: req.file.buffer,
            fileName: `challenge_${Date.now()}_${req.file.originalname}`,
            folder: "/ad_units",
            tags: ["challenge", "image"],
          });

          updatedData.imageUrl = `${uploadResponse.url}|${uploadResponse.fileId}`;
        } catch (imageKitError) {
          console.error("ImageKit upload failed:", imageKitError.message);
          updatedData.image_upload_error = `Failed to upload image: ${imageKitError.message}`;
        }
      }

      const updated = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, req.params.id, updatedData);
      res.json(updated);
    } catch (err) {
      console.error("Error updating challenge:", err);
      res.status(500).json({ error: 'Error updating challenge' });
    }
  },
];

// Delete challenge
const removeChallenge = async (req, res) => {
  try {
    // Fetch challenge to get image details
    const challenge = await databases.getDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Delete image from ImageKit if it exists
    if (challenge.imageUrl) {
      const [, fileId] = challenge.imageUrl.split('|');
      if (fileId) {
        try {
          await imageKit.deleteFile(fileId);
          console.log(`Deleted ImageKit file: ${fileId} for challenge ${req.params.id}`);
        } catch (imageKitError) {
          console.error(`Failed to delete ImageKit file for challenge ${req.params.id}:`, imageKitError.message);
        }
      }
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting challenge:", err);
    res.status(500).json({ error: 'Error deleting challenge' });
  }
};

module.exports = { listChallenges, getChallenge, addChallenge, editChallenge, removeChallenge };