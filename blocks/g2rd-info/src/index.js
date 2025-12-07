import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./info.css";
import save from "./save";
// Importer le script de personnalisation des labels et couleurs
import "./element-label";

registerBlockType("g2rd/info", {
  edit: Edit,
  save,
});
