import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./portfolio-universel.css";
import Save from "./save";

registerBlockType("g2rd/portfolio-universel", {
  edit: Edit,
  save: Save,
});
