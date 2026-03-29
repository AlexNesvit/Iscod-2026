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
