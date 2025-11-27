import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import classnames from "classnames";

/**
 * Composant de sauvegarde du bloc Accordéon
 * 
 * Ce composant sauvegarde la structure HTML de l'accordéon
 * avec leurs titres et contenus
 */
export default function save({ attributes }) {
  const {
    items,
    initialState,
    iconType,
    iconPosition,
    showCounter,
    counterPosition,
    allowMultiple,
    itemBackgroundColor,
    itemTextColor,
    itemActiveBackgroundColor,
    itemActiveTextColor,
    contentBackgroundColor,
    contentTextColor,
    borderColor,
    borderWidth,
    borderRadius,
    showBorder,
    gap,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames(
      "g2rd-accordion-block",
      {
        "g2rd-accordion-no-border": !showBorder,
        "g2rd-accordion-counter-left": showCounter && counterPosition === "left",
        "g2rd-accordion-counter-right": showCounter && counterPosition === "right",
        "g2rd-accordion-icon-left": iconPosition === "left",
        "g2rd-accordion-icon-right": iconPosition === "right",
        "g2rd-accordion-multiple": allowMultiple,
      }
    ),
    "data-initial-state": initialState,
    "data-allow-multiple": allowMultiple ? "true" : "false",
  });

  /**
   * Obtenir le nom de classe Dashicons pour l'icône selon le type
   */
  const getIconClass = (isOpen) => {
    switch (iconType) {
      case "chevron":
        return isOpen ? "dashicons-arrow-up-alt2" : "dashicons-arrow-down-alt2";
      case "arrow":
        return isOpen ? "dashicons-arrow-up-alt" : "dashicons-arrow-down-alt";
      case "arrow-horizontal":
        return isOpen ? "dashicons-arrow-left-alt" : "dashicons-arrow-right-alt";
      case "plus":
        return isOpen ? "dashicons-minus" : "dashicons-plus-alt2";
      default:
        return isOpen ? "dashicons-arrow-up-alt2" : "dashicons-arrow-down-alt2";
    }
  };

  /**
   * Déterminer si un item doit être ouvert initialement
   */
  const isItemOpenInitially = (item, index) => {
    if (initialState === "all-open") {
      return true;
    } else if (initialState === "all-closed") {
      return false;
    } else {
      return index === 0;
    }
  };

  // Styles inline pour l'accordéon
  const accordionStyles = {
    "--g2rd-item-bg": itemBackgroundColor || "#f0f0f0",
    "--g2rd-item-text": itemTextColor || "#333333",
    "--g2rd-item-active-bg": itemActiveBackgroundColor || "#0073aa",
    "--g2rd-item-active-text": itemActiveTextColor || "#ffffff",
    "--g2rd-content-bg": contentBackgroundColor || "#ffffff",
    "--g2rd-content-text": contentTextColor || "#333333",
    ...(showBorder
      ? {
          "--g2rd-border-color": borderColor || "#ddd",
          "--g2rd-border-width": `${borderWidth}px`,
        }
      : {
          borderStyle: "none",
        }),
    "--g2rd-border-radius": `${borderRadius}px`,
    "--g2rd-gap": gap || "0",
  };

  return (
    <div {...blockProps} style={accordionStyles}>
      <div className="g2rd-accordion-items">
        {items.map((item, index) => {
          const isOpen = isItemOpenInitially(item, index);
          
          return (
            <div
              key={item.id}
              className={classnames("g2rd-accordion-item", {
                "is-open": isOpen,
              })}
            >
              <button
                className="g2rd-accordion-item-header"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item.id}`}
                id={`accordion-header-${item.id}`}
                data-item-id={item.id}
              >
                {showCounter && counterPosition === "left" && (
                  <span className="g2rd-accordion-counter" aria-label={__("Item", "g2rd-accordion") + " " + (index + 1)}>
                    {index + 1}
                  </span>
                )}
                {iconPosition === "left" && (
                  <span 
                    className={classnames("g2rd-accordion-icon", "dashicons", getIconClass(isOpen))}
                    aria-hidden="true"
                  />
                )}
                <RichText.Content 
                  tagName="span"
                  value={item.title}
                  className="g2rd-accordion-item-title"
                />
                {showCounter && counterPosition === "right" && (
                  <span className="g2rd-accordion-counter" aria-label={__("Item", "g2rd-accordion") + " " + (index + 1)}>
                    {index + 1}
                  </span>
                )}
                {iconPosition === "right" && (
                  <span 
                    className={classnames("g2rd-accordion-icon", "dashicons", getIconClass(isOpen))}
                    aria-hidden="true"
                  />
                )}
              </button>
              <div
                id={`accordion-content-${item.id}`}
                className={classnames("g2rd-accordion-item-content-wrapper", {
                  "is-open": isOpen,
                })}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                hidden={!isOpen}
                data-item-id={item.id}
              >
                <div className={`g2rd-accordion-item-content g2rd-accordion-item-${item.id}`}>
                  {/* Le contenu sera injecté par le script frontend */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="g2rd-accordion-content" style={{ display: "none" }}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}

