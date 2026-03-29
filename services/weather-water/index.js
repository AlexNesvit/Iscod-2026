const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3004;
const SERVICE_NAME = 'weather-water';

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
