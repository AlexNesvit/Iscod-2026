function nowIso() {
  return new Date().toISOString();
}

function buildHealthPayload({ service, port, status = 'ok', extra = {} }) {
  return {
    service,
    status,
    port,
    ...extra,
  };
}

function buildMissingCityPayload() {
  return { error: 'city query param is required' };
}

function buildAirPayload({
  source,
  degraded,
  city,
  temperature,
  unit,
  condition,
  conditionIcon,
  message,
  cityImage,
}) {
  return {
    source,
    degraded,
    city,
    temperature,
    unit,
    condition,
    conditionIcon,
    message,
    cityImage,
    fetchedAt: nowIso(),
  };
}

function buildWaterPayload({
  source,
  degraded,
  city,
  waterTemperature,
  unit,
  waterState,
  showWater,
  message,
  cityImage,
}) {
  return {
    source,
    degraded,
    city,
    waterTemperature,
    unit,
    waterState,
    showWater,
    message,
    cityImage,
    fetchedAt: nowIso(),
  };
}

function buildTimePayload({
  source,
  degraded,
  city,
  timezone,
  localTime,
  localtimeEpoch = null,
  message,
}) {
  return {
    source,
    degraded,
    city,
    timezone,
    localTime,
    localtimeEpoch,
    message,
    fetchedAt: nowIso(),
  };
}

module.exports = {
  buildHealthPayload,
  buildMissingCityPayload,
  buildAirPayload,
  buildWaterPayload,
  buildTimePayload,
};
