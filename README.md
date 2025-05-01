# Application de Gestion de Tâches

Une application web moderne de gestion de tâches développée avec React et Express, tous deux en TypeScript.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Démarrage](#démarrage)
- [Utilisation](#utilisation)
  - [Connexion](#connexion)
  - [Fonctionnalités](#fonctionnalités)
- [Tests](#tests)
- [Choix technologiques](#choix-technologiques)

## Prérequis

- Node.js (version 22.14.1 recommandée)
- npm (installé avec Node.js)
- Git

## Installation

Commencez par cloner le projet sur votre machine locale :

```bash
git clone https://github.com/Miumiu27/test-candidat.git
cd test-candidat
```

### Frontend

```bash
# Naviguer vers le répertoire frontend
cd frontend

# Installer les dépendances
npm install
```

### Backend

```bash
# Naviguer vers le répertoire backend
cd backend

# Installer les dépendances
npm install
```

## Démarrage

Pour démarrer l'application, vous devez lancer à la fois le serveur frontend et le serveur backend.

### Démarrer le frontend

```bash
# Dans le répertoire frontend
npm run dev
```

### Démarrer le backend

```bash
# Dans le répertoire backend
npm run dev
```

Une fois les deux serveurs lancés, l'application sera accessible à l'adresse : [http://localhost:5173/](http://localhost:5173/)

## Utilisation

### Connexion

À l'écran de connexion, utilisez les identifiants suivants :

- **Email** : miumiu@gmail.com
- **Mot de passe** : kgfQc8a

Ces identifiants se trouvent également dans le fichier `.env` de l'API.

### Fonctionnalités

Une fois connecté, vous aurez accès à :

- **Page d'accueil** : Liste de toutes vos tâches
- **Formulaire d'ajout** : Pour créer de nouvelles tâches
- **Gestion des tâches** : Chaque tâche dispose de boutons d'action :
  - Marquer comme fait
  - Supprimer
  - Modifier (la modification s'effectue via le formulaire d'ajout)
- **Filtrage** : Possibilité de filtrer les tâches (faites/non faites)
- **Déconnexion** : Option pour se déconnecter de l'application

## Tests

Pour exécuter les tests, utilisez les commandes suivantes :

### Tests Frontend

```bash
# Dans le répertoire frontend
npm run test
```

### Tests Backend

```bash
# Dans le répertoire backend
npm run test
```

## Choix technologiques

Ce projet a été développé en utilisant des technologies modernes et robustes pour offrir une expérience utilisateur optimale tout en garantissant la maintenabilité et l'évolutivité du code.

**TypeScript** a été choisi pour les parties frontend et backend afin d'assurer un typage statique, ce qui améliore considérablement la détection d'erreurs dès la phase de développement et facilite la maintenance du code à long terme. 

**React** offre une approche composant qui permet de créer des interfaces utilisateur interactives et réactives. Sa grande communauté et son écosystème riche en bibliothèques compatibles en font un choix idéal pour le développement frontend moderne.

**Express** a été sélectionné pour le backend en raison de sa simplicité, sa flexibilité et ses performances. Ce framework minimaliste pour Node.js facilite la création d'APIs RESTful robustes et évolutives.

L'architecture séparée frontend/backend permet une meilleure organisation du code et facilite le développement parallèle des différentes parties de l'application, tout en offrant la possibilité de faire évoluer chaque partie indépendamment selon les besoins futurs du projet.