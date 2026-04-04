const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../services/weather-air');

test('GET /air returns weather payload for a city (happy path)', async () => {
  const response = await request(app).get('/air').query({ city: 'Paris' });

  assert.equal(response.status, 200);
  assert.equal(response.body.city, 'Paris');
  assert.equal(typeof response.body.source, 'string');
  assert.equal(typeof response.body.degraded, 'boolean');
  assert.equal(typeof response.body.cityImage, 'string');
});

test('GET /air returns 400 when city query param is missing (error path)', async () => {
  const response = await request(app).get('/air');

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'city query param is required');
});
