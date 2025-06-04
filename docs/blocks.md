# Documentation des blocs personnalisés

Ce document détaille les blocs FSE personnalisés inclus dans le thème G2RD.

## Liste des blocs

- Portfolio Block
- Team Block
- Services Block
- Contact Block
- Testimonials Block

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

Complétez chaque section pour chaque bloc personnalisé du thème.
