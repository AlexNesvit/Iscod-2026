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

export async function getAir(city) {
  if (FRONTEND_MOCK_MODE) {
    return buildMockAir(city);
  }

  return fetchJson(`${AIR_API_BASE}/air?city=${encodeURIComponent(city)}`);
}

export async function getWater(city) {
  if (FRONTEND_MOCK_MODE) {
    return buildMockWater(city);
  }

  return fetchJson(`${WATER_API_BASE}/water?city=${encodeURIComponent(city)}`);
}

export async function getTime(city) {
  if (FRONTEND_MOCK_MODE) {
    return buildMockTime(city);
  }

  return fetchJson(`${TIME_API_BASE}/time?city=${encodeURIComponent(city)}`);
}

export async function getFavorites(token) {
  return fetchJson(`${PREFERENCES_API_BASE}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function login(email, password) {
  if (FRONTEND_MOCK_MODE) {
    return {
      token: 'mock-token',
      user: { id: 'mock-user-id', email, role: 'user' },
    };
  }

  return fetchJson(`${AUTH_API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email, password) {
  if (FRONTEND_MOCK_MODE) {
    return {
      message: 'Mock register success',
      user: { id: 'mock-user-id', email, role: 'user' },
    };
  }

  return fetchJson(`${AUTH_API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function addFavorite(token, city) {
  if (FRONTEND_MOCK_MODE) {
    return {
      id: Date.now(),
      user_id: 'mock-user-id',
      city_code: city,
      label: city,
      created_at: new Date().toISOString(),
    };
  }

  return fetchJson(`${PREFERENCES_API_BASE}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ city }),
  });
}
