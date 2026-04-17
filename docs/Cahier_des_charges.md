# Cahier des Charges — Application Température (Air & Eau)

## 1. Contexte et objectifs

L’objectif du projet est de développer une application web permettant d’afficher la température de l’air, la température de l’eau (si disponible) et l’heure locale d’une ville, avec une architecture microservices claire et démontrable.

Le projet doit rester stable en cas d’indisponibilité partielle des APIs externes (mode dégradé), tout en conservant une expérience utilisateur fluide.

## 2. Périmètre fonctionnel (MVP)

Fonctionnalités incluses :

- recherche d’une ville manuelle ;
- chargement météo air, eau et heure sans rechargement de page ;
- affichage conditionnel du bloc eau (`showWater`) ;
- authentification JWT (register/login/me) ;
- gestion des favoris pour utilisateur authentifié (ajout, liste, suppression) ;
- mode mock et fallback pour la démonstration ;
- interface responsive (desktop, tablette, mobile).

Fonctionnalités hors MVP (ou partiellement implémentées côté API uniquement) :

- gestion complète des alertes côté UI ;
- notifications push/SMS ;
- stockage d’historique météo.

## 3. Architecture cible

### 3.1 Frontend

- React + Vite (port `3006` en dev).
- Dashboard accessible sans authentification obligatoire.
- Authentification optionnelle pour activer les favoris.

### 3.2 Backend microservices

- `auth` (port `3001`) : register, login, me.
- `preferences` (port `3002`) : favorites + alerts (JWT requis).
- `weather-air` (port `3003`) : air + image ville + icône météo.
- `weather-water` (port `3004`) : eau marine + estimation si champ absent.
- `time` (port `3005`) : timezone + localtime.

### 3.3 Bases de données

- MongoDB : utilisateurs/auth (`auth`).
- MySQL : favoris/alertes (`preferences`).

Important : les données météo (air/eau/heure) ne sont pas stockées en base, elles sont consultées en temps réel via API externe.

## 4. Modèle de données

### 4.1 MongoDB (auth)

Document utilisateur :

- `email`
- `passwordHash`
- `role`
- `createdAt`

### 4.2 MySQL (preferences)

Tables métier :

- `favorites` (`id`, `user_id`, `city_code`, `label`, `created_at`)
- `alerts` (`id`, `user_id`, `city_code`, `type`, `threshold`, `direction`, `created_at`)

## 5. APIs externes et stratégie de données

APIs WeatherAPI utilisées :

- `current.json` (air),
- `marine.json` (water),
- `timezone.json` (time).

Logique eau :

- si `water_temp_c` existe : valeur réelle ;
- sinon : estimation via `forecastday[0].day.avgtemp_c` ;
- sinon : bloc eau masqué (`showWater=false`).

## 6. Exigences non fonctionnelles

- robustesse : pas de crash frontend si API externe indisponible ;
- résilience : réponses fallback (`degraded: true`) ;
- performance perçue : chargement progressif (`/air` puis `/water` + `/time` en parallèle) ;
- sécurité : JWT, bcrypt, middleware `verifyToken`, CORS ;
- reproductibilité : lancement backend via Docker Compose.

## 7. Sécurité des accès

- séparation MongoDB/MySQL par responsabilité métier ;
- secrets externalisés via `.env` ;
- routes sensibles protégées par token Bearer ;
- isolation des données utilisateur via `user_id` issu du token.

## 8. Livrables

- code source frontend + backend microservices ;
- Docker Compose backend ;
- documentation projet (`README`, `journal_projet`, `vision_produit`, `user_stories`, ce cahier) ;
- diagrammes UML Bloc 9 (`uml-bloc9-simple.svg`, `uml-bloc9-usecase.svg`) ;
- tests fonctionnels minimaux des endpoints critiques.

---

Résumé : le projet implémente une architecture microservices lisible, des APIs météo temps réel sans stockage, une auth JWT, un mode dégradé robuste, et un frontend démontrable pour l’examen.
