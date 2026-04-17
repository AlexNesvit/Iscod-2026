# Vision Produit — Application Température (Air & Eau)

## 1. Vision

Créer une application météo simple et fiable qui permet de consulter rapidement l’air, l’eau et l’heure locale d’une ville, avec une UX claire et une architecture microservices professionnelle.

## 2. Objectif principal

Offrir un dashboard unique qui fonctionne même en cas d’erreurs externes :

- affichage air prioritaire ;
- chargement eau + heure en parallèle ;
- mode dégradé sans crash ;
- accès météo possible sans login obligatoire.

## 3. Valeur utilisateur

- consultation immédiate de la météo d’une ville ;
- visualisation enrichie (image de ville + icône météo) ;
- personnalisation via favoris après connexion ;
- continuité d’usage même si une API externe tombe.

## 4. Public cible

- utilisateurs grand public (voyage, loisirs, activités extérieures) ;
- utilisateurs souhaitant sauvegarder des villes favorites après authentification.

## 5. Périmètre fonctionnel actuel

Inclus :

- recherche manuelle de ville ;
- température de l’air (WeatherAPI `current.json`) ;
- température de l’eau (WeatherAPI `marine.json`, avec estimation si nécessaire) ;
- heure locale (WeatherAPI `timezone.json`) ;
- authentification JWT (`register`, `login`, `me`) ;
- favoris (`add`, `list`, `delete`) ;
- mode mock frontend + mode fallback backend ;
- interface responsive desktop/tablette/mobile.

Hors périmètre UI actuel :

- écran complet de gestion d’alertes (API prête côté backend) ;
- notifications push/SMS ;
- historique météo.

## 6. Contraintes techniques

- frontend : React + Vite (port dev `3006`) ;
- backend : Node.js/Express en microservices ;
- stockage polyglotte :
  - MongoDB pour `auth`,
  - MySQL pour `preferences` ;
- aucune persistance des données météo ;
- conteneurisation backend via Docker Compose.

## 7. Principes produit

- lisibilité (code et UI démontrables à l’examen) ;
- modularité (responsabilités séparées par service) ;
- robustesse (fallback, degraded, try/catch) ;
- sécurité (JWT, bcrypt, verifyToken, variables `.env`).

## 8. Indicateurs de réussite

Le produit est considéré valide si :

- les 5 microservices répondent correctement (`/health`) ;
- la recherche météo charge les données attendues sans reload ;
- le dashboard reste utilisable en mode dégradé ;
- l’authentification et les favoris fonctionnent ;
- la documentation et les tests minimaux sont cohérents avec l’implémentation.
