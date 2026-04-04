const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../services/time');

test('GET /time returns timezone payload for a city (happy path)', async () => {
  const response = await request(app).get('/time').query({ city: 'Paris' });

  assert.equal(response.status, 200);
  assert.equal(response.body.city, 'Paris');
  assert.equal(typeof response.body.source, 'string');
  assert.equal(typeof response.body.degraded, 'boolean');
  assert.equal(typeof response.body.timezone, 'string');
});

test('GET /time returns 400 when city query param is missing (error path)', async () => {
  const response = await request(app).get('/time');

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'city query param is required');
});
