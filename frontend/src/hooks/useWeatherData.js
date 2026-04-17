import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAir, getTime, getWater } from '../services/api';

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1743639337565-87c04183d160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTIxMDh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzU5MjM0NjV8&ixlib=rb-4.1.0&q=80&w=1080';
const DEFAULT_CITY = 'Paris';

function formatLocalTime(value) {
  if (!value) {
    return { time: '--', date: '--' };
  }

  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/);
  if (match) {
    const [, year, month, day, hhmm] = match;
    return { time: hhmm, date: `${day}-${month}-${year}` };
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    const hh = String(parsed.getHours()).padStart(2, '0');
    const mm = String(parsed.getMinutes()).padStart(2, '0');
    return { time: `${hh}:${mm}`, date: `${day}-${month}-${year}` };
  }

  return { time: raw, date: '--' };
}

export default function useWeatherData({ setUiMessage }) {
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [activeCity, setActiveCity] = useState(DEFAULT_CITY);
  const [air, setAir] = useState(null);
  const [water, setWater] = useState(null);
  const [time, setTime] = useState(null);
  const [loadingAir, setLoadingAir] = useState(false);
  const [loadingWater, setLoadingWater] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const [hasUserSearched, setHasUserSearched] = useState(false);

  const loadCityData = useCallback(
    async (city) => {
      if (!city) {
        setUiMessage('La ville est obligatoire.');
        return;
      }

      setActiveCity(city);
      setUiMessage(null);
      setWater(null);
      setTime(null);
      setLoadingAir(true);

      try {
        const airData = await getAir(city);
        setAir(airData);

        if (airData?.degraded && airData?.message) {
          setUiMessage(airData.message);
        }
      } catch {
        setAir(null);
        setUiMessage('API air indisponible. Veuillez reessayer.');
      } finally {
        setLoadingAir(false);
      }

      setLoadingWater(true);
      setLoadingTime(true);

      const [waterResult, timeResult] = await Promise.allSettled([getWater(city), getTime(city)]);

      if (waterResult.status === 'fulfilled') {
        setWater(waterResult.value);

        if (waterResult.value?.degraded && waterResult.value?.message) {
          setUiMessage(waterResult.value.message);
        }
      } else {
        setWater({ showWater: false, message: 'API eau indisponible (bloc masque).' });
      }

      if (timeResult.status === 'fulfilled') {
        setTime(timeResult.value);

        if (timeResult.value?.degraded && timeResult.value?.message) {
          setUiMessage(timeResult.value.message);
        }
      } else {
        setTime({ message: 'API heure indisponible.' });
      }

      setLoadingWater(false);
      setLoadingTime(false);
    },
    [setUiMessage]
  );

  const searchByCity = useCallback(
    async (city) => {
      const nextCity = typeof city === 'string' ? city.trim() : '';

      if (!nextCity) {
        setUiMessage('La ville est obligatoire.');
        return;
      }

      setHasUserSearched(true);
      setCityInput(nextCity);
      await loadCityData(nextCity);
    },
    [loadCityData, setUiMessage]
  );

  const handleSearchSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await searchByCity(cityInput);
    },
    [cityInput, searchByCity]
  );

  useEffect(() => {
    loadCityData(DEFAULT_CITY);
  }, [loadCityData]);

  const timeInfo = useMemo(() => formatLocalTime(time?.localTime), [time?.localTime]);

  const backgroundImage = useMemo(() => {
    if (!hasUserSearched) {
      return DEFAULT_BG;
    }

    return air?.cityImage || DEFAULT_BG;
  }, [hasUserSearched, air?.cityImage]);

  const forecast = useMemo(() => {
    const baseTemp = Number(air?.temperature);
    const hasBaseTemp = Number.isFinite(baseTemp);
    const formatTemp = (offset) => (hasBaseTemp ? `${(baseTemp + offset).toFixed(1)}°C` : '--');

    return [
      { id: 1, temp: formatTemp(0.6) },
      { id: 2, temp: formatTemp(1.2) },
      { id: 3, temp: formatTemp(1.6) },
    ];
  }, [air?.temperature]);

  return {
    cityInput,
    setCityInput,
    activeCity,
    air,
    water,
    time,
    loadingAir,
    loadingWater,
    loadingTime,
    timeInfo,
    backgroundImage,
    forecast,
    handleSearchSubmit,
    searchByCity,
  };
}
