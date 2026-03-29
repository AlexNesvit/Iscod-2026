const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const SERVICE_NAME = 'preferences';
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  database: process.env.MYSQL_DATABASE || 'preferences_db',
  user: process.env.MYSQL_USER || 'app_user',
  password: process.env.MYSQL_PASSWORD || 'app_password',
};

let mysqlConnected = false;

async function checkMySqlConnection() {
  try {
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    await connection.execute('SELECT 1');
    await connection.end();
    mysqlConnected = true;
    console.log('MySQL connected');
  } catch (error) {
    mysqlConnected = false;
    console.error('MySQL connection failed:', error.message);
  }
}

checkMySqlConnection();

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

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} service running on port ${PORT}`);
});
