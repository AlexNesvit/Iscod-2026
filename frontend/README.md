# Frontend — Temperature Air & Eau

Frontend React (Vite) du projet d’examen microservices.

## Lancement local

```bash
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3006` (voir `vite.config.js`).

## Variables utiles (`frontend/.env`)

- `VITE_FRONTEND_MOCK_MODE`
- `VITE_AIR_API_BASE`
- `VITE_WATER_API_BASE`
- `VITE_TIME_API_BASE`
- `VITE_PREFERENCES_API_BASE`
- `VITE_AUTH_API_BASE`

## Notes

- Le dashboard est accessible sans login.
- La connexion active les favoris.
- Le mode mock frontend permet une démonstration sans dépendre des APIs externes.
