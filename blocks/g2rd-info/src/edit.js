import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  RichText,
  useBlockProps,
  useSettings,
} from "@wordpress/block-editor";
import {
  Button,
  DropdownMenu,
  MenuGroup,
  MenuItem,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { useMemo, useState } from "react";

/**
 * Icônes organisées par catégories pour le DropdownMenu
 * Défini en dehors du composant pour éviter les problèmes d'initialisation
 */
const iconCategories = {
  "Information & Status": [
    { label: "Info", value: "dashicons-info" },
    { label: "Warning", value: "dashicons-warning" },
    { label: "Success", value: "dashicons-yes-alt" },
    { label: "Error", value: "dashicons-no-alt" },
    { label: "Question", value: "dashicons-editor-help" },
    { label: "Check", value: "dashicons-yes" },
    { label: "Cross", value: "dashicons-no" },
    { label: "Plus", value: "dashicons-plus" },
    { label: "Minus", value: "dashicons-minus" },
    { label: "Star Filled", value: "dashicons-star-filled" },
    { label: "Star Empty", value: "dashicons-star-empty" },
    { label: "Flag", value: "dashicons-flag" },
    { label: "Shield", value: "dashicons-shield" },
    { label: "Shield Alt", value: "dashicons-shield-alt" },
  ],
  "Numbers & Statistics": [
    { label: "Chart Bar", value: "dashicons-chart-bar" },
    { label: "Chart Pie", value: "dashicons-chart-pie" },
    { label: "Chart Area", value: "dashicons-chart-area" },
    { label: "Chart Line", value: "dashicons-chart-line" },
    { label: "Analytics", value: "dashicons-analytics" },
    { label: "Performance", value: "dashicons-performance" },
    { label: "Calculator", value: "dashicons-calculator" },
    { label: "Dashboard", value: "dashicons-dashboard" },
  ],
  "Business & Commerce": [
    { label: "Money", value: "dashicons-money" },
    { label: "Money Alt", value: "dashicons-money-alt" },
    { label: "Cart", value: "dashicons-cart" },
    { label: "Products", value: "dashicons-products" },
    { label: "Businessman", value: "dashicons-businessman" },
    { label: "Building", value: "dashicons-building" },
    { label: "Store", value: "dashicons-store" },
    { label: "Bank", value: "dashicons-bank" },
  ],
  Communication: [
    { label: "Email", value: "dashicons-email" },
    { label: "Email Alt", value: "dashicons-email-alt" },
    { label: "Phone", value: "dashicons-phone" },
    { label: "Megaphone", value: "dashicons-megaphone" },
    { label: "Testimonial", value: "dashicons-testimonial" },
    { label: "Microphone", value: "dashicons-microphone" },
  ],
  "Awards & Achievement": [
    { label: "Awards", value: "dashicons-awards" },
    { label: "Trophy", value: "dashicons-trophy" },
    { label: "Medal", value: "dashicons-medal" },
    { label: "Ribbon", value: "dashicons-ribbon" },
  ],
  Technology: [
    { label: "Desktop", value: "dashicons-desktop" },
    { label: "Laptop", value: "dashicons-laptop" },
    { label: "Tablet", value: "dashicons-tablet" },
    { label: "Cloud", value: "dashicons-cloud" },
    { label: "Cloud Saved", value: "dashicons-cloud-saved" },
    { label: "Cloud Upload", value: "dashicons-cloud-upload" },
    { label: "Database", value: "dashicons-database" },
    { label: "Database Add", value: "dashicons-database-add" },
    { label: "Database Export", value: "dashicons-database-export" },
    { label: "Database Import", value: "dashicons-database-import" },
    { label: "Database Remove", value: "dashicons-database-remove" },
    { label: "Database View", value: "dashicons-database-view" },
    { label: "Networking", value: "dashicons-networking" },
  ],
  Social: [
    { label: "Groups", value: "dashicons-groups" },
    { label: "Users", value: "dashicons-admin-users" },
    { label: "Heart", value: "dashicons-heart" },
    { label: "ID", value: "dashicons-id" },
    { label: "ID Alt", value: "dashicons-id-alt" },
  ],
  "Time & Calendar": [
    { label: "Clock", value: "dashicons-clock" },
    { label: "Calendar", value: "dashicons-calendar" },
    { label: "Calendar Alt", value: "dashicons-calendar-alt" },
  ],
  Location: [
    { label: "Location", value: "dashicons-location" },
    { label: "Location Alt", value: "dashicons-location-alt" },
    { label: "Home", value: "dashicons-admin-home" },
  ],
  "Media & Content": [
    { label: "Book", value: "dashicons-book" },
    { label: "Book Alt", value: "dashicons-book-alt" },
    { label: "Camera", value: "dashicons-camera" },
    { label: "Camera Alt", value: "dashicons-camera-alt" },
    { label: "Images Alt", value: "dashicons-images-alt" },
    { label: "Images Alt2", value: "dashicons-images-alt2" },
    { label: "Video Alt", value: "dashicons-video-alt" },
    { label: "Video Alt2", value: "dashicons-video-alt2" },
    { label: "Video Alt3", value: "dashicons-video-alt3" },
    { label: "Format Image", value: "dashicons-format-image" },
    { label: "Format Video", value: "dashicons-format-video" },
    { label: "Format Audio", value: "dashicons-format-audio" },
    { label: "Format Gallery", value: "dashicons-format-gallery" },
    { label: "Format Quote", value: "dashicons-format-quote" },
    { label: "Format Chat", value: "dashicons-format-chat" },
    { label: "Format Aside", value: "dashicons-format-aside" },
    { label: "Format Status", value: "dashicons-format-status" },
    { label: "Format Standard", value: "dashicons-format-standard" },
    { label: "Format Link", value: "dashicons-format-link" },
  ],
  Actions: [
    { label: "Download", value: "dashicons-download" },
    { label: "Upload", value: "dashicons-upload" },
    { label: "Share", value: "dashicons-share" },
    { label: "Share Alt", value: "dashicons-share-alt" },
    { label: "Share Alt2", value: "dashicons-share-alt2" },
    { label: "External", value: "dashicons-external" },
    { label: "Link", value: "dashicons-admin-links" },
    { label: "Paperclip", value: "dashicons-paperclip" },
  ],
  Management: [
    { label: "Settings", value: "dashicons-admin-generic" },
    { label: "Controls Play", value: "dashicons-controls-play" },
    { label: "Controls Pause", value: "dashicons-controls-pause" },
    { label: "Controls Forward", value: "dashicons-controls-forward" },
    { label: "Controls Back", value: "dashicons-controls-back" },
    { label: "Controls Repeat", value: "dashicons-controls-repeat" },
    {
      label: "Controls Skip Forward",
      value: "dashicons-controls-skipforward",
    },
    { label: "Controls Skip Back", value: "dashicons-controls-skipback" },
  ],
  Security: [
    { label: "Visibility", value: "dashicons-visibility" },
    { label: "Hidden", value: "dashicons-hidden" },
    { label: "Lock", value: "dashicons-lock" },
    { label: "Unlock", value: "dashicons-unlock" },
    { label: "Privacy", value: "dashicons-privacy" },
  ],
  Editing: [
    { label: "Edit", value: "dashicons-edit" },
    { label: "Edit Large", value: "dashicons-edit-large" },
    { label: "Edit Page", value: "dashicons-edit-page" },
    { label: "Trash", value: "dashicons-trash" },
    { label: "Backup", value: "dashicons-backup" },
    { label: "Migrate", value: "dashicons-migrate" },
    { label: "Redo", value: "dashicons-redo" },
    { label: "Undo", value: "dashicons-undo" },
  ],
  Navigation: [
    { label: "Arrow Up", value: "dashicons-arrow-up" },
    { label: "Arrow Down", value: "dashicons-arrow-down" },
    { label: "Arrow Left", value: "dashicons-arrow-left" },
    { label: "Arrow Right", value: "dashicons-arrow-right" },
    { label: "Arrow Up Alt", value: "dashicons-arrow-up-alt" },
    { label: "Arrow Down Alt", value: "dashicons-arrow-down-alt" },
    { label: "Arrow Left Alt", value: "dashicons-arrow-left-alt" },
    { label: "Arrow Right Alt", value: "dashicons-arrow-right-alt" },
    { label: "Sort", value: "dashicons-sort" },
    { label: "Randomize", value: "dashicons-randomize" },
  ],
  Miscellaneous: [
    { label: "Lightbulb", value: "dashicons-lightbulb" },
    { label: "Carrot", value: "dashicons-carrot" },
    { label: "Hammer", value: "dashicons-hammer" },
    { label: "Palmtree", value: "dashicons-palmtree" },
    { label: "Tickets", value: "dashicons-tickets" },
    { label: "Tickets Alt", value: "dashicons-tickets-alt" },
    { label: "Coffee", value: "dashicons-coffee" },
    { label: "Food", value: "dashicons-food" },
    { label: "Universal Access", value: "dashicons-universal-access" },
    {
      label: "Universal Access Alt",
      value: "dashicons-universal-access-alt",
    },
  ],
};

/**
 * Bloc Info G2RD - Composant principal d'édition
 */
export default function Edit({ attributes, setAttributes }) {
  // Déstructuration des attributs du bloc
  const {
    mediaType,
    icon,
    imageUrl,
    imageId,
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

  // Récupérer les couleurs de la palette WordPress (nouvelle API)
  const settings = useSettings();
  const colors = settings?.color?.palette || [];

  // État pour la recherche d'icônes
  const [iconSearch, setIconSearch] = useState("");

  // Fonction pour obtenir la valeur de couleur à partir d'un slug
  const getColorValue = (colorSlug) => {
    if (!colorSlug) return null;
    const color = colors.find((c) => c.slug === colorSlug);
    return color ? color.color : null;
  };

  // Filtrer les icônes selon la recherche
  const filteredIconCategories = useMemo(() => {
    if (!iconSearch.trim()) {
      return iconCategories;
    }

    const searchLower = iconSearch.toLowerCase();
    const filtered = {};

    Object.entries(iconCategories).forEach(([category, icons]) => {
      const matchingIcons = icons.filter(
        (iconData) =>
          iconData.label.toLowerCase().includes(searchLower) ||
          iconData.value.toLowerCase().includes(searchLower)
      );

      if (matchingIcons.length > 0) {
        filtered[category] = matchingIcons;
      }
    });

    return filtered;
  }, [iconSearch]);

  // Propriétés du wrapper du bloc - WordPress gère automatiquement les styles via useBlockProps
  // Les couleurs du titre et de la description sont dans l'onglet Styles (éléments heading et texte)
  // La couleur de la bordure est aussi dans l'onglet Styles
  // Seules les bordures (width, radius) et l'ombre sont dans l'onglet Réglages
  const blockProps = useBlockProps({
    className: `g2rd-info-block ${fullHeight ? "g2rd-info-full-height" : ""}`,
    style: {
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderStyle: borderWidth > 0 ? "solid" : undefined,
      // La couleur de bordure et l'ombre sont gérées par WordPress dans l'onglet Styles
      height: fullHeight ? "100%" : undefined,
    },
  });

  // Layouts disponibles
  const layoutOptions = [
    { label: __("Icône à gauche (ligne)", "g2rd-theme"), value: "icon-left" },
    { label: __("Icône à droite (ligne)", "g2rd-theme"), value: "icon-right" },
    { label: __("Icône en haut (colonne)", "g2rd-theme"), value: "icon-top" },
    { label: __("Icône en bas (colonne)", "g2rd-theme"), value: "icon-bottom" },
  ];

  /**
   * Rendu de l'icône ou de l'image
   */
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

  /**
   * Styles flex dynamiques selon le layout
   */
  const getFlexStyles = () => {
    if (layout === "icon-right") {
      return { gap: gap || "16px", flexDirection: "row", alignItems: "center" };
    }
    if (layout === "icon-top") {
      // Alignement de l'icône selon iconAlignment
      const alignmentMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        gap: gap || "16px",
        flexDirection: "column",
        alignItems: alignmentMap[iconAlignment] || "center",
      };
    }
    if (layout === "icon-bottom") {
      // Alignement de l'icône selon iconAlignment
      const alignmentMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        gap: gap || "16px",
        flexDirection: "column",
        alignItems: alignmentMap[iconAlignment] || "center",
        justifyContent: "center",
        width: "auto",
      };
    }
    // icon-left (défaut)
    return {
      gap: gap || "16px",
      flexDirection: "row",
      alignItems: "flex-start",
    };
  };

  /**
   * Alignement du texte selon le layout et l'alignement de l'icône
   */
  const getTextAlign = () => {
    if (layout === "icon-top" || layout === "icon-bottom") {
      // L'alignement du texte suit l'alignement de l'icône
      return iconAlignment || "center";
    }
    return "left";
  };

  /**
   * Rendu du texte (titre + description)
   * Les couleurs sont gérées par WordPress via l'onglet Styles
   */
  const renderText = (textAlign = "left") => (
    <div className="g2rd-info-text" style={{ textAlign }}>
      <RichText
        tagName="h3"
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        placeholder={__("Enter title...", "g2rd-theme")}
        className="g2rd-info-title"
      />
      <RichText
        tagName="p"
        value={description}
        onChange={(value) => setAttributes({ description: value })}
        placeholder={__("Enter description...", "g2rd-theme")}
        className="g2rd-info-description"
      />
    </div>
  );

  /**
   * Rendu du contenu (icône/image + texte) selon le layout
   */
  const renderContent = (textAlign = "left") => {
    switch (layout) {
      case "icon-top":
        return (
          <>
            {renderMedia()}
            {renderText(textAlign)}
          </>
        );
      case "icon-bottom":
        return (
          <>
            {renderText(textAlign)}
            {renderMedia()}
          </>
        );
      case "icon-right":
        return (
          <>
            {renderText(textAlign)}
            {renderMedia()}
          </>
        );
      case "icon-left":
      default:
        return (
          <>
            {renderMedia()}
            {renderText(textAlign)}
          </>
        );
    }
  };

  // --- Rendu principal du bloc ---
  return (
    <>
      {/* Panneau latéral de configuration */}
      <InspectorControls>
        <PanelBody
          title={__("Media Settings", "g2rd-theme")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Media Type", "g2rd-theme")}
            value={mediaType}
            options={[
              { label: "Icon", value: "icon" },
              { label: "Image", value: "image" },
            ]}
            onChange={(value) => setAttributes({ mediaType: value })}
          />
          {mediaType === "icon" && (
            <>
              {/* Sélecteur d'icône custom avec visuel */}
              <DropdownMenu
                icon={
                  icon ? (
                    <span className={`dashicons ${icon}`}></span>
                  ) : (
                    "admin-customizer"
                  )
                }
                label={__("Icon", "g2rd-theme")}
                toggleProps={{ variant: "secondary" }}
              >
                {({ onClose }) => (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {/* Champ de recherche */}
                    <div
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <TextControl
                        placeholder={__(
                          "Rechercher une icône...",
                          "g2rd-theme"
                        )}
                        value={iconSearch}
                        onChange={(value) => setIconSearch(value)}
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                    {/* Liste des icônes filtrées */}
                    {Object.keys(filteredIconCategories).length > 0 ? (
                      Object.entries(filteredIconCategories).map(
                        ([category, icons]) => (
                          <MenuGroup key={category} label={category}>
                            {icons.map((iconData) => (
                              <MenuItem
                                key={iconData.value}
                                icon={
                                  <span
                                    className={`dashicons ${iconData.value}`}
                                  ></span>
                                }
                                isSelected={icon === iconData.value}
                                onClick={() => {
                                  setAttributes({ icon: iconData.value });
                                  setIconSearch(""); // Réinitialiser la recherche
                                  onClose();
                                }}
                              >
                                {iconData.label}
                              </MenuItem>
                            ))}
                          </MenuGroup>
                        )
                      )
                    ) : (
                      <div
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        {__("Aucune icône trouvée", "g2rd-theme")}
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenu>
              <RangeControl
                label={__("Icon Size", "g2rd-theme")}
                value={iconSize}
                onChange={(value) => setAttributes({ iconSize: value })}
                min={16}
                max={128}
                step={1}
              />
            </>
          )}
          {mediaType === "image" && (
            <>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => {
                    setAttributes({
                      imageUrl: media.url,
                      imageId: media.id,
                      imageAlt: media.alt || "",
                    });
                  }}
                  allowedTypes={["image"]}
                  value={imageId}
                  render={({ open }) => (
                    <Button onClick={open} variant="secondary">
                      {imageUrl
                        ? __("Replace Image", "g2rd-theme")
                        : __("Select Image", "g2rd-theme")}
                    </Button>
                  )}
                />
              </MediaUploadCheck>
              {imageUrl && (
                <TextControl
                  label={__("Alt Text", "g2rd-theme")}
                  value={imageAlt}
                  onChange={(value) => setAttributes({ imageAlt: value })}
                />
              )}
            </>
          )}
        </PanelBody>
        <PanelBody title={__("Border", "g2rd-theme")} initialOpen={false}>
          <RangeControl
            label={__("Border Width", "g2rd-theme")}
            value={borderWidth || 0}
            onChange={(value) => setAttributes({ borderWidth: value })}
            min={0}
            max={20}
            step={1}
          />
          <RangeControl
            label={__("Border Radius", "g2rd-theme")}
            value={borderRadius || 0}
            onChange={(value) => setAttributes({ borderRadius: value })}
            min={0}
            max={50}
            step={1}
          />
        </PanelBody>
        <PanelBody title={__("Layout", "g2rd-theme")} initialOpen={false}>
          <TextControl
            label={__(
              "Espacement entre l'icône et le texte (gap)",
              "g2rd-theme"
            )}
            value={gap}
            onChange={(value) => setAttributes({ gap: value })}
            help={__("Exemple : 8px, 1rem, 2em...", "g2rd-theme")}
          />
          <SelectControl
            label={__("Disposition", "g2rd-theme")}
            value={layout}
            options={layoutOptions}
            onChange={(value) => setAttributes({ layout: value })}
          />
          {(layout === "icon-top" || layout === "icon-bottom") && (
            <SelectControl
              label={__("Alignement de l'icône", "g2rd-theme")}
              value={iconAlignment || "center"}
              options={[
                { label: __("Gauche", "g2rd-theme"), value: "left" },
                { label: __("Centré", "g2rd-theme"), value: "center" },
                { label: __("Droite", "g2rd-theme"), value: "right" },
              ]}
              onChange={(value) => setAttributes({ iconAlignment: value })}
            />
          )}
          <ToggleControl
            label={__("Prendre toute la hauteur du parent", "g2rd-theme")}
            checked={fullHeight || false}
            onChange={(value) => setAttributes({ fullHeight: value })}
            help={__(
              "Activez cette option pour que le bloc prenne toute la hauteur de son conteneur parent. Utile pour aligner plusieurs blocs côte à côte.",
              "g2rd-theme"
            )}
          />
        </PanelBody>
      </InspectorControls>
      {/* Rendu du bloc dans l'éditeur */}
      <div {...blockProps}>
        <div
          className={`g2rd-info-content g2rd-layout-${layout}`}
          style={getFlexStyles()}
        >
          {renderContent(getTextAlign())}
        </div>
      </div>
    </>
  );
}
