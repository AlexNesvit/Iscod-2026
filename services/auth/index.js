const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const verifyToken = require('./middleware/verifyToken');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const SERVICE_NAME = 'auth';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

let mongoConnected = false;

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json());

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

app.post('/register', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must contain at least 8 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      role: 'user',
    });

    return res.status(201).json({
      message: 'User registered',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Register failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        sub: String(user._id),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('_id email role createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Cannot fetch profile' });
  }
});

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
