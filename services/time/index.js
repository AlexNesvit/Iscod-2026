const express = require('express');
const cors = require('cors');
const { getQueryCity, buildEndpointUrl, fetchJsonWithStatus } = require('../shared/http');
const {
  buildHealthPayload,
  buildMissingCityPayload,
  buildTimePayload,
} = require('../shared/responses');

const app = express();
const PORT = Number(process.env.PORT) || 3005;
const SERVICE_NAME = 'time';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const TIME_API_URL = process.env.TIME_API_URL || 'http://api.weatherapi.com/v1';
const TIME_API_KEY = process.env.TIME_API_KEY || '';
const TIME_USE_MOCK = String(process.env.TIME_USE_MOCK || 'true') === 'true';

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

function buildTimeDegradedResponse(city, message) {
  return buildTimePayload({
    source: 'fallback',
    degraded: true,
    city,
    timezone: null,
    localTime: null,
    localtimeEpoch: null,
    message,
  });
}

app.get('/health', (req, res) => {
  res.json(
    buildHealthPayload({
      service: SERVICE_NAME,
      port: PORT,
      status: 'ok',
    })
  );
});

app.get('/time', async (req, res) => {
  const city = getQueryCity(req.query);

  if (!city) {
    return res.status(400).json(buildMissingCityPayload());
  }

  try {
    if (TIME_USE_MOCK || !TIME_API_KEY) {
      return res.json(
        buildTimePayload({
          source: 'mock',
          degraded: false,
          city,
          timezone: 'Europe/Paris',
          localTime: new Date().toISOString(),
          localtimeEpoch: Math.floor(Date.now() / 1000),
          message: 'Mock mode enabled',
        })
      );
    }

    const endpoint = buildEndpointUrl(TIME_API_URL, 'timezone.json');
    const url = `${endpoint}?key=${encodeURIComponent(TIME_API_KEY)}&q=${encodeURIComponent(city)}`;
    const response = await fetchJsonWithStatus(url);

    if (!response.ok) {
      console.error(`[time] timezone API error city=${city} status=${response.status} body=${response.errorBody}`);
      console.error('API failed, fallback used');
      return res.json(buildTimeDegradedResponse(city, 'Time API down: timezone temporarily unavailable'));
    }

    const data = response.data;
    return res.json(
      buildTimePayload({
        source: 'external',
        degraded: false,
        city: data?.location?.name || city,
        timezone: data?.location?.tz_id || null,
        localTime: data?.location?.localtime || null,
        localtimeEpoch: data?.location?.localtime_epoch || null,
        message: null,
      })
    );
  } catch (error) {
    console.error(`[time] /time failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(buildTimeDegradedResponse(city, 'Time API down: fallback mode enabled'));
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service running on port ${PORT}`);
  });
}

module.exports = app;
