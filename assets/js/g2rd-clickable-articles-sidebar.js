/**
 * Panneau latéral des articles cliquables
 *
 * Ce script gère le panneau latéral pour la configuration
 * des articles cliquables dans l'éditeur de blocs.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

/**
 * G2RD Clickable Articles Sidebar Control
 *
 * Ajoute un contrôle dans la sidebar de l'éditeur Gutenberg (onglet Réglages)
 * pour activer/désactiver la fonctionnalité de clic sur les articles.
 */
(function (wp) {
  // Vérifier si l'API WordPress est disponible
  if (!wp) {
    console.error("WordPress API not available");
    return;
  }

  try {
    // Récupérer les composants nécessaires
    const { __ } = wp.i18n;
    const { createHigherOrderComponent } = wp.compose;
    const { Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, ToggleControl } = wp.components;
    const { addFilter } = wp.hooks;
    const { createElement } = wp.element;

    /**
     * Ajouter l'attribut personnalisé aux blocs de type group et columns
     */
    function addClickableAttribute(settings, name) {
      // N'appliquer qu'aux blocs de type group et columns
      if (name !== "core/group" && name !== "core/columns") {
        return settings;
      }

      // Ajouter l'attribut clickableArticles
      if (settings.attributes) {
        settings.attributes = Object.assign({}, settings.attributes, {
          clickableArticles: {
            type: "boolean",
            default: false,
          },
        });
      }

      return settings;
    }

    /**
     * Ajouter le contrôle dans la sidebar pour les blocs de type group et columns
     */
    const withClickableControl = createHigherOrderComponent((BlockEdit) => {
      return (props) => {
        // N'appliquer qu'aux blocs de type group et columns
        if (props.name !== "core/group" && props.name !== "core/columns") {
          return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { clickableArticles } = attributes;

        return createElement(
          Fragment,
          {},
          createElement(BlockEdit, props),
          createElement(
            InspectorControls,
            null,
            createElement(
              PanelBody,
              {
                title: __("Articles cliquables", "G2RD"),
                initialOpen: false,
                className: "g2rd-clickable-articles-panel",
              },
              createElement(ToggleControl, {
                label: __("Activer les articles cliquables", "G2RD"),
                help: clickableArticles
                  ? __("Les articles sont cliquables", "G2RD")
                  : __("Les articles ne sont pas cliquables", "G2RD"),
                checked: !!clickableArticles,
                onChange: (value) =>
                  setAttributes({ clickableArticles: value }),
                __nextHasNoMarginBottom: true,
              })
            )
          )
        );
      };
    }, "withClickableControl");

    // Ajouter les filtres
    addFilter(
      "blocks.registerBlockType",
      "g2rd/clickable-articles-attribute",
      addClickableAttribute,
      9
    );

    addFilter(
      "editor.BlockEdit",
      "g2rd/clickable-articles-control",
      withClickableControl,
      9
    );

    console.log("G2RD Clickable Articles Sidebar Control initialized");
  } catch (e) {
    console.error(
      "Error initializing G2RD Clickable Articles Sidebar Control",
      e
    );
  }
})(window.wp);
