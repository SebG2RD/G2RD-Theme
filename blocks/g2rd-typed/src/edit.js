import React from "react";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  Button,
  RangeControl,
  ToggleControl,
  ColorPicker,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const {
    texteAvant,
    phrases,
    texteApres,
    typeSpeed,
    backSpeed,
    loop,
    showCursor,
    typedColor,
  } = attributes;

  // Gestion de la liste de phrases
  const updatePhrase = (value, idx) => {
    const newPhrases = [...phrases];
    newPhrases[idx] = value;
    setAttributes({ phrases: newPhrases });
  };
  const addPhrase = () =>
    setAttributes({ phrases: [...phrases, "Nouvelle phrase"] });
  const removePhrase = (idx) =>
    setAttributes({ phrases: phrases.filter((_, i) => i !== idx) });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__("Phrases animées", "G2RD")} initialOpen={true}>
          {phrases.map((phrase, idx) => (
            <div key={idx} style={{ display: "flex", marginBottom: 8 }}>
              <TextControl
                value={phrase}
                onChange={(val) => updatePhrase(val, idx)}
                style={{ flex: 1 }}
              />
              <Button
                icon="no-alt"
                label={__("Supprimer", "G2RD")}
                onClick={() => removePhrase(idx)}
                variant="tertiary"
                style={{ marginLeft: 4 }}
                aria-label={__("Supprimer cette phrase", "G2RD")}
              />
            </div>
          ))}
          <Button isSecondary onClick={addPhrase} icon="plus">
            {__("Ajouter une phrase", "G2RD")}
          </Button>
        </PanelBody>
        <PanelBody
          title={__("Options d’animation", "G2RD")}
          initialOpen={false}
        >
          <RangeControl
            label={__("Vitesse de frappe", "G2RD")}
            value={typeSpeed}
            onChange={(val) => setAttributes({ typeSpeed: val })}
            min={1}
            max={200}
            step={1}
            help={__(
              "Durée en ms entre chaque lettre (plus petit = plus rapide)",
              "G2RD"
            )}
          />
          <RangeControl
            label={__("Vitesse d’effacement", "G2RD")}
            value={backSpeed}
            onChange={(val) => setAttributes({ backSpeed: val })}
            min={1}
            max={200}
            step={1}
            help={__("Durée en ms entre chaque suppression de lettre", "G2RD")}
          />
          <ToggleControl
            label={__("Boucle", "G2RD")}
            checked={!!loop}
            onChange={(val) => setAttributes({ loop: val })}
            help={__("Répéter l’animation indéfiniment", "G2RD")}
          />
          <ToggleControl
            label={__("Afficher le curseur", "G2RD")}
            checked={!!showCursor}
            onChange={(val) => setAttributes({ showCursor: val })}
            help={__("Afficher le curseur clignotant", "G2RD")}
          />
          <div style={{ marginTop: 16 }}>
            <span style={{ display: "block", marginBottom: 4 }}>
              {__("Couleur du texte animé", "G2RD")}
            </span>
            <ColorPicker
              color={typedColor}
              onChangeComplete={(val) => {
                // val peut être une string (nouveau ColorPicker) ou un objet (LegacyColor)
                const color =
                  typeof val === "string"
                    ? val
                    : val && val.hex
                    ? val.hex
                    : typedColor;
                setAttributes({ typedColor: color });
              }}
              disableAlpha
            />
          </div>
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps()} className="g2rd-typed-block">
        <RichText
          tagName="span"
          value={texteAvant}
          onChange={(val) => setAttributes({ texteAvant: val })}
          placeholder={__("Texte avant…", "G2RD")}
          className="g2rd-typed-before"
        />
        <span className="g2rd-typed-preview" style={{ color: typedColor }}>
          {phrases.length > 0 ? phrases[0] : __("(Aucune phrase)", "G2RD")}
        </span>
        <RichText
          tagName="span"
          value={texteApres}
          onChange={(val) => setAttributes({ texteApres: val })}
          placeholder={__("Texte après…", "G2RD")}
          className="g2rd-typed-after"
        />
      </div>
    </Fragment>
  );
}
