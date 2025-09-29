const crypto = require("crypto");
const Brevo = require("sib-api-v3-sdk");
const { updateUser, getUserById } = require("./appwrite.service");

const OTP_EXPIRY_MINUTES = 15;

// ──────────────────────────────────────────────
// Configure Brevo client
// ──────────────────────────────────────────────
const defaultClient = Brevo.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new Brevo.TransactionalEmailsApi();

/**
 * Generate a 6-digit OTP
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP via Brevo Transactional Email API
 */
const sendOtpEmail = async (email, otp) => {
  const sendSmtpEmail = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "MyApp",
    },
    to: [{ email }],
    subject: "Verify your email",
    htmlContent: `<p>Your verification code is: <b>${otp}</b>. 
                  It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo API response for ${email}:`, response);
    return response;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
};

/**
 * Create and send OTP
 * Save OTP and expiry in user document
 */
const createEmailOtp = async (userId, email) => {
  const otp = generateOtp();
  // Convert expiry to ISO string
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  // Save OTP and expiry in user document
  await updateUser(userId, {
    emailOtp: otp,
    emailOtpExpiry: expiresAt, // ✅ now ISO string, compatible with Appwrite DateTime
  });

  await sendOtpEmail(email, otp);
  return true;
};


/**
 * Verify OTP from user document
 */
const verifyEmailOtp = async (userId, enteredOtp) => {
  const user = await getUserById(userId);
  if (!user) return { success: false, message: "User not found" };

  if (!user.emailOtp || !user.emailOtpExpiry) {
    return { success: false, message: "OTP not found" };
  }

  if (Date.now() > user.emailOtpExpiry) {
    // Clear OTP fields
    await updateUser(userId, { emailOtp: null, emailOtpExpiry: null });
    return { success: false, message: "OTP expired" };
  }

  if (user.emailOtp !== enteredOtp) {
    return { success: false, message: "Invalid OTP" };
  }

  // OTP is valid, mark email as verified
  await updateUser(userId, {
    isEmailVerified: true,
    emailOtp: null,
    emailOtpExpiry: null,
  });

  return { success: true };
};

module.exports = { createEmailOtp, verifyEmailOtp };
