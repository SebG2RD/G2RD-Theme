# G2RD Accordion Block

Un bloc WordPress personnalisé pour créer des accordéons FAQ avec de nombreuses options de personnalisation.

## Fonctionnalités

- ✅ Ajout/suppression illimitée d'items (onglets)
- ✅ Compteur d'onglets (affichable à gauche ou à droite)
- ✅ Choix du type d'icône (chevron, flèche, plus/moins)
- ✅ Position de l'icône (gauche ou droite)
- ✅ État initial configurable :
  - Tout ouvert
  - Tout fermé
  - Premier ouvert (par défaut)
- ✅ Permettre plusieurs items ouverts simultanément
- ✅ Personnalisation complète des couleurs
- ✅ Bordures et espacements personnalisables
- ✅ Responsive
- ✅ Compatible avec tous les blocs WordPress (via InnerBlocks)
- ✅ Design WordPress natif

## Installation

1. Les dépendances sont déjà installées dans le thème
2. Compiler le bloc avec : `npm run build`
3. Le bloc sera automatiquement enregistré par le système d'auto-chargement du thème

## Utilisation

1. Dans l'éditeur WordPress, cherchez le bloc "G2RD Accordéon FAQ"
2. Ajoutez le bloc à votre page
3. Configurez les options dans le panneau latéral :
   - **Configuration générale** : État initial et mode multiple
   - **Compteur d'onglets** : Afficher/masquer et position
   - **Icône** : Type et position
   - **Couleurs** : Personnalisation complète
   - **Bordures** : Style et épaisseur
   - **Espacement** : Gap entre les items

4. Cliquez sur "Ajouter un item" pour ajouter de nouveaux onglets
5. Cliquez sur chaque item pour l'ouvrir et ajouter du contenu
6. Utilisez n'importe quel bloc WordPress dans le contenu de chaque item

## Développement

```bash
# Installer les dépendances
npm install

# Compiler en mode production
npm run build

# Compiler en mode développement (avec watch)
npm run start
```

## Structure des fichiers

- `block.json` : Configuration du bloc
- `src/index.js` : Point d'entrée, enregistrement du bloc
- `src/edit.js` : Composant d'édition (interface dans l'éditeur)
- `src/save.js` : Composant de sauvegarde (HTML généré)
- `src/accordion.css` : Styles CSS
- `src/accordion-frontend.js` : JavaScript frontend pour les interactions
- `webpack.config.js` : Configuration Webpack

## Notes

- Le bloc utilise les classes WordPress natives pour un design cohérent
- Les icônes utilisent les Dashicons WordPress
- Le bloc est entièrement accessible (ARIA)
- Compatible avec l'impression (tous les items s'affichent)

