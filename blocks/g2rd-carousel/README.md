# G2RD Carousel - Bloc WordPress

Un bloc de carousel moderne et responsive pour WordPress, utilisant Swiper.js pour des animations fluides et une expérience utilisateur optimale.

## 🚀 Fonctionnalités

### Responsive Design
- **Mobile (320px+)**: Grille fixe 2×2 (4 images), sans autoplay, sans loop, sans swipe
- **Tablette (768px+)**: 2 slides visibles, loop activé, navigation optimisée
- **Desktop (1024px+)**: 3 slides visibles, loop désactivé pour stabilité, effets avancés
- **Grand écran (1200px+)**: Configuration complète avec effet coverflow, loop désactivé

### Effets Visuels
- **Slide**: Transition simple et fluide
- **Coverflow**: Effet 3D avec perspective
- **Fade**: Transition en fondu
- **Cube**: Rotation 3D (si supporté)

### Navigation
- Boutons de navigation personnalisables
- Pagination avec bullets
- Navigation tactile optimisée
- Autoplay avec pause au survol

### Contenu
- Support des images avec légendes
- Intégration des posts WordPress
- Lazy loading pour les performances
- Accessibilité améliorée (ARIA labels)

## 📱 Responsive Breakpoints

Le carousel s'adapte automatiquement à la taille d'écran :

```javascript
// Configuration responsive automatique
320: { 
  slidesPerView: 2, 
  spaceBetween: 10, 
  effect: 'slide',
  loop: false,
  autoplay: false,
  grid: { rows: 2, fill: 'row' }
}
768: { 
  slidesPerView: 2, 
  spaceBetween: 30, 
  effect: 'slide',
  loop: true,
  autoplay: true
}
1024: { 
  slidesPerView: 3, 
  spaceBetween: 30, 
  effect: 'slide',
  loop: false,
  autoplay: true,
  stopOnLastSlide: true
}
1200: { 
  slidesPerView: 3, 
  spaceBetween: 50, 
  effect: 'coverflow',
  loop: false,
  autoplay: true,
  stopOnLastSlide: true
}
```

## 🎨 Personnalisation

### Couleurs du thème
Le carousel utilise automatiquement les couleurs de votre thème WordPress :
- Couleurs primaires et secondaires
- Support des gradients
- Adaptation aux modes sombre/clair

### Styles CSS
```css
/* Personnalisation des boutons de navigation */
.swiper-button-prev,
.swiper-button-next {
  background: var(--wp--preset--color--primary);
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Adaptation mobile */
@media (max-width: 768px) {
  .swiper-slide {
    width: 280px !important;
    height: 200px !important;
  }
}
```

## 🔧 Installation

1. Copiez le dossier `g2rd-carousel` dans votre thème
2. Assurez-vous que Swiper.js est chargé
3. Le bloc sera automatiquement disponible dans l'éditeur

## 📋 Utilisation

### Dans l'éditeur WordPress
1. Ajoutez le bloc "G2RD Carousel"
2. Configurez les images ou sélectionnez des posts
3. Ajustez les paramètres d'affichage
4. Le responsive est automatique !

### Programmatiquement
```php
// Afficher un carousel dans votre thème
echo do_blocks('<!-- wp:g2rd/carousel {"images":[...]} /-->');
```

## ⚡ Performance

### Optimisations incluses
- **Lazy loading** des images
- **Détection tactile** pour désactiver les effets lourds
- **Debouncing** des événements de redimensionnement
- **Mise à jour intelligente** de Swiper

### Mobile First
- Effets simplifiés sur mobile
- Navigation tactile optimisée
- Chargement progressif
- Gestion de l'orientation

## 🎯 Accessibilité

- Labels ARIA pour la navigation
- Support du clavier
- Contraste des couleurs respecté
- Structure sémantique

## 🔄 Mise à jour

Le carousel se met à jour automatiquement lors des changements de taille d'écran :
- Redimensionnement de fenêtre
- Changement d'orientation mobile
- Rotation d'écran

## 🐛 Dépannage

### Problèmes courants
1. **Images qui ne s'affichent pas** : Vérifiez les URLs et les permissions
2. **Navigation qui ne fonctionne pas** : Assurez-vous que Swiper.js est chargé
3. **Problèmes sur mobile** : Vérifiez la console pour les erreurs JavaScript

### Debug
```javascript
// Accéder aux instances Swiper
window.G2RDCarousel.getAllInstances();

// Mettre à jour manuellement
window.G2RDCarousel.updateAllResponsive();
```

## 📄 Licence

Ce bloc fait partie du thème G2RD et suit les mêmes conditions de licence.

---

**Version**: 1.1.4  
**Dernière mise à jour**: Simplification et optimisation du code  
**Compatibilité**: WordPress 6.5+, Swiper.js 11+

### Notes de version 1.1.4
- Simplification de la configuration du loop pour améliorer la stabilité
- Désactivation automatique du loop si nombre de slides insuffisant
- Configuration simplifiée des breakpoints responsive
- Suppression des messages de debug dans la console
- Optimisation du code JavaScript pour réduire la complexité
- Amélioration de la gestion de l'autoplay avec loop désactivé sur desktop
- Correction des problèmes de décalage avec l'effet coverflow
