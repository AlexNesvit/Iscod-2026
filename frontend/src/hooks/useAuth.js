import { useState } from 'react';
import { login, register } from '../services/api';

const TOKEN_KEY = 'weather_dashboard_token';
const USER_KEY = 'weather_dashboard_user';

export function persistSession(data, { setToken, setUser }) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  setToken(data.token);
  setUser(data.user);
}

function clearSession({ setToken, setUser }) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setToken(null);
  setUser(null);
}

export default function useAuth({ setUiMessage }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('user@mail.com');
  const [loginPassword, setLoginPassword] = useState('StrongPass123');
  const [authMessage, setAuthMessage] = useState(null);

  const isAuthenticated = Boolean(token);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthMessage(null);

    try {
      const data = await login(loginEmail, loginPassword);
      persistSession(data, { setToken, setUser });
      setShowLogin(false);
      setUiMessage('Connecte. Les favoris sont maintenant disponibles.');
    } catch (error) {
      const isAuthError = error?.status === 401;
      const isUserNotFound = String(error?.payload?.error || '')
        .toLowerCase()
        .includes('invalid credentials');

      if (isAuthError && isUserNotFound) {
        try {
          await register(loginEmail, loginPassword);
          const data = await login(loginEmail, loginPassword);
          persistSession(data, { setToken, setUser });
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
      persistSession(data, { setToken, setUser });
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
    clearSession({ setToken, setUser });
    setAuthMessage(null);
    setShowLogin(false);
    setUiMessage('Deconnecte. Le dashboard meteo reste disponible.');
  }

  return {
    token,
    user,
    isAuthenticated,
    showLogin,
    setShowLogin,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    authMessage,
    setAuthMessage,
    handleLogin,
    handleCreateAccount,
    handleLogout,
  };
}
