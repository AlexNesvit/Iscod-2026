import { useEffect, useMemo, useState } from 'react';
import SearchForm from '../components/SearchForm';
import MetricCard from '../components/MetricCard';
import StatusMessage from '../components/StatusMessage';
import { addFavorite, getAir, getTime, getWater, login, register } from '../services/api';

const DEFAULT_BG = 'https://source.unsplash.com/1600x900/?city,skyline';
const TOKEN_KEY = 'weather_dashboard_token';
const USER_KEY = 'weather_dashboard_user';

function formatLocalTime(value) {
  if (!value) {
    return '--';
  }

  return String(value);
}

export default function DashboardPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cityInput, setCityInput] = useState('Paris');
  const [activeCity, setActiveCity] = useState('Paris');
  const [air, setAir] = useState(null);
  const [water, setWater] = useState(null);
  const [time, setTime] = useState(null);
  const [forecast] = useState([
    { id: 1, temp: '6°C', wind: '32 km/h' },
    { id: 2, temp: '10°C', wind: '52 km/h' },
    { id: 3, temp: '8°C', wind: '11 km/h' },
  ]);
  const [loadingAir, setLoadingAir] = useState(false);
  const [loadingWater, setLoadingWater] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('user@mail.com');
  const [loginPassword, setLoginPassword] = useState('StrongPass123');
  const [authMessage, setAuthMessage] = useState(null);
  const [uiMessage, setUiMessage] = useState(null);

  const backgroundImage = useMemo(() => air?.cityImage || DEFAULT_BG, [air?.cityImage]);
  const isAuthenticated = Boolean(token);

  async function loadCityData(city) {
    if (!city) {
      setUiMessage('City is required.');
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
    } catch (error) {
      setAir(null);
      setUiMessage('Air API unavailable. Please retry.');
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
      setWater({ showWater: false, message: 'Water API unavailable (hidden block).' });
    }

    if (timeResult.status === 'fulfilled') {
      setTime(timeResult.value);
      if (timeResult.value?.degraded && timeResult.value?.message) {
        setUiMessage(timeResult.value.message);
      }
    } else {
      setTime({ message: 'Time API unavailable.' });
    }

    setLoadingWater(false);
    setLoadingTime(false);
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadCityData(cityInput.trim());
  }

  useEffect(() => {
    const defaultCity = 'Paris';
    setCityInput(defaultCity);
    setActiveCity(defaultCity);
    loadCityData(defaultCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthMessage(null);

    try {
      const data = await login(loginEmail, loginPassword);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      setUiMessage('Logged in. Favorites are now available.');
    } catch (error) {
      const isAuthError = error?.status === 401;
      const isUserNotFound = String(error?.payload?.error || '').toLowerCase().includes('invalid credentials');

      if (isAuthError && isUserNotFound) {
        try {
          await register(loginEmail, loginPassword);
          const data = await login(loginEmail, loginPassword);
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          setShowLogin(false);
          setUiMessage('Account created automatically and logged in.');
          return;
        } catch (registerError) {
          if (registerError?.status === 409) {
            setAuthMessage('User exists. Check password and retry.');
            return;
          }

          setAuthMessage('Login failed and auto-register unavailable. Dashboard remains accessible.');
          return;
        }
      }

      setAuthMessage('Login failed. Dashboard remains available without login.');
    }
  }

  async function handleCreateAccount() {
    setAuthMessage(null);

    try {
      await register(loginEmail, loginPassword);
      const data = await login(loginEmail, loginPassword);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      setUiMessage('Account created and logged in.');
    } catch (error) {
      if (error?.status === 409) {
        setAuthMessage('Account already exists. Use Sign in.');
        return;
      }

      setAuthMessage('Cannot create account right now.');
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthMessage(null);
    setUiMessage('Logged out. Base weather dashboard is still available.');
  }

  async function handleAddFavorite() {
    if (!isAuthenticated) {
      return;
    }

    try {
      await addFavorite(token, activeCity);
      setUiMessage(`"${activeCity}" added to favorites.`);
    } catch (error) {
      setUiMessage('Cannot add favorite right now.');
    }
  }

  return (
    <main
      className="dashboard"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(7, 22, 40, 0.78), rgba(9, 32, 63, 0.4)), url(${backgroundImage})`,
      }}
    >
      <section className="right-time">
        <p className="time-value">{loadingTime ? '...' : formatLocalTime(time?.localTime)}</p>
        <p className="time-zone">{time?.timezone || 'No timezone data'}</p>
      </section>

      <aside className="left-panel">
        <header className="panel-header">
          <h1>Weather Dashboard</h1>
          {isAuthenticated ? (
            <button className="auth-button" type="button" onClick={handleLogout}>
              Déconnexion
            </button>
          ) : (
            <button className="auth-button" type="button" onClick={() => setShowLogin((prev) => !prev)}>
              Login
            </button>
          )}
        </header>

        {showLogin && !isAuthenticated ? (
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="Password"
            />
            <button type="submit">Sign in</button>
            <button className="register-link" type="button" onClick={handleCreateAccount}>
              Not registered? Create account
            </button>
          </form>
        ) : null}

        {authMessage ? <StatusMessage message={authMessage} /> : null}

        <p className="city-label">City: {activeCity}</p>

        <SearchForm
          value={cityInput}
          onChange={setCityInput}
          onSubmit={handleSearch}
          loadingAir={loadingAir}
        />

        <StatusMessage message={uiMessage} />

        <section className="cards-grid">
          <MetricCard
            title="Air Temperature"
            value={loadingAir ? '...' : air?.temperature != null ? `${air.temperature}°C` : '--'}
            subtitle={air?.condition || 'No data'}
          />

          {water?.showWater ? (
            <MetricCard
              title="Water Temperature"
              value={loadingWater ? '...' : water?.waterTemperature != null ? `${water.waterTemperature}°C` : '--'}
              subtitle={water?.waterState || 'No data'}
            />
          ) : null}
        </section>

        {isAuthenticated ? (
          <button className="favorite-button" type="button" onClick={handleAddFavorite}>
            Add to favorites
          </button>
        ) : null}

        <section className="forecast-panel">
          <p className="forecast-title">Forecast (mock)</p>
          <div className="forecast-grid">
            {forecast.map((item) => (
              <article key={item.id} className="forecast-item">
                <p>{item.temp}</p>
                <span>{item.wind}</span>
              </article>
            ))}
          </div>
        </section>

        {isAuthenticated && user?.email ? <p className="auth-user">Connected as {user.email}</p> : null}
      </aside>
    </main>
  );
}
