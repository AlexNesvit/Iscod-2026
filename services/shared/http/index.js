function getQueryCity(query = {}) {
  return typeof query.city === 'string' ? query.city.trim() : '';
}

function buildEndpointUrl(baseUrl, endpoint) {
  if (baseUrl.endsWith(`/${endpoint}`)) {
    return baseUrl;
  }

  return `${baseUrl.replace(/\/$/, '')}/${endpoint}`;
}

async function fetchJsonWithStatus(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorBody = '';

    try {
      errorBody = await response.text();
    } catch {
      errorBody = '';
    }

    return {
      ok: false,
      status: response.status,
      errorBody,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: await response.json(),
  };
}

function createCityImageFetcher({
  unsplashApiUrl,
  unsplashAccessKey,
  buildFallbackUrl,
  buildQuery,
}) {
  return async function getCityImage(city) {
    if (!unsplashAccessKey) {
      console.warn(`[images] Unsplash key is empty. Using fallback for city="${city}"`);
      return buildFallbackUrl(city);
    }

    try {
      const query = typeof buildQuery === 'function' ? buildQuery(city) : city;
      const url = `${unsplashApiUrl}?query=${encodeURIComponent(query)}&orientation=landscape`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
          'Accept-Version': 'v1',
        },
      });

      if (!response.ok) {
        let body = '';
        try {
          body = await response.text();
        } catch {
          body = '';
        }
        console.warn(
          `[images] Unsplash API failed for city="${city}" status=${response.status}${body ? ` body=${body}` : ''}`
        );
        return buildFallbackUrl(city);
      }

      const data = await response.json();
      return data?.urls?.regular || buildFallbackUrl(city);
    } catch (error) {
      console.warn(`[images] Unsplash request error for city="${city}": ${error.message}`);
      return buildFallbackUrl(city);
    }
  };
}

module.exports = {
  getQueryCity,
  buildEndpointUrl,
  fetchJsonWithStatus,
  createCityImageFetcher,
};
