import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import classnames from "classnames";

export default function save({ attributes }) {
  const {
    showLeft,
    toggleAlign,
    toggleStyle,
    toggleColorActive,
    toggleColorInactive,
    blockId,
  } = attributes;

  const blockProps = useBlockProps.save();

  // Les styles pour les couleurs sont passés en variables CSS
  const sliderStyles = {
    "--g2rd-toggle-active-color": toggleColorActive,
    "--g2rd-toggle-inactive-color": toggleColorInactive,
  };

  return (
    <div {...blockProps}>
      <input
        type="checkbox"
        id={blockId}
        className="g2rd-toggle-checkbox"
        defaultChecked={!showLeft}
        style={{ display: "none" }}
      />

      <div className="g2rd-toggle-container" style={{ textAlign: toggleAlign }}>
        <label
          htmlFor={blockId}
          className={classnames(
            "g2rd-toggle-switch",
            `is-style-${toggleStyle}`
          )}
        >
          <span className="g2rd-toggle-slider" style={sliderStyles}></span>
        </label>
      </div>

      <div className="g2rd-toggle-content-container">
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
