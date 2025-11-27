import React, { useEffect } from "react";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  SelectControl,
  Button,
  ColorPicker,
  RangeControl,
  TextControl,
  ToggleControl,
} from "@wordpress/components";
import { plus, trash } from "@wordpress/icons";
import classnames from "classnames";

/**
 * Bloc Onglets G2RD - Composant principal d'édition
 * 
 * Ce composant permet de créer et gérer des onglets avec :
 * - Ajout/suppression d'onglets
 * - Modification des titres
 * - Contenu riche avec InnerBlocks pour chaque onglet
 * - Plusieurs styles disponibles
 */
export default function Edit({ attributes, setAttributes, clientId }) {
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

  // Initialiser les clientId pour chaque onglet si nécessaire
  useEffect(() => {
    const updatedTabs = tabs.map((tab, index) => {
      if (!tab.clientId) {
        return {
          ...tab,
          clientId: `${clientId}-tab-${index}`,
        };
      }
      return tab;
    });
    if (JSON.stringify(updatedTabs) !== JSON.stringify(tabs)) {
      setAttributes({ tabs: updatedTabs });
    }
  }, [clientId]);


  // Propriétés du wrapper du bloc
  const blockProps = useBlockProps({
    className: classnames(
      "g2rd-tabs-block",
      `g2rd-tabs-style-${style}`,
      {
        "g2rd-tabs-no-border": !showBorder,
      }
    ),
  });

  /**
   * Ajouter un nouvel onglet
   */
  const addTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab = {
      id: newTabId,
      title: __("Nouvel onglet", "g2rd-tabs"),
      clientId: `${clientId}-${newTabId}`,
    };
    setAttributes({
      tabs: [...tabs, newTab],
      activeTab: newTabId,
    });
  };

  /**
   * Supprimer un onglet
   */
  const removeTab = (tabId) => {
    if (tabs.length <= 1) {
      return; // Ne pas supprimer le dernier onglet
    }
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setAttributes({
      tabs: updatedTabs,
      activeTab: updatedTabs[0]?.id || "",
    });
  };

  /**
   * Mettre à jour le titre d'un onglet
   */
  const updateTabTitle = (tabId, newTitle) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, title: newTitle } : tab
    );
    setAttributes({ tabs: updatedTabs });
  };

  /**
   * Changer l'onglet actif
   */
  const setActiveTab = (tabId) => {
    setAttributes({ activeTab: tabId });
  };

  /**
   * Créer le template pour InnerBlocks
   * Chaque onglet a son propre groupe de blocs avec un data-attribute pour l'identifier
   */
  const createInnerBlocksTemplate = () => {
    return tabs.map((tab) => [
      "core/group",
      {
        className: `g2rd-tab-content g2rd-tab-${tab.id}`,
        layout: { type: "constrained" },
        metadata: {
          name: `tab-content-${tab.id}`,
        },
      },
    ]);
  };

  // Template pour InnerBlocks - un groupe par onglet
  const innerBlocksTemplate = createInnerBlocksTemplate();

  // Mapper les groupes aux panneaux et gérer l'affichage dans l'éditeur
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const blockWrapper = document.querySelector(
        `[data-block="${clientId}"] .g2rd-tabs-content`
      );
      if (!blockWrapper) return;

      const groups = blockWrapper.querySelectorAll(":scope > .wp-block-group");
      groups.forEach((group, index) => {
        if (tabs[index]) {
          const tabId = tabs[index].id;
          group.setAttribute("data-tab-id", tabId);
          group.classList.add(`g2rd-tab-${tabId}`);
          
          // Afficher/masquer selon l'onglet actif
          if (activeTab === tabId) {
            group.classList.add("g2rd-tab-active");
            group.style.display = "block";
          } else {
            group.classList.remove("g2rd-tab-active");
            group.style.display = "none";
          }
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [tabs, activeTab, clientId]);

  // Styles disponibles
  const styleOptions = [
    { label: __("Défaut", "g2rd-tabs"), value: "default" },
    { label: __("Sous-ligné", "g2rd-tabs"), value: "underline" },
    { label: __("Pillules", "g2rd-tabs"), value: "pills" },
    { label: __("Bordure", "g2rd-tabs"), value: "bordered" },
    { label: __("Minimal", "g2rd-tabs"), value: "minimal" },
  ];

  // Options d'alignement
  const alignmentOptions = [
    { label: __("Gauche", "g2rd-tabs"), value: "left" },
    { label: __("Centre", "g2rd-tabs"), value: "center" },
    { label: __("Droite", "g2rd-tabs"), value: "right" },
    { label: __("Étiré", "g2rd-tabs"), value: "stretch" },
  ];

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
    <>
      {/* Panneau latéral de configuration */}
      <InspectorControls>
        <PanelBody title={__("Style des onglets", "g2rd-tabs")} initialOpen={true}>
          <SelectControl
            label={__("Style", "g2rd-tabs")}
            value={style}
            options={styleOptions}
            onChange={(value) => setAttributes({ style: value })}
          />
          <SelectControl
            label={__("Alignement", "g2rd-tabs")}
            value={tabAlignment}
            options={alignmentOptions}
            onChange={(value) => setAttributes({ tabAlignment: value })}
          />
        </PanelBody>

        <PanelBody title={__("Couleurs des onglets", "g2rd-tabs")} initialOpen={false}>
          <div>
            <p>{__("Couleur de fond (inactif)", "g2rd-tabs")}</p>
            <ColorPicker
              color={tabBackgroundColor}
              onChange={(color) => setAttributes({ tabBackgroundColor: color })}
            />
          </div>
          <div>
            <p>{__("Couleur du texte (inactif)", "g2rd-tabs")}</p>
            <ColorPicker
              color={tabTextColor}
              onChange={(color) => setAttributes({ tabTextColor: color })}
            />
          </div>
          <div>
            <p>{__("Couleur de fond (actif)", "g2rd-tabs")}</p>
            <ColorPicker
              color={activeTabBackgroundColor}
              onChange={(color) =>
                setAttributes({ activeTabBackgroundColor: color })
              }
            />
          </div>
          <div>
            <p>{__("Couleur du texte (actif)", "g2rd-tabs")}</p>
            <ColorPicker
              color={activeTabTextColor}
              onChange={(color) =>
                setAttributes({ activeTabTextColor: color })
              }
            />
          </div>
        </PanelBody>

        <PanelBody title={__("Couleurs du contenu", "g2rd-tabs")} initialOpen={false}>
          <div>
            <p>{__("Couleur de fond", "g2rd-tabs")}</p>
            <ColorPicker
              color={contentBackgroundColor}
              onChange={(color) =>
                setAttributes({ contentBackgroundColor: color })
              }
            />
          </div>
          <div>
            <p>{__("Couleur du texte", "g2rd-tabs")}</p>
            <ColorPicker
              color={contentTextColor}
              onChange={(color) => setAttributes({ contentTextColor: color })}
            />
          </div>
        </PanelBody>

        <PanelBody title={__("Bordures", "g2rd-tabs")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher la bordure", "g2rd-tabs")}
            checked={showBorder}
            onChange={(value) => setAttributes({ showBorder: value })}
            help={
              showBorder
                ? __("La bordure est visible", "g2rd-tabs")
                : __("La bordure est masquée", "g2rd-tabs")
            }
          />
          {showBorder && (
            <>
              <div>
                <p>{__("Couleur de la bordure", "g2rd-tabs")}</p>
                <ColorPicker
                  color={borderColor}
                  onChange={(color) => setAttributes({ borderColor: color })}
                />
              </div>
              <RangeControl
                label={__("Épaisseur de la bordure", "g2rd-tabs")}
                value={borderWidth}
                onChange={(value) => setAttributes({ borderWidth: value })}
                min={0}
                max={10}
                step={1}
              />
              <RangeControl
                label={__("Rayon des coins", "g2rd-tabs")}
                value={borderRadius}
                onChange={(value) => setAttributes({ borderRadius: value })}
                min={0}
                max={50}
                step={1}
              />
            </>
          )}
        </PanelBody>

        <PanelBody title={__("Espacement", "g2rd-tabs")} initialOpen={false}>
          <TextControl
            label={__("Espacement entre les onglets", "g2rd-tabs")}
            value={gap}
            onChange={(value) => setAttributes({ gap: value })}
            help={__("Exemple : 8px, 1rem, 0.5em...", "g2rd-tabs")}
          />
        </PanelBody>
      </InspectorControls>

      {/* Rendu du bloc dans l'éditeur */}
      <div {...blockProps} style={tabStyles}>
        {/* Barre d'onglets */}
        <div
          className={classnames(
            "g2rd-tabs-nav",
            `g2rd-tabs-align-${tabAlignment}`
          )}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={classnames("g2rd-tab-button", {
                "is-active": activeTab === tab.id,
              })}
            >
              <RichText
                tagName="button"
                value={tab.title}
                onChange={(value) => updateTabTitle(tab.id, value)}
                placeholder={__("Titre de l'onglet", "g2rd-tabs")}
                onClick={() => setActiveTab(tab.id)}
                allowedFormats={[]}
              />
              {tabs.length > 1 && (
                <Button
                  icon={trash}
                  onClick={() => removeTab(tab.id)}
                  className="g2rd-tab-remove"
                  label={__("Supprimer l'onglet", "g2rd-tabs")}
                  isSmall
                  variant="tertiary"
                />
              )}
            </div>
          ))}
          <Button
            icon={plus}
            onClick={addTab}
            className="g2rd-tab-add"
            label={__("Ajouter un onglet", "g2rd-tabs")}
            isSmall
            variant="secondary"
          >
            {__("Ajouter", "g2rd-tabs")}
          </Button>
        </div>

        {/* Contenu des onglets */}
        <div className="g2rd-tabs-content">
          <InnerBlocks
            template={innerBlocksTemplate}
            templateLock={false}
            renderAppender={false}
          />
        </div>
      </div>
    </>
  );
}

