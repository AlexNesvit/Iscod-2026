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