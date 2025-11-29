# G2RD Modal Block

Un bloc WordPress personnalisé pour créer des modals/popups avec de nombreuses options de personnalisation.

## Fonctionnalités

- ✅ Bouton déclencheur personnalisable (texte, couleurs, style)
- ✅ Titre du modal optionnel
- ✅ Contenu riche avec tous les blocs WordPress (via InnerBlocks)
- ✅ Options de fermeture :
  - Bouton de fermeture (X)
  - Clic en dehors du modal
  - Touche Escape
- ✅ Personnalisation complète des couleurs (modal, bouton, overlay)
- ✅ Bordures et coins arrondis personnalisables
- ✅ Alignement du modal (centré, droite, gauche)
- ✅ Largeur du modal personnalisable
- ✅ Responsive et accessible
- ✅ Design WordPress natif

## Installation

1. Les dépendances sont déjà installées dans le thème
2. Compiler le bloc avec : `npm run build`
3. Le bloc sera automatiquement enregistré par le système d'auto-chargement du thème

## Utilisation

1. Dans l'éditeur WordPress, cherchez le bloc "G2RD Modal (Popup)"
2. Ajoutez le bloc à votre page
3. Configurez les options dans le panneau latéral :
   - **Bouton déclencheur** : Texte, couleurs, style
   - **Configuration du modal** : Titre, largeur, alignement
   - **Options de fermeture** : Bouton X, clic extérieur, Escape
   - **Couleurs du modal** : Fond et texte
   - **Bordure du modal** : Style, épaisseur, coins arrondis
   - **Fond (overlay)** : Couleur et opacité
4. Cliquez sur le bouton déclencheur dans l'éditeur pour voir l'aperçu du modal
5. Ajoutez du contenu dans le modal en utilisant n'importe quel bloc WordPress

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
- `src/modal.css` : Styles CSS
- `src/modal-frontend.js` : JavaScript frontend pour les interactions
- `webpack.config.js` : Configuration Webpack

## Notes

- Le bloc utilise les classes WordPress natives pour un design cohérent
- Les icônes utilisent les Dashicons WordPress
- Le bloc est entièrement accessible (ARIA, focus trap)
- Compatible avec l'impression (le modal est masqué)
- Le scroll du body est désactivé quand le modal est ouvert

