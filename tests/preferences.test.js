const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../services/preferences');

test('GET /favorites returns 401 without Bearer token', async () => {
  const response = await request(app).get('/favorites');

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Missing or invalid Authorization header');
});
