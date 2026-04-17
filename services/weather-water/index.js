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
  buildWaterPayload,
} = require('../shared/responses');

const app = express();
const PORT = Number(process.env.PORT) || 3004;
const SERVICE_NAME = 'weather-water';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const WEATHER_WATER_API_URL = process.env.WEATHER_WATER_API_URL || 'http://api.weatherapi.com/v1';
const WEATHER_WATER_API_KEY = process.env.WEATHER_WATER_API_KEY || '';
const WEATHER_WATER_USE_MOCK = String(process.env.WEATHER_WATER_USE_MOCK || 'true') === 'true';
const UNSPLASH_API_URL = process.env.UNSPLASH_API_URL || 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

function buildFallbackCityImage(city) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},water`;
}

const getCityImage = createCityImageFetcher({
  unsplashApiUrl: UNSPLASH_API_URL,
  unsplashAccessKey: UNSPLASH_ACCESS_KEY,
  buildFallbackUrl: buildFallbackCityImage,
  buildQuery: (city) => `${city} water`,
});

async function buildWaterDegradedResponse(city, message) {
  return buildWaterPayload({
    source: 'fallback',
    degraded: true,
    city,
    waterTemperature: null,
    unit: 'C',
    waterState: 'Not available',
    showWater: false,
    message,
    cityImage: await getCityImage(city),
  });
}

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

function pickEstimatedWaterTemperatureC(data) {
  const fromDayAvg = data?.forecast?.forecastday?.[0]?.day?.avgtemp_c;
  if (Number.isFinite(fromDayAvg)) {
    return fromDayAvg;
  }

  return null;
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

app.get('/water', async (req, res) => {
  const city = getQueryCity(req.query);

  if (!city) {
    return res.status(400).json(buildMissingCityPayload());
  }

  try {
    if (WEATHER_WATER_USE_MOCK || !WEATHER_WATER_API_KEY) {
      console.log(`[weather-water] mock response for city=${city}`);

      return res.json(
        buildWaterPayload({
          source: 'mock',
          degraded: false,
          city,
          waterTemperature: 18.2,
          unit: 'C',
          waterState: 'Swimmable',
          showWater: true,
          message: 'Mock mode enabled',
          cityImage: await getCityImage(city),
        })
      );
    }

    const endpoint = buildEndpointUrl(WEATHER_WATER_API_URL, 'marine.json');
    const url = `${endpoint}?key=${encodeURIComponent(WEATHER_WATER_API_KEY)}&q=${encodeURIComponent(city)}&days=1`;
    const response = await fetchJsonWithStatus(url);

    if (!response.ok) {
      console.error(
        `[weather-water] external API error city=${city} status=${response.status} body=${response.errorBody}`
      );
      console.error('API failed, fallback used');
      return res.json(
        await buildWaterDegradedResponse(city, 'Water API down: water data temporarily unavailable')
      );
    }

    const data = response.data;
    const waterTemperature = pickWaterTemperatureC(data);
    const cityImage = await getCityImage(city);

    if (!Number.isFinite(waterTemperature)) {
      const estimatedWaterTemperature = pickEstimatedWaterTemperatureC(data);

      if (Number.isFinite(estimatedWaterTemperature)) {
        return res.status(200).json(
          buildWaterPayload({
            source: 'external',
            degraded: true,
            city: data?.location?.name || city,
            waterTemperature: estimatedWaterTemperature,
            unit: 'C',
            waterState: null,
            showWater: true,
            message: null,
            cityImage,
          })
        );
      }

      return res.status(200).json(
        buildWaterPayload({
          source: 'external',
          degraded: true,
          city: data?.location?.name || city,
          waterTemperature: null,
          unit: 'C',
          waterState: 'No nearby sea/lake data',
          showWater: false,
          message: 'Pas de donnees eau pour cette ville',
          cityImage,
        })
      );
    }

    return res.json(
      buildWaterPayload({
        source: 'external',
        degraded: false,
        city: data?.location?.name || city,
        waterTemperature,
        unit: 'C',
        waterState: 'Temperature marine',
        showWater: true,
        message: null,
        cityImage,
      })
    );
  } catch (error) {
    console.error(`[weather-water] /water failed city=${city}:`, error.message);
    console.error('API failed, fallback used');
    return res.json(await buildWaterDegradedResponse(city, 'Water API down: fallback mode enabled'));
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service running on port ${PORT}`);
  });
}

module.exports = app;
