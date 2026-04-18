const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3004;
const SERVICE_NAME = 'weather-water';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const WEATHER_WATER_API_URL =
  process.env.WEATHER_WATER_API_URL || 'http://api.weatherapi.com/v1';
const WEATHER_WATER_API_KEY = process.env.WEATHER_WATER_API_KEY || '';
const WEATHER_WATER_USE_MOCK = String(process.env.WEATHER_WATER_USE_MOCK || 'true') === 'true';
const UNSPLASH_API_URL = process.env.UNSPLASH_API_URL || 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

// Active CORS pour les appels frontend.
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

// Endpoint de sante pour supervision du service weather-water.
app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'ok',
    port: PORT,
  });
});

// Construit une image de secours orientee eau.
function buildFallbackCityImage(city) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},water`;
}

// Construit une reponse eau degradee en mode fallback.
async function buildWaterDegradedResponse(city, message) {
  return {
    source: 'fallback',
    degraded: true,
    city,
    waterTemperature: null,
    unit: 'C',
    waterState: 'Not available',
    showWater: false,
    message,
    cityImage: await getCityImage(city),
    fetchedAt: new Date().toISOString(),
  };
}

// Cherche une temperature d'eau dans plusieurs zones de la reponse API.
function pickWaterTemperatureC(data) {
  const direct = data?.current?.water_temp_c;
  if (Number.isFinite(direct)) {
    return direct;
  }

  const forecastDay = data?.forecast?.forecastday?.[0];
  if (!forecastDay) {
    return null;
  }

  const fromHour = forecastDay?.hour?.find((entry) => Number.isFinite(entry?.water_temp_c));
  if (fromHour) {
    return fromHour.water_temp_c;
  }

  const fromTide = forecastDay?.tides?.[0]?.tide?.find((entry) => Number.isFinite(entry?.water_temp_c));
  if (fromTide) {
    return fromTide.water_temp_c;
  }

  return null;
}

// Estime une temperature d'eau a partir de la moyenne jour si necessaire.
function pickEstimatedWaterTemperatureC(data) {
  const fromDayAvg = data?.forecast?.forecastday?.[0]?.day?.avgtemp_c;
  if (Number.isFinite(fromDayAvg)) {
    return fromDayAvg;
  }

  return null;
}

// Tente de recuperer une image de ville/eau via Unsplash.
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

// Retourne la meteo eau (mock ou API externe), avec fallback degrade.
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
        degraded: false,
        city,
        waterTemperature: 18.2,
        unit: 'C',
        waterState: 'Swimmable',
        showWater: true,
        message: 'Mock mode enabled',
        cityImage,
        fetchedAt: new Date().toISOString(),
      });
    }

    const endpoint = WEATHER_WATER_API_URL.endsWith('/marine.json')
      ? WEATHER_WATER_API_URL
      : `${WEATHER_WATER_API_URL.replace(/\/$/, '')}/marine.json`;
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_WATER_API_KEY)}&q=${encodeURIComponent(city)}&days=1`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      console.error(
        `[weather-water] external API error city=${city} status=${response.status} body=${payload}`
      );
      console.error('API failed, fallback used');
      return res.json(
        await buildWaterDegradedResponse(city, 'Water API down: water data temporarily unavailable')
      );
    }

    const data = await response.json();
    const cityImage = await getCityImage(city);
    const waterTemperature = pickWaterTemperatureC(data);

    if (!Number.isFinite(waterTemperature)) {
      const estimatedWaterTemperature = pickEstimatedWaterTemperatureC(data);

      if (Number.isFinite(estimatedWaterTemperature)) {
        return res.status(200).json({
          source: 'external',
          degraded: true,
          city: data?.location?.name || city,
          waterTemperature: estimatedWaterTemperature,
          unit: 'C',
          waterState: null,
          showWater: true,
          message: null,
          cityImage,
          fetchedAt: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        source: 'external',
        degraded: true,
        city: data?.location?.name || city,
        waterTemperature: null,
        unit: 'C',
        waterState: 'No nearby sea/lake data',
        showWater: false,
        message: 'Pas de donnees eau pour cette ville',
        cityImage,
        fetchedAt: new Date().toISOString(),
      });
    }

    return res.json({
      source: 'external',
      degraded: false,
      city: data?.location?.name || city,
      waterTemperature,
      unit: 'C',
      waterState: 'Temperature marine',
      showWater: true,
      message: null,
      cityImage,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[weather-water] /water failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(await buildWaterDegradedResponse(city, 'Water API down: fallback mode enabled'));
  }
});

// Demarre le serveur HTTP quand le fichier est lance directement.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service running on port ${PORT}`);
  });
}

module.exports = app;
