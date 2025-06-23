/**
 * @see https://reactjs.org/docs/react-api.html#createelement
 */
import { createElement, useEffect } from "@wordpress/element";
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

  useEffect(() => {
    if (!blockId) {
      setAttributes({ blockId: `g2rd-toggle-${clientId}` });
    }
  }, [clientId, blockId, setAttributes]);

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
        <PanelBody title={__("État initial", "g2rd")}>
          <ToggleControl
            label={__("Afficher le contenu de gauche", "g2rd")}
            checked={showLeft}
            onChange={() => setAttributes({ showLeft: !showLeft })}
            help={
              showLeft
                ? __("Le contenu de gauche sera visible par défaut.", "g2rd")
                : __("Le contenu de droite sera visible par défaut.", "g2rd")
            }
          />
        </PanelBody>
        <PanelBody title={__("Style du bouton", "g2rd")}>
          <SelectControl
            label={__("Style", "g2rd")}
            value={toggleStyle}
            options={[
              { label: "Défaut", value: "default" },
              { label: "Arrondi", value: "rounded" },
            ]}
            onChange={(newStyle) => setAttributes({ toggleStyle: newStyle })}
          />
        </PanelBody>
        <PanelColorSettings
          title={__("Couleurs du bouton", "g2rd")}
          colorSettings={[
            {
              value: toggleColorActive,
              onChange: (color) => setAttributes({ toggleColorActive: color }),
              label: __("Couleur (Activé)", "g2rd"),
            },
            {
              value: toggleColorInactive,
              onChange: (color) =>
                setAttributes({ toggleColorInactive: color }),
              label: __("Couleur (Désactivé)", "g2rd"),
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
        <InnerBlocks template={TEMPLATE} allowedBlocks={["core/group"]} />
      </div>
    </>
  );
}
