import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import "./countdown.css";
import "./countdown-frontend.js";
import Edit from "./edit";
import Save from "./save";
import metadata from "../block.json";

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
