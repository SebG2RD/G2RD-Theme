/**
 * @see https://reactjs.org/docs/react-api.html#createelement
 */
import { createElement, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  BlockControls,
  PanelColorSettings,
} from "@wordpress/block-editor";
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  ToolbarGroup,
  ToolbarButton,
  Button,
} from "@wordpress/components";
import classnames from "classnames";

const TEMPLATE = [
  [
    "core/group",
    {
      layout: { type: "constrained" },
      placeholder: "Contenu de gauche (par défaut)",
    },
  ],
  [
    "core/group",
    { layout: { type: "constrained" }, placeholder: "Contenu de droite" },
  ],
];

const ALIGNMENT_ICONS = {
  left: "editor-alignleft",
  center: "editor-aligncenter",
  right: "editor-alignright",
};

export default function Edit({ attributes, setAttributes, clientId }) {
  const {
    showLeft,
    toggleAlign,
    toggleStyle,
    toggleColorActive,
    toggleColorInactive,
    blockId,
  } = attributes;

  // État local pour gérer l'onglet actif dans l'éditeur
  const [activeEditorTab, setActiveEditorTab] = useState("left");

  useEffect(() => {
    if (!blockId) {
      setAttributes({ blockId: `g2rd-toggle-${clientId}` });
    }
  }, [clientId, blockId, setAttributes]);

  // Gérer l'affichage des groupes dans l'éditeur
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      // Chercher le conteneur des InnerBlocks
      const blockWrapper = document.querySelector(
        `[data-block="${clientId}"]`
      );
      if (!blockWrapper) return;

      // Chercher les groupes dans la structure InnerBlocks
      const innerBlocksContainer = blockWrapper.querySelector(
        ".g2rd-toggle-content-editor .block-editor-inner-blocks .block-editor-block-list__layout"
      );
      
      if (!innerBlocksContainer) return;

      const groups = innerBlocksContainer.querySelectorAll(":scope > .wp-block-group");
      
      groups.forEach((group, index) => {
        if (index === 0) {
          // Premier groupe (gauche)
          if (activeEditorTab === "left") {
            group.style.display = "block";
            group.classList.add("g2rd-toggle-editor-active");
            group.classList.remove("g2rd-toggle-editor-hidden");
          } else {
            group.style.display = "none";
            group.classList.remove("g2rd-toggle-editor-active");
            group.classList.add("g2rd-toggle-editor-hidden");
          }
        } else if (index === 1) {
          // Deuxième groupe (droite)
          if (activeEditorTab === "right") {
            group.style.display = "block";
            group.classList.add("g2rd-toggle-editor-active");
            group.classList.remove("g2rd-toggle-editor-hidden");
          } else {
            group.style.display = "none";
            group.classList.remove("g2rd-toggle-editor-active");
            group.classList.add("g2rd-toggle-editor-hidden");
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeEditorTab, clientId]);

  const blockProps = useBlockProps({
    className: classnames({
      "show-left": showLeft,
      "show-right": !showLeft,
    }),
  });

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          {Object.keys(ALIGNMENT_ICONS).map((align) => (
            <ToolbarButton
              key={align}
              icon={ALIGNMENT_ICONS[align]}
              label={__(`Align ${align}`)}
              onClick={() => setAttributes({ toggleAlign: align })}
              isPressed={toggleAlign === align}
            />
          ))}
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody title={__("État initial", "g2rd-theme")}>
          <ToggleControl
            label={__("Afficher le contenu de gauche", "g2rd-theme")}
            checked={showLeft}
            onChange={() => setAttributes({ showLeft: !showLeft })}
            help={
              showLeft
                ? __("Le contenu de gauche sera visible par défaut.", "g2rd-theme")
                : __("Le contenu de droite sera visible par défaut.", "g2rd-theme")
            }
          />
        </PanelBody>
        <PanelBody title={__("Style du bouton", "g2rd-theme")}>
          <SelectControl
            label={__("Style", "g2rd-theme")}
            value={toggleStyle}
            options={[
              { label: "Défaut", value: "default" },
              { label: "Arrondi", value: "rounded" },
            ]}
            onChange={(newStyle) => setAttributes({ toggleStyle: newStyle })}
          />
        </PanelBody>
        <PanelColorSettings
          title={__("Couleurs du bouton", "g2rd-theme")}
          colorSettings={[
            {
              value: toggleColorActive,
              onChange: (color) => setAttributes({ toggleColorActive: color }),
              label: __("Couleur (Activé)", "g2rd-theme"),
            },
            {
              value: toggleColorInactive,
              onChange: (color) =>
                setAttributes({ toggleColorInactive: color }),
              label: __("Couleur (Désactivé)", "g2rd-theme"),
            },
          ]}
        />
      </InspectorControls>

      <div {...blockProps}>
        {/* Le switch n'est pas interactif ici, juste une prévisualisation */}
        <div className="g2rd-toggle-preview" style={{ textAlign: toggleAlign }}>
          <label className={`g2rd-toggle-switch-preview ${toggleStyle}`}>
            <span
              className="g2rd-toggle-slider-preview"
              style={{
                backgroundColor: showLeft
                  ? toggleColorActive
                  : toggleColorInactive,
              }}
            />
          </label>
        </div>

        {/* Onglets pour basculer entre les contenus dans l'éditeur */}
        <div className="g2rd-toggle-editor-tabs" style={{ marginBottom: "20px" }}>
          <Button
            isPrimary={activeEditorTab === "left"}
            isSecondary={activeEditorTab !== "left"}
            onClick={() => setActiveEditorTab("left")}
            style={{ marginRight: "10px" }}
          >
            {__("Contenu de gauche", "g2rd-theme")}
            {showLeft && " ✓"}
          </Button>
          <Button
            isPrimary={activeEditorTab === "right"}
            isSecondary={activeEditorTab !== "right"}
            onClick={() => setActiveEditorTab("right")}
          >
            {__("Contenu de droite", "g2rd-theme")}
            {!showLeft && " ✓"}
          </Button>
        </div>

        {/* Conteneur pour les InnerBlocks avec classe pour le ciblage CSS */}
        <div className="g2rd-toggle-content-editor">
          <InnerBlocks template={TEMPLATE} allowedBlocks={["core/group"]} />
        </div>
      </div>
    </>
  );
}
