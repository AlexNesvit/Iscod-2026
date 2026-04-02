const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3004;
const SERVICE_NAME = 'weather-water';
const WEATHER_WATER_API_URL =
  process.env.WEATHER_WATER_API_URL || 'http://api.weatherapi.com/v1';
const WEATHER_WATER_API_KEY = process.env.WEATHER_WATER_API_KEY || '';
const WEATHER_WATER_USE_MOCK = String(process.env.WEATHER_WATER_USE_MOCK || 'true') === 'true';
const UNSPLASH_API_URL = process.env.UNSPLASH_API_URL || 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'ok',
    port: PORT,
  });
});

function buildFallbackCityImage(city) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},water`;
}

async function getCityImage(city) {
  if (!UNSPLASH_ACCESS_KEY) {
    return buildFallbackCityImage(city);
  }

  try {
    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(city)}%20water&orientation=landscape`;
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

app.get('/water', async (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  if (!city) {
    return res.status(400).json({ error: 'city query param is required' });
  }

  try {
    if (WEATHER_WATER_USE_MOCK || !WEATHER_WATER_API_KEY) {
      console.log(`[weather-water] mock response for city=${city}`);

      const cityImage = await getCityImage(city);
      return res.json({
        source: 'mock',
        city,
        waterTemperature: 18.2,
        unit: 'C',
        waterState: 'Swimmable',
        cityImage,
        fetchedAt: new Date().toISOString(),
      });
    }

    const endpoint = WEATHER_WATER_API_URL.endsWith('/current.json')
      ? WEATHER_WATER_API_URL
      : `${WEATHER_WATER_API_URL.replace(/\/$/, '')}/current.json`;
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_WATER_API_KEY)}&q=${encodeURIComponent(city)}&aqi=no`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(
        `[weather-water] external API error city=${city} status=${response.status} body=${payload}`
      );
      return res.status(502).json({ error: 'External water API failed' });
    }

    const data = await response.json();
    const cityImage = await getCityImage(city);

    return res.json({
      source: 'external',
      city: data?.location?.name || city,
      waterTemperature: data?.current?.temp_c ?? null,
      unit: 'C',
      waterState: 'Estimated',
      cityImage,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[weather-water] /water failed city=${city}:`, error.message);
    return res.status(500).json({ error: 'Cannot fetch water temperature right now' });
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} service running on port ${PORT}`);
});
