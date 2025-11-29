/**
 * Script frontend pour le bloc G2RD Modal
 * 
 * Ce script gère l'interactivité du modal sur le frontend :
 * - Ouverture/fermeture du modal
 * - Gestion des événements (clic extérieur, Escape)
 * - Prévention du scroll du body
 * - Animations
 */

(function () {
  "use strict";

  /**
   * Initialise le modal pour un bloc donné
   */
  function initModal(blockElement) {
    const trigger = blockElement.querySelector(".g2rd-modal-trigger");
    const overlay = blockElement.querySelector(".g2rd-modal-overlay");
    const closeButton = blockElement.querySelector(".g2rd-modal-close");
    const container = blockElement.querySelector(".g2rd-modal-container");

    if (!overlay) {
      return; // Élément overlay manquant
    }

    // Récupérer les options depuis les attributs data
    const closeOnOutsideClick =
      blockElement.getAttribute("data-close-on-outside-click") === "true";
    const closeOnEscape =
      blockElement.getAttribute("data-close-on-escape") === "true";
    const openMode = blockElement.getAttribute("data-open-mode") || "click";
    const timerDelay = parseInt(
      blockElement.getAttribute("data-timer-delay") || "0",
      10
    );

    /**
     * Ouvrir le modal
     */
    function openModal() {
      overlay.classList.add("is-open");
      document.body.classList.add("g2rd-modal-open");

      // Focus sur le modal pour l'accessibilité
      if (container) {
        container.setAttribute("tabindex", "-1");
        container.focus();
      }

      // Empêcher le scroll du body
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    /**
     * Fermer le modal
     */
    function closeModal() {
      overlay.classList.add("closing");
      document.body.classList.remove("g2rd-modal-open");
      document.body.style.paddingRight = "";

      // Attendre la fin de l'animation avant de masquer
      setTimeout(() => {
        overlay.classList.remove("is-open", "closing");
      }, 300); // Durée de l'animation (0.3s)
    }

    /**
     * Gérer le clic sur le bouton déclencheur (mode clic uniquement)
     */
    if (trigger && openMode === "click") {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
    }

    /**
     * Ouvrir automatiquement après un délai (mode timer)
     */
    if (openMode === "timer" && timerDelay > 0) {
      setTimeout(function () {
        openModal();
      }, timerDelay * 1000); // Convertir en millisecondes
    }

    /**
     * Gérer le clic sur le bouton de fermeture
     */
    if (closeButton) {
      closeButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    /**
     * Gérer le clic en dehors du modal (sur l'overlay)
     */
    if (closeOnOutsideClick) {
      overlay.addEventListener("click", function (e) {
        // Ne fermer que si on clique directement sur l'overlay (pas sur le container)
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    /**
     * Gérer le clic sur le container (empêcher la propagation)
     */
    if (container) {
      container.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    /**
     * Gérer la touche Escape
     */
    if (closeOnEscape) {
      function handleEscape(e) {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) {
          closeModal();
        }
      }

      // Ajouter l'écouteur au chargement
      document.addEventListener("keydown", handleEscape);

      // Nettoyer l'écouteur si le bloc est supprimé (pour éviter les fuites mémoire)
      // Note: Cette partie nécessiterait un MutationObserver pour être complète
      // mais pour simplifier, on laisse l'écouteur actif
    }

    /**
     * Gérer le focus trap (accessibilité)
     * Empêcher le focus de sortir du modal avec Tab
     */
    if (container) {
      const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      container.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") {
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            if (lastFocusable) {
              lastFocusable.focus();
            }
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            if (firstFocusable) {
              firstFocusable.focus();
            }
          }
        }
      });
    }
  }

  /**
   * Initialise tous les blocs modal sur la page
   */
  function initAllModals() {
    const modalBlocks = document.querySelectorAll(".g2rd-modal-block");
    modalBlocks.forEach((block) => {
      // Vérifier si le modal n'a pas déjà été initialisé
      if (!block.hasAttribute("data-modal-initialized")) {
        initModal(block);
        block.setAttribute("data-modal-initialized", "true");
      }
    });
  }

  // Initialiser au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllModals);
  } else {
    initAllModals();
  }

  // Réinitialiser si du contenu est chargé dynamiquement (AJAX)
  if (typeof jQuery !== "undefined") {
    jQuery(document).on("g2rd-modal-init", initAllModals);
  }

  // Observer les mutations DOM pour les contenus chargés dynamiquement
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Si un nouveau modal est ajouté
            if (
              node.classList &&
              node.classList.contains("g2rd-modal-block")
            ) {
              initModal(node);
              node.setAttribute("data-modal-initialized", "true");
            }
            // Si un modal est dans le nœud ajouté
            const modals =
              node.querySelectorAll && node.querySelectorAll(".g2rd-modal-block");
            if (modals) {
              modals.forEach((modal) => {
                if (!modal.hasAttribute("data-modal-initialized")) {
                  initModal(modal);
                  modal.setAttribute("data-modal-initialized", "true");
                }
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

