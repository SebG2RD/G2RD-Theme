// G2RD Carousel Frontend JavaScript
// Initialise Swiper.js pour tous les carrousels sur la page

function initializeCarousels() {
  // Vérifier si Swiper est disponible
  if (typeof Swiper === "undefined") {
    setTimeout(initializeCarousels, 500);
    return;
  }

  // Trouver tous les carrousels G2RD
  const carousels = document.querySelectorAll(".g2rd-carousel");

  carousels.forEach(function (carousel, index) {
    // Récupérer la configuration depuis les data attributes
    let config = {};
    try {
      const configData = carousel.getAttribute("data-config");
      if (configData) {
        config = JSON.parse(configData);
      }
    } catch (e) {
      console.error("G2RD Carousel: Error parsing config", e);
    }

    const swiperContainer = carousel.querySelector(".swiper");
    if (!swiperContainer) {
      return;
    }

    // Configuration par défaut
    const defaultConfig = {
      autoplayDelay: 3000,
      showPagination: true,
      showNavigation: true,
      effect: "slide", // Changé de coverflow à slide par défaut
      slidesPerView: "3",
      spaceBetween: 50,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      contentType: "images", // Type de contenu par défaut
      height: 400, // Hauteur par défaut
    };

    // Fusionner avec la configuration du block
    const finalConfig = { ...defaultConfig, ...config };

    // Appliquer la hauteur au conteneur si définie
    if (finalConfig.height) {
      const container = carousel.querySelector(".carousel-container");
      if (container) {
        container.style.height = `${finalConfig.height}px`;
      }
    }

    // Préparer la configuration Swiper de base
    const swiperConfig = {
      spaceBetween: finalConfig.spaceBetween,
      effect: finalConfig.effect,
      grabCursor: finalConfig.grabCursor,
      centeredSlides: finalConfig.centeredSlides,
      loop: finalConfig.loop,
      slidesPerView: finalConfig.slidesPerView,
      // Animation plus douce
      speed: 1000, // Durée de transition plus longue pour l'autoplay
      easing: "ease-in-out", // Transition plus douce
      watchSlidesProgress: true, // Surveille le progrès des slides
      watchSlidesVisibility: true, // Surveille la visibilité des slides
      // Configuration pour un défilement progressif
      slidesPerGroup: 1, // Défile une image à la fois
      allowTouchMove: true, // Permet le glissement tactile
      resistance: true, // Résistance aux bords
      resistanceRatio: 0.85, // Ratio de résistance
    };

    // Ajouter l'autoplay si disponible
    if (Swiper.Autoplay) {
      swiperConfig.autoplay = {
        delay: finalConfig.autoplayDelay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // Pause au survol
        waitForTransition: true, // Attend la fin de la transition
      };
    }

    // Ajouter la pagination si disponible et activée
    if (finalConfig.showPagination && Swiper.Pagination) {
      swiperConfig.pagination = {
        el: ".swiper-pagination",
        clickable: true,
      };
    }

    // Ajouter la navigation si disponible et activée
    if (finalConfig.showNavigation && Swiper.Navigation) {
      swiperConfig.navigation = {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      };
    }

    // Ajouter les modules disponibles
    const availableModules = [];
    if (Swiper.Autoplay) availableModules.push(Swiper.Autoplay);
    if (Swiper.EffectCoverflow) availableModules.push(Swiper.EffectCoverflow);
    if (Swiper.Pagination) availableModules.push(Swiper.Pagination);
    if (Swiper.Navigation) availableModules.push(Swiper.Navigation);

    if (availableModules.length > 0) {
      swiperConfig.modules = availableModules;
    }

    // Ajouter la configuration coverflow si nécessaire et disponible
    if (finalConfig.effect === "coverflow" && Swiper.EffectCoverflow) {
      swiperConfig.coverflowEffect = {
        rotate: finalConfig.coverflowRotate || 50,
        stretch: finalConfig.coverflowStretch || 0,
        depth: finalConfig.coverflowDepth || 200,
        modifier: finalConfig.coverflowModifier || 1,
        slideShadows: false,
        scale: 0.85, // Échelle des slides latérales
        perspective: 1000, // Perspective 3D
      };
    }

    // Initialiser Swiper
    try {
      const swiper = new Swiper(swiperContainer, swiperConfig);

      // Stocker l'instance Swiper sur l'élément pour un accès futur
      carousel.swiperInstance = swiper;

      // Navigation manuelle si les modules ne sont pas disponibles
      if (finalConfig.showNavigation && !Swiper.Navigation) {
        const prevButton = carousel.querySelector(".swiper-button-prev");
        const nextButton = carousel.querySelector(".swiper-button-next");

        if (prevButton) {
          prevButton.addEventListener("click", function (e) {
            e.preventDefault();
            swiper.slidePrev();
          });
        }

        if (nextButton) {
          nextButton.addEventListener("click", function (e) {
            e.preventDefault();
            swiper.slideNext();
          });
        }
      }

      // Pagination manuelle si le module n'est pas disponible
      if (finalConfig.showPagination && !Swiper.Pagination) {
        const pagination = carousel.querySelector(".swiper-pagination");
        if (pagination) {
          // Créer les bullets de pagination
          const slides = swiperContainer.querySelectorAll(".swiper-slide");
          pagination.innerHTML = "";

          slides.forEach((slide, index) => {
            const bullet = document.createElement("span");
            bullet.className = "swiper-pagination-bullet";
            bullet.addEventListener("click", function () {
              swiper.slideTo(index);
            });
            pagination.appendChild(bullet);
          });

          // Mettre à jour la pagination active
          const updatePagination = () => {
            const bullets = pagination.querySelectorAll(
              ".swiper-pagination-bullet"
            );
            bullets.forEach((bullet, index) => {
              bullet.classList.toggle(
                "swiper-pagination-bullet-active",
                index === swiper.activeIndex
              );
            });
          };

          swiper.on("slideChange", updatePagination);
          updatePagination(); // Initialisation
        }
      }

      // Autoplay manuel si le module n'est pas disponible
      if (finalConfig.autoplayDelay && !Swiper.Autoplay) {
        let autoplayInterval;

        const startAutoplay = () => {
          autoplayInterval = setInterval(() => {
            // Vérifier si la transition est en cours
            if (!swiper.animating) {
              swiper.slideNext();
            }
          }, finalConfig.autoplayDelay);
        };

        const stopAutoplay = () => {
          if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
          }
        };

        // Démarrer l'autoplay
        startAutoplay();

        // Arrêter l'autoplay au survol
        swiperContainer.addEventListener("mouseenter", stopAutoplay);
        swiperContainer.addEventListener("mouseleave", startAutoplay);

        // Arrêter l'autoplay lors d'une interaction tactile
        swiperContainer.addEventListener("touchstart", stopAutoplay);
        swiperContainer.addEventListener("touchend", () => {
          setTimeout(startAutoplay, 1000);
        });

        // Éviter les conflits de timing
        swiper.on("slideChangeTransitionStart", stopAutoplay);
        swiper.on("slideChangeTransitionEnd", () => {
          setTimeout(startAutoplay, 500);
        });
      }

      // Ajouter des événements personnalisés si nécessaire
      swiper.on("slideChange", function () {
        // Événement personnalisé pour le changement de slide
        const event = new CustomEvent("g2rdCarouselSlideChange", {
          detail: {
            carousel: carousel,
            swiper: swiper,
            activeIndex: swiper.activeIndex,
          },
        });
        document.dispatchEvent(event);
      });
    } catch (error) {
      console.error("G2RD Carousel: Error initializing Swiper", error);
    }
  });
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Attendre un peu plus longtemps pour s'assurer que Swiper est chargé
  setTimeout(initializeCarousels, 100);
});

// Fallback : essayer d'initialiser même si DOMContentLoaded a déjà été déclenché
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCarousels);
} else {
  // Le DOM est déjà chargé, initialiser immédiatement
  setTimeout(initializeCarousels, 100);
}

// Fonction utilitaire pour accéder aux instances Swiper
window.G2RDCarousel = {
  getInstance: function (carouselElement) {
    return carouselElement.swiperInstance;
  },

  getAllInstances: function () {
    const carousels = document.querySelectorAll(".g2rd-carousel");
    return Array.from(carousels)
      .map((carousel) => carousel.swiperInstance)
      .filter(Boolean);
  },

  destroy: function (carouselElement) {
    if (carouselElement.swiperInstance) {
      carouselElement.swiperInstance.destroy();
      delete carouselElement.swiperInstance;
    }
  },
};
