const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const companyRoutes = require('./routes/companyRoutes');
const authRoutes = require('./routes/authRoutes');
const { initializeStore } = require('./utils/companyDataStore');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.locals.companyStore = initializeStore();

app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Company Directory Management System API is running',
    status: 'ready',
    documentation: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

function startServer(port) {
  return app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

function tryStart(port) {
  const server = startServer(port);
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead.`);
      server.close(() => tryStart(fallbackPort));
    } else {
      console.error(error.message);
    }
  });
}

tryStart(PORT);
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.warn('MONGO_URI not configured. The app will run with a local fallback store for demo purposes.');
} else {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      console.warn('Continuing with fallback mode.');
    });
}

