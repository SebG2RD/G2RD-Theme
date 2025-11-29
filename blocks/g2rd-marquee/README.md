# Bloc G2RD Marquee

Un bloc WordPress pour créer un défilement infini (marquee) horizontal ou vertical avec effet de fondu.

## Fonctionnalités

- ✅ Défilement horizontal ou vertical
- ✅ Vitesse de défilement configurable
- ✅ Effet de fondu optionnel sur les bords
- ✅ Pause au survol optionnelle
- ✅ Duplication automatique du contenu pour un défilement fluide
- ✅ Hauteur configurable pour le défilement vertical (px, vh, %)
- ✅ Compatible avec tous les blocs WordPress (InnerBlocks)

## Installation

1. Le bloc est automatiquement détecté et enregistré par le système d'auto-chargement du thème
2. Compiler les assets avec :
   ```bash
   cd blocks/g2rd-marquee
   npm install
   npm run build
   ```

## Utilisation

1. Dans l'éditeur Gutenberg, recherchez "G2RD Marquee"
2. Ajoutez le bloc à votre page
3. Ajoutez votre contenu à l'intérieur du bloc (texte, images, autres blocs, etc.)
4. Configurez les paramètres dans la barre latérale :
   - **Direction** : Horizontal ou Vertical
   - **Vitesse** : De 10 (très rapide) à 200 (très lent)
   - **Effet de fondu** : Active/désactive l'effet de fondu sur les bords
   - **Pause au survol** : Le défilement s'arrête quand la souris survole le bloc
   - **Dupliquer le contenu** : Duplique automatiquement le contenu pour un défilement fluide
   - **Hauteur du bloc** (uniquement pour défilement vertical) : Définit la hauteur visible du bloc
     - **Unité** : Pixels (px), Viewport Height (vh), ou Pourcentage (%)
     - **Valeur** : Ajustable selon l'unité choisie

## Exemples d'utilisation

### Défilement horizontal de logos
- Ajoutez des blocs d'images avec vos logos
- Direction : Horizontal
- Vitesse : 50-80
- Effet de fondu : Activé

### Défilement vertical de témoignages
- Ajoutez des blocs de citations
- Direction : Vertical
- Vitesse : 60-100
- Effet de fondu : Activé
- Hauteur : 400px (ou 50vh pour une hauteur responsive)

## Structure technique

- `block.json` : Configuration du bloc
- `src/index.js` : Point d'entrée et enregistrement du bloc
- `src/edit.js` : Composant d'édition dans l'éditeur
- `src/save.js` : Composant de sauvegarde (frontend)
- `src/marquee-frontend.js` : Script JavaScript pour l'animation
- `src/marquee.css` : Styles CSS pour le défilement et les animations

## Notes

- Le contenu est automatiquement dupliqué côté frontend pour assurer un défilement infini fluide
- L'animation utilise CSS animations pour de meilleures performances
- Le bloc est compatible avec tous les alignements WordPress (large, pleine largeur, etc.)

