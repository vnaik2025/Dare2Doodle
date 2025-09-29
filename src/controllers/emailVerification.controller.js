const { createEmailOtp, verifyEmailOtp } = require("../services/emailVerification.service");
const { getUserById } = require("../services/appwrite.service");

/**
 * Request email verification OTP
 */
const requestEmailVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isEmailVerified) {
      return res.json({ message: "Email already verified" });
    }

    await createEmailOtp(userId, user.email);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * Verify OTP
 */
const verifyEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    const result = await verifyEmailOtp(userId, otp);
    if (!result.success) return res.status(400).json({ error: result.message });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

module.exports = { requestEmailVerification, verifyEmail };
