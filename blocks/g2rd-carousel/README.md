# G2RD Carousel Block

Un block WordPress personnalisé pour créer des carrousels d'images interactifs avec Swiper.js.

## Fonctionnalités

- **Effets multiples** : Coverflow, Slide, Fade, Cube, Flip
- **Navigation** : Boutons précédent/suivant personnalisables
- **Pagination** : Points de navigation cliquables
- **Autoplay** : Défilement automatique configurable
- **Responsive** : Adaptation automatique aux différentes tailles d'écran
- **Gestion d'images** : Upload multiple via la bibliothèque WordPress
- **Légendes** : Support des légendes d'images
- **Badge** : Badge personnalisable pour mettre en valeur le contenu

## Installation

1. Assurez-vous que Swiper.js est chargé sur votre site
2. Le block sera automatiquement disponible dans l'éditeur WordPress

## Utilisation

### Dans l'éditeur WordPress

1. Ajoutez le block "G2RD Carousel" à votre page
2. Sélectionnez les images via la bibliothèque WordPress
3. Configurez les paramètres dans le panneau latéral :
   - **Carousel Settings** : Titre, description, badge
   - **Images** : Gestion des images sélectionnées
   - **Animation Settings** : Effet, délai, navigation, pagination
   - **Coverflow Settings** : Paramètres spécifiques à l'effet coverflow

### Paramètres disponibles

#### Carousel Settings

- **Title** : Titre du carrousel
- **Description** : Description du carrousel
- **Show Badge** : Afficher/masquer le badge
- **Badge Text** : Texte du badge

#### Animation Settings

- **Effect** : Type d'effet (Coverflow, Slide, Fade, Cube, Flip)
- **Autoplay Delay** : Délai entre les transitions automatiques (ms)
- **Space Between** : Espacement entre les slides
- **Show Pagination** : Afficher/masquer la pagination
- **Show Navigation** : Afficher/masquer les boutons de navigation
- **Centered Slides** : Centrer les slides
- **Loop** : Boucle infinie
- **Grab Cursor** : Curseur de préhension

#### Coverflow Settings (si l'effet coverflow est sélectionné)

- **Rotate** : Rotation des slides
- **Stretch** : Étirement des slides
- **Depth** : Profondeur de l'effet 3D
- **Modifier** : Modificateur de l'effet

## Développement

### Structure des fichiers

```
g2rd-carousel/
├── block.json          # Configuration du block
├── package.json        # Dépendances et scripts
├── webpack.config.js   # Configuration Webpack
├── src/
│   ├── index.js        # Point d'entrée principal
│   ├── edit.js         # Composant d'édition
│   ├── save.js         # Composant de sauvegarde
│   ├── carousel.css    # Styles CSS
│   └── carousel-frontend.js # JavaScript frontend
└── build/              # Fichiers compilés
```

### Scripts disponibles

```bash
# Développement
npm run start

# Production
npm run build

# Linting
npm run lint:js
npm run lint:css
```

### Dépendances

- `@wordpress/scripts` : Outils de développement WordPress
- `swiper` : Bibliothèque de carrousel (externe)

## Personnalisation

### CSS

Les styles peuvent être personnalisés en modifiant le fichier `src/carousel.css`. Les classes principales sont :

- `.g2rd-carousel` : Conteneur principal
- `.carousel-header` : En-tête avec titre et badge
- `.carousel-container` : Conteneur du carrousel
- `.swiper-container` : Conteneur Swiper
- `.carousel-slide` : Slide individuel

### JavaScript

Le JavaScript frontend peut être étendu en modifiant `src/carousel-frontend.js`. L'objet global `G2RDCarousel` fournit des méthodes utilitaires :

```javascript
// Obtenir l'instance Swiper d'un carrousel
const swiper = G2RDCarousel.getInstance(carouselElement);

// Obtenir toutes les instances
const allSwipers = G2RDCarousel.getAllInstances();

// Détruire un carrousel
G2RDCarousel.destroy(carouselElement);
```

## Support

Pour toute question ou problème, consultez la documentation du thème G2RD ou contactez l'équipe de développement.

## Licence

Ce block fait partie du thème G2RD et suit la même licence que le thème principal.
