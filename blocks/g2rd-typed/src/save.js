import React from "react";
import { RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
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
  return (
    <div className="g2rd-typed-block">
      <RichText.Content
        tagName="span"
        value={texteAvant}
        className="g2rd-typed-before"
      />
      <span
        className="g2rd-typed-animated"
        data-type-speed={typeSpeed}
        data-back-speed={backSpeed}
        data-loop={loop ? "true" : "false"}
        data-show-cursor={showCursor ? "true" : "false"}
        data-typed-color={typedColor}
      >
        <div id="typed-strings" style={{ display: "none" }}>
          {phrases &&
            phrases.map((phrase, idx) => (
              <p key={idx}>
                <strong>{phrase}</strong>
              </p>
            ))}
        </div>
        <span id="typed"></span>
      </span>
      <RichText.Content
        tagName="span"
        value={texteApres}
        className="g2rd-typed-after"
      />
    </div>
  );
}
