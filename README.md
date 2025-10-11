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

## 🚀 Lancement (à venir)
Les instructions pour installer et exécuter le projet en local avec Docker Compose seront ajoutées ultérieurement.

---

## 📖 Documentation
- **Cahier des Charges :** voir [docs/cahier_des_charges.md](docs/Cahier_des_charges.md)
- **Swagger API Docs :** (à définir)

---
