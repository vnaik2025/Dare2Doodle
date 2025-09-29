// emailVerification.routes.js
const express = require("express");
const authenticate = require("../middleware/authMiddleware"); // ✅ no destructure
const { requestEmailVerification, verifyEmail } = require("../controllers/emailVerification.controller");

const router = express.Router();

router.post("/request", authenticate, requestEmailVerification);
router.post("/verify", authenticate, verifyEmail);

module.exports = router;
