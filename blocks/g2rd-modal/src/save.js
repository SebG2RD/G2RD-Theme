import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import classnames from "classnames";

/**
 * Composant de sauvegarde du bloc Modal
 * 
 * Ce composant sauvegarde la structure HTML du modal
 * avec le bouton déclencheur et le contenu
 */
export default function save({ attributes }) {
  const {
    triggerText,
    modalTitle,
    showCloseButton,
    closeOnOutsideClick,
    closeOnEscape,
    modalWidth,
    modalAlignment,
    modalBackgroundColor,
    modalTextColor,
    borderColor,
    borderWidth,
    borderRadius,
    showBorder,
    overlayColor,
    overlayOpacity,
    triggerButtonBackgroundColor,
    triggerButtonTextColor,
    triggerButtonBorderRadius,
    triggerButtonPadding,
    useThemeStyles = true,
    buttonIcon = "",
    iconPosition = "right",
    buttonStyle = "",
    openMode = "click",
    timerDelay = 3,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames("g2rd-modal-block", {
      "g2rd-modal-aligned-center": modalAlignment === "center",
      "g2rd-modal-aligned-right": modalAlignment === "right",
      "g2rd-modal-aligned-left": modalAlignment === "left",
      "g2rd-modal-no-border": !showBorder,
      "g2rd-modal-theme-styles": useThemeStyles,
      "g2rd-modal-custom-styles": !useThemeStyles,
    }),
    "data-close-on-outside-click": closeOnOutsideClick ? "true" : "false",
    "data-close-on-escape": closeOnEscape ? "true" : "false",
    "data-open-mode": openMode || "click",
    "data-timer-delay": openMode === "timer" ? timerDelay : "0",
  });

  // Fonction pour convertir hex en rgba
  const hexToRgba = (hex, opacity) => {
    // Retirer le # si présent
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Calculer la couleur de l'overlay avec opacité
  const overlayColorWithOpacity = hexToRgba(
    overlayColor || "#000000",
    overlayOpacity || 0.5
  );

  // Styles inline pour le modal
  const modalStyles = {
    "--g2rd-modal-bg": modalBackgroundColor || "#ffffff",
    "--g2rd-modal-text": modalTextColor || "#333333",
    "--g2rd-modal-width": modalWidth || "600px",
    ...(showBorder
      ? {
          "--g2rd-border-color": borderColor || "#ddd",
          "--g2rd-border-width": `${borderWidth}px`,
        }
      : {
          borderStyle: "none",
        }),
    "--g2rd-border-radius": `${borderRadius}px`,
    "--g2rd-overlay-bg": overlayColorWithOpacity,
    "--g2rd-trigger-bg": triggerButtonBackgroundColor || "#0073aa",
    "--g2rd-trigger-text": triggerButtonTextColor || "#ffffff",
    "--g2rd-trigger-border-radius": `${triggerButtonBorderRadius}px`,
    "--g2rd-trigger-padding": triggerButtonPadding || "12px 24px",
  };

  return (
    <div {...blockProps} style={modalStyles}>
      {/* Bouton déclencheur - affiché uniquement en mode clic */}
      {openMode === "click" && (
        <button
        type="button"
        className={classnames(
          "g2rd-modal-trigger",
          {
            // Classes WordPress standard pour hériter des styles du thème
            "wp-element-button": useThemeStyles,
            "g2rd-modal-trigger-theme": useThemeStyles,
            "g2rd-modal-trigger-custom": !useThemeStyles,
            "g2rd-modal-trigger-icon-left": buttonIcon && iconPosition === "left",
            "g2rd-modal-trigger-icon-right": buttonIcon && iconPosition === "right",
            // Classe de style WordPress (is-style-{slug})
            [`is-style-${buttonStyle}`]: useThemeStyles && buttonStyle,
          }
        )}
        aria-label={__("Ouvrir le modal", "g2rd-modal")}
        style={
          !useThemeStyles
            ? {
                backgroundColor: triggerButtonBackgroundColor || "#0073aa",
                color: triggerButtonTextColor || "#ffffff",
                borderRadius: `${triggerButtonBorderRadius}px`,
                padding: triggerButtonPadding || "12px 24px",
                border: "none",
              }
            : {}
        }
      >
        {buttonIcon && iconPosition === "left" && (
          <span
            className={`dashicons dashicons-${buttonIcon}`}
            aria-hidden="true"
          />
        )}
        <RichText.Content value={triggerText} tagName="span" />
        {buttonIcon && iconPosition === "right" && (
          <span
            className={`dashicons dashicons-${buttonIcon}`}
            aria-hidden="true"
          />
        )}
        </button>
      )}

      {/* Structure du modal (sera géré par le script frontend) */}
      <div className="g2rd-modal-overlay" aria-hidden="true">
        <div
          className="g2rd-modal-container"
          style={{
            width: modalWidth || "600px",
            backgroundColor: modalBackgroundColor || "#ffffff",
            color: modalTextColor || "#333333",
            borderRadius: `${borderRadius}px`,
            ...(showBorder
              ? {
                  border: `${borderWidth}px solid ${borderColor || "#ddd"}`,
                }
              : {}),
          }}
        >
          {/* En-tête du modal */}
          {(modalTitle || showCloseButton) && (
            <div className="g2rd-modal-header">
              {modalTitle && (
                <RichText.Content
                  tagName="h2"
                  value={modalTitle}
                  className="g2rd-modal-title"
                />
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="g2rd-modal-close"
                  aria-label={__("Fermer", "g2rd-modal")}
                >
                  <span className="dashicons dashicons-no-alt" aria-hidden="true"></span>
                </button>
              )}
            </div>
          )}

          {/* Corps du modal */}
          <div className="g2rd-modal-body">
            <InnerBlocks.Content />
          </div>
        </div>
      </div>
    </div>
  );
}

