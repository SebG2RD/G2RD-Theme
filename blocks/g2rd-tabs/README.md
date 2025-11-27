# G2RD Tabs Block

Un bloc WordPress personnalisé permettant de créer des onglets avec du contenu riche.

## Fonctionnalités

- ✅ Ajout et suppression d'onglets
- ✅ Modification des titres d'onglets
- ✅ Contenu riche avec InnerBlocks (possibilité d'ajouter n'importe quel bloc Gutenberg dans chaque onglet)
- ✅ Plusieurs styles disponibles (Défaut, Sous-ligné, Pillules, Bordure, Minimal)
- ✅ Personnalisation des couleurs (onglets actifs/inactifs, contenu)
- ✅ Personnalisation des bordures et espacements
- ✅ Alignement des onglets (gauche, centre, droite, étiré)
- ✅ Accessible (ARIA labels, navigation au clavier)
- ✅ Responsive
- ✅ Styles proches de WordPress natif

## Installation

Le bloc est automatiquement enregistré par le système d'auto-chargement du thème. Assurez-vous d'avoir compilé les assets :

```bash
cd blocks/g2rd-tabs
npm install
npm run build
```

## Utilisation

1. Ajoutez le bloc "G2RD Onglets" depuis la catégorie "G2RD Bloks"
2. Cliquez sur "Ajouter" pour créer de nouveaux onglets
3. Modifiez les titres en cliquant directement dessus
4. Ajoutez du contenu dans chaque onglet en cliquant dans la zone de contenu
5. Personnalisez le style et les couleurs depuis le panneau latéral

## Styles disponibles

- **Défaut** : Style classique avec bordure inférieure pour l'onglet actif
- **Sous-ligné** : Style minimal avec une ligne sous l'onglet actif
- **Pillules** : Onglets arrondis comme des boutons
- **Bordure** : Onglets avec bordure complète
- **Minimal** : Style épuré sans bordures

## Personnalisation

Toutes les options de personnalisation sont disponibles dans le panneau latéral de l'éditeur :

- **Style des onglets** : Choisir le style visuel
- **Alignement** : Positionner les onglets
- **Couleurs** : Personnaliser les couleurs des onglets et du contenu
- **Bordures** : Ajuster l'épaisseur, la couleur et le rayon des coins
- **Espacement** : Définir l'espace entre les onglets

## Structure technique

- `block.json` : Configuration du bloc
- `src/index.js` : Point d'entrée et enregistrement du bloc
- `src/edit.js` : Composant d'édition React
- `src/save.js` : Composant de sauvegarde
- `src/tabs.css` : Styles CSS
- `src/tabs-frontend.js` : Script JavaScript pour l'interactivité frontend

## Compatibilité

- WordPress 6.0+
- Gutenberg (éditeur de blocs)
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)

