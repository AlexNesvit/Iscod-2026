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