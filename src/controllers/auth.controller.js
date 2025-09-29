// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { createUser, getUserByEmail } = require('../services/appwrite.service');
// const validate = require('../middleware/validation.middleware');
// const z = require('zod');

// const registerSchema = z.object({
//   username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
//   email: z.string().email(),
//   password: z.string().min(8).regex(/(?=.*[a-z])(?=.*\d)/i) // letter + number
// });

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string()
// });

// const register = [validate(registerSchema), async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await getUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userData = {
//       username,
//       email,
//       password: hashedPassword,
//       bio: '',
//       avatarUrl: '',
//       bannerUrl: '',
//       links: [],
//       nsfw: false,
//       role: 'user',
//       createdAt: new Date().toISOString()
//     };

//     const newUser = await createUser(userData);

//     res.status(201).json({
//       id: newUser.$id,
//       username: newUser.username,
//       email: newUser.email
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed', details: error.message });
//   }
// }];

// const login = [validate(loginSchema), async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await getUserByEmail(email);
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user.$id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.$id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed', details: error.message });
//   }
// }];

// module.exports = { register, login };



// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const { createUser, getUserByEmail, updateUser } = require('../services/appwrite.service');
// const validate = require('../middleware/validation.middleware');
// const z = require('zod');

// const registerSchema = z.object({
//   username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
//   email: z.string().email(),
//   password: z.string().min(8).regex(/(?=.*[a-z])(?=.*\d)/i)
// });

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string()
// });

// // setup email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail", // or SMTP config
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // send OTP email
// const sendOtpEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"My App" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     text: `Your OTP is ${otp}`,
//     html: `<p>Your OTP is <b>${otp}</b></p>`
//   });
// };

// const register = [validate(registerSchema), async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await getUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

//     const userData = {
//       username,
//       email,
//       password: hashedPassword,
//       bio: '',
//       avatarUrl: '',
//       bannerUrl: '',
//       links: [],
//       nsfw: false,
//       role: 'user',
//       createdAt: new Date().toISOString(),
//       isEmailVerified: false,
//       emailOtp: otp,
//       emailOtpExpiry: otpExpiry
//     };

//     const newUser = await createUser(userData);

//     await sendOtpEmail(email, otp);

//     res.status(201).json({
//       id: newUser.$id,
//       username: newUser.username,
//       email: newUser.email,
//       message: "User registered. Please verify your email."
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed', details: error.message });
//   }
// }];

// const login = [validate(loginSchema), async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await getUserByEmail(email);
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user.$id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.$id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified || false
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed', details: error.message });
//   }
// }];

// // resend OTP
// const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await getUserByEmail(email);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

//     await updateUser(user.$id, { emailOtp: otp, emailOtpExpiry: otpExpiry });

//     await sendOtpEmail(email, otp);

//     res.json({ message: "OTP sent" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to send OTP", details: err.message });
//   }
// };

// // verify email
// const verifyEmail = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await getUserByEmail(email);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (user.isEmailVerified) {
//       return res.json({ message: "Email already verified" });
//     }

//     if (user.emailOtp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     if (new Date() > new Date(user.emailOtpExpiry)) {
//       return res.status(400).json({ error: "OTP expired" });
//     }

//     await updateUser(user.$id, {
//       isEmailVerified: true,
//       emailOtp: null,
//       emailOtpExpiry: null
//     });

//     res.json({ message: "Email verified successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Verification failed", details: err.message });
//   }
// };

// module.exports = { register, login, sendOtp, verifyEmail };


// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Brevo = require('sib-api-v3-sdk');
const { createUser, getUserByEmail, updateUser } = require('../services/appwrite.service');
const validate = require('../middleware/validation.middleware');
const z = require('zod');

const OTP_EXPIRY_MINUTES = 15;

// ----------------------
// Validation Schemas
// ----------------------
const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*[a-z])(?=.*\d)/i)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// ----------------------
// Configure Brevo
// ----------------------
const defaultClient = Brevo.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new Brevo.TransactionalEmailsApi();

/**
 * Generate 6-digit OTP
 */
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

/**
 * Send OTP email via Brevo
 */
const sendOtpEmail = async (email, otp) => {
  const sendSmtpEmail = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "MyApp",
    },
    to: [{ email }],
    subject: "Verify your email",
    htmlContent: `<p>Your verification code is: <b>${otp}</b>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo API response for ${email}:`, response);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
};

// ----------------------
// REGISTER
// ----------------------
const register = [
  validate(registerSchema),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

      const userData = {
        username,
        email,
        password: hashedPassword,
        bio: '',
        avatarUrl: '',
        bannerUrl: '',
        links: [],
        nsfw: false,
        role: 'user',
        createdAt: new Date().toISOString(),
        isEmailVerified: false,
        emailOtp: otp,
        emailOtpExpiry: otpExpiry
      };

      const newUser = await createUser(userData);

      await sendOtpEmail(email, otp);

      res.status(201).json({
        id: newUser.$id,
        username: newUser.username,
        email: newUser.email,
        message: "User registered. Please verify your email."
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }
];

// ----------------------
// LOGIN
// ----------------------
const login = [
  validate(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.$id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: {
          id: user.$id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified || false
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  }
];

// ----------------------
// RESEND OTP
// ----------------------
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    await updateUser(user.$id, { emailOtp: otp, emailOtpExpiry: otpExpiry });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
};

// ----------------------
// VERIFY EMAIL
// ----------------------
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isEmailVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > new Date(user.emailOtpExpiry)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await updateUser(user.$id, {
      isEmailVerified: true,
      emailOtp: null,
      emailOtpExpiry: null
    });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
};

module.exports = { register, login, sendOtp, verifyEmail };
