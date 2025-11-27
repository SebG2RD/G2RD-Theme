import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import classnames from "classnames";

/**
 * Composant de sauvegarde du bloc Onglets
 * 
 * Ce composant sauvegarde la structure HTML des onglets
 * avec leurs titres et contenus
 */
export default function save({ attributes }) {
  const {
    tabs,
    activeTab,
    style,
    tabAlignment,
    tabBackgroundColor,
    tabTextColor,
    activeTabBackgroundColor,
    activeTabTextColor,
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
      "g2rd-tabs-block",
      `g2rd-tabs-style-${style}`,
      `g2rd-tabs-align-${tabAlignment}`,
      {
        "g2rd-tabs-no-border": !showBorder,
      }
    ),
    "data-active-tab": activeTab,
  });

  // Styles inline pour les onglets
  const tabStyles = {
    "--g2rd-tab-bg": tabBackgroundColor || "#f0f0f0",
    "--g2rd-tab-text": tabTextColor || "#333333",
    "--g2rd-tab-active-bg": activeTabBackgroundColor || "#0073aa",
    "--g2rd-tab-active-text": activeTabTextColor || "#ffffff",
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
    <div {...blockProps} style={tabStyles}>
      {/* Barre d'onglets */}
      <div
        className={classnames(
          "g2rd-tabs-nav",
          `g2rd-tabs-align-${tabAlignment}`
        )}
        role="tablist"
        aria-label={__("Onglets", "g2rd-tabs")}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={classnames("g2rd-tab-button", {
              "is-active": activeTab === tab.id,
            })}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            data-tab-id={tab.id}
            type="button"
          >
            <RichText.Content value={tab.title} />
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="g2rd-tabs-content">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={`tab-panel-${tab.id}`}
            className={classnames("g2rd-tab-panel", {
              "is-active": activeTab === tab.id,
            })}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            data-tab-index={index}
          >
            <div className={`g2rd-tab-content g2rd-tab-${tab.id}`}>
              {/* Le contenu sera injecté par le script frontend */}
            </div>
          </div>
        ))}
        <InnerBlocks.Content />
      </div>
    </div>
  );
}

