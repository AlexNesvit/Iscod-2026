const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const authApp = require('../services/auth');
const preferencesApp = require('../services/preferences');
const weatherAirApp = require('../services/weather-air');
const weatherWaterApp = require('../services/weather-water');
const timeApp = require('../services/time');

const services = [
  { app: authApp, service: 'auth' },
  { app: preferencesApp, service: 'preferences' },
  { app: weatherAirApp, service: 'weather-air' },
  { app: weatherWaterApp, service: 'weather-water' },
  { app: timeApp, service: 'time' },
];

for (const item of services) {
  test(`GET /health returns service metadata (${item.service})`, async () => {
    const response = await request(item.app).get('/health');

    assert.equal(response.status, 200);
    assert.equal(response.body.service, item.service);
    assert.equal(typeof response.body.status, 'string');
    assert.equal(typeof response.body.port, 'number');
  });
}
