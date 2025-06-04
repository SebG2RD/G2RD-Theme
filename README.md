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
├── assets/           # Assets compilés
├── classes/          # Classes PHP
├── inc/             # Fonctions et hooks
├── parts/           # Templates de parties
├── patterns/        # Patterns FSE
├── src/             # Source files
│   ├── js/         # JavaScript
│   ├── scss/       # Styles
│   └── blocks/     # Blocs personnalisés
├── templates/       # Templates FSE
└── theme.json      # Configuration FSE
```

### Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile les assets pour la production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run format` : Formate le code avec Prettier
- `npm run test` : Lance les tests

### Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### Standards de code

- PHP : PSR-12
- JavaScript : ESLint + Prettier
- CSS : SCSS avec BEM
- Documentation : PHPDoc

## Licence

Ce projet est sous licence EUPL-1.2. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Support

Pour le support technique, veuillez ouvrir une issue sur GitHub.
Pour le support utilisateur, visitez [g2rd.fr](https://g2rd.fr).

## Auteur

Sebastien GERARD - [G2RD](https://g2rd.fr)

## Utilisation

### Gestion des membres d'équipe

1. Accédez à "Qui sommes nous" dans le menu WordPress
2. Créez un nouveau membre
3. Remplissez les informations du profil
4. Utilisez le sélecteur de médias pour ajouter des icônes
5. Publiez le profil
