/**
 * Script frontend pour le bloc G2RD Accordion
 * 
 * Ce script gère l'interactivité de l'accordéon sur le frontend
 * et mappe le contenu InnerBlocks aux items correspondants
 */

(function () {
  "use strict";

  /**
   * Initialise l'accordéon pour un bloc donné
   */
  function initAccordion(blockElement) {
    const itemHeaders = blockElement.querySelectorAll(".g2rd-accordion-item-header");
    const itemContentWrappers = blockElement.querySelectorAll(".g2rd-accordion-item-content-wrapper");
    const initialState = blockElement.getAttribute("data-initial-state") || "first-open";
    const allowMultiple = blockElement.getAttribute("data-allow-multiple") === "true";
    
    // Récupérer les IDs des items depuis les en-têtes
    const items = Array.from(itemHeaders).map((header) => ({
      id: header.getAttribute("data-item-id"),
      header: header,
    }));

    // Récupérer tous les groupes InnerBlocks
    const innerBlocksGroups = blockElement.querySelectorAll(
      ".g2rd-accordion-content > .wp-block-group"
    );

    // Mapper les groupes aux items
    innerBlocksGroups.forEach((group, index) => {
      let itemId = group.getAttribute("data-item-id");
      
      // Si pas de data-attribute, utiliser l'index pour mapper
      if (!itemId && items[index]) {
        itemId = items[index].id;
      }
      
      if (itemId) {
        const targetContentWrapper = blockElement.querySelector(
          `#accordion-content-${itemId}`
        );
        if (targetContentWrapper) {
          const contentDiv = targetContentWrapper.querySelector(".g2rd-accordion-item-content");
          if (contentDiv && !contentDiv.contains(group)) {
            // Déplacer le groupe dans le contenu correspondant
            contentDiv.appendChild(group);
          }
        }
      } else if (itemContentWrappers[index]) {
        // Fallback : mapper par index si pas de itemId
        const targetContentWrapper = itemContentWrappers[index];
        const contentDiv = targetContentWrapper.querySelector(".g2rd-accordion-item-content");
        if (contentDiv && !contentDiv.contains(group)) {
          contentDiv.appendChild(group);
        }
      }
    });

    // Appliquer l'état initial
    applyInitialState(blockElement, initialState, items);

    // Gérer les clics sur les en-têtes
    itemHeaders.forEach((header) => {
      header.addEventListener("click", function (e) {
        e.preventDefault();

        const itemId = this.getAttribute("data-item-id");
        if (!itemId) return;

        const itemElement = this.closest(".g2rd-accordion-item");
        const contentWrapper = blockElement.querySelector(
          `#accordion-content-${itemId}`
        );

        if (!itemElement || !contentWrapper) return;

        const isOpen = itemElement.classList.contains("is-open");

        if (allowMultiple) {
          // Si plusieurs items peuvent être ouverts
          if (isOpen) {
            closeItem(itemElement, contentWrapper, this);
          } else {
            openItem(itemElement, contentWrapper, this);
          }
        } else {
          // Si un seul item peut être ouvert à la fois
          if (isOpen) {
            closeItem(itemElement, contentWrapper, this);
          } else {
            // Fermer tous les autres items
            const allItems = blockElement.querySelectorAll(".g2rd-accordion-item");
            const allContentWrappers = blockElement.querySelectorAll(".g2rd-accordion-item-content-wrapper");
            const allHeaders = blockElement.querySelectorAll(".g2rd-accordion-item-header");

            allItems.forEach((item) => {
              if (item !== itemElement) {
                item.classList.remove("is-open");
              }
            });

            allContentWrappers.forEach((wrapper) => {
              if (wrapper !== contentWrapper) {
                wrapper.classList.remove("is-open");
                wrapper.setAttribute("hidden", "hidden");
                const header = blockElement.querySelector(
                  `[data-item-id="${wrapper.getAttribute("data-item-id")}"]`
                );
                if (header) {
                  header.setAttribute("aria-expanded", "false");
                }
              }
            });

            // Ouvrir l'item cliqué
            openItem(itemElement, contentWrapper, this);
          }
        }
      });
    });
  }

  /**
   * Applique l'état initial selon la configuration
   */
  function applyInitialState(blockElement, initialState, items) {
    if (initialState === "all-open") {
      // Ouvrir tous les items
      items.forEach((item) => {
        const header = blockElement.querySelector(
          `[data-item-id="${item.id}"]`
        );
        if (header) {
          const itemElement = header.closest(".g2rd-accordion-item");
          const contentWrapper = blockElement.querySelector(
            `#accordion-content-${item.id}`
          );
          if (itemElement && contentWrapper) {
            openItem(itemElement, contentWrapper, header);
          }
        }
      });
    } else if (initialState === "all-closed") {
      // Fermer tous les items
      items.forEach((item) => {
        const header = blockElement.querySelector(
          `[data-item-id="${item.id}"]`
        );
        if (header) {
          const itemElement = header.closest(".g2rd-accordion-item");
          const contentWrapper = blockElement.querySelector(
            `#accordion-content-${item.id}`
          );
          if (itemElement && contentWrapper) {
            closeItem(itemElement, contentWrapper, header);
          }
        }
      });
    } else {
      // Premier item ouvert (défaut)
      if (items.length > 0) {
        const firstItem = items[0];
        const header = blockElement.querySelector(
          `[data-item-id="${firstItem.id}"]`
        );
        if (header) {
          const itemElement = header.closest(".g2rd-accordion-item");
          const contentWrapper = blockElement.querySelector(
            `#accordion-content-${firstItem.id}`
          );
          if (itemElement && contentWrapper) {
            openItem(itemElement, contentWrapper, header);
          }
        }
      }
    }
  }

  /**
   * Ouvre un item
   */
  function openItem(itemElement, contentWrapper, header) {
    itemElement.classList.add("is-open");
    contentWrapper.classList.add("is-open");
    contentWrapper.removeAttribute("hidden");
    header.setAttribute("aria-expanded", "true");
    
    // Mettre à jour l'icône
    updateIcon(header, true);
  }

  /**
   * Ferme un item
   */
  function closeItem(itemElement, contentWrapper, header) {
    itemElement.classList.remove("is-open");
    contentWrapper.classList.remove("is-open");
    contentWrapper.setAttribute("hidden", "hidden");
    header.setAttribute("aria-expanded", "false");
    
    // Mettre à jour l'icône
    updateIcon(header, false);
  }

  /**
   * Met à jour l'icône selon l'état ouvert/fermé
   */
  function updateIcon(header, isOpen) {
    const icon = header.querySelector(".g2rd-accordion-icon");
    if (!icon) return;

    // Retirer toutes les classes d'icône
    icon.classList.remove(
      "dashicons-arrow-up-alt2",
      "dashicons-arrow-down-alt2",
      "dashicons-arrow-up-alt",
      "dashicons-arrow-down-alt",
      "dashicons-arrow-left-alt",
      "dashicons-arrow-right-alt",
      "dashicons-minus",
      "dashicons-plus-alt2"
    );

    // Déterminer le type d'icône depuis le bloc parent
    const blockElement = header.closest(".g2rd-accordion-block");
    if (!blockElement) return;

    // Chercher l'icône actuelle pour déterminer le type
    const currentIconClass = Array.from(icon.classList).find(cls => 
      cls.startsWith("dashicons-")
    );

    if (currentIconClass) {
      // Déterminer le type d'icône et appliquer la bonne classe
      if (currentIconClass.includes("arrow-up-alt2") || currentIconClass.includes("arrow-down-alt2")) {
        icon.classList.add(isOpen ? "dashicons-arrow-up-alt2" : "dashicons-arrow-down-alt2");
      } else if (currentIconClass.includes("arrow-up-alt") || currentIconClass.includes("arrow-down-alt")) {
        icon.classList.add(isOpen ? "dashicons-arrow-up-alt" : "dashicons-arrow-down-alt");
      } else if (currentIconClass.includes("arrow-left-alt") || currentIconClass.includes("arrow-right-alt")) {
        icon.classList.add(isOpen ? "dashicons-arrow-left-alt" : "dashicons-arrow-right-alt");
      } else if (currentIconClass.includes("minus") || currentIconClass.includes("plus-alt2")) {
        icon.classList.add(isOpen ? "dashicons-minus" : "dashicons-plus-alt2");
      }
    } else {
      // Par défaut, utiliser chevron
      icon.classList.add(isOpen ? "dashicons-arrow-up-alt2" : "dashicons-arrow-down-alt2");
    }
  }

  /**
   * Initialise tous les blocs accordéon sur la page
   */
  function initAllAccordions() {
    const accordionBlocks = document.querySelectorAll(".g2rd-accordion-block");
    accordionBlocks.forEach((block) => {
      initAccordion(block);
    });
  }

  // Initialiser au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllAccordions);
  } else {
    initAllAccordions();
  }

  // Réinitialiser si du contenu est chargé dynamiquement (AJAX)
  if (typeof jQuery !== "undefined") {
    jQuery(document).on("g2rd-accordion-init", initAllAccordions);
  }

  // Observer les mutations DOM pour les contenus chargés dynamiquement
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Si un nouvel accordéon est ajouté
            if (node.classList && node.classList.contains("g2rd-accordion-block")) {
              initAccordion(node);
            }
            // Si un accordéon est dans le nœud ajouté
            const accordions = node.querySelectorAll && node.querySelectorAll(".g2rd-accordion-block");
            if (accordions) {
              accordions.forEach((accordion) => {
                initAccordion(accordion);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();

