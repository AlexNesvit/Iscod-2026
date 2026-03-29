const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const SERVICE_NAME = 'preferences';

app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'ok',
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} service running on port ${PORT}`);
});
