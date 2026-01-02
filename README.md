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

## 🚀 Lancement (à venir)
Les instructions pour installer et exécuter le projet en local avec Docker Compose seront ajoutées ultérieurement.

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