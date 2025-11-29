import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import "./marquee.css";

// Enregistrer le bloc avec gestion d'erreur
try {
  registerBlockType("g2rd/marquee", {
    edit: Edit,
    save,
  });
} catch (error) {
  console.error("Erreur lors de l'enregistrement du bloc marquee:", error);
}

