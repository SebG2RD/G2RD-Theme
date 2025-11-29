import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import classnames from "classnames";

/**
 * Composant de sauvegarde du bloc Marquee
 * 
 * Ce composant sauvegarde la structure HTML du marquee
 * avec les attributs de configuration
 */
export default function save({ attributes }) {
  const {
    direction = "horizontal",
    speed = 50,
    fadeEffect = true,
    pauseOnHover = false,
    duplicateContent = true,
    height = 300,
    heightUnit = "px",
  } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames(
      "g2rd-marquee-block",
      {
        "g2rd-marquee-horizontal": direction === "horizontal",
        "g2rd-marquee-vertical": direction === "vertical",
        "g2rd-marquee-fade": fadeEffect,
        "g2rd-marquee-pause-hover": pauseOnHover,
      }
    ),
    "data-direction": direction,
    "data-speed": speed,
    "data-fade-effect": fadeEffect ? "true" : "false",
    "data-pause-hover": pauseOnHover ? "true" : "false",
    "data-duplicate": duplicateContent ? "true" : "false",
    style: {
      "--marquee-speed": `${speed}s`,
      ...(direction === "vertical" && {
        "--marquee-height": `${height}${heightUnit}`,
      }),
    },
  });

  return (
    <div {...blockProps}>
      <div className="g2rd-marquee-wrapper">
        <div className="g2rd-marquee-content">
          <InnerBlocks.Content />
        </div>
        {/* La duplication du contenu sera gérée par le script frontend */}
      </div>
    </div>
  );
}

