import { useEffect, useMemo, useState } from 'react';
import SearchForm from '../components/SearchForm';
import MetricCard from '../components/MetricCard';
import StatusMessage from '../components/StatusMessage';
import {
  addFavorite,
  deleteFavorite,
  getAir,
  getFavorites,
  getTime,
  getWater,
  login,
  register,
} from '../services/api';

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1743639337565-87c04183d160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTIxMDh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzU5MjM0NjV8&ixlib=rb-4.1.0&q=80&w=1080';
const TOKEN_KEY = 'weather_dashboard_token';
const USER_KEY = 'weather_dashboard_user';

function formatLocalTime(value) {
  if (!value) return '--';

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
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('user@mail.com');
  const [loginPassword, setLoginPassword] = useState('StrongPass123');
  const [authMessage, setAuthMessage] = useState(null);
  const [uiMessage, setUiMessage] = useState(null);
  const [hasUserSearched, setHasUserSearched] = useState(false);
  const timeInfo = formatLocalTime(time?.localTime);

  const backgroundImage = useMemo(() => {
    if (!hasUserSearched) {
      return DEFAULT_BG;
    }

    return air?.cityImage || DEFAULT_BG;
  }, [hasUserSearched, air?.cityImage]);
  const isAuthenticated = Boolean(token);

  async function loadCityData(city) {
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
    } catch (error) {
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
  }

  async function handleSearch(input) {
    const cityFromInput =
      typeof input === 'string' ? input.trim() : typeof cityInput === 'string' ? cityInput.trim() : '';

    if (input && typeof input !== 'string' && typeof input.preventDefault === 'function') {
      input.preventDefault();
    }

    if (!cityFromInput) {
      setUiMessage('La ville est obligatoire.');
      return;
    }

    setHasUserSearched(true);
    setCityInput(cityFromInput);
    await loadCityData(cityFromInput);
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
      setUiMessage('Connecte. Les favoris sont maintenant disponibles.');
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
          setUiMessage('Compte cree automatiquement et connexion reussie.');
          return;
        } catch (registerError) {
          if (registerError?.status === 409) {
            setAuthMessage('Utilisateur existant. Verifiez le mot de passe.');
            return;
          }

          setAuthMessage('Connexion echouee et auto-inscription indisponible.');
          return;
        }
      }

      setAuthMessage('Connexion echouee. Le dashboard reste accessible sans login.');
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
      setUiMessage('Compte cree et connexion reussie.');
    } catch (error) {
      if (error?.status === 409) {
        setAuthMessage('Le compte existe deja. Utilisez Connexion.');
        return;
      }

      setAuthMessage('Creation de compte impossible pour le moment.');
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthMessage(null);
    setFavorites([]);
    setShowFavorites(false);
    setUiMessage('Deconnecte. Le dashboard meteo reste disponible.');
  }

  async function handleAddFavorite() {
    if (!isAuthenticated) {
      return;
    }

    try {
      await addFavorite(token, activeCity);
      setUiMessage(`"${activeCity}" ajoute aux favoris.`);
    } catch (error) {
      setUiMessage('Impossible d ajouter ce favori maintenant.');
    }
  }

  async function handleLoadFavorites() {
    if (!isAuthenticated) {
      return;
    }

    setLoadingFavorites(true);
    setAuthMessage(null);

    try {
      const result = await getFavorites(token);
      setFavorites(Array.isArray(result) ? result : []);
      setShowFavorites(true);
      if (!result?.length) {
        setUiMessage('Aucun favori enregistre pour le moment.');
      }
    } catch (error) {
      setAuthMessage('Impossible de charger les favoris.');
    } finally {
      setLoadingFavorites(false);
    }
  }

  async function handleDeleteFavorite(favoriteId) {
    if (!isAuthenticated) {
      return;
    }

    try {
      await deleteFavorite(token, favoriteId);
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
      setUiMessage('Favori supprime.');
    } catch (error) {
      setAuthMessage('Impossible de supprimer ce favori.');
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
        <p className="time-value">{loadingTime ? '...' : timeInfo.time}</p>
        <p className="time-date">{loadingTime ? '--' : timeInfo.date}</p>
        <p className="time-zone">{time?.timezone || 'Pas de fuseau horaire'}</p>
      </section>

      <aside className="left-panel">
        <header className="panel-header">
          <h1>Weather Air & Eau</h1>
          {isAuthenticated ? (
            <button className="auth-button" type="button" onClick={handleLogout}>
              Déconnexion
            </button>
          ) : (
            <button className="auth-button" type="button" onClick={() => setShowLogin((prev) => !prev)}>
              Connexion
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
              placeholder="Mot de passe"
            />
            <button type="submit">Se connecter</button>
            <button className="register-link" type="button" onClick={handleCreateAccount}>
              Pas inscrit ? Creer un compte
            </button>
          </form>
        ) : null}

        {authMessage ? <StatusMessage message={authMessage} /> : null}

        <p className="city-label">Ville : {activeCity}</p>

        <SearchForm
          value={cityInput}
          onChange={setCityInput}
          onSubmit={handleSearch}
          loadingAir={loadingAir}
        />

        <StatusMessage message={uiMessage} />

        <section className="cards-grid">
          <MetricCard
            title="Temperature de l air"
            value={loadingAir ? '...' : air?.temperature != null ? `${air.temperature}°C` : '--'}
            subtitle={air?.condition || 'Pas de donnees'}
            rightIconUrl={air?.conditionIcon}
            rightIconAlt={air?.condition || 'Weather icon'}
            largeRightIcon
          />

          {water?.showWater ? (
            <MetricCard
              title="Temperature de l eau"
              value={loadingWater ? '...' : water?.waterTemperature != null ? `${water.waterTemperature}°C` : '--'}
              subtitle={water?.waterState || 'Pas de donnees'}
            />
          ) : null}
        </section>

        {isAuthenticated ? (
          <section className="favorites-actions">
            <button className="favorite-button" type="button" onClick={handleAddFavorite}>
              Ajouter aux favoris
            </button>
            <button className="favorite-button" type="button" onClick={handleLoadFavorites}>
              {loadingFavorites ? 'Chargement...' : 'Mes favoris'}
            </button>
          </section>
        ) : null}

        {showFavorites ? (
          <section className="favorites-panel">
            <p className="favorites-title">Mes favoris</p>
            {favorites.length ? (
              <ul>
                {favorites.map((item) => (
                  <li
                    key={item.id}
                    className="favorite-row"
                    onClick={() => handleSearch(item.label || item.city_code)}
                    style={{ cursor: 'pointer' }}
                    title="Cliquer pour charger cette ville"
                  >
                    <span>{item.label || item.city_code}</span>
                    <button
                      type="button"
                      className="delete-favorite"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteFavorite(item.id);
                      }}
                    >
                      ❌ Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="favorites-empty">Aucun favori.</p>
            )}
          </section>
        ) : null}

        <section className="forecast-panel">
          <p className="forecast-title">Previsions (mock)</p>
          <div className="forecast-grid">
            {forecast.map((item) => (
              <article key={item.id} className="forecast-item">
                <p>{item.temp}</p>
                <span>{item.wind}</span>
              </article>
            ))}
          </div>
        </section>

        {isAuthenticated && user?.email ? <p className="auth-user">Connecte en tant que {user.email}</p> : null}
      </aside>
    </main>
  );
}
