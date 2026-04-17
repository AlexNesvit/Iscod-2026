# User Stories — Backlog Produit

## Application Température (Air & Eau)

### US-01 — Consultation météo air sans authentification

En tant qu’utilisateur non authentifié,  
je veux consulter la température de l’air d’une ville,  
afin d’obtenir rapidement une information météo de base.

Statut : implémentée

### US-02 — Consultation température de l’eau

En tant qu’utilisateur non authentifié,  
je veux consulter la température de l’eau lorsqu’elle est disponible,  
afin d’estimer les conditions aquatiques.

Statut : implémentée (avec fallback/estimation selon données API)

### US-03 — Consultation de l’heure locale

En tant qu’utilisateur,  
je veux consulter l’heure locale de la ville recherchée,  
afin d’avoir un contexte complet.

Statut : implémentée

### US-04 — Résilience en cas d’erreur externe

En tant qu’utilisateur,  
je veux que l’interface reste utilisable si une API externe échoue,  
afin d’éviter un écran bloquant.

Statut : implémentée (mode degraded + fallback)

### US-05 — Image de fond par ville

En tant qu’utilisateur,  
je veux voir un fond visuel lié à la ville recherchée,  
afin de contextualiser la consultation.

Statut : implémentée (avec image par défaut si indisponible)

### US-06 — Connexion utilisateur

En tant qu’utilisateur enregistré,  
je veux me connecter avec un compte sécurisé,  
afin d’accéder aux fonctionnalités personnalisées.

Statut : implémentée

### US-07 — Dashboard accessible sans login obligatoire

En tant qu’utilisateur,  
je veux accéder au dashboard sans blocage d’authentification,  
afin d’utiliser l’application immédiatement.

Statut : implémentée

### US-08 — Ajouter une ville en favori

En tant qu’utilisateur authentifié,  
je veux ajouter une ville dans mes favoris,  
afin d’y revenir rapidement.

Statut : implémentée

### US-09 — Voir la liste des favoris

En tant qu’utilisateur authentifié,  
je veux charger la liste de mes favoris,  
afin de naviguer entre mes villes enregistrées.

Statut : implémentée

### US-10 — Supprimer un favori

En tant qu’utilisateur authentifié,  
je veux supprimer un favori,  
afin de maintenir une liste pertinente.

Statut : implémentée

### US-11 — Cliquer un favori pour relancer la recherche

En tant qu’utilisateur authentifié,  
je veux cliquer sur un favori pour charger ses données météo,  
afin d’éviter une saisie manuelle.

Statut : implémentée

### US-12 — Gestion des alertes personnalisées

En tant qu’utilisateur authentifié,  
je veux créer et consulter des alertes,  
afin de préparer des seuils météo personnalisés.

Statut : partielle (API backend prête, UI dédiée non finalisée)

### US-13 — Déploiement reproductible

En tant que développeur/examinateur,  
je veux démarrer les services backend via Docker Compose,  
afin de reproduire l’environnement rapidement.

Statut : implémentée
