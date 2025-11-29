import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  ToggleControl,
  ColorPicker,
  RangeControl,
  SelectControl,
  DropdownMenu,
  MenuGroup,
  MenuItem,
} from "@wordpress/components";
import classnames from "classnames";

/**
 * Bloc Modal G2RD - Composant principal d'édition
 * 
 * Ce composant permet de créer et gérer un modal/popup avec :
 * - Bouton déclencheur personnalisable
 * - Contenu riche avec InnerBlocks
 * - Options de style complètes (couleurs, bordures, etc.)
 * - Options d'alignement (centré, à droite)
 * - Contrôles de fermeture (bouton X, clic extérieur, Escape)
 */
export default function Edit({ attributes = {}, setAttributes, clientId }) {
  // Valeurs par défaut sécurisées
  const {
    triggerText = "Ouvrir le modal",
    modalTitle = "",
    showCloseButton = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    modalWidth = "600px",
    modalAlignment = "center",
    modalBackgroundColor,
    modalTextColor,
    borderColor,
    borderWidth = 1,
    borderRadius = 8,
    showBorder = true,
    overlayColor = "#000000",
    overlayOpacity = 0.5,
    triggerButtonBackgroundColor,
    triggerButtonTextColor,
    triggerButtonBorderRadius = 4,
    triggerButtonPadding = "12px 24px",
    useThemeStyles = true,
    buttonIcon = "",
    iconPosition = "right",
    buttonStyle = "",
    openMode = "click",
    timerDelay = 3,
  } = attributes || {};

  // État local pour gérer l'ouverture du modal dans l'éditeur
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Propriétés du wrapper du bloc
  const blockProps = useBlockProps({
    className: classnames("g2rd-modal-block", {
      "g2rd-modal-aligned-center": modalAlignment === "center",
      "g2rd-modal-aligned-right": modalAlignment === "right",
      "g2rd-modal-aligned-left": modalAlignment === "left",
      "g2rd-modal-no-border": !showBorder,
      "g2rd-modal-theme-styles": useThemeStyles,
      "g2rd-modal-custom-styles": !useThemeStyles,
    }),
  });

  // Options d'alignement
  const alignmentOptions = [
    { label: __("Centré", "g2rd-modal"), value: "center" },
    { label: __("Droite", "g2rd-modal"), value: "right" },
    { label: __("Gauche", "g2rd-modal"), value: "left" },
  ];

  // Options de position de l'icône
  const iconPositionOptions = [
    { label: __("Gauche", "g2rd-modal"), value: "left" },
    { label: __("Droite", "g2rd-modal"), value: "right" },
  ];

  // Liste d'icônes courantes pour le bouton
  const buttonIcons = [
    { label: __("Aucune", "g2rd-modal"), value: "" },
    { label: __("Flèche droite", "g2rd-modal"), value: "arrow-right-alt" },
    { label: __("Flèche gauche", "g2rd-modal"), value: "arrow-left-alt" },
    { label: __("Flèche haut", "g2rd-modal"), value: "arrow-up-alt" },
    { label: __("Flèche bas", "g2rd-modal"), value: "arrow-down-alt" },
    { label: __("Plus", "g2rd-modal"), value: "plus-alt2" },
    { label: __("Info", "g2rd-modal"), value: "info" },
    { label: __("Étoile", "g2rd-modal"), value: "star-filled" },
    { label: __("Cœur", "g2rd-modal"), value: "heart" },
    { label: __("Email", "g2rd-modal"), value: "email" },
    { label: __("Téléphone", "g2rd-modal"), value: "phone" },
    { label: __("Calendrier", "g2rd-modal"), value: "calendar-alt" },
    { label: __("Cadenas", "g2rd-modal"), value: "lock" },
    { label: __("Oeil", "g2rd-modal"), value: "visibility" },
    { label: __("Télécharger", "g2rd-modal"), value: "download" },
    { label: __("Upload", "g2rd-modal"), value: "upload" },
    { label: __("Partager", "g2rd-modal"), value: "share" },
    { label: __("Imprimer", "g2rd-modal"), value: "printer" },
    { label: __("Rechercher", "g2rd-modal"), value: "search" },
    { label: __("Paramètres", "g2rd-modal"), value: "admin-settings" },
  ];

  // Liste des styles de boutons disponibles dans le thème
  const buttonStyles = [
    { label: __("Par défaut", "g2rd-modal"), value: "" },
    { label: __("Alternatif", "g2rd-modal"), value: "alt" },
    { label: __("Secondaire", "g2rd-modal"), value: "scd" },
    { label: __("Transparent", "g2rd-modal"), value: "transparent" },
    { label: __("Neomorphic", "g2rd-modal"), value: "neomorphic" },
    { label: __("Soft Pressed", "g2rd-modal"), value: "soft-pressed" },
  ];

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
    "--g2rd-modal-width": modalWidth,
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

  // Pas de template - permet n'importe quel bloc
  // Le template est null pour permettre tous les types de blocs

  return (
    <>
      {/* Panneau latéral de configuration */}
      <InspectorControls>
        <PanelBody title={__("Bouton déclencheur", "g2rd-modal")} initialOpen={true}>
          <ToggleControl
            label={__("Hériter des styles du thème", "g2rd-modal")}
            checked={useThemeStyles}
            onChange={(value) => setAttributes({ useThemeStyles: value })}
            help={
              useThemeStyles
                ? __("Le bouton utilise les styles de votre thème WordPress", "g2rd-modal")
                : __("Désactivez pour personnaliser les styles du bouton", "g2rd-modal")
            }
          />

          {useThemeStyles && (
            <SelectControl
              label={__("Style de bouton", "g2rd-modal")}
              value={buttonStyle}
              options={buttonStyles}
              onChange={(value) => setAttributes({ buttonStyle: value })}
              help={__("Choisissez un style de bouton parmi ceux disponibles dans votre thème", "g2rd-modal")}
            />
          )}
          
          <TextControl
            label={__("Texte du bouton", "g2rd-modal")}
            value={triggerText}
            onChange={(value) => setAttributes({ triggerText: value })}
            help={__("Texte affiché sur le bouton qui ouvre le modal", "g2rd-modal")}
          />

          {!useThemeStyles && (
            <>
              <div>
                <p>{__("Couleur de fond du bouton", "g2rd-modal")}</p>
                <ColorPicker
                  color={triggerButtonBackgroundColor}
                  onChange={(color) => setAttributes({ triggerButtonBackgroundColor: color })}
                />
              </div>
              <div>
                <p>{__("Couleur du texte du bouton", "g2rd-modal")}</p>
                <ColorPicker
                  color={triggerButtonTextColor}
                  onChange={(color) => setAttributes({ triggerButtonTextColor: color })}
                />
              </div>
              <RangeControl
                label={__("Rayon des coins du bouton", "g2rd-modal")}
                value={triggerButtonBorderRadius}
                onChange={(value) => setAttributes({ triggerButtonBorderRadius: value })}
                min={0}
                max={50}
              />
              <TextControl
                label={__("Espacement interne du bouton", "g2rd-modal")}
                value={triggerButtonPadding}
                onChange={(value) => setAttributes({ triggerButtonPadding: value })}
                help={__("Format: '12px 24px' (haut/bas gauche/droite)", "g2rd-modal")}
              />
            </>
          )}

          <div>
            <p style={{ marginBottom: "8px" }}>{__("Icône du bouton", "g2rd-modal")}</p>
            <DropdownMenu
              icon={
                buttonIcon ? (
                  <span className={`dashicons dashicons-${buttonIcon}`}></span>
                ) : (
                  "admin-customizer"
                )
              }
              label={__("Sélectionner une icône", "g2rd-modal")}
              toggleProps={{ variant: "secondary" }}
            >
              {({ onClose }) => (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <MenuGroup>
                    {buttonIcons.map((iconData) => (
                      <MenuItem
                        key={iconData.value}
                        icon={
                          iconData.value ? (
                            <span
                              className={`dashicons dashicons-${iconData.value}`}
                            ></span>
                          ) : null
                        }
                        isSelected={buttonIcon === iconData.value}
                        onClick={() => {
                          setAttributes({ buttonIcon: iconData.value });
                          onClose();
                        }}
                      >
                        {iconData.label}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                </div>
              )}
            </DropdownMenu>
          </div>

          {buttonIcon && (
            <SelectControl
              label={__("Position de l'icône", "g2rd-modal")}
              value={iconPosition}
              options={iconPositionOptions}
              onChange={(value) => setAttributes({ iconPosition: value })}
            />
          )}
        </PanelBody>

        <PanelBody title={__("Mode d'ouverture", "g2rd-modal")} initialOpen={false}>
          <SelectControl
            label={__("Mode d'ouverture", "g2rd-modal")}
            value={openMode}
            options={[
              { label: __("Au clic sur le bouton", "g2rd-modal"), value: "click" },
              { label: __("Automatique après un délai", "g2rd-modal"), value: "timer" },
            ]}
            onChange={(value) => setAttributes({ openMode: value })}
            help={__("Choisissez comment le modal doit s'ouvrir", "g2rd-modal")}
          />
          
          {openMode === "timer" && (
            <RangeControl
              label={__("Délai avant ouverture (secondes)", "g2rd-modal")}
              value={timerDelay}
              onChange={(value) => setAttributes({ timerDelay: value })}
              min={1}
              max={60}
              help={__("Temps d'attente avant l'ouverture automatique du modal", "g2rd-modal")}
            />
          )}
        </PanelBody>

        <PanelBody title={__("Configuration du modal", "g2rd-modal")} initialOpen={true}>
          <TextControl
            label={__("Titre du modal (optionnel)", "g2rd-modal")}
            value={modalTitle}
            onChange={(value) => setAttributes({ modalTitle: value })}
            help={__("Titre affiché en haut du modal (laisser vide pour ne pas afficher)", "g2rd-modal")}
          />
          <TextControl
            label={__("Largeur du modal", "g2rd-modal")}
            value={modalWidth}
            onChange={(value) => setAttributes({ modalWidth: value })}
            help={__("Exemples: '600px', '80%', '50rem'", "g2rd-modal")}
          />
          <SelectControl
            label={__("Alignement du modal", "g2rd-modal")}
            value={modalAlignment}
            options={alignmentOptions}
            onChange={(value) => setAttributes({ modalAlignment: value })}
            help={__("Position du modal sur l'écran", "g2rd-modal")}
          />
        </PanelBody>

        <PanelBody title={__("Options de fermeture", "g2rd-modal")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher le bouton de fermeture (X)", "g2rd-modal")}
            checked={showCloseButton}
            onChange={(value) => setAttributes({ showCloseButton: value })}
          />
          <ToggleControl
            label={__("Fermer en cliquant en dehors", "g2rd-modal")}
            checked={closeOnOutsideClick}
            onChange={(value) => setAttributes({ closeOnOutsideClick: value })}
          />
          <ToggleControl
            label={__("Fermer avec la touche Escape", "g2rd-modal")}
            checked={closeOnEscape}
            onChange={(value) => setAttributes({ closeOnEscape: value })}
          />
        </PanelBody>

        <PanelBody title={__("Couleurs du modal", "g2rd-modal")} initialOpen={false}>
          <div>
            <p>{__("Couleur de fond du modal", "g2rd-modal")}</p>
            <ColorPicker
              color={modalBackgroundColor}
              onChange={(color) => setAttributes({ modalBackgroundColor: color })}
            />
          </div>
          <div>
            <p>{__("Couleur du texte du modal", "g2rd-modal")}</p>
            <ColorPicker
              color={modalTextColor}
              onChange={(color) => setAttributes({ modalTextColor: color })}
            />
          </div>
        </PanelBody>

        <PanelBody title={__("Bordure du modal", "g2rd-modal")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher la bordure", "g2rd-modal")}
            checked={showBorder}
            onChange={(value) => setAttributes({ showBorder: value })}
          />
          {showBorder && (
            <>
              <div>
                <p>{__("Couleur de la bordure", "g2rd-modal")}</p>
                <ColorPicker
                  color={borderColor}
                  onChange={(color) => setAttributes({ borderColor: color })}
                />
              </div>
              <RangeControl
                label={__("Épaisseur de la bordure", "g2rd-modal")}
                value={borderWidth}
                onChange={(value) => setAttributes({ borderWidth: value })}
                min={0}
                max={10}
              />
            </>
          )}
          <RangeControl
            label={__("Rayon des coins", "g2rd-modal")}
            value={borderRadius}
            onChange={(value) => setAttributes({ borderRadius: value })}
            min={0}
            max={50}
          />
        </PanelBody>

        <PanelBody title={__("Fond (overlay)", "g2rd-modal")} initialOpen={false}>
          <div>
            <p>{__("Couleur de l'overlay", "g2rd-modal")}</p>
            <ColorPicker
              color={overlayColor}
              onChange={(color) => setAttributes({ overlayColor: color })}
            />
          </div>
          <RangeControl
            label={__("Opacité de l'overlay", "g2rd-modal")}
            value={overlayOpacity}
            onChange={(value) => setAttributes({ overlayOpacity: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </PanelBody>
      </InspectorControls>

      {/* Aperçu du bloc dans l'éditeur */}
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
            onClick={() => setIsModalOpen(!isModalOpen)}
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
          <RichText
            value={triggerText}
            onChange={(value) => setAttributes({ triggerText: value })}
            tagName="span"
            placeholder={__("Ouvrir le modal", "g2rd-modal")}
          />
          {buttonIcon && iconPosition === "right" && (
            <span
              className={`dashicons dashicons-${buttonIcon}`}
              aria-hidden="true"
            />
          )}
        </button>
        )}

        {/* Message pour le mode timer */}
        {openMode === "timer" && (
          <div style={{
            padding: "12px",
            background: "#f0f0f0",
            border: "1px dashed #ccc",
            borderRadius: "4px",
            marginBottom: "10px",
            fontSize: "13px",
            color: "#666"
          }}>
            {__("Le modal s'ouvrira automatiquement après", "g2rd-modal")} {timerDelay} {__("seconde(s)", "g2rd-modal")}
          </div>
        )}

        {/* Modal dans l'éditeur (aperçu) */}
        {isModalOpen && (
          <div 
            className="g2rd-modal-overlay" 
            onClick={() => closeOnOutsideClick && setIsModalOpen(false)}
            style={{
              backgroundColor: overlayColorWithOpacity,
            }}
          >
            <div
              className="g2rd-modal-container"
              onClick={(e) => e.stopPropagation()}
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
                    <RichText
                      value={modalTitle}
                      onChange={(value) => setAttributes({ modalTitle: value })}
                      tagName="h2"
                      className="g2rd-modal-title"
                      placeholder={__("Titre du modal", "g2rd-modal")}
                    />
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="g2rd-modal-close"
                      onClick={() => setIsModalOpen(false)}
                      aria-label={__("Fermer", "g2rd-modal")}
                    >
                      <span className="dashicons dashicons-no-alt"></span>
                    </button>
                  )}
                </div>
              )}

              {/* Contenu du modal - Aperçu seulement */}
              <div className="g2rd-modal-body">
                <p style={{ 
                  color: "#999", 
                  fontStyle: "italic", 
                  textAlign: "center",
                  padding: "40px 20px"
                }}>
                  {__("Le contenu que vous ajoutez ci-dessous apparaîtra ici. Utilisez la zone d'édition en bas pour ajouter des blocs.", "g2rd-modal")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Zone d'édition toujours visible dans l'éditeur */}
        <div 
          className="g2rd-modal-content-editor" 
          style={{ 
            marginTop: "20px",
            padding: "20px",
            background: "#f0f0f0",
            border: "1px dashed #ccc",
            borderRadius: "4px"
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "12px", fontSize: "13px", color: "#666" }}>
            {__("Contenu du modal - Ajoutez n'importe quel bloc ici", "g2rd-modal")}
          </p>
          <InnerBlocks 
            allowedBlocks={true}
            templateLock={false}
          />
        </div>
      </div>
    </>
  );
}

