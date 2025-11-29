import { useBlockProps } from "@wordpress/block-editor";

/**
 * Encode de manière sécurisée un objet en JSON pour un attribut data
 * Échappe les caractères spéciaux pour éviter les problèmes de sécurité
 *
 * @param {Object} data - L'objet à encoder
 * @returns {string} JSON encodé de manière sécurisée
 */
function safeJsonEncode(data) {
  try {
    // JSON.stringify échappe déjà les caractères spéciaux
    // React échappe également automatiquement les valeurs dans les attributs
    // Cette fonction garantit un encodage sûr
    return JSON.stringify(data);
  } catch (error) {
    // En cas d'erreur, retourner un objet vide
    console.error("G2RD Typed: Error encoding JSON", error);
    return JSON.stringify({});
  }
}

export default function Save({ attributes }) {
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

  const blockProps = useBlockProps.save({
    className: "g2rd-typed",
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
    "data-typed-config": safeJsonEncode({
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
    }),
  });

  return (
    <div {...blockProps}>
      {textBefore && <span className="typed-text-before">{textBefore}</span>}

      {typedStrings.length > 0 && (
        <div id="typed-strings" style={{ display: "none" }}>
          {typedStrings.map((string, index) => (
            <p key={index}>
              <strong>{string}</strong>
            </p>
          ))}
        </div>
      )}

      <span id="typed" className="typed-text-animated"></span>

      {textAfter && <span className="typed-text-after">{textAfter}</span>}
    </div>
  );
}
