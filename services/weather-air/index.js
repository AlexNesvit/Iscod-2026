const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3003;
const SERVICE_NAME = 'weather-air';
const WEATHER_AIR_API_URL =
  process.env.WEATHER_AIR_API_URL || 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_AIR_API_KEY = process.env.WEATHER_AIR_API_KEY || '';
const WEATHER_AIR_USE_MOCK = String(process.env.WEATHER_AIR_USE_MOCK || 'true') === 'true';
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
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)}`;
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
        city,
        temperature: 23.4,
        unit: 'C',
        condition: 'Clear',
        cityImage,
        fetchedAt: new Date().toISOString(),
      });
    }

    const url = `${WEATHER_AIR_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_AIR_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(`[weather-air] external API error city=${city} status=${response.status} body=${payload}`);
      return res.status(502).json({ error: 'External weather API failed' });
    }

    const data = await response.json();
    const cityImage = await getCityImage(city);

    return res.json({
      source: 'external',
      city: data?.name || city,
      temperature: data?.main?.temp ?? null,
      unit: 'C',
      condition: data?.weather?.[0]?.main || 'Unknown',
      cityImage,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[weather-air] /air failed city=${city}:`, error.message);
    return res.status(500).json({ error: 'Cannot fetch air temperature right now' });
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} service running on port ${PORT}`);
});
