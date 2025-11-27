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
 * Bloc Accordéon G2RD - Composant principal d'édition
 * 
 * Ce composant permet de créer et gérer un accordéon FAQ avec :
 * - Ajout/suppression d'items (onglets)
 * - Compteur d'onglets à gauche
 * - Modification des titres
 * - Choix de l'icône (chevron, flèche, plus/moins)
 * - Choix de l'état initial (tout ouvert, tout fermé, premier ouvert)
 * - Contenu riche avec InnerBlocks pour chaque item
 * - Design WordPress natif
 */
export default function Edit({ attributes = {}, setAttributes, clientId }) {
  // Valeurs par défaut sécurisées
  const {
    items = [],
    initialState = "first-open",
    iconType = "chevron",
    iconPosition = "right",
    showCounter = true,
    counterPosition = "left",
    allowMultiple = false,
    itemBackgroundColor,
    itemTextColor,
    itemActiveBackgroundColor,
    itemActiveTextColor,
    contentBackgroundColor,
    contentTextColor,
    borderColor,
    borderWidth = 1,
    borderRadius = 4,
    showBorder = true,
    gap = "0",
  } = attributes || {};

  // S'assurer que items est toujours un tableau
  const safeItems = Array.isArray(items) ? items : [];

  // État local pour gérer les items ouverts dans l'éditeur
  const [openItems, setOpenItems] = React.useState(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }
    if (initialState === "all-open") {
      return items.filter(item => item && item.id).map(item => item.id);
    } else if (initialState === "all-closed") {
      return [];
    } else {
      const firstItem = items.find(item => item && item.id);
      return firstItem ? [firstItem.id] : [];
    }
  });

  // Initialiser les clientId pour chaque item si nécessaire
  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }
    const updatedItems = items.map((item, index) => {
      if (!item || !item.id) {
        return item;
      }
      if (!item.clientId) {
        return {
          ...item,
          clientId: `${clientId}-item-${index}`,
        };
      }
      return item;
    });
    if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
      setAttributes({ items: updatedItems });
    }
  }, [clientId, items, setAttributes]);

  // Propriétés du wrapper du bloc
  const blockProps = useBlockProps({
    className: classnames(
      "g2rd-accordion-block",
      {
        "g2rd-accordion-no-border": !showBorder,
        "g2rd-accordion-counter-left": showCounter && counterPosition === "left",
        "g2rd-accordion-counter-right": showCounter && counterPosition === "right",
        "g2rd-accordion-icon-left": iconPosition === "left",
        "g2rd-accordion-icon-right": iconPosition === "right",
      }
    ),
  });

  /**
   * Obtenir la classe CSS de l'icône selon le type choisi
   * On utilise des classes CSS au lieu de composants React pour éviter les erreurs
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
   * Ajouter un nouvel item
   */
  const addItem = () => {
    const newItemId = `item-${Date.now()}`;
    const newItem = {
      id: newItemId,
      title: __("Nouvelle question", "g2rd-accordion"),
      clientId: `${clientId}-${newItemId}`,
    };
    const currentItems = Array.isArray(items) ? items : [];
    const updatedItems = [...currentItems, newItem];
    setAttributes({ items: updatedItems });
    
    // Si l'état initial est "all-open", ouvrir le nouvel item
    if (initialState === "all-open") {
      setOpenItems([...openItems, newItemId]);
    }
  };

  /**
   * Supprimer un item
   */
  const removeItem = (itemId) => {
    const currentItems = Array.isArray(items) ? items : [];
    if (currentItems.length <= 1) {
      return; // Ne pas supprimer le dernier item
    }
    const updatedItems = currentItems.filter((item) => item && item.id !== itemId);
    setAttributes({ items: updatedItems });
    setOpenItems(openItems.filter(id => id !== itemId));
  };

  /**
   * Mettre à jour le titre d'un item
   */
  const updateItemTitle = (itemId, newTitle) => {
    const currentItems = Array.isArray(items) ? items : [];
    const updatedItems = currentItems.map((item) =>
      item && item.id === itemId ? { ...item, title: newTitle } : item
    );
    setAttributes({ items: updatedItems });
  };

  /**
   * Basculer l'état ouvert/fermé d'un item dans l'éditeur
   */
  const toggleItem = (itemId) => {
    if (allowMultiple) {
      // Si plusieurs items peuvent être ouverts
      if (openItems.includes(itemId)) {
        setOpenItems(openItems.filter(id => id !== itemId));
      } else {
        setOpenItems([...openItems, itemId]);
      }
    } else {
      // Si un seul item peut être ouvert à la fois
      if (openItems.includes(itemId)) {
        setOpenItems([]);
      } else {
        setOpenItems([itemId]);
      }
    }
  };

  /**
   * Créer le template pour InnerBlocks
   * Chaque item a son propre groupe de blocs
   */
  const createInnerBlocksTemplate = () => {
    const currentItems = Array.isArray(items) ? items : [];
    const template = [];
    currentItems.forEach((item) => {
      if (item && item.id) {
        template.push([
          "core/group",
          {
            className: `g2rd-accordion-item-content g2rd-accordion-item-${item.id}`,
            layout: { type: "constrained" },
            metadata: {
              name: `accordion-item-content-${item.id}`,
            },
          },
        ]);
      }
    });
    return template;
  };

  // Template pour InnerBlocks - un groupe par item
  const innerBlocksTemplate = createInnerBlocksTemplate();
  
  // S'assurer que le template n'est jamais vide
  const safeTemplate = Array.isArray(innerBlocksTemplate) && innerBlocksTemplate.length > 0 
    ? innerBlocksTemplate 
    : [
        ["core/group", {
          className: "g2rd-accordion-item-content-placeholder",
          layout: { type: "constrained" },
        }]
      ];

  // Mapper les groupes aux items et gérer l'affichage dans l'éditeur
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const blockWrapper = document.querySelector(
        `[data-block="${clientId}"]`
      );
      if (!blockWrapper) return;

      const accordionContent = blockWrapper.querySelector(".g2rd-accordion-content");
      if (!accordionContent) return;

      const groups = accordionContent.querySelectorAll(":scope > .wp-block-group");
      const currentItems = Array.isArray(items) ? items : [];
      
      groups.forEach((group, index) => {
        if (currentItems[index] && currentItems[index].id) {
          const itemId = currentItems[index].id;
          group.setAttribute("data-item-id", itemId);
          group.classList.add(`g2rd-accordion-item-${itemId}`);
          
          // Trouver tous les wrappers de contenu
          const allWrappers = blockWrapper.querySelectorAll(".g2rd-accordion-item-content-wrapper");
          
          // Trouver le wrapper correspondant à cet item
          const targetWrapper = Array.from(allWrappers).find(wrapper => {
            const contentDiv = wrapper.querySelector(`.g2rd-accordion-item-${itemId}`);
            return contentDiv !== null;
          });
          
          if (targetWrapper) {
            const contentDiv = targetWrapper.querySelector(`.g2rd-accordion-item-${itemId}`);
            if (contentDiv && !contentDiv.contains(group)) {
              // Déplacer le groupe dans le contenu correspondant
              contentDiv.appendChild(group);
            }
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [items, openItems, clientId]);

  // Options d'état initial
  const initialStateOptions = [
    { label: __("Premier ouvert", "g2rd-accordion"), value: "first-open" },
    { label: __("Tout ouvert", "g2rd-accordion"), value: "all-open" },
    { label: __("Tout fermé", "g2rd-accordion"), value: "all-closed" },
  ];

  // Options de type d'icône
  const iconTypeOptions = [
    { label: __("Chevron (^/v)", "g2rd-accordion"), value: "chevron" },
    { label: __("Flèche (↑/↓)", "g2rd-accordion"), value: "arrow" },
    { label: __("Flèche horizontale (←/→)", "g2rd-accordion"), value: "arrow-horizontal" },
    { label: __("Plus/Moins (+/-)", "g2rd-accordion"), value: "plus" },
  ];

  // Options de position de l'icône
  const iconPositionOptions = [
    { label: __("Gauche", "g2rd-accordion"), value: "left" },
    { label: __("Droite", "g2rd-accordion"), value: "right" },
  ];

  // Options de position du compteur
  const counterPositionOptions = [
    { label: __("Gauche", "g2rd-accordion"), value: "left" },
    { label: __("Droite", "g2rd-accordion"), value: "right" },
  ];

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
    <>
      {/* Panneau latéral de configuration */}
      <InspectorControls>
        <PanelBody title={__("Configuration générale", "g2rd-accordion")} initialOpen={true}>
          <SelectControl
            label={__("État initial", "g2rd-accordion")}
            value={initialState}
            options={initialStateOptions}
            onChange={(value) => {
              setAttributes({ initialState: value });
              // Mettre à jour l'état local
              const currentItems = Array.isArray(items) ? items : [];
              if (value === "all-open") {
                setOpenItems(currentItems.map(item => item.id).filter(Boolean));
              } else if (value === "all-closed") {
                setOpenItems([]);
              } else {
                setOpenItems(currentItems.length > 0 && currentItems[0] ? [currentItems[0].id] : []);
              }
            }}
            help={__("Choisissez l'état initial des items au chargement de la page", "g2rd-accordion")}
          />
          <ToggleControl
            label={__("Permettre plusieurs items ouverts", "g2rd-accordion")}
            checked={allowMultiple}
            onChange={(value) => setAttributes({ allowMultiple: value })}
            help={
              allowMultiple
                ? __("Plusieurs items peuvent être ouverts simultanément", "g2rd-accordion")
                : __("Un seul item peut être ouvert à la fois", "g2rd-accordion")
            }
          />
        </PanelBody>

        <PanelBody title={__("Compteur d'onglets", "g2rd-accordion")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher le compteur", "g2rd-accordion")}
            checked={showCounter}
            onChange={(value) => setAttributes({ showCounter: value })}
          />
          {showCounter && (
            <SelectControl
              label={__("Position du compteur", "g2rd-accordion")}
              value={counterPosition}
              options={counterPositionOptions}
              onChange={(value) => setAttributes({ counterPosition: value })}
            />
          )}
        </PanelBody>

        <PanelBody title={__("Icône", "g2rd-accordion")} initialOpen={false}>
          <SelectControl
            label={__("Type d'icône", "g2rd-accordion")}
            value={iconType}
            options={iconTypeOptions}
            onChange={(value) => setAttributes({ iconType: value })}
          />
          <SelectControl
            label={__("Position de l'icône", "g2rd-accordion")}
            value={iconPosition}
            options={iconPositionOptions}
            onChange={(value) => setAttributes({ iconPosition: value })}
          />
        </PanelBody>

        <PanelBody title={__("Couleurs des items", "g2rd-accordion")} initialOpen={false}>
          <div>
            <p>{__("Couleur de fond (fermé)", "g2rd-accordion")}</p>
            <ColorPicker
              color={itemBackgroundColor}
              onChange={(color) => setAttributes({ itemBackgroundColor: color })}
            />
          </div>
          <div>
            <p>{__("Couleur du texte (fermé)", "g2rd-accordion")}</p>
            <ColorPicker
              color={itemTextColor}
              onChange={(color) => setAttributes({ itemTextColor: color })}
            />
          </div>
          <div>
            <p>{__("Couleur de fond (ouvert)", "g2rd-accordion")}</p>
            <ColorPicker
              color={itemActiveBackgroundColor}
              onChange={(color) =>
                setAttributes({ itemActiveBackgroundColor: color })
              }
            />
          </div>
          <div>
            <p>{__("Couleur du texte (ouvert)", "g2rd-accordion")}</p>
            <ColorPicker
              color={itemActiveTextColor}
              onChange={(color) =>
                setAttributes({ itemActiveTextColor: color })
              }
            />
          </div>
        </PanelBody>

        <PanelBody title={__("Couleurs du contenu", "g2rd-accordion")} initialOpen={false}>
          <div>
            <p>{__("Couleur de fond", "g2rd-accordion")}</p>
            <ColorPicker
              color={contentBackgroundColor}
              onChange={(color) =>
                setAttributes({ contentBackgroundColor: color })
              }
            />
          </div>
          <div>
            <p>{__("Couleur du texte", "g2rd-accordion")}</p>
            <ColorPicker
              color={contentTextColor}
              onChange={(color) => setAttributes({ contentTextColor: color })}
            />
          </div>
        </PanelBody>

        <PanelBody title={__("Bordures", "g2rd-accordion")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher la bordure", "g2rd-accordion")}
            checked={showBorder}
            onChange={(value) => setAttributes({ showBorder: value })}
            help={
              showBorder
                ? __("La bordure est visible", "g2rd-accordion")
                : __("La bordure est masquée", "g2rd-accordion")
            }
          />
          {showBorder && (
            <>
              <div>
                <p>{__("Couleur de la bordure", "g2rd-accordion")}</p>
                <ColorPicker
                  color={borderColor}
                  onChange={(color) => setAttributes({ borderColor: color })}
                />
              </div>
              <RangeControl
                label={__("Épaisseur de la bordure", "g2rd-accordion")}
                value={borderWidth}
                onChange={(value) => setAttributes({ borderWidth: value })}
                min={0}
                max={10}
                step={1}
              />
              <RangeControl
                label={__("Rayon des coins", "g2rd-accordion")}
                value={borderRadius}
                onChange={(value) => setAttributes({ borderRadius: value })}
                min={0}
                max={50}
                step={1}
              />
            </>
          )}
        </PanelBody>

        <PanelBody title={__("Espacement", "g2rd-accordion")} initialOpen={false}>
          <TextControl
            label={__("Espacement entre les items", "g2rd-accordion")}
            value={gap}
            onChange={(value) => setAttributes({ gap: value })}
            help={__("Exemple : 8px, 1rem, 0.5em...", "g2rd-accordion")}
          />
        </PanelBody>
      </InspectorControls>

      {/* Rendu du bloc dans l'éditeur */}
      <div {...blockProps} style={accordionStyles}>
        <div className="g2rd-accordion-items">
          {safeItems.filter(item => item && item.id).map((item, index) => {
            
            const isOpen = openItems.includes(item.id);
            const iconClass = getIconClass(isOpen);
            
            return (
              <div
                key={item.id}
                className={classnames("g2rd-accordion-item", {
                  "is-open": isOpen,
                })}
              >
                <button
                  className="g2rd-accordion-item-header"
                  onClick={() => toggleItem(item.id)}
                  type="button"
                >
                  {showCounter && counterPosition === "left" && (
                    <span className="g2rd-accordion-counter">
                      {index + 1}
                    </span>
                  )}
                  {iconPosition === "left" && (
                    <span className={classnames("g2rd-accordion-icon", "dashicons", iconClass)} />
                  )}
                  <RichText
                    tagName="span"
                    value={item.title || ""}
                    onChange={(value) => updateItemTitle(item.id, value)}
                    placeholder={__("Titre de la question", "g2rd-accordion")}
                    allowedFormats={[]}
                    className="g2rd-accordion-item-title"
                  />
                  {showCounter && counterPosition === "right" && (
                    <span className="g2rd-accordion-counter">
                      {index + 1}
                    </span>
                  )}
                  {iconPosition === "right" && (
                    <span className={classnames("g2rd-accordion-icon", "dashicons", iconClass)} />
                  )}
                  {safeItems.length > 1 && (
                    <Button
                      icon={trash}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="g2rd-accordion-item-remove"
                      label={__("Supprimer l'item", "g2rd-accordion")}
                      isSmall
                      variant="tertiary"
                    />
                  )}
                </button>
                <div 
                  className={classnames("g2rd-accordion-item-content-wrapper", {
                    "is-open": isOpen,
                  })}
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  <div className={`g2rd-accordion-item-content g2rd-accordion-item-${item.id}`}>
                    {/* Le contenu sera injecté par InnerBlocks */}
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            icon={plus}
            onClick={addItem}
            className="g2rd-accordion-add"
            label={__("Ajouter un item", "g2rd-accordion")}
            isSmall
            variant="secondary"
          >
            {__("Ajouter un item", "g2rd-accordion")}
          </Button>
        </div>

        {/* Contenu des items via InnerBlocks - visible dans l'éditeur pour l'édition */}
        <div className="g2rd-accordion-content">
          <InnerBlocks
            template={safeTemplate}
            templateLock={false}
            allowedBlocks={true}
          />
        </div>
      </div>
    </>
  );
}

