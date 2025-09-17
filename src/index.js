require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http'); // wrap app for serverless

// Your existing route and middleware imports (keep same paths)
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

// trust proxy on production (Vercel / proxies)
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// security + parsing + logging
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// -------------------- CORS SETUP (robust for production & local dev) --------------------
// Dev defaults you had
const devDefaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4200',
  // add any other local dev hosts here
];

// Read env var (comma separated)
const envOrigins =
  (process.env.CORS_ORIGINS &&
    process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)) ||
  [];

// allowedOrigins: prefer explicit env var. But to avoid accidental total block,
// if envOrigins is empty we will *reflect* incoming origin (allow all browser origins) but log a warning.
// If you want strict mode in prod, set CORS_ORIGINS in Vercel to exact origins.
let allowedOrigins = [...devDefaultOrigins, ...envOrigins];

// If in production and you explicitly want to only use envOrigins, uncomment below:
// if (NODE_ENV === 'production') allowedOrigins = envOrigins;

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools (curl, server-to-server) that have no origin
    if (!origin) return callback(null, true);

    // If we have configured allowedOrigins and it's non-empty, check against it
    if (Array.isArray(allowedOrigins) && allowedOrigins.length > 0) {
      if (allowedOrigins.includes(origin)) return callback(null, origin);

      // Not in whitelist
      return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    }

    // No origins configured (fallback): reflect the request origin (allows browser requests)
    // WARNING: this will allow any origin. For production tighten by setting CORS_ORIGINS env var.
    console.warn(
      '[CORS] No allowed origins configured (CORS_ORIGINS empty). Allowing all origins by reflecting request origin.'
    );
    return callback(null, origin);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
};

// Enable cors middleware and respond to preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight for all routes

// -------------------- rate limiting --------------------
app.use(
  rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
      : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// tighter auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later.' },
});

// health check
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// central error handler
app.use((err, req, res, next) => {
  // If CORS error thrown by cors callback, send 403 and message
  if (err && err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ error: err.message });
  }

  if (NODE_ENV !== 'production') {
    return errorHandler(err, req, res, next);
  }
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// -------------------- Export / listen --------------------
// If running locally (development), keep the existing listen() behavior so `node src/index.js` still works.
// On Vercel / serverless (NODE_ENV === 'production' or process.env.VERCEL), export serverless handler.
if (process.env.VERCEL || NODE_ENV === 'production') {
  console.log(`[server] Running in serverless/production mode. Allowed origins: ${allowedOrigins.join(', ')}`);
  module.exports = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  });
}