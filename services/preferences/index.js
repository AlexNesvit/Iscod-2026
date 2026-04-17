const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const verifyToken = require('../shared/middleware/verifyToken');

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const SERVICE_NAME = 'preferences';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  database: process.env.MYSQL_DATABASE || 'preferences_db',
  user: process.env.MYSQL_USER || 'app_user',
  password: process.env.MYSQL_PASSWORD || 'app_password',
};

const pool = mysql.createPool({
  ...MYSQL_CONFIG,
  waitForConnections: true,
  connectionLimit: 10,
});

let mysqlConnected = false;

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json());

async function checkMySqlConnection() {
  try {
    await pool.query('SELECT 1');
    mysqlConnected = true;
    console.log('MySQL connected');
  } catch (error) {
    mysqlConnected = false;
    console.error('MySQL connection failed:', error.message);
  }
}

if (process.env.NODE_ENV !== 'test') {
  checkMySqlConnection();
}

app.use('/favorites', verifyToken);
app.use('/alerts', verifyToken);

app.post('/favorites', async (req, res) => {
  const userId = req.user?.sub;
  const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';

  if (!city) {
    return res.status(400).json({ error: 'city is required' });
  }

  try {
    console.log(`[preferences] POST /favorites user=${userId} city=${city}`);

    const [result] = await pool.execute(
      'INSERT INTO favorites (user_id, city_code, label) VALUES (?, ?, ?)',
      [userId, city, city]
    );

    const [rows] = await pool.execute(
      'SELECT id, user_id, city_code, label, created_at FROM favorites WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Favorite already exists for this city' });
    }

    console.error('[preferences] POST /favorites failed:', error.message);
    return res.status(500).json({ error: 'Cannot create favorite' });
  }
});

app.get('/favorites', async (req, res) => {
  const userId = req.user?.sub;

  try {
    console.log(`[preferences] GET /favorites user=${userId}`);

    const [rows] = await pool.execute(
      'SELECT id, user_id, city_code, label, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('[preferences] GET /favorites failed:', error.message);
    return res.status(500).json({ error: 'Cannot fetch favorites' });
  }
});

app.delete('/favorites/:id', async (req, res) => {
  const userId = req.user?.sub;
  const favoriteId = Number(req.params.id);

  if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
    return res.status(400).json({ error: 'Invalid favorite id' });
  }

  try {
    console.log(`[preferences] DELETE /favorites/${favoriteId} user=${userId}`);

    const [result] = await pool.execute('DELETE FROM favorites WHERE id = ? AND user_id = ?', [
      favoriteId,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    return res.json({ message: 'Favorite deleted' });
  } catch (error) {
    console.error('[preferences] DELETE /favorites/:id failed:', error.message);
    return res.status(500).json({ error: 'Cannot delete favorite' });
  }
});

app.post('/alerts', async (req, res) => {
  const userId = req.user?.sub;
  const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';
  const threshold = Number(req.body.threshold);

  if (!city) {
    return res.status(400).json({ error: 'city is required' });
  }

  if (!Number.isFinite(threshold)) {
    return res.status(400).json({ error: 'threshold must be a valid number' });
  }

  try {
    console.log(`[preferences] POST /alerts user=${userId} city=${city} threshold=${threshold}`);

    const [result] = await pool.execute(
      'INSERT INTO alerts (user_id, city_code, type, threshold, direction) VALUES (?, ?, ?, ?, ?)',
      [userId, city, 'air', threshold, 'ABOVE']
    );

    const [rows] = await pool.execute(
      'SELECT id, user_id, city_code, type, threshold, direction, created_at FROM alerts WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('[preferences] POST /alerts failed:', error.message);
    return res.status(500).json({ error: 'Cannot create alert' });
  }
});

app.get('/alerts', async (req, res) => {
  const userId = req.user?.sub;

  try {
    console.log(`[preferences] GET /alerts user=${userId}`);

    const [rows] = await pool.execute(
      'SELECT id, user_id, city_code, type, threshold, direction, created_at FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('[preferences] GET /alerts failed:', error.message);
    return res.status(500).json({ error: 'Cannot fetch alerts' });
  }
});

app.get('/health', (req, res) => {
  const status = mysqlConnected ? 'ok' : 'degraded';

  res.json({
    service: SERVICE_NAME,
    status,
    port: PORT,
    mysql: {
      connected: mysqlConnected,
      host: MYSQL_CONFIG.host,
      database: MYSQL_CONFIG.database,
    },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service running on port ${PORT}`);
  });
}

module.exports = app;
