export default function FavoritesPanel({ show, favorites, onSelectCity, onDeleteFavorite }) {
  if (!show) {
    return null;
  }

  return (
    <section className="favorites-panel">
      <p className="favorites-title">Mes favoris</p>
      {favorites.length ? (
        <ul>
          {favorites.map((item) => {
            const cityName = item.label || item.city_code;

            return (
              <li key={item.id} className="favorite-row">
                <button
                  type="button"
                  className="favorite-city-button"
                  onClick={() => onSelectCity(cityName)}
                  title="Cliquer pour charger cette ville"
                >
                  {cityName}
                </button>
                <button
                  type="button"
                  className="delete-favorite"
                  onClick={() => onDeleteFavorite(item.id)}
                >
                  ❌ Supprimer
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="favorites-empty">Aucun favori.</p>
      )}
    </section>
  );
}
