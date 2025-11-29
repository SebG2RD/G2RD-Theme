import React from "react";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from "@wordpress/block-editor";
import {
  PanelBody,
  SelectControl,
  RangeControl,
  ToggleControl,
} from "@wordpress/components";
import classnames from "classnames";

/**
 * Bloc Marquee G2RD - Composant principal d'édition
 * 
 * Ce composant permet de créer un marquee (défilement infini) avec :
 * - Défilement horizontal ou vertical
 * - Vitesse de défilement configurable
 * - Effet de fondu optionnel
 * - Pause au survol optionnelle
 * - Duplication automatique du contenu pour un défilement fluide
 * - Contenu personnalisable avec InnerBlocks
 */
export default function Edit({ attributes = {}, setAttributes, clientId }) {
  // Valeurs par défaut sécurisées
  const {
    direction = "horizontal",
    speed = 50,
    fadeEffect = true,
    pauseOnHover = false,
    duplicateContent = true,
    height = 300,
    heightUnit = "px",
  } = attributes || {};

  // Propriétés du wrapper du bloc
  const blockProps = useBlockProps({
    className: classnames(
      "g2rd-marquee-block",
      "g2rd-marquee-editor",
      {
        "g2rd-marquee-horizontal": direction === "horizontal",
        "g2rd-marquee-vertical": direction === "vertical",
        "g2rd-marquee-fade": fadeEffect,
      }
    ),
    style: {
      "--marquee-speed": `${speed}s`,
      ...(direction === "vertical" && {
        "--marquee-height": `${height}${heightUnit}`,
      }),
    },
  });

  // Options de direction
  const directionOptions = [
    { label: __("Horizontal", "g2rd-marquee"), value: "horizontal" },
    { label: __("Vertical", "g2rd-marquee"), value: "vertical" },
  ];

  // Template pour InnerBlocks - permet d'ajouter n'importe quel contenu
  const innerBlocksTemplate = [
    [
      "core/paragraph",
      {
        placeholder: __("Ajoutez votre contenu ici...", "g2rd-marquee"),
        content: __("Contenu du marquee - Ajoutez des blocs ici pour créer votre défilement infini", "g2rd-marquee"),
      },
    ],
  ];

  return (
    <>
      {/* Panneau de contrôle dans la barre latérale */}
      <InspectorControls>
        <PanelBody title={__("Paramètres du Marquee", "g2rd-marquee")} initialOpen={true}>
          {/* Direction du défilement */}
          <SelectControl
            label={__("Direction", "g2rd-marquee")}
            value={direction}
            options={directionOptions}
            onChange={(value) => setAttributes({ direction: value })}
            help={__("Choisissez si le contenu défile horizontalement ou verticalement", "g2rd-marquee")}
          />

          {/* Vitesse de défilement */}
          <RangeControl
            label={__("Vitesse", "g2rd-marquee")}
            value={speed}
            onChange={(value) => setAttributes({ speed: value })}
            min={10}
            max={200}
            step={5}
            help={__("Plus la valeur est basse, plus le défilement est rapide (10 = très rapide, 200 = très lent)", "g2rd-marquee")}
          />

          {/* Effet de fondu */}
          <ToggleControl
            label={__("Effet de fondu", "g2rd-marquee")}
            checked={fadeEffect}
            onChange={(value) => setAttributes({ fadeEffect: value })}
            help={__("Ajoute un effet de fondu sur les bords du marquee", "g2rd-marquee")}
          />

          {/* Pause au survol */}
          <ToggleControl
            label={__("Pause au survol", "g2rd-marquee")}
            checked={pauseOnHover}
            onChange={(value) => setAttributes({ pauseOnHover: value })}
            help={__("Le défilement s'arrête lorsque la souris survole le marquee", "g2rd-marquee")}
          />

          {/* Duplication du contenu */}
          <ToggleControl
            label={__("Dupliquer le contenu", "g2rd-marquee")}
            checked={duplicateContent}
            onChange={(value) => setAttributes({ duplicateContent: value })}
            help={__("Duplique automatiquement le contenu pour un défilement infini fluide (recommandé)", "g2rd-marquee")}
          />

          {/* Hauteur du bloc (uniquement pour défilement vertical) */}
          {direction === "vertical" && (
            <>
              <SelectControl
                label={__("Unité de hauteur", "g2rd-marquee")}
                value={heightUnit}
                options={[
                  { label: __("Pixels (px)", "g2rd-marquee"), value: "px" },
                  { label: __("Viewport Height (vh)", "g2rd-marquee"), value: "vh" },
                  { label: __("Rapport (%)", "g2rd-marquee"), value: "%" },
                ]}
                onChange={(value) => {
                  setAttributes({ heightUnit: value });
                  // Ajuster la valeur par défaut selon l'unité
                  if (value === "vh" && height > 100) {
                    setAttributes({ height: 50 });
                  } else if (value === "%" && height > 100) {
                    setAttributes({ height: 50 });
                  } else if (value === "px" && height < 100) {
                    setAttributes({ height: 300 });
                  }
                }}
                help={__("Choisissez l'unité de mesure pour la hauteur", "g2rd-marquee")}
              />
              <RangeControl
                label={__("Hauteur du bloc", "g2rd-marquee")}
                value={height}
                onChange={(value) => setAttributes({ height: value })}
                min={heightUnit === "px" ? 100 : 10}
                max={heightUnit === "px" ? 1000 : 100}
                step={heightUnit === "px" ? 10 : 1}
                help={__("Définit la hauteur visible du bloc pour le défilement vertical", "g2rd-marquee")}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>

      {/* Aperçu du bloc dans l'éditeur */}
      <div {...blockProps}>
        <div className="g2rd-marquee-wrapper">
          <div className="g2rd-marquee-content">
            <InnerBlocks
              template={innerBlocksTemplate}
              templateLock={false}
              allowedBlocks={true}
            />
          </div>
          {/* Note : La duplication sera gérée automatiquement sur le frontend */}
        </div>
        {/* Note informative dans l'éditeur */}
        <div className="g2rd-marquee-editor-note">
          <p>
            {__("💡 Le défilement infini sera actif sur le frontend. Ajoutez votre contenu ci-dessus.", "g2rd-marquee")}
          </p>
        </div>
      </div>
    </>
  );
}

