# 🌊 Application Température (Air & Eau)

## 📌 Description
Ce projet est une application web permettant :
- d’afficher la **température de l’air** et de l’**eau** par ville (via des APIs externes),
- de gérer ses **villes favorites**,
- de définir des **alertes personnalisées**,
- et d’assurer une **authentification sécurisée** des utilisateurs.

L’objectif est de combiner **microservices Node.js**, un **frontend React**, et deux types de bases de données (**MySQL** et **MongoDB**), tout en respectant une architecture modulaire et évolutive. Les données de température sont récupérées depuis des APIs externes et affichées directement sans stockage.

---

## ⚙️ Technologies
- **Frontend :** React
- **Backend :** Node.js (architecture microservices)
- **Bases de données :**
  - MySQL → Logique métier (favoris, alertes)
  - MongoDB → uthentification (utilisateurs, rôles)
  - APIs externes :** données de température de l’air et de l’eau (consultation en temps réel, sans stockage).
- **Sécurité BDD :** utilisateurs dédiés avec privilèges limités (DML    uniquement, sans DDL ni GRANT ALL)
- **Conteneurisation :** Docker + Docker Compose
- **Documentation API :** Swagger / OpenAPI
- **Gestion de version :** GitHub (dépôt privé)

---

## 📂 Structure du dépôt (prévisionnelle)
```
root/
 ├── frontend/              # Application React
 ├── services/
 │    ├── auth/            # Authentification (MongoDB)
 │    ├── preferences/     # Favoris & alertes (MySQL)
 │    ├── weather-air/     # API Air externe → (consultation sans stockage)
 │    └── weather-water/   # API Eau externe → (consultation sans stockage)
 ├── docs/
 │    ├── cahier_des_charges.md
 │    └── architecture-diagram.png (optionnel)
 ├── docker-compose.yml
 └── README.md
```

---

## 🔒 Sécurité et Bonnes Pratiques
- Chaque base (MySQL et MongoDB) possède un utilisateur dédié et cloisonné.
- Les privilèges sont limités à la lecture/écriture (DML).
- Aucune action d’administration (DROP, CREATE) n’est autorisée via les services.
- Intégrité des données garantie par les contraintes de clés étrangères dans MySQL.

---

## 🗺️ Étapes de Développement
1. **Figma / Wireframes** : parcours de navigation (desktop), texte réel.
2. **Modélisation BDD** : schémas MySQL et MongoDB.
3. **Maquette couleur fidèle** : une seule page (mobile + desktop).
4. **Intégration statique HTML/CSS** : méthode BEM + SASS (Raphaël Goetter).
5. **Découpage React** : templates et modules.

---

## 🚀 Lancement (Docker Compose)

1. Créer le fichier `.env` à la racine (ou partir de `.env.example`).
2. Vérifier les variables sensibles (`JWT_SECRET`, mots de passe BDD).
3. Démarrer la stack :

```bash
docker compose up -d --build
```

Le projet utilise les variables `.env` directement dans `docker-compose.yml`.

---

## 📖 Documentation
- **Cahier des Charges :** voir [docs/cahier_des_charges.md](docs/cahier_des_charges.md)
- **Vision produit / Cadrage:** voir [docs/vision_produit.md](docs/vision_produit.md)
- **User stories / Backlog :** voir [docs/ser_stories.md](docs/user_stories.md)
- **Notes de projet / journal de bord (interne) :** voir [docs/journal_projet.md](docs/journal_projet.md)
- **Swagger API Docs :** (à définir)

---


Figma: Mettre en place un design systémique
Checked Atomic design, le principe - (4 min)

---

## 🛠️ Roadmap de développement (notes personnelles)

Cette section constitue un plan de travail évolutif, destiné au suivi personnel de l’avancement du projet.
Elle est susceptible d’évoluer, d’être modifiée ou supprimée au fil du développement.

### Étape 1 – Cadrage & documentation
	•	Création du cahier des charges - ✅
	•	Vision produit / cadrage projet - ✅
	•	User stories / backlog produit - ✅
	•	Mise à jour continue de la documentation - en cours

### Étape 2 – Conception
	•	Wireframes Figma (parcours desktop, texte réel) - en cours
	•	Modélisation UML
	•	Modélisation BDD (MERISE)

### Étape 3 – Maquettes UI
	•	Maquette couleur fidèle (desktop)
	•	Maquette couleur fidèle (mobile)

### Étape 4 – Initialisation technique  ✅ 
	•	Installation Node.js
	•	Initialisation du projet (npm) ✅ «Local Express skeleton OK»
	•	Structure des microservices
	•	Configuration Docker / Docker Compose
  •	Workflow Git : main (stable) / develop (development)

### Étape 5 – Intégration statique
	•	Intégration HTML / CSS
	•	Méthodologie BEM
	•	SASS

### Étape 5 – Initialisation technique
	•	Installation Node.js
	•	Initialisation du projet (npm)
	•	Structure des microservices
	•	Configuration Docker / Docker Compose

### Étape 6 – Backend (microservices)
	•	Authentification (MongoDB)
	•	Gestion des préférences (MySQL)
	•	Service météo air (API externe)
	•	Service météo eau (API externe)
	•	Sécurisation des accès BDD

### Étape 7 – Frontend React
	•	Découpage des composants
	•	Templates et vues
	•	Connexion aux APIs backend

### Étape 8 – Documentation & finalisation
	•	Documentation Swagger / OpenAPI
	•	Tests fonctionnels
	•	Ajustements finaux
	•	Préparation à la soutenance

---

## 🔐 Bloc 3 — Authentification (JWT) implémentée

Le microservice `auth` fournit désormais une authentification minimale sécurisée :

- `POST /register` : création de compte utilisateur
- `POST /login` : authentification et génération d’un token JWT
- `GET /me` : route protégée (middleware `verifyToken`) pour récupérer le profil connecté

### Register

Entrée :
- `email`
- `password` (minimum 8 caractères)

Traitements :
- normalisation de l’email (trim + lowercase),
- vérification unicité email,
- hash du mot de passe avec `bcryptjs`,
- stockage MongoDB via schéma utilisateur.

Sortie :
- utilisateur créé (sans mot de passe).

### Login

Entrée :
- `email`
- `password`

Traitements :
- recherche utilisateur par email,
- comparaison du mot de passe en clair avec `passwordHash` via `bcrypt.compare`,
- génération du JWT (`sub`, `email`, `role`, expiration).

Sortie :
- `token` JWT + informations utilisateur.

### Sécurité appliquée

- mot de passe jamais stocké en clair (hash bcrypt),
- vérification du token Bearer via middleware,
- route protégée (`/me`) inaccessible sans JWT valide (`401`),
- secret JWT configurable par variable d’environnement (`JWT_SECRET`),
- durée de validité configurable (`JWT_EXPIRES_IN`),
- configuration du coût bcrypt configurable (`BCRYPT_SALT_ROUNDS`).

---

## ⚙️ Configuration `.env` / `.env.example`

- `.env` : fichier local de configuration (non versionné, présent dans `.gitignore`)
- `.env.example` : modèle versionné pour documenter toutes les variables nécessaires

Variables principales :
- ports des services (`AUTH_PORT`, `PREFERENCES_PORT`, etc.)
- MongoDB auth (`AUTH_MONGO_URI`, utilisateurs, mots de passe)
- MySQL (`MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, etc.)
- sécurité auth (`JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`)

---

## ⭐ Bloc 4 — Gestion des préférences utilisateur (MySQL)

Le microservice `preferences` gère désormais les favoris et alertes utilisateur avec liaison par `user_id` (issu du JWT).

Routes implémentées :
- `POST /favorites`
- `GET /favorites`
- `DELETE /favorites/:id`
- `POST /alerts`
- `GET /alerts`

Règles de sécurité :
- toutes les routes `favorites` / `alerts` sont protégées par token Bearer,
- `user_id` est récupéré depuis `req.user.sub`,
- suppression favorite autorisée uniquement si `id` + `user_id` correspondent.

Gestion d’erreurs :
- `401` si token absent/invalide,
- `400` si payload invalide (ex. `city` manquant),
- `404` si ressource favorite introuvable sur suppression.

---

## 🌤️ Bloc 5 — Intégration APIs météo air + water + time (implémenté)

Le bloc météo est implémenté avec appels API externes en temps réel, sans stockage.

Endpoints :
- `GET /air?city=<ville>` (service `weather-air`)
- `GET /water?city=<ville>` (service `weather-water`)
- `GET /time?city=<ville>` (service `weather-air`)

Providers utilisés :
- `weather-air` : WeatherAPI `current.json`
- `weather-water` : WeatherAPI `marine.json`
- `time` : WeatherAPI `timezone.json`

Comportement :
- récupération des données via `fetch` + `try/catch`,
- aucune persistance en base (ni MongoDB, ni MySQL),
- affichage direct des données au frontend,
- ajout d’un `cityImage` (Unsplash / fallback).

Variables `.env` du bloc :
- `WEATHER_AIR_USE_MOCK`
- `WEATHER_AIR_API_URL`
- `WEATHER_AIR_API_KEY`
- `WEATHER_WATER_USE_MOCK`
- `WEATHER_WATER_API_URL`
- `WEATHER_WATER_API_KEY`
- `UNSPLASH_API_URL`
- `UNSPLASH_ACCESS_KEY`

Stratégie frontend recommandée (ordre d’appel) :
1. Appeler `/air?city=...` en premier pour afficher vite température air + `cityImage` (background).
2. Ensuite appeler en parallèle `/time?city=...` et `/water?city=...` (marine).
3. Si `water` indisponible, afficher uniquement air + time (mode dégradé).

---

## 🛟 Bloc 6 — Error Handling & Mode Dégradé

Objectif : ne jamais faire tomber l’interface.

Règles appliquées :
- **API down** : le backend renvoie une réponse fallback (`source: "fallback"`, `degraded: true`, `message` explicite).
- **Pas de données eau** : `waterTemperature: null` et `showWater: false` pour que le frontend masque simplement le bloc eau.
- **Try/catch partout** : chaque appel externe est protégé pour éviter les crashs backend.

Impact frontend :
1. L’écran principal s’affiche même si une API externe est indisponible.
2. Les composants secondaires (eau, heure) peuvent être cachés sans casser la page.
3. Le message fallback peut être affiché en texte léger (“donnée temporairement indisponible”).

---

## 🖥️ Frontend (React + Vite)

Le frontend est dans un dossier séparé `frontend/` (séparation claire frontend/backend).

Structure frontend :
- `frontend/src/components/`
- `frontend/src/pages/`
- `frontend/src/services/`

Lancement local :
```bash
cd frontend
npm install
npm run dev
```

Le serveur Vite démarre sur `http://localhost:3000`.

### Appels API frontend

Le frontend utilise :
- `GET http://localhost:3003/air?city=...`
- `GET http://localhost:3004/water?city=...`
- `GET http://localhost:3005/time?city=...`

Ordre de chargement UX :
1. `/air` d’abord (affichage rapide + background via `cityImage`).
2. `/water` et `/time` ensuite en parallèle.
3. si `water.showWater=false`, le bloc eau est masqué.
4. si `degraded=true`, le message fallback est affiché.

### Authentification optionnelle

Le dashboard est accessible sans login :
- recherche ville, météo air/eau, heure locale disponibles immédiatement.

Le login est optionnel et sert uniquement aux fonctionnalités avancées :
- bouton `Login` / `Déconnexion`,
- token stocké dans `localStorage`,
- bouton `Add to favorites` affiché uniquement si l’utilisateur est connecté.

En cas d’erreur login :
- aucune redirection bloquante,
- aucune interruption du dashboard.

### Mock mode frontend

Le frontend peut fonctionner sans API externe via :
- `VITE_FRONTEND_MOCK_MODE=true`

Variables dans `frontend/.env.example` :
- `VITE_FRONTEND_MOCK_MODE`
- `VITE_AIR_API_BASE`
- `VITE_WATER_API_BASE`
- `VITE_TIME_API_BASE`
- `VITE_PREFERENCES_API_BASE`

### Docker (préparation future)

Exemple d’intégration future dans `docker-compose.yml` (port 3000) :

```yaml
frontend:
  build: ./frontend
  command: npm run dev -- --host 0.0.0.0 --port 3000
  ports:
    - "3000:3000"
  depends_on:
    - auth
    - preferences
    - weather-air
    - weather-water
    - time
```
