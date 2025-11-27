import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import "./tabs.css";

registerBlockType("g2rd/tabs", {
  edit: Edit,
  save,
});

