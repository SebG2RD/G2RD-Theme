import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
  BlockControls,
  AlignmentToolbar,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  RangeControl,
  ToggleControl,
  Button,
  TextareaControl,
  SelectControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const {
    typedStrings,
    textBefore,
    textAfter,
    typeSpeed,
    backSpeed,
    loop,
    startDelay,
    backDelay,
    fadeOut,
    fadeOutClass,
    fadeOutDelay,
    smartBackspace,
    shuffle,
    showCursor,
    cursorChar,
    autoInsertCss,
    attr,
    bindInputFocusEvents,
    contentType,
    alignment,
    fontSize,
    fontWeight,
    textColor,
    backgroundColor,
    padding,
    margin,
  } = attributes;

  const blockProps = useBlockProps({
    style: {
      textAlign: alignment,
      fontSize: fontSize !== "inherit" ? fontSize : undefined,
      fontWeight: fontWeight !== "inherit" ? fontWeight : undefined,
      color: textColor !== "inherit" ? textColor : undefined,
      backgroundColor:
        backgroundColor !== "transparent" ? backgroundColor : undefined,
      padding: `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`,
      margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
    },
  });

  const [newString, setNewString] = useState("");

  const addString = () => {
    if (newString.trim()) {
      setAttributes({
        typedStrings: [...typedStrings, newString.trim()],
      });
      setNewString("");
    }
  };

  const removeString = (index) => {
    const newStrings = typedStrings.filter((_, i) => i !== index);
    setAttributes({ typedStrings: newStrings });
  };

  const updateString = (index, value) => {
    const newStrings = [...typedStrings];
    newStrings[index] = value;
    setAttributes({ typedStrings: newStrings });
  };

  return (
    <>
      <BlockControls>
        <AlignmentToolbar
          value={alignment}
          onChange={(value) => setAttributes({ alignment: value })}
        />
      </BlockControls>

      <InspectorControls>
        <PanelBody title={__("Textes animés", "g2rd-theme")} initialOpen={true}>
          <TextareaControl
            label={__("Ajouter un nouveau texte", "g2rd-theme")}
            value={newString}
            onChange={setNewString}
            placeholder={__("Entrez un nouveau texte à animer...", "g2rd-theme")}
          />
          <Button
            isPrimary
            onClick={addString}
            disabled={!newString.trim()}
            style={{ marginTop: "8px" }}
          >
            {__("Ajouter", "g2rd-theme")}
          </Button>

          <div style={{ marginTop: "16px" }}>
            <strong>{__("Textes actuels :", "g2rd-theme")}</strong>
            {typedStrings.map((string, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <TextControl
                  value={string}
                  onChange={(value) => updateString(index, value)}
                  style={{ flex: 1, marginRight: "8px" }}
                />
                <Button
                  isDestructive
                  isSmall
                  onClick={() => removeString(index)}
                >
                  {__("Supprimer", "g2rd-theme")}
                </Button>
              </div>
            ))}
          </div>
        </PanelBody>

        <PanelBody title={__("Texte avant/après", "g2rd-theme")} initialOpen={false}>
          <TextControl
            label={__("Texte avant l'animation", "g2rd-theme")}
            value={textBefore}
            onChange={(value) => setAttributes({ textBefore: value })}
            placeholder={__("Texte qui apparaît avant l'animation...", "g2rd-theme")}
          />
          <TextControl
            label={__("Texte après l'animation", "g2rd-theme")}
            value={textAfter}
            onChange={(value) => setAttributes({ textAfter: value })}
            placeholder={__("Texte qui apparaît après l'animation...", "g2rd-theme")}
          />
        </PanelBody>

        <PanelBody
          title={__("Paramètres d'animation", "g2rd-theme")}
          initialOpen={false}
        >
          <RangeControl
            label={__("Vitesse de frappe", "g2rd-theme")}
            value={typeSpeed}
            onChange={(value) => setAttributes({ typeSpeed: value })}
            min={10}
            max={200}
            step={5}
          />
          <RangeControl
            label={__("Vitesse d'effacement", "g2rd-theme")}
            value={backSpeed}
            onChange={(value) => setAttributes({ backSpeed: value })}
            min={10}
            max={200}
            step={5}
          />
          <RangeControl
            label={__("Délai de départ", "g2rd-theme")}
            value={startDelay}
            onChange={(value) => setAttributes({ startDelay: value })}
            min={0}
            max={5000}
            step={100}
          />
          <RangeControl
            label={__("Délai avant effacement", "g2rd-theme")}
            value={backDelay}
            onChange={(value) => setAttributes({ backDelay: value })}
            min={0}
            max={5000}
            step={100}
          />
          <ToggleControl
            label={__("Boucle infinie", "g2rd-theme")}
            checked={loop}
            onChange={() => setAttributes({ loop: !loop })}
          />
          <ToggleControl
            label={__("Mélanger les textes", "g2rd-theme")}
            checked={shuffle}
            onChange={() => setAttributes({ shuffle: !shuffle })}
          />
        </PanelBody>

        <PanelBody title={__("Curseur", "g2rd-theme")} initialOpen={false}>
          <ToggleControl
            label={__("Afficher le curseur", "g2rd-theme")}
            checked={showCursor}
            onChange={() => setAttributes({ showCursor: !showCursor })}
          />
          <TextControl
            label={__("Caractère du curseur", "g2rd-theme")}
            value={cursorChar}
            onChange={(value) => setAttributes({ cursorChar: value })}
            disabled={!showCursor}
          />
        </PanelBody>

        <PanelBody title={__("Options avancées", "g2rd-theme")} initialOpen={false}>
          <ToggleControl
            label={__("Effacement intelligent", "g2rd-theme")}
            checked={smartBackspace}
            onChange={() => setAttributes({ smartBackspace: !smartBackspace })}
          />
          <ToggleControl
            label={__("Fondu de sortie", "g2rd-theme")}
            checked={fadeOut}
            onChange={() => setAttributes({ fadeOut: !fadeOut })}
          />
          <TextControl
            label={__("Classe de fondu", "g2rd-theme")}
            value={fadeOutClass}
            onChange={(value) => setAttributes({ fadeOutClass: value })}
            disabled={!fadeOut}
          />
          <RangeControl
            label={__("Délai de fondu", "g2rd-theme")}
            value={fadeOutDelay}
            onChange={(value) => setAttributes({ fadeOutDelay: value })}
            min={0}
            max={5000}
            step={100}
            disabled={!fadeOut}
          />
          <ToggleControl
            label={__("CSS automatique", "g2rd-theme")}
            checked={autoInsertCss}
            onChange={() => setAttributes({ autoInsertCss: !autoInsertCss })}
          />
          <SelectControl
            label={__("Type de contenu", "g2rd-theme")}
            value={contentType}
            options={[
              { label: __("HTML", "g2rd-theme"), value: "html" },
              { label: __("Texte", "g2rd-theme"), value: "null" },
            ]}
            onChange={(value) => setAttributes({ contentType: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="g2rd-typed-editor">
          {textBefore && (
            <span className="typed-text-before">{textBefore}</span>
          )}
          <span className="typed-text-animated">
            {typedStrings.length > 0
              ? typedStrings[0]
              : __("Aucun texte défini", "g2rd-theme")}
          </span>
          {textAfter && <span className="typed-text-after">{textAfter}</span>}
          {showCursor && <span className="typed-cursor">{cursorChar}</span>}
        </div>

        {typedStrings.length === 0 && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              marginTop: "8px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {__(
              "Aucun texte animé défini. Ajoutez des textes dans les paramètres.",
              "g2rd-theme"
            )}
          </div>
        )}
      </div>
    </>
  );
}
