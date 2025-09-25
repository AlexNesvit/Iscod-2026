# Cahier des Charges — Application Température (Air & Eau)

## 1. Contexte et Objectifs

L’objectif du projet est de développer une application web permettant d’afficher les températures de l’air et de l’eau par ville, avec la possibilité pour l’utilisateur de s’authentifier, de gérer ses villes favorites et de configurer des alertes. L’application intégrera des APIs externes (température de l’air et température de l’eau) et des APIs internes (authentification, gestion des favoris, alertes).

**Public cible :** nageurs, surfeurs, coachs sportifs, touristes.

## 2. Périmètre Fonctionnel (MVP)

* **Frontend :** Application React.
* **Backend :** Architecture microservices en Node.js.
* **Bases de données :**

  * **MySQL :** gestion des utilisateurs, authentification, favoris, alertes.
  * **MongoDB :** stockage des données issues des APIs externes (mesures de température air et eau).
* **APIs externes :**

  * API n°1 : température de l’air par ville.
  * API n°2 : température de l’eau (si la ville dispose d’un plan d’eau/océan/mer/rivière).
* **API interne :**

  * Authentification et inscription utilisateur (JWT).
  * Gestion des villes favorites (ajout/suppression).
  * Gestion des alertes personnalisées.

## 3. Architecture

* **Frontend (React)** commun, communiquant avec un **API Gateway**.
* **Microservices Node.js :**

  1. **Auth Service (MySQL)** : inscription, login, profil utilisateur.
  2. **Preferences Service (MySQL)** : favoris, alertes.
  3. **Weather Air Service (MongoDB)** : intégration API air + archivage mesures.
  4. **Weather Water Service (MongoDB)** : intégration API eau + archivage mesures.
* **API Gateway :** centralisation des appels vers les microservices.
* **Docker :** chaque service conteneurisé.

## 4. Modèle de Données

### MySQL (SQL)

* **users**(id, email, passwordHash, createdAt)
* **favorites**(id, user_id, cityCode, label, createdAt)
* **alerts**(id, user_id, cityCode, type [air|water], threshold, direction [ABOVE|BELOW], createdAt)

### MongoDB (NoSQL)

```json
{
  "cityCode": "paris",
  "type": "air" | "water",
  "value": 22.4,
  "unit": "°C",
  "source": "ExternalAPI",
  "takenAt": "2025-09-25T10:00:00Z",
  "fetchedAt": "2025-09-25T10:02:00Z"
}
```

## 5. Parcours Utilisateur

* L’utilisateur crée un compte et se connecte.
* Il ajoute plusieurs villes en favoris.
* L’application affiche la température de l’air (toujours) et de l’eau (si disponible).
* L’utilisateur peut définir des alertes (par ex. « notifier si eau < 18°C »).
* Les données sont récupérées des APIs externes mais stockées dans MongoDB.

## 6. Exigences Non Fonctionnelles

* **Performance :** temps de réponse API < 300ms (hors latence externe).
* **Sécurité :** JWT, gestion des accès, CORS strict.
* **Scalabilité :** architecture microservices, conteneurisation Docker.
* **Qualité :** documentation des APIs (Swagger), tests unitaires de base.

## 7. Fonctionnalités Futures (optionnelles)

En fonction du temps et des ressources disponibles, des fonctionnalités supplémentaires pourront être intégrées :

* Lors de l’ouverture d’une ville, affichage de photos issues de Google (ex. photos connues, monuments, paysages).
* Possibilité de cliquer sur une photo pour l’agrandir et découvrir des images représentatives de la ville.

Ces éléments ne font pas partie du MVP initial mais pourront enrichir l’expérience utilisateur ultérieurement.

## 8. Livrables

* Code source (Frontend React, Backend Node.js microservices).
* Schéma des bases de données.
* Documentation API (Swagger / OpenAPI).
* Cahier des charges (ce document, rédigé en format Markdown pour intégration facile dans un dépôt GitHub).
* **Dépôt GitHub** (privé) contenant le code source et les documents associés.
* **README.md** en Markdown, décrivant le projet, les technologies utilisées et les instructions de lancement (Docker Compose, installation, configuration).
* Docker Compose pour lancer l’ensemble.

---

**Résumé :** Le projet démontre l’utilisation de deux types de bases de données (SQL et NoSQL), l’intégration d’APIs externes et la conception d’APIs internes. L’application offre une expérience utilisateur simple : authentification, gestion de favoris, visualisation des températures et alertes personnalisées, avec possibilité d’évolution future vers un affichage enrichi (photos des villes). L’ensemble sera versionné et documenté dans un dépôt GitHub avec README.md en Markdown.
