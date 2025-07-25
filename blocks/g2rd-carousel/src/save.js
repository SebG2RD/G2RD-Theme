import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

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
    ...(contentType && { contentType }), // N'inclure contentType que s'il existe
  };

  return (
    <div {...blockProps}>
      <div className="g2rd-carousel" data-config={JSON.stringify(config)}>
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
          <div className="swiper" data-slides-per-view={visibleSlides}>
            <div className="swiper-wrapper">
              {displayContent && displayContent.length > 0 ? (
                displayContent.map((item, index) => (
                  <div key={index} className="swiper-slide">
                    <div
                      className={`carousel-slide ${
                        !showBoxShadow ? "no-shadow" : ""
                      }`}
                    >
                      {currentContentType === "images" ? (
                        <>
                          <img
                            src={item.url}
                            alt={item.alt || ""}
                            className="carousel-image"
                          />
                          {showCaptions && item.caption && (
                            <p className="carousel-caption">{item.caption}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <img
                            src={item.featuredImage || ""}
                            alt={item.featuredImageAlt || item.title}
                            className="carousel-image"
                          />
                          <div className="carousel-post-info">
                            <h4 className="carousel-post-title">
                              {item.title}
                            </h4>
                            {showCaptions && item.excerpt && (
                              <p className="carousel-post-excerpt">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="swiper-slide">
                  <div className="carousel-slide">
                    <p>{__("No content selected", "g2rd-carousel")}</p>
                  </div>
                </div>
              )}
            </div>

            {showNavigation && (
              <>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
              </>
            )}

            {showPagination && <div className="swiper-pagination"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
