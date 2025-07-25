import { registerBlockType } from "@wordpress/blocks";
import "./carousel.css";
import "./carousel-frontend.js";
import Edit from "./edit";
import Save from "./save";

registerBlockType("g2rd/carousel", {
  edit: Edit,
  save: Save,
});
