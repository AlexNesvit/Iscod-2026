const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3003;
const SERVICE_NAME = 'weather-air';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const WEATHER_AIR_API_URL =
  process.env.WEATHER_AIR_API_URL || 'http://api.weatherapi.com/v1';
const WEATHER_AIR_API_KEY = process.env.WEATHER_AIR_API_KEY || '';
const WEATHER_AIR_USE_MOCK = String(process.env.WEATHER_AIR_USE_MOCK || 'true') === 'true';
const UNSPLASH_API_URL = process.env.UNSPLASH_API_URL || 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'ok',
    port: PORT,
  });
});

function buildFallbackCityImage(city) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)}`;
}

async function buildAirDegradedResponse(city, message) {
  return {
    source: 'fallback',
    degraded: true,
    city,
    temperature: null,
    unit: 'C',
    condition: null,
    message,
    cityImage: await getCityImage(city),
    fetchedAt: new Date().toISOString(),
  };
}

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

async function getCityImage(city) {
  if (!UNSPLASH_ACCESS_KEY) {
    return buildFallbackCityImage(city);
  }

  try {
    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(city)}&orientation=landscape`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      return buildFallbackCityImage(city);
    }

    const data = await response.json();
    return data?.urls?.regular || buildFallbackCityImage(city);
  } catch (error) {
    return buildFallbackCityImage(city);
  }
}

app.get('/air', async (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  if (!city) {
    return res.status(400).json({ error: 'city query param is required' });
  }

  try {
    if (WEATHER_AIR_USE_MOCK || !WEATHER_AIR_API_KEY) {
      console.log(`[weather-air] mock response for city=${city}`);

      const cityImage = await getCityImage(city);
      return res.json({
        source: 'mock',
        degraded: false,
        city,
        temperature: 23.4,
        unit: 'C',
        condition: 'Clear',
        message: 'Mock mode enabled',
        cityImage,
        fetchedAt: new Date().toISOString(),
      });
    }

    const endpoint = WEATHER_AIR_API_URL.endsWith('/current.json')
      ? WEATHER_AIR_API_URL
      : `${WEATHER_AIR_API_URL.replace(/\/$/, '')}/current.json`;
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_AIR_API_KEY)}&q=${encodeURIComponent(city)}&aqi=no`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(`[weather-air] external API error city=${city} status=${response.status} body=${payload}`);
      console.error('API failed, fallback used');
      return res.json(
        await buildAirDegradedResponse(city, 'Air API down: weather data temporarily unavailable')
      );
    }

    const data = await response.json();
    const cityImage = await getCityImage(city);

    return res.json({
      source: 'external',
      degraded: false,
      city: data?.location?.name || city,
      temperature: data?.current?.temp_c ?? null,
      unit: 'C',
      condition: data?.current?.condition?.text || 'Unknown',
      message: null,
      cityImage,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[weather-air] /air failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(await buildAirDegradedResponse(city, 'Air API down: fallback mode enabled'));
  }
});

app.get('/time', async (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  if (!city) {
    return res.status(400).json({ error: 'city query param is required' });
  }

  try {
    if (WEATHER_AIR_USE_MOCK || !WEATHER_AIR_API_KEY) {
      console.log(`[weather-air] mock time response for city=${city}`);

      return res.json({
        source: 'mock',
        degraded: false,
        city,
        timezone: 'Europe/Paris',
        localTime: new Date().toISOString(),
        message: 'Mock mode enabled',
        fetchedAt: new Date().toISOString(),
      });
    }

    const endpoint = WEATHER_AIR_API_URL.endsWith('/timezone.json')
      ? WEATHER_AIR_API_URL
      : `${WEATHER_AIR_API_URL.replace(/\/$/, '')}/timezone.json`;
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_AIR_API_KEY)}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(`[weather-air] timezone API error city=${city} status=${response.status} body=${payload}`);
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
    console.error(`[weather-air] /time failed city=${city}:`, error.message);
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
