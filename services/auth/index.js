const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const SERVICE_NAME = 'auth';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db';

let mongoConnected = false;

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    mongoConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    mongoConnected = false;
    console.error('MongoDB connection failed:', error.message);
  }
}

connectMongo();

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const status = dbStatus === 'connected' ? 'ok' : 'degraded';

  res.json({
    service: SERVICE_NAME,
    status,
    port: PORT,
    mongo: {
      connected: mongoConnected,
      state: dbStatus,
    },
  });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} service running on port ${PORT}`);
});
