import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

/**
 * Encode de manière sécurisée un objet en JSON pour un attribut data
 * Échappe les caractères spéciaux pour éviter les problèmes de sécurité
 *
 * @param {Object} data - L'objet à encoder
 * @returns {string} JSON encodé de manière sécurisée
 */
function safeJsonEncode(data) {
  try {
    // JSON.stringify échappe déjà les caractères spéciaux
    // React échappe également automatiquement les valeurs dans les attributs
    // Cette fonction garantit un encodage sûr
    return JSON.stringify(data);
  } catch (error) {
    // En cas d'erreur, retourner un objet vide
    console.error("G2RD Carousel: Error encoding JSON", error);
    return JSON.stringify({});
  }
}

export default function Save({ attributes, className }) {
  const {
    images,
    autoplayDelay,
    showPagination,
    showNavigation,
    effect,
    slidesPerView,
    spaceBetween,
    centeredSlides,
    loop,
    grabCursor,
    coverflowRotate,
    coverflowStretch,
    coverflowDepth,
    coverflowModifier,
    title,
    description,
    showBadge,
    badgeText,
    showCaptions,
    style,
    visibleSlides,
    contentType,
    selectedPosts,
    showBoxShadow,
    height,
  } = attributes;

  const blockProps = useBlockProps.save({
    className,
    style,
  });

  // Déterminer le contenu à afficher (avec fallback pour les anciens blocks)
  const currentContentType = contentType || "images";
  const displayContent =
    currentContentType === "images" ? images : selectedPosts || [];

  // Debug désactivé pour la production

  // Configuration responsive pour les breakpoints
  const responsiveConfig = {
    // Mobile (320px et plus) - Grille 2x2 FIXE (4 images seulement)
    320: {
      slidesPerView: 2, // 2 images par ligne
      slidesPerGroup: 4, // Groupe de 4 images (pas de défilement)
      spaceBetween: 10, // Petit espacement sur mobile
      centeredSlides: false, // Désactivé pour affichage en grille
      effect: "slide",
      loop: false, // Pas de boucle sur mobile - affichage fixe
      autoplay: false, // Désactiver l'autoplay sur mobile
      allowTouchMove: false, // Désactiver le défilement tactile sur mobile
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
      effect: effect || "slide",
      loop: true, // Boucle activée sur tablette
      allowTouchMove: true, // Activer le défilement tactile
      autoplay: autoplayDelay ? true : false, // Autoplay conditionnel
    },
    // Desktop (1024px et plus) - TROIS IMAGES
    1024: {
      slidesPerView: Math.min(3, visibleSlides || 3),
      slidesPerGroup: 1, // Défile une image à la fois
      spaceBetween: spaceBetween || 30,
      centeredSlides: centeredSlides !== false,
      effect: effect || "slide",
      loop: true, // Boucle activée sur desktop
      allowTouchMove: true, // Activer le défilement tactile
      autoplay: autoplayDelay ? true : false, // Autoplay conditionnel
    },
    // Grand écran (1200px et plus) - CONFIGURATION COMPLÈTE
    1200: {
      slidesPerView: visibleSlides || 3,
      slidesPerGroup: 1, // Défile une image à la fois
      spaceBetween: spaceBetween || 50,
      centeredSlides: centeredSlides !== false,
      effect: effect || "coverflow",
      loop: true, // Boucle activée sur grand écran
      allowTouchMove: true, // Activer le défilement tactile
      autoplay: autoplayDelay ? true : false, // Autoplay conditionnel
    },
  };

  // Préparer la configuration pour les data attributes
  const config = {
    autoplayDelay,
    showPagination,
    showNavigation,
    effect,
    slidesPerView: visibleSlides.toString(),
    spaceBetween,
    centeredSlides,
    loop,
    grabCursor,
    coverflowRotate,
    coverflowStretch,
    coverflowDepth,
    coverflowModifier,
    showBoxShadow,
    height,
    showCaptions, // transmettre l'option aux scripts front
    responsiveConfig, // Ajouter la configuration responsive
    ...(contentType && { contentType }), // N'inclure contentType que s'il existe
  };

  // Utiliser tout le contenu disponible (pas de limitation côté serveur)
  const slidesToShow = displayContent;

  // Préparer des données de contenu pour fallback côté front
  const contentData = slidesToShow.map((item) => {
    if (currentContentType === "images") {
      return {
        type: "image",
        id: item.id,
        url: item.url,
        alt: item.alt || "",
        caption: item.caption || "",
        link: item.link || "",
      };
    }
    return {
      type: "post",
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      link: item.link || "",
      featuredImage: item.featuredImage || "",
      featuredImageAlt: item.featuredImageAlt || item.title || "",
    };
  });

  // Extraire les IDs pour un fallback fetch côté front
  const contentIds = (selectedPosts || []).map((p) => p.id);

  return (
    <div {...blockProps}>
      <div
        className="g2rd-carousel"
        data-config={safeJsonEncode({
          ...config,
          contentData, // embarquer les données pour fallback front
          contentIds, // IDs pour fallback fetch
        })}
      >
        <div className="carousel-header">
          {showBadge && (
            <div className="carousel-badge">
              <span className="badge-icon">✨</span>
              {badgeText}
            </div>
          )}
          <div className="carousel-title">
            <h2 className="wp-block-heading">{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="carousel-container" style={{ height: `${height}px` }}>
          <div
            className="swiper"
            data-slides-per-view={visibleSlides}
            data-responsive-config={safeJsonEncode(responsiveConfig)}
          >
            <div className="swiper-wrapper">
              {slidesToShow.map((item, index) => (
                <div key={index} className="swiper-slide">
                  <div
                    className={`carousel-slide ${
                      !showBoxShadow ? "no-shadow" : ""
                    }`}
                  >
                    {currentContentType === "images" ? (
                      <>
                        {item.link ? (
                          <a href={item.link} className="carousel-image-link">
                            <img
                              src={item.url}
                              alt={item.alt || ""}
                              className="carousel-image"
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.alt || ""}
                            className="carousel-image"
                            loading="lazy"
                          />
                        )}
                        {showCaptions && item.caption && (
                          <p className="carousel-caption">{item.caption}</p>
                        )}
                      </>
                    ) : (
                      <>
                        {item.link ? (
                          <a href={item.link} className="carousel-image-link">
                            <img
                              src={item.featuredImage || ""}
                              alt={item.featuredImageAlt || item.title}
                              className="carousel-image"
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <img
                            src={item.featuredImage || ""}
                            alt={item.featuredImageAlt || item.title}
                            className="carousel-image"
                            loading="lazy"
                          />
                        )}
                        {showCaptions && (
                          <div className="carousel-post-info">
                            <h4 className="carousel-post-title">
                              {item.title}
                            </h4>
                            {item.excerpt && (
                              <p className="carousel-post-excerpt">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showNavigation && (
              <>
                <div
                  className="swiper-button-prev"
                  aria-label={__("Previous slide", "g2rd-carousel")}
                ></div>
                <div
                  className="swiper-button-next"
                  aria-label={__("Next slide", "g2rd-carousel")}
                ></div>
              </>
            )}

            {showPagination && (
              <div
                className="swiper-pagination"
                role="navigation"
                aria-label={__("Carousel pagination", "g2rd-carousel")}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
