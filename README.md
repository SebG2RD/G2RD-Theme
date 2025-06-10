# G2RD Theme

Un thème WordPress Full Site Editing (FSE) moderne et flexible pour les agences web.

## Description

Ce thème offre une expérience d'édition complète avec des blocs personnalisés, des animations fluides et une interface intuitive. Idéal pour les sites vitrines, portfolios et sites d'agences web.

## Fonctionnalités

- Full Site Editing (FSE)
- Design moderne et responsive
- Support des blocs Gutenberg
- Personnalisation avancée via l'interface WordPress
- Optimisé pour les performances
- Support multilingue
- Système de licences et mises à jour intégré
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

## Installation

1. Téléchargez le thème depuis votre espace client SureCart
2. Dans votre administration WordPress, allez dans Apparence > Thèmes
3. Cliquez sur "Ajouter" puis "Téléverser un thème"
4. Sélectionnez le fichier ZIP du thème et cliquez sur "Installer maintenant"
5. Activez le thème

## Configuration

### Configuration de la licence

1. Dans votre administration WordPress, allez dans Apparence > G2RD Settings
2. Entrez votre clé API SureCart
3. Allez dans Apparence > G2RD License
4. Entrez votre clé de licence
5. Cliquez sur "Enregistrer les modifications"

### Mises à jour

Le thème se met à jour automatiquement lorsque de nouvelles versions sont disponibles sur GitHub. Pour bénéficier des mises à jour :

1. Assurez-vous d'avoir une licence valide
2. Votre clé de licence doit être entrée dans les paramètres du thème
3. Les mises à jour apparaîtront automatiquement dans votre administration WordPress

## Système de licences

Le thème utilise un système de licences basé sur SureCart pour gérer les abonnements et les mises à jour :

- Licences annuelles
- Vérification automatique de la validité des licences
- Mises à jour automatiques pour les licences valides
- Support de plusieurs licences par utilisateur
- Interface d'administration pour gérer les licences

### Fonctionnement des licences

1. L'utilisateur achète une licence via SureCart
2. La licence est liée à son compte WordPress
3. Le système vérifie automatiquement la validité de la licence
4. Les mises à jour sont disponibles uniquement pour les licences valides
5. Les licences expirées ne permettent plus l'accès aux mises à jour

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

## Structure du projet

```
G2RD-theme/
├── assets/           # Assets compilés (CSS, JS, images)
├── blocks/           # Blocs personnalisés
├── classes/          # Classes PHP
│   ├── class-github-updater.php
│   ├── class-surecart-license-manager.php
│   └── ...
├── docs/            # Documentation complémentaire
├── includes/        # Fichiers d'inclusion
│   └── license-init.php
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

## Support

Pour toute question ou assistance :

- Consultez la documentation en ligne
- Contactez le support via votre espace client SureCart
- Ouvrez une issue sur GitHub pour les bugs

## Licence

Ce thème est distribué sous licence EUPL-1.2. Voir le fichier LICENSE pour plus de détails.

## Crédits

- Développé par Sebastien GERARD
- Basé sur WordPress
- Utilise l'API GitHub pour les mises à jour
- Intégration avec SureCart pour la gestion des licences

## Structure de la documentation

- **README.md** : Documentation développeur, instructions d'installation, scripts, contribution. Ce fichier reste à la racine pour GitHub.
- **readme.txt** : Documentation utilisateur, format WordPress.org, reste à la racine du thème.
- **/docs/** : Documentation complémentaire (ex : [accessibilité](docs/accessibility.md), guides avancés, tutoriels).
- **LICENSE** et **license.txt** : Licences du projet, à la racine.
