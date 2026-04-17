import { useEffect, useState } from 'react';
import { addFavorite, deleteFavorite, getFavorites } from '../services/api';

export default function useFavorites({
  token,
  isAuthenticated,
  activeCity,
  onSelectCity,
  setUiMessage,
  setAuthMessage,
}) {
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    setFavorites([]);
    setShowFavorites(false);
    setLoadingFavorites(false);
  }, [isAuthenticated]);

  async function handleAddFavorite() {
    if (!isAuthenticated) {
      return;
    }

    try {
      await addFavorite(token, activeCity);
      setUiMessage(`"${activeCity}" ajoute aux favoris.`);
    } catch {
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
    } catch {
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
    } catch {
      setAuthMessage('Impossible de supprimer ce favori.');
    }
  }

  function handleSelectFavorite(city) {
    onSelectCity(city);
  }

  return {
    favorites,
    showFavorites,
    loadingFavorites,
    handleAddFavorite,
    handleLoadFavorites,
    handleDeleteFavorite,
    handleSelectFavorite,
  };
}
