import { RichText, useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
  const {
    mediaType,
    icon,
    imageUrl,
    imageAlt,
    title,
    description,
    iconSize,
    gap,
    layout,
    iconAlignment,
    borderWidth,
    borderRadius,
    borderColor,
    fullHeight,
  } = attributes;

  // Fonction pour obtenir la valeur de couleur (gère les slugs et les valeurs hex)
  const getColorValue = (colorSlug) => {
    if (!colorSlug) return null;
    // Si c'est déjà une valeur hex (commence par #), on l'utilise directement
    if (colorSlug.startsWith("#")) {
      return colorSlug;
    }
    // Sinon, c'est un slug - on utilise la variable CSS WordPress
    return `var(--wp--preset--color--${colorSlug})`;
  };

  // useBlockProps.save() applique automatiquement les classes et styles WordPress
  // pour les couleurs définis dans l'onglet Styles (titre via heading, description via texte, bordure via border.color)
  // Les bordures (width, radius) et l'ombre sont gérées via les attributs personnalisés
  const blockProps = useBlockProps.save({
    className: `g2rd-info-block ${fullHeight ? "g2rd-info-full-height" : ""}`,
    style: {
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderStyle: borderWidth > 0 ? "solid" : undefined,
      // La couleur de bordure et l'ombre sont gérées par WordPress dans l'onglet Styles
      height: fullHeight ? "100%" : undefined,
    },
  });

  const getFlexDirection = () => {
    if (layout === "icon-top") return "column";
    if (layout === "icon-bottom") return "column-reverse";
    if (layout === "icon-right") return "row-reverse";
    return "row";
  };

  // Fonction pour obtenir l'alignement selon le layout
  const getAlignment = () => {
    if (layout === "icon-top" || layout === "icon-bottom") {
      const alignmentMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return alignmentMap[iconAlignment] || "center";
    }
    return "center";
  };

  // Fonction pour obtenir l'alignement du texte
  const getTextAlign = () => {
    if (layout === "icon-top" || layout === "icon-bottom") {
      return iconAlignment || "center";
    }
    return "left";
  };

  const renderMedia = () => {
    if (mediaType === "icon") {
      return (
        <div
          className="g2rd-info-icon"
          style={{
            // Adapter la taille du conteneur à la taille de l'icône
            minWidth: `${iconSize + 16}px`,
            minHeight: `${iconSize + 16}px`,
          }}
        >
          <span
            className={`dashicons ${
              icon || "dashicons-info"
            } g2rd-info-icon-element`}
            style={{
              fontSize: `${iconSize}px`,
            }}
          ></span>
        </div>
      );
    } else if (mediaType === "image" && imageUrl) {
      return (
        <div className="g2rd-info-image">
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{ maxWidth: "100px", height: "auto" }}
          />
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (layout === "icon-top") {
      return (
        <>
          {renderMedia()}
          <div className="g2rd-info-text" style={{ textAlign: getTextAlign() }}>
            <RichText.Content
              tagName="h3"
              value={title}
              className="g2rd-info-title"
            />
            <RichText.Content
              tagName="p"
              value={description}
              className="g2rd-info-description"
            />
          </div>
        </>
      );
    }
    if (layout === "icon-bottom") {
      return (
        <>
          <div className="g2rd-info-text" style={{ textAlign: getTextAlign() }}>
            <RichText.Content
              tagName="h3"
              value={title}
              className="g2rd-info-title"
            />
            <RichText.Content
              tagName="p"
              value={description}
              className="g2rd-info-description"
            />
          </div>
          {renderMedia()}
        </>
      );
    }
    if (layout === "icon-right") {
      return (
        <>
          <div className="g2rd-info-text" style={{ textAlign: getTextAlign() }}>
            <RichText.Content
              tagName="h3"
              value={title}
              className="g2rd-info-title"
            />
            <RichText.Content
              tagName="p"
              value={description}
              className="g2rd-info-description"
            />
          </div>
          {renderMedia()}
        </>
      );
    }
    // icon-left (défaut)
    return (
      <>
        {renderMedia()}
        <div className="g2rd-info-text" style={{ textAlign: getTextAlign() }}>
          <RichText.Content
            tagName="h3"
            value={title}
            className="g2rd-info-title"
          />
          <RichText.Content
            tagName="p"
            value={description}
            className="g2rd-info-description"
          />
        </div>
      </>
    );
  };

  return (
    <div {...blockProps}>
      <div
        className={`g2rd-info-content g2rd-layout-${layout}`}
        style={{
          gap: gap || "16px",
          flexDirection: getFlexDirection(),
          alignItems: getAlignment(),
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
