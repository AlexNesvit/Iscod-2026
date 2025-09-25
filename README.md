# 🌊 Application Température (Air & Eau)

## 📌 Description
Ce projet est une application web permettant :
- d’afficher la **température de l’air** et de l’**eau** par ville (via des APIs externes),
- de gérer ses **villes favorites**,
- de définir des **alertes personnalisées**,
- et d’assurer une **authentification sécurisée** des utilisateurs.

L’objectif est de combiner **microservices Node.js**, un **frontend React**, et deux types de bases de données (**MySQL** et **MongoDB**), tout en respectant une architecture modulaire et évolutive.

---

## ⚙️ Technologies
- **Frontend :** React
- **Backend :** Node.js (architecture microservices)
- **Bases de données :**
  - MySQL → gestion des utilisateurs, favoris, alertes
  - MongoDB → stockage des mesures issues des APIs externes (air & eau)
- **Conteneurisation :** Docker + Docker Compose
- **Documentation API :** Swagger / OpenAPI
- **Gestion de version :** GitHub (dépôt privé)

---

## 📂 Structure du dépôt (prévisionnelle)
```
root/
 ├── frontend/              # Application React
 ├── services/
 │    ├── auth/            # Authentification (MySQL)
 │    ├── preferences/     # Favoris & alertes (MySQL)
 │    ├── weather-air/     # API Air externe → MongoDB
 │    └── weather-water/   # API Eau externe → MongoDB
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
- **Cahier des Charges :** voir [docs/cahier_des_charges.md](docs/cahier_des_charges.md)
- **Swagger API Docs :** (à définir)

---
