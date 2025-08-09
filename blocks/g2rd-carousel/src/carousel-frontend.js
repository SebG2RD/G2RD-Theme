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

    // Debug: Afficher la configuration
    console.log("G2RD Carousel Config:", config);

    const swiperContainer = carousel.querySelector(".swiper");
    if (!swiperContainer) {
      console.error("G2RD Carousel: Swiper container not found");
      return;
    }

    // Helpers pour construire des slides et assurer leur présence
    const ensureWrapper = () => {
      return (
        swiperContainer.querySelector(".swiper-wrapper") ||
        (() => {
          const w = document.createElement("div");
          w.className = "swiper-wrapper";
          swiperContainer.appendChild(w);
          return w;
        })()
      );
    };

    const buildFromItems = (items, options = {}) => {
      const {
        showCaptions = true,
        showBoxShadow = true,
        contentType = "images",
      } = options;
      const wrapper = ensureWrapper();

      items.forEach((item) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        const slideInner = document.createElement("div");
        slideInner.className =
          "carousel-slide" + (showBoxShadow ? "" : " no-shadow");

        const makeImage = (src, alt, link) => {
          const img = document.createElement("img");
          img.className = "carousel-image";
          img.loading = "lazy";
          img.src = src || "";
          img.alt = alt || "";
          if (link) {
            const a = document.createElement("a");
            a.href = link;
            a.className = "carousel-image-link";
            a.appendChild(img);
            return a;
          }
          return img;
        };

        if (item.type === "image" || contentType === "images") {
          const node = makeImage(item.url, item.alt, item.link);
          slideInner.appendChild(node);
          if (showCaptions && item.caption) {
            const p = document.createElement("p");
            p.className = "carousel-caption";
            p.textContent = item.caption;
            slideInner.appendChild(p);
          }
        } else {
          const node = makeImage(
            item.featuredImage,
            item.featuredImageAlt,
            item.link
          );
          slideInner.appendChild(node);
          if (showCaptions) {
            const info = document.createElement("div");
            info.className = "carousel-post-info";
            const title = document.createElement("h4");
            title.className = "carousel-post-title";
            title.textContent = item.title || "";
            info.appendChild(title);
            if (item.excerpt) {
              const p = document.createElement("p");
              p.className = "carousel-post-excerpt";
              p.innerHTML = item.excerpt;
              info.appendChild(p);
            }
            slideInner.appendChild(info);
          }
        }

        slide.appendChild(slideInner);
        wrapper.appendChild(slide);
      });
    };

    const ensureSlidesReady = async () => {
      const initialSlides = swiperContainer.querySelectorAll(".swiper-slide");
      console.log(
        "G2RD Carousel: Number of slides found:",
        initialSlides.length
      );

      if (initialSlides.length > 0) {
        // Slides déjà rendues côté serveur : ne pas modifier le DOM ici
        return;
      }

      const {
        contentData = [],
        contentIds = [],
        contentType = "images",
        showCaptions = true,
        showBoxShadow = true,
      } = config || {};

      // 1) contentData immédiat
      if (Array.isArray(contentData) && contentData.length > 0) {
        const items =
          window.innerWidth < 768 ? contentData.slice(0, 4) : contentData;
        buildFromItems(items, { showCaptions, showBoxShadow, contentType });
        return;
      }

      // 2) contentIds + wpApiSettings.root
      if (
        contentType !== "images" &&
        Array.isArray(contentIds) &&
        contentIds.length > 0 &&
        typeof window?.wpApiSettings?.root === "string"
      ) {
        try {
          const endpointType = contentType;
          const url = `${
            window.wpApiSettings.root
          }wp/v2/${endpointType}?include=${contentIds.join(",")}&per_page=${
            contentIds.length
          }&_embed`;
          const r = await fetch(url);
          const data = await r.json();
          let items = (data || []).map((post) => ({
            type: "post",
            id: post.id,
            title: post.title?.rendered || "",
            excerpt: post.excerpt?.rendered || "",
            link: post.link || "",
            featuredImage:
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
            featuredImageAlt:
              post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
          }));
          if (window.innerWidth < 768) items = items.slice(0, 4);
          buildFromItems(items, { showCaptions, showBoxShadow, contentType });
          return;
        } catch (err) {
          console.warn(
            "G2RD Carousel: REST fetch fallback (include) failed",
            err
          );
        }
      }

      // 3) Dernier fallback: derniers items du CPT
      if (contentType !== "images") {
        try {
          const endpointType = contentType;
          const perPage = window.innerWidth < 768 ? 4 : 8;
          const url = `/wp-json/wp/v2/${endpointType}?per_page=${perPage}&_embed`;
          const r = await fetch(url);
          const data = await r.json();
          const items = (data || []).map((post) => ({
            type: "post",
            id: post.id,
            title: post.title?.rendered || "",
            excerpt: post.excerpt?.rendered || "",
            link: post.link || "",
            featuredImage:
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
            featuredImageAlt:
              post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
          }));
          buildFromItems(items, { showCaptions, showBoxShadow, contentType });
          return;
        } catch (err) {
          console.warn("G2RD Carousel: CPT fetch fallback failed", err);
        }
      }

      console.warn("G2RD Carousel: No slides available after fallbacks");
    };

    const initSwiper = () => {
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

      // Sécuriser pagination/navigation si les éléments DOM manquent
      const paginationEl = carousel.querySelector(".swiper-pagination");
      const navPrevEl = carousel.querySelector(".swiper-button-prev");
      const navNextEl = carousel.querySelector(".swiper-button-next");
      const showPaginationEnabled = !!(
        finalConfig.showPagination && paginationEl
      );
      const showNavigationEnabled = !!(
        finalConfig.showNavigation &&
        navPrevEl &&
        navNextEl
      );
      if (!showPaginationEnabled) {
        finalConfig.showPagination = false;
      }
      if (!showNavigationEnabled) {
        finalConfig.showNavigation = false;
      }

      // Configuration responsive pour Swiper
      const getResponsiveConfig = () => {
        const baseSlidesPerView = parseInt(finalConfig.slidesPerView) || 3;

        return {
          // Mobile (320px et plus) - GRILLE 2x2 FIXE (4 images seulement)
          320: {
            slidesPerView: 2, // 2 images par ligne
            slidesPerGroup: 4, // Groupe de 4 images (pas de défilement)
            spaceBetween: 10, // Petit espacement sur mobile
            centeredSlides: false, // Désactivé pour affichage en grille
            effect: "slide", // Effet slide sur mobile pour de meilleures performances
            loop: false, // Pas de boucle sur mobile - affichage fixe
            autoplay: false, // Désactiver l'autoplay sur mobile
            allowTouchMove: false, // Désactiver le défilement tactile sur mobile
            simulateTouch: false, // Désactiver complètement le défilement
            touchEventsTarget: "none", // Désactiver les événements tactiles
            grid: {
              rows: 2, // 2 rangées
              fill: "row", // Remplir par rangée
            },
          },
          // Tablette (768px et plus) - DEUX IMAGES
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2, // Défile par groupe de 2 images
            spaceBetween: 30,
            centeredSlides: true, // Centrer la slide principale
            effect: finalConfig.effect,
            loop: true, // Boucle activée sur tablette
            allowTouchMove: true, // Activer le défilement tactile
            autoplay: finalConfig.autoplayDelay
              ? {
                  delay: finalConfig.autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                  stopOnLastSlide: false,
                  reverseDirection: false,
                }
              : false,
          },
          // Desktop (1024px et plus) - TROIS IMAGES
          1024: {
            slidesPerView: Math.min(3, baseSlidesPerView),
            slidesPerGroup: 1, // Défile une image à la fois
            spaceBetween: finalConfig.spaceBetween,
            centeredSlides: finalConfig.centeredSlides,
            effect: finalConfig.effect,
            loop: true, // Boucle activée sur desktop
            allowTouchMove: true, // Activer le défilement tactile
            autoplay: finalConfig.autoplayDelay
              ? {
                  delay: finalConfig.autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                  stopOnLastSlide: false,
                  reverseDirection: false,
                }
              : false,
          },
          // Grand écran (1200px et plus) - CONFIGURATION COMPLÈTE
          1200: {
            slidesPerView: baseSlidesPerView,
            slidesPerGroup: 1, // Défile une image à la fois
            spaceBetween: finalConfig.spaceBetween,
            centeredSlides: finalConfig.centeredSlides,
            effect: finalConfig.effect,
            loop: true, // Boucle activée sur grand écran
            allowTouchMove: true, // Activer le défilement tactile
            autoplay: finalConfig.autoplayDelay
              ? {
                  delay: finalConfig.autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                  stopOnLastSlide: false,
                  reverseDirection: false,
                }
              : false,
          },
        };
      };

      // En mobile, forcer désactivation nav/pagination/autoplay/touch + loop false
      if (window.innerWidth < 768) {
        finalConfig.showNavigation = false;
        finalConfig.showPagination = false;
      }

      // Préparer les modules Swiper disponibles
      const preInitModules = [];
      if (Swiper.Autoplay && window.innerWidth >= 768)
        preInitModules.push(Swiper.Autoplay);
      if (Swiper.Navigation && showNavigationEnabled)
        preInitModules.push(Swiper.Navigation);
      if (Swiper.Pagination && showPaginationEnabled)
        preInitModules.push(Swiper.Pagination);
      if (Swiper.EffectCoverflow) preInitModules.push(Swiper.EffectCoverflow);
      if (Swiper.Grid) preInitModules.push(Swiper.Grid);
      const modulesForSwiper = preInitModules;

      // Initialiser Swiper
      try {
        const swiperConfig = {
          modules: modulesForSwiper,
          effect: window.innerWidth < 768 ? "slide" : finalConfig.effect,
          speed: 800,
          easing: "ease-out",
          slidesPerView: parseInt(finalConfig.slidesPerView) || 3,
          spaceBetween: finalConfig.spaceBetween,
          centeredSlides: finalConfig.centeredSlides,
          loop: window.innerWidth < 768 ? false : finalConfig.loop,
          grabCursor: finalConfig.grabCursor,
          breakpoints: getResponsiveConfig(),
          pagination: (window.innerWidth < 768 ? false : showPaginationEnabled)
            ? {
                el: paginationEl,
                clickable: true,
              }
            : false,
          navigation: (window.innerWidth < 768 ? false : showNavigationEnabled)
            ? {
                nextEl: navNextEl,
                prevEl: navPrevEl,
              }
            : false,
          autoplay:
            finalConfig.autoplayDelay && window.innerWidth >= 768
              ? {
                  delay: finalConfig.autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                  stopOnLastSlide: false,
                  reverseDirection: false,
                }
              : false,
        };

        if (finalConfig.effect === "coverflow" && Swiper.EffectCoverflow) {
          swiperConfig.coverflowEffect = {
            rotate: finalConfig.coverflowRotate || 50,
            stretch: finalConfig.coverflowStretch || 0,
            depth: finalConfig.coverflowDepth || 200,
            modifier: finalConfig.coverflowModifier || 1,
            slideShadows: false,
            scale: 0.85,
            perspective: 1000,
          };
        }

        // Initialiser Swiper
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

        // Autoplay manuel si le module n'est pas disponible et PAS sur mobile
        if (
          finalConfig.autoplayDelay &&
          !Swiper.Autoplay &&
          window.innerWidth >= 768
        ) {
          // Désactiver sur mobile
          let autoplayInterval;
          let isAutoplayActive = true;

          const startAutoplay = () => {
            if (!isAutoplayActive) return;

            autoplayInterval = setInterval(() => {
              // Vérifier si la transition est en cours et si l'autoplay est actif
              if (!swiper.animating && isAutoplayActive && !swiper.destroyed) {
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

          const pauseAutoplay = () => {
            isAutoplayActive = false;
            stopAutoplay();
          };

          const resumeAutoplay = () => {
            isAutoplayActive = true;
            startAutoplay();
          };

          // Démarrer l'autoplay
          startAutoplay();

          // Arrêter l'autoplay au survol
          swiperContainer.addEventListener("mouseenter", pauseAutoplay);
          swiperContainer.addEventListener("mouseleave", resumeAutoplay);

          // Arrêter l'autoplay lors d'une interaction tactile
          swiperContainer.addEventListener("touchstart", pauseAutoplay);
          swiperContainer.addEventListener("touchend", () => {
            setTimeout(resumeAutoplay, 1000);
          });

          // Gestion des transitions pour éviter les conflits
          swiper.on("slideChangeTransitionStart", pauseAutoplay);
          swiper.on("slideChangeTransitionEnd", () => {
            setTimeout(resumeAutoplay, 100);
          });

          // Nettoyer l'autoplay lors de la destruction
          swiper.on("destroy", () => {
            isAutoplayActive = false;
            stopAutoplay();
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

        // Gestion du redimensionnement de la fenêtre avec protection
        const handleResize = () => {
          if (swiper && !swiper.destroyed && !swiper.animating) {
            // Attendre que l'animation en cours soit terminée
            setTimeout(() => {
              if (swiper && !swiper.destroyed) {
                swiper.update();
                swiper.updateSize();
                swiper.updateSlides();
                swiper.updateProgress();
                swiper.updateSlidesClasses();
              }
            }, 100);
          }
        };

        // Écouter les changements de taille d'écran avec debouncing
        let resizeTimeout;
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(handleResize, 250);
        });

        // Écouter les changements d'orientation sur mobile
        window.addEventListener("orientationchange", () => {
          setTimeout(handleResize, 300);
        });

        // Optimisation pour mobile : désactiver certains effets sur les appareils tactiles
        const isTouchDevice =
          "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
          // Désactiver l'effet coverflow sur mobile si nécessaire
          if (finalConfig.effect === "coverflow" && window.innerWidth < 768) {
            swiper.params.effect = "slide";
          }

          // Améliorer la stabilité tactile
          swiper.params.touchRatio = 1;
          swiper.params.touchAngle = 45;
          swiper.params.simulateTouch = true;
        }
      } catch (error) {
        console.error("G2RD Carousel: Error initializing Swiper", error);
      }
    };

    // Attendre que les slides soient prêtes (fallbacks inclus) puis initialiser Swiper
    ensureSlidesReady().then(initSwiper);
  });
}

// Fonction pour détecter la taille d'écran et ajuster la configuration
function getResponsiveConfigForScreen() {
  const width = window.innerWidth;

  if (width < 480) {
    return {
      slidesPerView: 2, // 2 images par ligne
      spaceBetween: 10, // Petit espacement sur mobile
      centeredSlides: false, // Désactivé pour affichage en grille
      effect: "slide",
      loop: true, // Boucle activée sur mobile
      autoplay: false, // Désactiver l'autoplay sur mobile
    };
  } else if (width < 768) {
    return {
      slidesPerView: 2, // 2 images par ligne
      spaceBetween: 10, // Petit espacement sur mobile
      centeredSlides: false, // Désactivé pour affichage en grille
      effect: "slide",
      loop: true, // Boucle activée sur mobile
      autoplay: false, // Désactiver l'autoplay sur mobile
    };
  } else if (width < 1024) {
    return {
      slidesPerView: 2,
      spaceBetween: 30,
      centeredSlides: true, // Centrer la slide principale
      effect: "slide",
      loop: true, // Boucle activée sur tablette
      autoplay: true, // Autoplay activé sur tablette
    };
  } else if (width < 1200) {
    return {
      slidesPerView: 3,
      spaceBetween: 40,
      centeredSlides: true, // Activé sur desktop
      effect: "coverflow",
      loop: true, // Boucle activée sur desktop
      autoplay: true, // Autoplay activé sur desktop
    };
  } else {
    return {
      slidesPerView: 3,
      spaceBetween: 50,
      centeredSlides: true, // Activé sur grand écran
      effect: "coverflow",
      loop: true, // Boucle activée sur grand écran
      autoplay: true, // Autoplay activé sur grand écran
    };
  }
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

  // Nouvelle fonction pour mettre à jour la configuration responsive
  updateResponsiveConfig: function (carouselElement) {
    const swiper = carouselElement.swiperInstance;
    if (swiper && !swiper.destroyed && !swiper.animating) {
      const responsiveConfig = getResponsiveConfigForScreen();

      // Attendre que l'animation en cours soit terminée
      setTimeout(() => {
        if (swiper && !swiper.destroyed) {
          // Mettre à jour la configuration
          Object.assign(swiper.params, responsiveConfig);

          // Forcer la mise à jour de manière sécurisée
          swiper.update();
          swiper.updateSize();
          swiper.updateSlides();
          swiper.updateProgress();
          swiper.updateSlidesClasses();
        }
      }, 50);
    }
  },

  // Fonction pour mettre à jour tous les carousels
  updateAllResponsive: function () {
    const carousels = document.querySelectorAll(".g2rd-carousel");
    carousels.forEach((carousel) => {
      this.updateResponsiveConfig(carousel);
    });
  },
};

// Écouter les changements de taille d'écran pour tous les carousels
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    if (window.G2RDCarousel) {
      window.G2RDCarousel.updateAllResponsive();
    }
  }, 250); // Délai pour éviter trop d'appels
});
