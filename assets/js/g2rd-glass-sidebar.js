/**
 * G2RD Glass Effect Sidebar Control
 *
 * Ajoute un contrôle dans la sidebar de l'éditeur Gutenberg (onglet Réglages)
 * pour activer/désactiver l'effet de verre sur les blocs.
 *
 * @package G2RD
 * @since 1.0.2
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
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
     * Ajouter l'attribut personnalisé aux blocs de type group, columns et rows
     */
    function addGlassAttribute(settings, name) {
      // N'appliquer qu'aux blocs de type group, columns et rows
      if (!["core/group", "core/columns", "core/row"].includes(name)) {
        return settings;
      }

      // Ajouter l'attribut glassEffect
      if (settings.attributes) {
        settings.attributes = Object.assign({}, settings.attributes, {
          glassEffect: {
            type: "boolean",
            default: false,
          },
        });
      }

      return settings;
    }

    /**
     * Ajouter le contrôle dans la sidebar pour les blocs de type group, columns et rows
     */
    const withGlassControl = createHigherOrderComponent((BlockEdit) => {
      return (props) => {
        // N'appliquer qu'aux blocs de type group, columns et rows
        if (!["core/group", "core/columns", "core/row"].includes(props.name)) {
          return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { glassEffect } = attributes;

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
                title: __("Effet de verre", "G2RD"),
                initialOpen: false,
                className: "g2rd-glass-panel",
              },
              createElement(ToggleControl, {
                label: __("Activer l'effet de verre", "G2RD"),
                help: glassEffect
                  ? __("L'effet de verre est activé", "G2RD")
                  : __("L'effet de verre est désactivé", "G2RD"),
                checked: !!glassEffect,
                onChange: (value) => setAttributes({ glassEffect: value }),
                __nextHasNoMarginBottom: true,
              })
            )
          )
        );
      };
    }, "withGlassControl");

    // Ajouter les filtres
    addFilter(
      "blocks.registerBlockType",
      "g2rd/glass-effect-attribute",
      addGlassAttribute,
      9
    );

    addFilter(
      "editor.BlockEdit",
      "g2rd/glass-effect-control",
      withGlassControl,
      9
    );
  } catch (e) {
    console.error("Error initializing G2RD Glass Effect Sidebar Control", e);
  }
})(window.wp);
