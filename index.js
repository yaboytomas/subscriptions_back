const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const corsConfig = require('./middleware/corsConfig');
const securityMiddleware = require('./middleware/security');
const { limiter } = require('./middleware/rateLimiter');
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected !');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityMiddleware);
app.use(corsConfig);
app.use(limiter);

// Handle preflight requests explicitly
app.options('*', corsConfig);

app.use('/users', require('./routes/userRoute'));
app.use('/clients', require('./routes/clientRoute'));

app.get('/', (req, res) => {
  res.send('Welcome to node_study');
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`This bitch is running on http://localhost:${PORT}`);
});
