# Journal de projet – Application Température (Air & Eau)

## Démarrage du projet et cadrage initial

Le projet a débuté par la création du dépôt GitHub afin de disposer dès le départ d’un espace de travail centralisé et versionné.
L’objectif était de poser un cadre clair avant toute phase de développement technique.

J’ai commencé par rédiger un fichier README.md afin de présenter le projet, ses objectifs généraux, les technologies envisagées et la structure globale du dépôt. Le README sert de point d’entrée pour toute personne consultant le projet (enseignant, recruteur, ou développeur).

Rapidement, j’ai fait le choix de distinguer la documentation « vitrine » (README) des documents de cadrage et de gestion de projet, stockés dans un dossier docs/.

⸻

## Cadrage du projet et vision produit

Avant d’écrire du code, j’ai formalisé la vision produit dans un document dédié (vision_produit.md).
Ce document permet de définir clairement :
	•	le contexte du projet,
	•	les objectifs fonctionnels,
	•	le périmètre inclus et exclu,
	•	les contraintes techniques imposées (microservices, bases de données, sécurité, Docker).

Ce travail de cadrage m’a permis d’éviter de partir directement dans l’implémentation sans vision claire, et de structurer le projet comme un véritable produit, et non comme un simple exercice technique.

⸻

## Approche centrée utilisateur et backlog produit

Dans une logique user-centric, j’ai ensuite formalisé les besoins sous forme de user stories dans le fichier user_stories.md.
Ces user stories constituent le backlog produit et servent de référence tout au long du projet.

Cette étape m’a aidé à :
	•	identifier les fonctionnalités essentielles,
	•	prioriser les besoins,
	•	garder une cohérence fonctionnelle entre le backend et le frontend.

Le backlog reste volontairement évolutif afin de pouvoir être ajusté au fil de l’avancement du projet.

⸻

## Cahier des charges

En complément du cadrage et des user stories, un cahier des charges a été rédigé afin de regrouper les attentes fonctionnelles et techniques du projet dans un document structuré.

Ce document permet de répondre aux exigences pédagogiques du projet tout en servant de référence globale.

⸻

## Organisation du travail et roadmap

Une roadmap de développement a été ajoutée dans le README.md sous forme de notes personnelles.
Elle permet de suivre l’avancement du projet étape par étape (cadrage, conception, initialisation technique, backend, frontend, documentation).

Cette roadmap n’est pas figée et peut être modifiée en fonction des besoins ou des ajustements réalisés au cours du développement.

⸻

## Choix méthodologiques initiaux

Dès le départ, j’ai fait le choix de :
	•	commencer par le cadrage et la documentation avant toute implémentation,
	•	sécuriser le socle technique (Node.js, Docker, structure microservices) avant l’intégration frontend,
	•	adopter une organisation Git avec une branche main stable et une branche develop dédiée au développement fonctionnel.

Ces choix visent à reproduire une méthodologie de travail proche de celle rencontrée en environnement professionnel.

⸻

## État actuel du projet

À ce stade, le projet dispose :
	•	d’un dépôt Git structuré,
	•	d’un README clair,
	•	d’un dossier de documentation complet (vision produit, user stories, cahier des charges, journal de projet),
	•	d’une roadmap permettant de suivre l’avancement.

Les prochaines étapes concerneront l’initialisation technique (Node.js, Express, Docker) et la mise en place du socle backend.

## Initialisation du socle technique (en cours)

À ce stade du projet, j’ai entamé la phase d’initialisation du socle technique avant toute implémentation fonctionnelle ou frontend.

L’objectif de cette étape est de mettre en place un environnement stable et reproductible, permettant au projet de démarrer correctement, même en l’absence de fonctionnalités métier.

Je travaille actuellement sur les actions suivantes :
	•	installation et configuration de Node.js (version LTS),
	•	mise en place d’un serveur Express minimal,
	•	création de la structure des microservices,
	•	préparation de la conteneurisation avec Docker et Docker Compose.

### Mise en place de l’environnement Node.js

Le projet a été initialisé à l’aide de Node.js afin de disposer d’un point d’entrée technique commun à l’ensemble des services.

Les premières commandes exécutées sont les suivantes :
	•	node -v (vérification de la version LTS installée)
	•	npm init -y (initialisation du projet Node)
	•	npm install express (installation du framework Express)

Ces étapes permettent de disposer d’un projet Node fonctionnel et prêt à accueillir un serveur HTTP minimal.

### Serveur Express minimal

Un serveur Express basique est ensuite mis en place afin de valider le bon fonctionnement de l’environnement Node.

L’objectif à ce stade n’est pas d’implémenter de logique métier, mais simplement de vérifier que :
	•	le serveur démarre correctement,
	•	une route simple (ex. /health) répond sans erreur.

### Structure des microservices

Une structure de dossiers est créée afin de préparer l’architecture microservices du projet, avec un service par responsabilité (authentification, préférences, météo air, météo eau).

Chaque service est initialisé de manière minimale avec son propre point d’entrée Node et un serveur Express simple, sans dépendance fonctionnelle à ce stade.

### Préparation de la conteneurisation Docker

En parallèle, la conteneurisation est préparée avec Docker et Docker Compose afin de garantir un environnement reproductible.

Les outils Docker sont utilisés pour :
	•	définir les services applicatifs,
	•	préparer l’intégration future des bases de données,
	•	permettre le démarrage global du projet via une commande unique (docker compose up).

Ce choix a été fait afin de sécuriser l’environnement de développement en amont et d’éviter toute dépendance prématurée au frontend ou aux aspects visuels du projet.

Cette phase permettra, une fois terminée, de disposer d’un projet techniquement opérationnel, prêt à accueillir progressivement les fonctionnalités backend (authentification, préférences, services météo), puis frontend.

### Initialisation du socle technique (terminée)

La phase d’initialisation du socle technique est désormais terminée.

Un serveur Node.js avec Express a été mis en place et validé localement, avec un endpoint de santé simple (/health) permettant de vérifier le bon fonctionnement de l’application.

Le projet a ensuite été conteneurisé avec Docker. Un Dockerfile et un docker-compose.yml minimal ont été créés afin de permettre le lancement de l’application dans un environnement isolé et reproductible.

L’application est désormais exécutée entièrement à l’intérieur d’un conteneur Docker et peut être démarrée via une seule commande (docker compose up). Le serveur Node.js ne dépend plus de l’environnement local pour son exécution.

Ce socle technique garantit une base stable pour la suite du projet et permet d’envisager sereinement l’ajout progressif des microservices, des bases de données et du frontend.

⸻

## Bloc 1 — Mise en place de l’architecture microservices (terminée)

Dans la continuité du socle technique, j’ai finalisé le premier bloc de développement en structurant l’application en microservices distincts, conformément au cahier des charges.

L’objectif de ce bloc était de passer d’un serveur unique minimal à une base d’architecture distribuée, avec une séparation claire des responsabilités.

### Structure créée

Les dossiers de services suivants ont été créés :
	•	services/auth
	•	services/preferences
	•	services/weather-air
	•	services/weather-water

Chaque service dispose d’un point d’entrée `index.js` avec :
	•	une application Express minimale,
	•	une route `/health`,
	•	un port dédié via variable d’environnement `PORT`.

### Évolution Docker Compose

Le fichier `docker-compose.yml` a été mis à jour pour déclarer les quatre services applicatifs :
	•	auth (port 3001)
	•	preferences (port 3002)
	•	weather-air (port 3003)
	•	weather-water (port 3004)

Cette étape permet de préparer le projet pour la suite (ajout des bases de données et communication interservices).

### Vérifications réalisées

Les validations suivantes ont été effectuées :
	•	validation de la configuration compose via `docker compose config` (OK),
	•	vérification syntaxique des quatre points d’entrée via `node --check` (OK).

Le démarrage complet via `docker compose up -d --build` n’a pas pu être confirmé dans l’environnement courant car le daemon Docker n’était pas accessible au moment du test.

### Résultat du bloc

Le bloc 1 est considéré comme terminé sur le plan structurel : l’architecture microservices est en place, cohérente et prête à accueillir les blocs suivants (MongoDB, MySQL, authentification JWT, gestion des préférences et intégration des APIs météo externes).

⸻

## Bloc 2 — Intégration des bases de données (terminée)

Le deuxième bloc a consisté à intégrer les deux bases de données attendues dans le projet : MongoDB et MySQL, directement dans l’environnement Docker Compose.

### Pourquoi deux bases de données

Le choix de deux systèmes de stockage répond à une logique d’architecture :
	•	MongoDB est utilisé pour l’authentification (documents utilisateur, flexibilité du schéma, modèle orienté identité).
	•	MySQL est utilisé pour la logique métier structurée (favoris, alertes), avec un schéma relationnel clair et des contraintes de cohérence.

Cette séparation permet d’illustrer une approche polyglotte orientée besoins métier, tout en respectant le cahier des charges de l’examen.

### Séparation des responsabilités

La responsabilité des données est désormais explicitement répartie :
	•	service `auth` ↔ MongoDB (`auth_db`),
	•	service `preferences` ↔ MySQL (`preferences_db`),
	•	services météo sans stockage persistant (consultation uniquement).

Ce découpage réduit le couplage entre composants et facilite l’évolution de chaque service.

### Connexion via Docker

Les deux bases sont intégrées à `docker-compose.yml` avec :
	•	volumes persistants dédiés (`mongo_data`, `mysql_data`),
	•	healthchecks,
	•	dépendances de démarrage (`depends_on`) pour garantir l’ordre d’initialisation.

Pour MongoDB, un script d’initialisation crée l’utilisateur applicatif `app_user` avec des droits limités à `auth_db`.

Pour MySQL, un script SQL d’initialisation crée les tables métier :
	•	`favorites`
	•	`alerts`

### Vérifications effectuées

Les validations techniques réalisées :
	•	services et bases démarrés via `docker compose up -d --build`,
	•	MongoDB en état `healthy` et connexion confirmée depuis le service `auth`,
	•	MySQL en état `healthy` et connexion confirmée depuis le service `preferences`,
	•	présence confirmée des tables `favorites` et `alerts` dans `preferences_db`,
	•	health endpoints des services `auth` et `preferences` retournant un statut `ok` avec état de connexion base.

### Résultat du bloc

Le bloc 2 est validé : l’application dispose désormais d’une intégration Docker complète de MongoDB et MySQL, avec une séparation claire des responsabilités et une base technique prête pour le bloc suivant (JWT, register/login, puis CRUD métier).

⸻

## Bloc 3 — Implémentation de l’authentification JWT (terminée)

Ce bloc a permis de transformer le service `auth` en service de sécurité minimal fonctionnel, conforme aux attentes d’une application sécurisée.

### Register (`POST /register`)

Le endpoint d’inscription a été implémenté avec les règles suivantes :
	•	validation des champs obligatoires (`email`, `password`),
	•	normalisation de l’email (trim + lowercase),
	•	contrôle de longueur minimale du mot de passe,
	•	vérification d’unicité de l’email en base,
	•	création du compte en MongoDB.

### Login (`POST /login`)

Le endpoint de connexion a été implémenté avec :
	•	recherche de l’utilisateur par email,
	•	vérification du mot de passe via comparaison bcrypt,
	•	retour d’un token JWT signé en cas de succès.

### Hash password

La sécurité des mots de passe repose sur :
	•	l’utilisation de `bcryptjs`,
	•	le stockage d’un `passwordHash` uniquement,
	•	l’absence de stockage de mot de passe en clair,
	•	un facteur de coût configurable (`BCRYPT_SALT_ROUNDS`).

### Schéma MongoDB

Un schéma utilisateur dédié a été ajouté :
	•	`email` (unique),
	•	`passwordHash`,
	•	`role` (`user`/`admin`),
	•	`createdAt`.

Ce schéma structure les données d’authentification et renforce la cohérence du service.

### Sécurité (JWT + middleware)

Un middleware de vérification JWT (`verifyToken`) a été ajouté :
	•	vérification du header `Authorization: Bearer <token>`,
	•	vérification de signature + expiration,
	•	rejet des requêtes non autorisées (`401`).

Une route protégée (`GET /me`) permet de valider le fonctionnement du middleware sur un cas concret.

### Vérifications réalisées

Les tests fonctionnels ont confirmé le comportement attendu :
	•	`register` retourne `201`,
	•	`login` retourne `200` + token JWT,
	•	`/me` avec token valide retourne `200`,
	•	`/me` sans token retourne `401`.

### Résultat du bloc

Le bloc 3 est validé : le socle d’authentification sécurisé (inscription, connexion, hash des mots de passe, JWT, middleware de protection) est en place et opérationnel.

⸻

## Configuration centralisée via `.env` et `.env.example`

Dans la continuité des blocs backend, la configuration a été centralisée à la racine du projet :
	•	`.env` pour l’exécution locale (non versionné),
	•	`.env.example` comme modèle de référence (versionné).

Ce changement permet de :
	•	éviter le hardcode des secrets et paramètres techniques dans `docker-compose.yml`,
	•	uniformiser les configurations entre environnements,
	•	faciliter l’onboarding et la reproductibilité du projet.

Les variables couvrent :
	•	les ports des microservices,
	•	la connexion MongoDB (auth),
	•	la connexion MySQL (preferences),
	•	la sécurité JWT/Bcrypt.

⸻

## Bloc 4 — Gestion des préférences utilisateur (MySQL) (terminée)

Ce bloc a consisté à implémenter la logique métier des préférences utilisateur dans le microservice `preferences`, avec liaison systématique au `user_id` extrait du JWT.

### Sécurisation des routes

Un middleware de vérification token a été ajouté au service `preferences` afin de protéger les routes métier :
	•	`/favorites`
	•	`/alerts`

L’identifiant utilisateur est récupéré depuis `req.user.sub`, ce qui garantit une isolation des données par utilisateur.

### Favorites (CRUD partiel)

Fonctionnalités implémentées :
	•	`POST /favorites` : création d’un favori (`city` requis),
	•	`GET /favorites` : liste des favoris de l’utilisateur connecté,
	•	`DELETE /favorites/:id` : suppression d’un favori seulement s’il appartient à l’utilisateur courant.

### Alerts (create/read)

Fonctionnalités implémentées :
	•	`POST /alerts` : création d’alerte (`city`, `threshold`),
	•	`GET /alerts` : liste des alertes de l’utilisateur connecté.

### Choix technique MySQL

Le service utilise `mysql2` avec un pool de connexions pour une gestion plus robuste des accès base.

Des logs de debug ont été ajoutés sur les routes principales pour faciliter le suivi des opérations pendant la phase d’examen.

### Gestion des erreurs

Les cas métier attendus sont gérés explicitement :
	•	`401` si token absent/invalide,
	•	`400` si données d’entrée manquantes ou invalides,
	•	`404` si la ressource à supprimer n’existe pas pour l’utilisateur.

### Vérifications réalisées

Des tests fonctionnels ont validé :
	•	création/lecture/suppression des favoris,
	•	création/lecture des alertes,
	•	retours d’erreur conformes (`401`, `400`, `404`).

### Résultat du bloc

Le bloc 4 est validé : le service `preferences` est opérationnel, sécurisé par JWT, connecté à MySQL et conforme au périmètre CRUD attendu pour l’examen.

⸻

## Bloc 5 — Intégration APIs météo air + water + time (terminée)

Ce bloc concrétise la fonctionnalité différenciante du projet : la consultation météo air/eau en temps réel par ville.

### Endpoints livrés

	•	`GET /air?city=<ville>` (`weather-air`)
	•	`GET /water?city=<ville>` (`weather-water`)
	•	`GET /time?city=<ville>` (`weather-air`)

### Intégration des providers

	•	`weather-air` utilise WeatherAPI `current.json` (température de l’air),
	•	`weather-water` utilise WeatherAPI `marine.json` (température de l’eau).
	•	`time` utilise WeatherAPI `timezone.json` (heure locale et fuseau).

Les deux services restent compatibles avec un mode mock via variables d’environnement.

### Appel API externe, pas de stockage, affichage direct

La logique suit la contrainte projet :
	•	**appel API externe** : récupération météo à la demande,
	•	**pas de stockage** : aucune insertion en base (ni MySQL ni MongoDB),
	•	**affichage direct** : la température est renvoyée directement au frontend.

### Background ville (Unsplash)

Une URL d’image de ville est ajoutée à la réponse (`cityImage`) :
	•	fallback simple sans clé via `source.unsplash.com`,
	•	appel API Unsplash prêt si clé fournie.

### Configuration `.env` / `.env.example`

Les variables de ce bloc ont été ajoutées dans `.env` et `.env.example` :
	•	`WEATHER_AIR_USE_MOCK`
	•	`WEATHER_AIR_API_URL`
	•	`WEATHER_AIR_API_KEY`
	•	`WEATHER_WATER_USE_MOCK`
	•	`WEATHER_WATER_API_URL`
	•	`WEATHER_WATER_API_KEY`
	•	`UNSPLASH_API_URL`
	•	`UNSPLASH_ACCESS_KEY`

### Résultat

Le bloc 5 est validé : les services `weather-air` et `weather-water` sont opérationnels avec appels API externes, sans stockage, et réponses prêtes à l’affichage direct côté frontend.

### Orchestration frontend (ordre de chargement)

Pour optimiser l’expérience utilisateur sur une seule page :
	1. appel prioritaire de `/air?city=...` pour afficher immédiatement la météo air et le background (`cityImage`),
	2. appels secondaires en parallèle : `/time?city=...` et `/water?city=...` (marine),
	3. en cas d’absence de données eau, l’interface reste fonctionnelle avec air + heure locale.

⸻

## Bloc 6 — Gestion des erreurs et mode dégradé (terminée)

Ce bloc a été implémenté pour garantir la stabilité perçue de l’application même en cas de problème externe.

### API down

Quand un provider externe est indisponible (weather ou timezone) :
	•	le service ne renvoie pas une erreur bloquante au frontend,
	•	il renvoie un objet fallback avec :
	•	`source: "fallback"`
	•	`degraded: true`
	•	`message` explicite.

### Pas de données (eau)

Quand aucune donnée eau n’est disponible pour une ville :
	•	`waterTemperature` est renvoyé à `null`,
	•	`showWater` est positionné à `false`,
	•	un message “pas de données” est fourni.

Le frontend peut donc masquer le bloc eau proprement, sans erreur visuelle.

### Fallback & robustesse

Les appels externes sont encapsulés en `try/catch` pour tous les endpoints météo/temps.

Résultat :
	•	aucun crash backend sur erreur externe,
	•	expérience utilisateur continue (air + background + éléments disponibles),
	•	mode dégradé clair et exploitable côté frontend.
