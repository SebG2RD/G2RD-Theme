# G2RD Portfolio Universel Filtrable

Un bloc WordPress puissant qui affiche Articles, CPT (Custom Post Types) et produits WooCommerce avec des filtres dynamiques, recherche, et différents modes d'affichage.

## Fonctionnalités

### Types de contenu supportés

- ✅ Articles (posts)
- ✅ Tous les CPT (Custom Post Types)
- ✅ Produits WooCommerce (optionnel)

### Filtres dynamiques

- ✅ Catégories (posts + WooCommerce)
- ✅ Tags (posts + WooCommerce)
- ✅ Taxonomies custom
- ✅ Filtre par date (de/à)
- ✅ Filtre par auteur
- ✅ Recherche par titre et contenu

### Modes d'affichage

- **Grille** : Affichage en grille avec nombre de colonnes configurable
- **Masonry** : Affichage en colonnes (style Pinterest)
- **Slider** : Carrousel horizontal avec défilement
- **Liste** : Affichage vertical en liste

### Chargement

- ✅ Chargement Ajax dynamique
- ✅ Pagination classique
- ✅ Load More (charger plus)

### Interactions

- **Modale** : Affiche le contenu complet dans une modale
- **Lien externe** : Redirige vers la page de l'article
- **Preview rapide** : Aperçu au survol (à venir)

### Performance

- ✅ Lazy loading des images
- ✅ Requêtes optimisées
- ✅ SEO friendly (liens propres, pas de cloaking)

## Installation

Le bloc est automatiquement enregistré par le thème G2RD. Aucune installation supplémentaire n'est nécessaire.

## Utilisation

1. Dans l'éditeur Gutenberg, ajoutez le bloc "G2RD Portfolio Universel Filtrable"
2. Configurez les types de contenu à afficher dans le panneau latéral
3. Choisissez le mode d'affichage (grille, masonry, slider, liste)
4. Configurez les filtres à afficher
5. Ajustez les options d'affichage (colonnes, éléments par page, etc.)

## Configuration

### Types de contenu

Sélectionnez les types de posts à afficher :

- Articles
- Tous les CPT disponibles
- Produits WooCommerce (si WooCommerce est installé)

### Affichage

- **Mode** : Grille, Masonry, Slider, ou Liste
- **Colonnes** : Nombre de colonnes pour le mode grille (1-6)
- **Éléments par page** : Nombre d'éléments à afficher (1-50)
- **Type de pagination** : Load More ou Pagination classique
- **Espacement** : Espace entre les éléments (0-50px)

### Filtres

Activez/désactivez les différents filtres :

- Recherche
- Catégories
- Tags
- Taxonomies custom
- Filtre date
- Filtre auteur

### Contenu des cartes

- Afficher l'extrait
- Afficher la date
- Afficher l'auteur

### Liens et interactions

- **Modale** : Ouvre le contenu dans une modale
- **Lien externe** : Redirige vers la page
- **Preview rapide** : Aperçu au survol

### Tri

- **Trier par** : Date, Titre, Modifié, Ordre du menu, Aléatoire
- **Ordre** : Croissant ou Décroissant

## API REST

Le bloc utilise des endpoints REST API personnalisés :

- `GET /wp-json/g2rd/v1/portfolio-universel` : Récupère les éléments avec filtres
- `GET /wp-json/g2rd/v1/portfolio-universel/filters` : Récupère les filtres disponibles

## Structure des fichiers

```
g2rd-portfolio-universel/
├── block.json              # Configuration du bloc
├── package.json            # Dépendances npm
├── webpack.config.js       # Configuration webpack
├── README.md               # Documentation
└── src/
    ├── index.js            # Point d'entrée
    ├── edit.js             # Composant d'édition
    ├── save.js             # Composant de sauvegarde
    ├── portfolio-universel-frontend.js  # JavaScript frontend
    └── portfolio-universel.css          # Styles CSS
```

## Développement

Pour compiler les assets :

```bash
cd blocks/g2rd-portfolio-universel
npm install
npm run build
```

Pour le développement en mode watch :

```bash
npm run start
```

## Notes techniques

- Le bloc utilise l'API REST WordPress pour récupérer les données
- Les requêtes sont optimisées avec WP_Query
- Le lazy loading utilise l'Intersection Observer API
- Les filtres sont gérés côté client avec Ajax
- Compatible avec tous les thèmes WordPress modernes

## Support

Pour toute question ou problème, consultez la documentation du thème G2RD ou contactez le support.
