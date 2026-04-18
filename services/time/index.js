const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3005;
const SERVICE_NAME = 'time';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const TIME_API_URL = process.env.TIME_API_URL || 'http://api.weatherapi.com/v1';
const TIME_API_KEY = process.env.TIME_API_KEY || '';
const TIME_USE_MOCK = String(process.env.TIME_USE_MOCK || 'true') === 'true';

// Active CORS pour les appels frontend.
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

// Construit une reponse heure degradee en mode fallback.
function buildTimeDegradedResponse(city, message) {
  return {
    source: 'fallback',
    degraded: true,
    city,
    timezone: null,
    localTime: null,
    localtimeEpoch: null,
    message,
    fetchedAt: new Date().toISOString(),
  };
}

// Endpoint de sante pour supervision du service time.
app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'ok',
    port: PORT,
  });
});

// Retourne fuseau/localTime (mock ou API externe), avec fallback.
app.get('/time', async (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  if (!city) {
    return res.status(400).json({ error: 'city query param is required' });
  }

  try {
    if (TIME_USE_MOCK || !TIME_API_KEY) {
      return res.json({
        source: 'mock',
        degraded: false,
        city,
        timezone: 'Europe/Paris',
        localTime: new Date().toISOString(),
        localtimeEpoch: Math.floor(Date.now() / 1000),
        message: 'Mock mode enabled',
        fetchedAt: new Date().toISOString(),
      });
    }

    const endpoint = TIME_API_URL.endsWith('/timezone.json')
      ? TIME_API_URL
      : `${TIME_API_URL.replace(/\/$/, '')}/timezone.json`;
    const url = `${endpoint}?key=${encodeURIComponent(TIME_API_KEY)}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(`[time] timezone API error city=${city} status=${response.status} body=${payload}`);
      console.error('API failed, fallback used');
      return res.json(buildTimeDegradedResponse(city, 'Time API down: timezone temporarily unavailable'));
    }

    const data = await response.json();
    return res.json({
      source: 'external',
      degraded: false,
      city: data?.location?.name || city,
      timezone: data?.location?.tz_id || null,
      localTime: data?.location?.localtime || null,
      localtimeEpoch: data?.location?.localtime_epoch || null,
      message: null,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[time] /time failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(buildTimeDegradedResponse(city, 'Time API down: fallback mode enabled'));
  }
});

// Demarre le serveur HTTP quand le fichier est lance directement.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service running on port ${PORT}`);
  });
}

module.exports = app;
