# Documentation des blocs personnalisés

Ce document détaille les blocs FSE personnalisés inclus dans le thème G2RD.

## Liste des blocs

- **G2RD Accordéon FAQ Block** _(Nouveau en v1.1.5)_
- **G2RD Info Block** _(v1.0.6)_
- G2RD Countdown Block
- G2RD Toggle Content Block
- G2RD Tabs Block
- G2RD Counter Block
- G2RD Typed Block
- G2RD Carousel Block
- Portfolio Block
- Team Block
- Services Block
- Contact Block
- Testimonials Block

## G2RD Info Block _(v1.0.6)_

- **Description** : Bloc d'information polyvalent similaire au bloc info d'Astra, permettant d'afficher une icône ou image avec du texte dans différentes dispositions.
- **Attributs** :

  - `title` : titre principal
  - `description` : description/contenu
  - `mediaType` : type de média (icon/image)
  - `iconName` : nom de l'icône Dashicon
  - `imageUrl` : URL de l'image personnalisée
  - `layout` : disposition (icon-left, icon-right, icon-top, icon-bottom)
  - `gap` : espacement entre l'icône et le texte
  - `backgroundColor` : couleur de fond
  - `titleColor` : couleur du titre
  - `descriptionColor` : couleur de la description
  - `iconColor` : couleur de l'icône

- **Options** :

  - **Layouts** : 4 dispositions (gauche, droite, haut, bas)
  - **Médias** : Plus de 100 icônes Dashicons organisées par catégories ou image personnalisée
  - **Sélecteur visuel** : Aperçu des icônes avec recherche par catégorie
  - **Espacement dynamique** : Contrôle du gap entre icône et texte
  - **Personnalisation complète** : Couleurs, typographie, bordures, ombres
  - **Effets de survol** : Scale, lift, glow
  - **Responsive** : S'adapte automatiquement aux écrans mobiles

- **Catégories d'icônes disponibles** :

  - Information & Status (info, warning, success, error, etc.)
  - Communication (email, phone, chat, etc.)
  - Media & Content (image, video, audio, etc.)
  - Commerce (cart, money, products, etc.)
  - Navigation (arrow, menu, search, etc.)
  - Social Media (social icons)
  - Utilities (tools, settings, etc.)

- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/info {
    "title":"Notre expertise",
    "description":"Plus de 10 ans d'expérience en développement web",
    "mediaType":"icon",
    "iconName":"star-filled",
    "layout":"icon-left",
    "gap":20,
    "titleColor":"#2563eb",
    "iconColor":"#f59e0b"
  } /-->
  ```

## Portfolio Block

- **Description** : Affiche une grille de projets avec filtres dynamiques et animations au survol.
- **Attributs** : titre, image, lien, catégories, nombre de colonnes, affichage des filtres.
- **Options** :
  - `columns` : nombre de colonnes (2, 3, 4)
  - `showFilters` : afficher/masquer les filtres
  - `animation` : type d'animation au survol
- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/portfolio {"columns":3,"showFilters":true} /-->
  ```

## Team Block

- **Description** : Affiche les membres de l'équipe avec photo, nom, rôle et réseaux sociaux.
- **Attributs** : nom, rôle, image, liens sociaux, description.
- **Options** :
  - `columns` : nombre de colonnes
  - `showDescription` : afficher la description
- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/team {"columns":4} /-->
  ```

## Services Block

- **Description** : Liste les services proposés avec icônes et descriptions.
- **Attributs** : titre, icône, description.
- **Options** :
  - `columns` : nombre de colonnes
- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/services {"columns":3} /-->
  ```

## Contact Block

- **Description** : Formulaire de contact personnalisable avec champs dynamiques.
- **Attributs** : email, téléphone, adresse, carte, champs personnalisés.
- **Options** :
  - `showMap` : afficher la carte
- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/contact {"showMap":true} /-->
  ```

## Testimonials Block

- **Description** : Affiche les témoignages clients avec note, photo et citation.
- **Attributs** : nom, photo, citation, note.
- **Options** :
  - `columns` : nombre de colonnes
- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/testimonials {"columns":2} /-->
  ```

---

## G2RD Accordéon FAQ Block _(v1.1.5)_

- **Description** : Bloc accordéon complet pour créer des FAQ avec onglets ouvrables/fermables. Permet d'ajouter autant d'onglets que souhaité avec compteur, icône personnalisable et options d'état initial.
- **Attributs** :
  - `items` : tableau des items de l'accordéon (id, title, clientId)
  - `initialState` : état initial ("first-open", "all-open", "all-closed")
  - `iconType` : type d'icône ("chevron", "arrow", "arrow-horizontal", "plus")
  - `iconPosition` : position de l'icône ("left", "right")
  - `showCounter` : afficher le compteur (boolean)
  - `counterPosition` : position du compteur ("left", "right")
  - `allowMultiple` : permettre plusieurs items ouverts simultanément (boolean)
  - `itemBackgroundColor` : couleur de fond des items inactifs
  - `itemTextColor` : couleur du texte des items inactifs
  - `itemActiveBackgroundColor` : couleur de fond des items actifs
  - `itemActiveTextColor` : couleur du texte des items actifs
  - `contentBackgroundColor` : couleur de fond du contenu
  - `contentTextColor` : couleur du texte du contenu
  - `borderColor` : couleur de la bordure
  - `borderWidth` : épaisseur de la bordure (nombre)
  - `borderRadius` : rayon des coins (nombre)
  - `showBorder` : afficher la bordure (boolean)
  - `gap` : espacement entre les items (string, ex: "8px", "1rem")

- **Options** :
  - **Ajout/suppression illimitée** : Boutons pour ajouter/supprimer des items
  - **Compteur personnalisable** : Affichage du numéro de chaque item (gauche ou droite)
  - **4 types d'icônes** : Chevron, flèche, flèche horizontale, plus/moins
  - **Position de l'icône** : Gauche ou droite
  - **État initial** : Tout ouvert, tout fermé, ou premier ouvert
  - **Plusieurs items ouverts** : Option pour permettre plusieurs items ouverts simultanément
  - **Contenu riche** : InnerBlocks pour ajouter n'importe quel bloc WordPress dans chaque item
  - **Personnalisation complète** : Couleurs, bordures, espacement
  - **Design responsive** : Adaptation automatique pour mobile et tablette
  - **Accessibilité** : Support ARIA complet

- **Exemple d'utilisation** :
  ```
  <!-- wp:g2rd/accordion {
    "items": [
      {"id": "item-1", "title": "Question 1"},
      {"id": "item-2", "title": "Question 2"}
    ],
    "initialState": "first-open",
    "iconType": "chevron",
    "iconPosition": "right",
    "showCounter": true,
    "counterPosition": "left",
    "allowMultiple": false
  } -->
  <!-- /wp:g2rd/accordion -->
  ```

Complétez chaque section pour chaque bloc personnalisé du thème.
