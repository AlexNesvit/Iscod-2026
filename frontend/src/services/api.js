const AIR_API_BASE = import.meta.env.VITE_AIR_API_BASE || 'http://localhost:3003';
const WATER_API_BASE = import.meta.env.VITE_WATER_API_BASE || 'http://localhost:3004';
const TIME_API_BASE = import.meta.env.VITE_TIME_API_BASE || 'http://localhost:3005';
const PREFERENCES_API_BASE = import.meta.env.VITE_PREFERENCES_API_BASE || 'http://localhost:3002';
const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE || 'http://localhost:3001';
const FRONTEND_MOCK_MODE = String(import.meta.env.VITE_FRONTEND_MOCK_MODE || 'false') === 'true';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    let payload = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text };
    }

    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return response.json();
}

function buildMockAir(city) {
  return {
    source: 'mock',
    degraded: true,
    city,
    temperature: 22,
    unit: 'C',
    condition: 'Ensoleillé',
    cityImage: `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},city`,
    message: 'Mode mock frontend activé',
    fetchedAt: new Date().toISOString(),
  };
}

function buildMockWater(city) {
  return {
    source: 'mock',
    degraded: true,
    city,
    waterTemperature: 17,
    unit: 'C',
    waterState: 'Baignade possible',
    showWater: true,
    message: 'Mode mock frontend activé',
    fetchedAt: new Date().toISOString(),
  };
}

function buildMockTime(city) {
  return {
    source: 'mock',
    degraded: true,
    city,
    timezone: 'Europe/Paris',
    localTime: new Date().toLocaleString(),
    message: 'Mode mock frontend activé',
    fetchedAt: new Date().toISOString(),
  };
}

function requestApi({ base, path, method = 'GET', token, body, mockBuilder }) {
  if (FRONTEND_MOCK_MODE && typeof mockBuilder === 'function') {
    return Promise.resolve(mockBuilder());
  }

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  return fetchJson(`${base}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function getAir(city) {
  return requestApi({
    base: AIR_API_BASE,
    path: `/air?city=${encodeURIComponent(city)}`,
    mockBuilder: () => buildMockAir(city),
  });
}

export function getWater(city) {
  return requestApi({
    base: WATER_API_BASE,
    path: `/water?city=${encodeURIComponent(city)}`,
    mockBuilder: () => buildMockWater(city),
  });
}

export function getTime(city) {
  return requestApi({
    base: TIME_API_BASE,
    path: `/time?city=${encodeURIComponent(city)}`,
    mockBuilder: () => buildMockTime(city),
  });
}

export function getFavorites(token) {
  return requestApi({
    base: PREFERENCES_API_BASE,
    path: '/favorites',
    token,
  });
}

export function login(email, password) {
  return requestApi({
    base: AUTH_API_BASE,
    path: '/login',
    method: 'POST',
    body: { email, password },
    mockBuilder: () => ({
      token: 'mock-token',
      user: { id: 'mock-user-id', email, role: 'user' },
    }),
  });
}

export function register(email, password) {
  return requestApi({
    base: AUTH_API_BASE,
    path: '/register',
    method: 'POST',
    body: { email, password },
    mockBuilder: () => ({
      message: 'Mock register success',
      user: { id: 'mock-user-id', email, role: 'user' },
    }),
  });
}

export function addFavorite(token, city) {
  return requestApi({
    base: PREFERENCES_API_BASE,
    path: '/favorites',
    method: 'POST',
    token,
    body: { city },
    mockBuilder: () => ({
      id: Date.now(),
      user_id: 'mock-user-id',
      city_code: city,
      label: city,
      created_at: new Date().toISOString(),
    }),
  });
}

export function deleteFavorite(token, favoriteId) {
  return requestApi({
    base: PREFERENCES_API_BASE,
    path: `/favorites/${favoriteId}`,
    method: 'DELETE',
    token,
    mockBuilder: () => ({ message: 'Favori supprime (mock)' }),
  });
}
