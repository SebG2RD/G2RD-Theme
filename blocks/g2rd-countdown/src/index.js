import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
// import "./countdown.css";
import "./countdown-frontend.js";
import Edit from "./edit";
import Save from "./save";

registerBlockType("g2rd/countdown", {
  edit: Edit,
  save: Save,
});
