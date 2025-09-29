const express = require('express');
const { register, login, sendOtp, verifyEmail } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-email', verifyEmail);

module.exports = router;
