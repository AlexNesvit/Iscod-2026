# Vision Produit – Application Température (Air & Eau)

## 1. Contexte et objectif du projet

Ce projet s’inscrit dans le cadre d’un projet d’examen visant à concevoir et développer une application web complète, en appliquant une démarche professionnelle de gestion de projet et de conception logicielle.

L’objectif principal est de proposer une application permettant à un utilisateur de consulter, en temps réel, la température de l’air et de l’eau pour une ville donnée, à partir de données fournies par des APIs externes, sans stockage de ces données météorologiques.

Le projet met l’accent sur :
	•	une architecture microservices,
	•	la séparation claire des responsabilités,
	•	la sécurité des accès aux bases de données,
	•	une approche centrée utilisateur,
	•	et une démarche progressive de conception avant développement.

⸻

## 2. Vision du produit

L’application a pour vocation de fournir une information météo simple, lisible et contextualisée, à destination d’utilisateurs souhaitant consulter rapidement les conditions climatiques d’une ville, notamment dans un contexte de loisirs, de voyage ou d’activités en extérieur.

La température de l’eau constitue une fonctionnalité différenciante, affichée uniquement lorsque l’information est disponible (présence d’un point d’eau exploitable à proximité de la ville sélectionnée).

L’application doit rester fonctionnelle même en cas d’indisponibilité partielle des services externes (mode dégradé).

⸻

## 3. Cibles utilisateurs

Les utilisateurs ciblés sont :
	•	des utilisateurs non authentifiés souhaitant consulter rapidement des informations de température,
	•	des utilisateurs authentifiés souhaitant personnaliser leur expérience via :
	•	la gestion de villes favorites,
	•	la définition d’alertes personnalisées.

L’application ne vise pas un public technique, mais un usage grand public simple et intuitif.

⸻

## 4. Périmètre fonctionnel

Fonctionnalités incluses dans le périmètre :
	•	géolocalisation approximative par IP,
	•	recherche manuelle d’une ville,
	•	consultation de la température de l’air,
	•	consultation de la température de l’eau lorsque disponible,
	•	affichage d’une image représentative de la ville,
	•	authentification utilisateur,
	•	gestion des villes favorites,
	•	création et consultation d’alertes,
	•	séparation des responsabilités par microservices.

Fonctionnalités exclues du périmètre :
	•	stockage historique des données météorologiques,
	•	prévisions long terme,
	•	gestion avancée des notifications (SMS, push mobiles),
	•	interface d’administration avancée.

⸻

## 5. Contraintes techniques

Les contraintes techniques imposées au projet sont les suivantes :
	•	architecture microservices basée sur Node.js,
	•	frontend développé en React,
	•	utilisation de deux systèmes de bases de données distincts :
	•	MongoDB pour l’authentification et la gestion des utilisateurs,
	•	MySQL pour la logique métier (favoris, alertes),
	•	accès aux bases de données via des utilisateurs dédiés disposant uniquement de privilèges DML,
	•	absence de droits DDL ou administratifs pour les services applicatifs,
	•	données météorologiques récupérées via des APIs externes, sans stockage,
	•	conteneurisation de chaque service via Docker et Docker Compose,
	•	documentation des APIs via Swagger / OpenAPI.

⸻

## 6. Approche méthodologique

Le projet adopte une approche centrée utilisateur (user-centric), reposant sur :
	•	la formalisation des besoins sous forme de user stories,
	•	la constitution d’un backlog produit,
	•	une conception préalable incluant wireframes, modélisation UML et modélisation des bases de données,
	•	une progression par étapes, de la conception vers l’implémentation.

Cette approche vise à garantir la cohérence du produit, la maintenabilité du code et la lisibilité du projet dans un contexte pédagogique et professionnel.

⸻

## 7. Indicateurs de réussite

Le projet sera considéré comme abouti si :
	•	l’architecture microservices est fonctionnelle et cohérente,
	•	les bases de données sont correctement sécurisées et isolées,
	•	l’application démarre et fonctionne via Docker Compose,
	•	les fonctionnalités principales sont accessibles et stables,
	•	la documentation projet est claire, structurée et exploitable.