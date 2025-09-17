// src/index.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http');

// route + middleware imports
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const commentRoutes = require('./routes/comment.routes');
const likesRoutes = require('./routes/likes.routes');
const bookmarksRoutes = require('./routes/bookmarks.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const reportsRoutes = require('./routes/reports.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// -------------------- CORS --------------------
const devOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

const envOrigins =
  (process.env.CORS_ORIGINS &&
    process.env.CORS_ORIGINS.split(',').map(s => s.trim())) ||
  [];

// Always include dev + env origins
let allowedOrigins = [...devOrigins, ...envOrigins];

// Fallback: if empty, allow all (not recommended for prod)
if (allowedOrigins.length === 0) {
  console.warn('[CORS] No origins configured. Allowing all origins.');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl/postman

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all if not configured
    if (allowedOrigins.length === 0) return callback(null, true);

    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight everywhere

// -------------------- Rate limiting --------------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later.' },
});

// -------------------- Health check --------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// -------------------- Routes --------------------
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', userRoutes);

// -------------------- 404 --------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ error: err.message });
  }
  if (NODE_ENV !== 'production') {
    return errorHandler(err, req, res, next);
  }
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// -------------------- Export / Listen --------------------
if (process.env.VERCEL || NODE_ENV === 'production') {
  console.log(`[server] Running in serverless mode. Allowed origins: ${allowedOrigins.join(', ')}`);
  module.exports = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  });
}
