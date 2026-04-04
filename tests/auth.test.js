const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../services/auth');
const User = require('../services/auth/models/User');
const bcrypt = require('bcryptjs');

const originalFindOne = User.findOne;
const originalCompare = bcrypt.compare;

test.after(() => {
  User.findOne = originalFindOne;
  bcrypt.compare = originalCompare;
});

test('POST /login returns token when credentials are valid', async () => {
  User.findOne = async ({ email }) => ({
    _id: '507f1f77bcf86cd799439011',
    email,
    role: 'user',
    passwordHash: 'hashed_password',
  });
  bcrypt.compare = async (password, hash) => password === 'password123' && hash === 'hashed_password';

  const response = await request(app).post('/login').send({
    email: 'user@example.com',
    password: 'password123',
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, 'user@example.com');
  assert.equal(response.body.user.role, 'user');
});

test('POST /login returns 401 when user is unknown', async () => {
  User.findOne = async () => null;

  const response = await request(app).post('/login').send({
    email: 'unknown@example.com',
    password: 'password123',
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Invalid credentials');
});
