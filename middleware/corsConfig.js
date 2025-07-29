const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Origin check:', origin);
    console.log('ALLOWED_ORIGINS env var:', process.env.ALLOWED_ORIGINS);
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
      : ['http://localhost:3000'];

    console.log('Parsed allowed origins:', allowedOrigins);

    // Always allow localhost origins for development
    const isLocalhost =
      origin.includes('localhost') || origin.includes('127.0.0.1');
    if (isLocalhost) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('Origin blocked:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  // Cache preflight requests for 24 hours
  maxAge: 86400,
  // Handle preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
