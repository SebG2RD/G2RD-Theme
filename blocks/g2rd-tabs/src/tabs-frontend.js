/**
 * Script frontend pour le bloc G2RD Tabs
 * 
 * Ce script gère l'interactivité des onglets sur le frontend
 * et mappe le contenu InnerBlocks aux panneaux correspondants
 */

(function () {
  "use strict";

  /**
   * Initialise les onglets pour un bloc donné
   */
  function initTabs(blockElement) {
    const tabButtons = blockElement.querySelectorAll(".g2rd-tab-button");
    const tabPanels = blockElement.querySelectorAll(".g2rd-tab-panel");
    const activeTabId = blockElement.getAttribute("data-active-tab");
    
    // Récupérer les IDs des onglets depuis les boutons
    const tabs = Array.from(tabButtons).map((btn) => ({
      id: btn.getAttribute("data-tab-id"),
    }));

    // Récupérer tous les groupes InnerBlocks
    const innerBlocksGroups = blockElement.querySelectorAll(
      ".g2rd-tabs-content > .wp-block-group"
    );

    // Mapper les groupes aux panneaux
    innerBlocksGroups.forEach((group, index) => {
      let tabId = group.getAttribute("data-tab-id");
      
      // Si pas de data-attribute, utiliser l'index pour mapper
      if (!tabId && tabs[index]) {
        tabId = tabs[index].id;
      }
      
      if (tabId) {
        const targetPanel = blockElement.querySelector(`#tab-panel-${tabId}`);
        if (targetPanel) {
          const contentDiv = targetPanel.querySelector(".g2rd-tab-content");
          if (contentDiv && !contentDiv.contains(group)) {
            // Déplacer le groupe dans le panneau correspondant
            contentDiv.appendChild(group);
          }
        }
      } else if (tabPanels[index]) {
        // Fallback : mapper par index si pas de tabId
        const targetPanel = tabPanels[index];
        const contentDiv = targetPanel.querySelector(".g2rd-tab-content");
        if (contentDiv && !contentDiv.contains(group)) {
          contentDiv.appendChild(group);
        }
      }
    });

    // Gérer les clics sur les boutons d'onglets
    tabButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        const tabId = this.getAttribute("data-tab-id");
        if (!tabId) return;

        // Retirer la classe active de tous les boutons et panneaux
        tabButtons.forEach((btn) => btn.classList.remove("is-active"));
        tabPanels.forEach((panel) => {
          panel.classList.remove("is-active");
          panel.setAttribute("hidden", "hidden");
        });

        // Ajouter la classe active au bouton et panneau sélectionnés
        this.classList.add("is-active");
        const targetPanel = blockElement.querySelector(
          `#tab-panel-${tabId}`
        );
        if (targetPanel) {
          targetPanel.classList.add("is-active");
          targetPanel.removeAttribute("hidden");

          // Mettre à jour l'attribut aria-selected
          this.setAttribute("aria-selected", "true");
          tabButtons.forEach((btn) => {
            if (btn !== this) {
              btn.setAttribute("aria-selected", "false");
            }
          });
        }
      });
    });

    // Activer l'onglet par défaut
    if (activeTabId) {
      const defaultButton = blockElement.querySelector(
        `[data-tab-id="${activeTabId}"]`
      );
      if (defaultButton) {
        defaultButton.click();
      }
    }
  }

  /**
   * Initialise tous les blocs d'onglets sur la page
   */
  function initAllTabs() {
    const tabBlocks = document.querySelectorAll(".g2rd-tabs-block");
    tabBlocks.forEach((block) => {
      initTabs(block);
    });
  }

  // Initialiser au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllTabs);
  } else {
    initAllTabs();
  }

  // Réinitialiser si du contenu est chargé dynamiquement (AJAX)
  if (typeof jQuery !== "undefined") {
    jQuery(document).on("g2rd-tabs-init", initAllTabs);
  }
})();

