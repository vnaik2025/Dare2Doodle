// src/index.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http'); // wrap app for Vercel

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

// trust proxy in prod (needed on Vercel)
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// security + logging
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// -------------------- CORS SETUP (robust/reflection) --------------------
// dev safe defaults (include your dev host)
const devOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

// env override (comma-separated)
const envOrigins =
  (process.env.CORS_ORIGINS &&
    process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)) ||
  [];

// If envOrigins provided, use that list. If not, fall back to devOrigins.
// NOTE: In production you should set CORS_ORIGINS explicitly.
let allowedOrigins = envOrigins.length > 0 ? envOrigins : devOrigins;

console.log('[CORS] Allowed origins list:', allowedOrigins);

// Use standard cors middleware (keeps things tidy)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools (no origin)
    if (!origin) return callback(null, true);

    // Allow explicit whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // If no env list was set (we are using devOrigins fallback), reflect origin
    if (envOrigins.length === 0) {
      console.warn('[CORS] No CORS_ORIGINS env configured, reflecting request origin (dev fallback).');
      return callback(null, true);
    }

    // Otherwise block
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// -------------------- Manual guard to ensure headers always appear (defensive) --------------------
// This sets Access-Control-Allow-* on every response so serverless wrappers / proxies don't drop them.
// It reflects origin if allowed (or if no envOrigins defined we allow reflection).
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const originAllowed =
      allowedOrigins.includes(origin) || envOrigins.length === 0; // allow reflection if no envOrigins
    if (originAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  } else {
    // no origin (curl/postman) — do nothing special
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  // Short-circuit preflight requests here to ensure OPTIONS always gets the headers
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
  // handle CORS callback errors
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
