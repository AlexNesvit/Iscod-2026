import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import MetricCard from '../components/MetricCard';
import StatusMessage from '../components/StatusMessage';
import FooterCopyright from '../components/FooterCopyright';
import AuthForm from '../components/AuthForm';
import FavoritesPanel from '../components/FavoritesPanel';
import useAuth from '../hooks/useAuth';
import useWeatherData from '../hooks/useWeatherData';
import useFavorites from '../hooks/useFavorites';

export default function DashboardPage() {
  const [uiMessage, setUiMessage] = useState(null);

  const auth = useAuth({ setUiMessage });
  const weather = useWeatherData({ setUiMessage });
  const favorites = useFavorites({
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    activeCity: weather.activeCity,
    onSelectCity: weather.searchByCity,
    setUiMessage,
    setAuthMessage: auth.setAuthMessage,
  });

  return (
    <main
      className="dashboard"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(7, 22, 40, 0.78), rgba(9, 32, 63, 0.4)), url(${weather.backgroundImage})`,
      }}
    >
      <div className="dashboard-content">
        <section className="right-time">
          <p className="time-value">{weather.loadingTime ? '...' : weather.timeInfo.time}</p>
          <p className="time-date">{weather.loadingTime ? '--' : weather.timeInfo.date}</p>
          <p className="time-zone">{weather.time?.timezone || 'Pas de fuseau horaire'}</p>
        </section>

        <aside className="left-panel">
          <header className="panel-header">
            <h1>Weather Air & Eau</h1>
            {auth.isAuthenticated ? (
              <button className="auth-button" type="button" onClick={auth.handleLogout}>
                Déconnexion
              </button>
            ) : (
              <button className="auth-button" type="button" onClick={() => auth.setShowLogin((prev) => !prev)}>
                Connexion
              </button>
            )}
          </header>

          <AuthForm
            show={auth.showLogin}
            isAuthenticated={auth.isAuthenticated}
            loginEmail={auth.loginEmail}
            loginPassword={auth.loginPassword}
            onEmailChange={auth.setLoginEmail}
            onPasswordChange={auth.setLoginPassword}
            onSubmit={auth.handleLogin}
            onCreateAccount={auth.handleCreateAccount}
          />

          {auth.authMessage ? <StatusMessage message={auth.authMessage} /> : null}

          <p className="city-label">Ville : {weather.activeCity}</p>

          <SearchForm
            value={weather.cityInput}
            onChange={weather.setCityInput}
            onSubmit={weather.handleSearchSubmit}
            loadingAir={weather.loadingAir}
          />

          <StatusMessage message={uiMessage} />

          <section className="cards-grid">
            <MetricCard
              title="Temperature de l air"
              value={weather.loadingAir ? '...' : weather.air?.temperature != null ? `${weather.air.temperature}°C` : '--'}
              subtitle={weather.air?.condition || 'Pas de donnees'}
              rightIconUrl={weather.air?.conditionIcon}
              rightIconAlt={weather.air?.condition || 'Weather icon'}
              largeRightIcon
            />

            {weather.water?.showWater ? (
              <MetricCard
                title="Temperature de l eau"
                value={
                  weather.loadingWater
                    ? '...'
                    : weather.water?.waterTemperature != null
                      ? `${weather.water.waterTemperature}°C`
                      : '--'
                }
                subtitle={weather.water?.waterState || ''}
              />
            ) : null}
          </section>

          {auth.isAuthenticated ? (
            <section className="favorites-actions">
              <button className="favorite-button" type="button" onClick={favorites.handleAddFavorite}>
                Ajouter aux favoris
              </button>
              <button className="favorite-button" type="button" onClick={favorites.handleLoadFavorites}>
                {favorites.loadingFavorites ? 'Chargement...' : 'Mes favoris'}
              </button>
            </section>
          ) : null}

          <FavoritesPanel
            show={favorites.showFavorites}
            favorites={favorites.favorites}
            onSelectCity={favorites.handleSelectFavorite}
            onDeleteFavorite={favorites.handleDeleteFavorite}
          />

          <section className="forecast-panel">
            <p className="forecast-title">Previsions (mock)</p>
            <div className="forecast-grid">
              {weather.forecast.map((item) => (
                <article key={item.id} className="forecast-item">
                  <p>{item.temp}</p>
                </article>
              ))}
            </div>
          </section>

          {auth.isAuthenticated && auth.user?.email ? (
            <p className="auth-user">Connecte en tant que {auth.user.email}</p>
          ) : null}
        </aside>
      </div>

      <FooterCopyright className="dashboard-footer" />
    </main>
  );
}
