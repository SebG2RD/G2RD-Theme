# G2RD-theme

## Structure de la documentation

- **README.md** : Documentation développeur, instructions d'installation, scripts, contribution. Ce fichier reste à la racine pour GitHub.
- **readme.txt** : Documentation utilisateur, format WordPress.org, reste à la racine du thème.
- **/docs/** : Documentation complémentaire (ex : [accessibilité](docs/accessibility.md), guides avancés, tutoriels).
- **LICENSE** et **license.txt** : Licences du projet, à la racine.

---

Un thème WordPress Full Site Editing (FSE) moderne et flexible pour les agences web.

## Description

Ce thème offre une expérience d'édition complète avec des blocs personnalisés, des animations fluides et une interface intuitive. Idéal pour les sites vitrines, portfolios et sites d'agences web.

## Caractéristiques

- Full Site Editing (FSE)
- Blocs personnalisés
- Animations fluides
- Interface intuitive
- Support multilingue
- Responsive design
- Gestion avancée des membres d'équipe
- Sélecteur de médias WordPress intégré
- Interface d'administration native
- Types de contenu personnalisés
- Portfolio professionnel
- Section "Qui sommes nous" avec gestion des icônes

## Fonctionnalités détaillées

### Section "Qui sommes nous"

- Profils détaillés des membres
- Gestion des compétences et expériences
- Sélection multiple d'icônes via la bibliothèque de médias
- Interface d'administration native WordPress
- Prévisualisation des icônes en temps réel

### Interface d'administration

- Utilisation des classes natives WordPress
- Sélecteur de médias intégré
- Gestion intuitive des contenus
- Interface responsive et accessible

## Développement

### Prérequis

- WordPress 6.5+
- PHP 8.0+
- Node.js 16+
- npm ou yarn

### Installation pour le développement

1. Clonez le dépôt :

```bash
git clone https://github.com/g2rd/g2rd-theme.git
cd g2rd-theme
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

### Structure du projet

```
g2rd-theme/
├── assets/           # Assets compilés (CSS, JS, images)
├── blocks/           # Blocs personnalisés
├── classes/          # Classes PHP
├── docs/            # Documentation complémentaire
├── languages/       # Fichiers de traduction
├── parts/           # Templates de parties
├── patterns/        # Patterns FSE
├── styles/          # Styles FSE
├── templates/       # Templates FSE
├── configuration.json  # Configuration du thème
├── functions.php    # Fonctions principales
├── index.php        # Template par défaut
├── license.txt      # Licence (format WordPress.org)
├── LICENSE          # Licence (format GitHub)
├── readme.txt       # Documentation utilisateur (WordPress.org)
├── screenshot.png   # Capture d'écran du thème
├── style.css        # Fichier de style principal
├── theme.json       # Configuration FSE principale
├── theme-settings.json  # Paramètres du thème
└── theme-styles.json    # Styles du thème
```

### Scripts disponibles

- `npm run dev`
