# Guide de personnalisation avancée

Ce guide explique comment personnaliser le thème G2RD au-delà des options de l'éditeur.

## Surcharger les styles

- Utilisez un thème enfant ou ajoutez vos SCSS/CSS dans le dossier approprié
- Utilisez les variables CSS du thème
- **Exemple** :
  ```css
  :root {
    --wp--preset--color--primary: #1a237e;
  }
  ```

## Modifier les templates

- Les templates FSE sont dans /templates et /parts
- Vous pouvez les dupliquer et les adapter dans un thème enfant
- **Exemple** :
  Copiez `parts/header.html` dans votre thème enfant et modifiez le logo ou la structure.

## Ajouter des hooks ou filtres

- Utilisez les hooks WordPress pour ajouter des fonctionnalités
- **Exemple** :
  ```php
  add_action('wp_footer', function() {
    echo '<!-- Custom footer code -->';
  });
  ```

## Ajouter des blocs personnalisés

- Placez vos blocs dans /src/blocks
- Suivez la structure des blocs existants
- **Exemple** :
  Créez `/src/blocks/mon-bloc/` avec un fichier `block.json` et le JS associé.

## Ressources utiles

- [Documentation WordPress FSE](https://developer.wordpress.org/block-editor/full-site-editing/)
