const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../services/appwrite.service');
const validate = require('../middleware/validation.middleware');
const z = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*[a-z])(?=.*\d)/i) // letter + number
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const register = [validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      createdAt: new Date().toISOString()
    };

    const newUser = await createUser(userData);

    res.status(201).json({
      id: newUser.$id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
}];

const login = [validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
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
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
}];

module.exports = { register, login };