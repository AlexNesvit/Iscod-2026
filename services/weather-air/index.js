const express = require('express');
const cors = require('cors');
const {
  getQueryCity,
  buildEndpointUrl,
  fetchJsonWithStatus,
  createCityImageFetcher,
} = require('../shared/http');
const {
  buildHealthPayload,
  buildMissingCityPayload,
  buildAirPayload,
  buildTimePayload,
} = require('../shared/responses');

const app = express();
const PORT = Number(process.env.PORT) || 3003;
const SERVICE_NAME = 'weather-air';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const WEATHER_AIR_API_URL = process.env.WEATHER_AIR_API_URL || 'http://api.weatherapi.com/v1';
const WEATHER_AIR_API_KEY = process.env.WEATHER_AIR_API_KEY || '';
const WEATHER_AIR_USE_MOCK = String(process.env.WEATHER_AIR_USE_MOCK || 'true') === 'true';
const UNSPLASH_API_URL = process.env.UNSPLASH_API_URL || 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

function buildFallbackCityImage(city) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)}`;
}

const getCityImage = createCityImageFetcher({
  unsplashApiUrl: UNSPLASH_API_URL,
  unsplashAccessKey: UNSPLASH_ACCESS_KEY,
  buildFallbackUrl: buildFallbackCityImage,
  buildQuery: (city) => city,
});

async function buildAirDegradedResponse(city, message) {
  return buildAirPayload({
    source: 'fallback',
    degraded: true,
    city,
    temperature: null,
    unit: 'C',
    condition: null,
    conditionIcon: null,
    message,
    cityImage: await getCityImage(city),
  });
}

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

app.get('/air', async (req, res) => {
  const city = getQueryCity(req.query);

  if (!city) {
    return res.status(400).json(buildMissingCityPayload());
  }

  try {
    if (WEATHER_AIR_USE_MOCK || !WEATHER_AIR_API_KEY) {
      console.log(`[weather-air] mock response for city=${city}`);

      return res.json(
        buildAirPayload({
          source: 'mock',
          degraded: false,
          city,
          temperature: 23.4,
          unit: 'C',
          condition: 'Ensoleille',
          conditionIcon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          message: 'Mock mode enabled',
          cityImage: await getCityImage(city),
        })
      );
    }

    const endpoint = buildEndpointUrl(WEATHER_AIR_API_URL, 'current.json');
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_AIR_API_KEY)}&q=${encodeURIComponent(city)}&aqi=no&lang=fr`;
    const response = await fetchJsonWithStatus(url);

    if (!response.ok) {
      console.error(
        `[weather-air] external API error city=${city} status=${response.status} body=${response.errorBody}`
      );
      console.error('API failed, fallback used');
      return res.json(
        await buildAirDegradedResponse(city, 'Air API down: weather data temporarily unavailable')
      );
    }

    const data = response.data;
    return res.json(
      buildAirPayload({
        source: 'external',
        degraded: false,
        city: data?.location?.name || city,
        temperature: data?.current?.temp_c ?? null,
        unit: 'C',
        condition: data?.current?.condition?.text || 'Unknown',
        conditionIcon: data?.current?.condition?.icon || null,
        message: null,
        cityImage: await getCityImage(city),
      })
    );
  } catch (error) {
    console.error(`[weather-air] /air failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(await buildAirDegradedResponse(city, 'Air API down: fallback mode enabled'));
  }
});

app.get('/time', async (req, res) => {
  const city = getQueryCity(req.query);

  if (!city) {
    return res.status(400).json(buildMissingCityPayload());
  }

  try {
    if (WEATHER_AIR_USE_MOCK || !WEATHER_AIR_API_KEY) {
      console.log(`[weather-air] mock time response for city=${city}`);

      return res.json(
        buildTimePayload({
          source: 'mock',
          degraded: false,
          city,
          timezone: 'Europe/Paris',
          localTime: new Date().toISOString(),
          message: 'Mock mode enabled',
        })
      );
    }

    const endpoint = buildEndpointUrl(WEATHER_AIR_API_URL, 'timezone.json');
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_AIR_API_KEY)}&q=${encodeURIComponent(city)}`;
    const response = await fetchJsonWithStatus(url);

    if (!response.ok) {
      console.error(
        `[weather-air] timezone API error city=${city} status=${response.status} body=${response.errorBody}`
      );
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
