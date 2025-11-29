/**
 * Script frontend pour le bloc G2RD Marquee
 * 
 * Ce script gère l'animation de défilement infini et les interactions
 * comme la pause au survol
 */

(function () {
  "use strict";

  /**
   * Initialise le marquee pour un bloc donné
   */
  function initMarquee(blockElement) {
    // Récupérer les attributs de configuration
    const direction = blockElement.getAttribute("data-direction") || "horizontal";
    const speed = parseFloat(blockElement.getAttribute("data-speed")) || 50;
    const fadeEffect = blockElement.getAttribute("data-fade-effect") === "true";
    const pauseOnHover = blockElement.getAttribute("data-pause-hover") === "true";
    const duplicate = blockElement.getAttribute("data-duplicate") === "true";

    const wrapper = blockElement.querySelector(".g2rd-marquee-wrapper");
    if (!wrapper) return;

    // Toujours dupliquer le contenu pour un défilement infini fluide
    // (même si l'option est désactivée, on en a besoin pour l'animation)
    const content = wrapper.querySelector(".g2rd-marquee-content");
    if (content && !wrapper.querySelector(".g2rd-marquee-content-duplicate")) {
      const duplicate = content.cloneNode(true);
      duplicate.classList.add("g2rd-marquee-content-duplicate");
      duplicate.setAttribute("aria-hidden", "true");
      wrapper.appendChild(duplicate);
    }

    // Gérer la pause au survol
    if (pauseOnHover) {
      blockElement.addEventListener("mouseenter", function () {
        wrapper.style.animationPlayState = "paused";
      });

      blockElement.addEventListener("mouseleave", function () {
        wrapper.style.animationPlayState = "running";
      });
    }

    // S'assurer que l'animation est active
    wrapper.style.animationPlayState = "running";
  }

  /**
   * Initialise tous les blocs marquee sur la page
   */
  function initAllMarquees() {
    const marqueeBlocks = document.querySelectorAll(".g2rd-marquee-block:not(.g2rd-marquee-editor)");
    marqueeBlocks.forEach((block) => {
      // Vérifier si le bloc n'a pas déjà été initialisé
      if (!block.hasAttribute("data-marquee-initialized")) {
        initMarquee(block);
        block.setAttribute("data-marquee-initialized", "true");
      }
    });
  }

  // Initialiser au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllMarquees);
  } else {
    initAllMarquees();
  }

  // Réinitialiser si du contenu est chargé dynamiquement (AJAX)
  if (typeof jQuery !== "undefined") {
    jQuery(document).on("g2rd-marquee-init", initAllMarquees);
  }

  // Observer les mutations DOM pour les contenus chargés dynamiquement
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Si un nouveau marquee est ajouté
            if (node.classList && node.classList.contains("g2rd-marquee-block") && !node.classList.contains("g2rd-marquee-editor")) {
              initMarquee(node);
            }
            // Si un marquee est dans le nœud ajouté
            const marquees = node.querySelectorAll && node.querySelectorAll(".g2rd-marquee-block:not(.g2rd-marquee-editor)");
            if (marquees) {
              marquees.forEach((marquee) => {
                if (!marquee.hasAttribute("data-marquee-initialized")) {
                  initMarquee(marquee);
                  marquee.setAttribute("data-marquee-initialized", "true");
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

