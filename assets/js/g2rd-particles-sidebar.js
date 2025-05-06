/**
 * G2RD Particles Sidebar Control
 *
 * Ajoute un contrôle dans la sidebar de l'éditeur Gutenberg (onglet Réglages)
 * pour activer/désactiver l'effet de particules sur les blocs de type group.
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
     * Ajouter l'attribut personnalisé aux blocs de type group
     */
    function addParticlesAttribute(settings, name) {
      // N'appliquer qu'aux blocs de type group
      if (name !== "core/group") {
        return settings;
      }

      // Ajouter l'attribut particlesEffect
      if (settings.attributes) {
        settings.attributes = Object.assign({}, settings.attributes, {
          particlesEffect: {
            type: "boolean",
            default: false,
          },
        });
      }

      return settings;
    }

    /**
     * Ajouter le contrôle dans la sidebar pour les blocs de type group
     */
    const withParticlesControl = createHigherOrderComponent((BlockEdit) => {
      return (props) => {
        // N'appliquer qu'aux blocs de type group
        if (props.name !== "core/group") {
          return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { particlesEffect } = attributes;

        // Utiliser InspectorControls sans le paramètre group pour l'onglet Réglages
        return createElement(
          Fragment,
          {},
          createElement(BlockEdit, props),
          createElement(
            InspectorControls,
            null, // Sans le group, cela apparaît dans l'onglet Réglages
            createElement(
              PanelBody,
              {
                title: __("Effet de particules", "G2RD"),
                initialOpen: false,
                className: "g2rd-particles-panel",
              },
              createElement(ToggleControl, {
                label: __("Activer l'effet", "G2RD"),
                help: particlesEffect
                  ? __("Effet particules activé", "G2RD")
                  : __("Effet particules désactivé", "G2RD"),
                checked: !!particlesEffect,
                onChange: (value) => setAttributes({ particlesEffect: value }),
                __nextHasNoMarginBottom: true,
              })
            )
          )
        );
      };
    }, "withParticlesControl");

    // Ajouter les filtres
    addFilter(
      "blocks.registerBlockType",
      "g2rd/particles-effect-attribute",
      addParticlesAttribute,
      9
    );

    addFilter(
      "editor.BlockEdit",
      "g2rd/particles-effect-control",
      withParticlesControl,
      9
    );

    console.log("G2RD Particles Sidebar Control initialized");
  } catch (e) {
    console.error("Error initializing G2RD Particles Sidebar Control", e);
  }
})(window.wp);
