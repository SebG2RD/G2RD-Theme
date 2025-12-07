// G2RD Info Block Frontend Script
// Ce script s'exécute uniquement en frontend, pas dans l'éditeur
(function () {
  // Ne pas s'exécuter dans l'éditeur WordPress
  // Vérifier si on est dans l'éditeur en cherchant des éléments spécifiques
  if (
    window.wp &&
    window.wp.blockEditor &&
    (document.body.classList.contains("block-editor-page") ||
      document.querySelector(".block-editor-block-list__layout"))
  ) {
    return;
  }
  /**
   * Fonction utilitaire pour résoudre une variable CSS WordPress
   */
  function resolveCssVariable(variableValue) {
    if (!variableValue || !variableValue.startsWith("var(")) {
      return variableValue;
    }

    const varMatch = variableValue.match(/var\(--wp--preset--color--([^,)]+)/);
    if (varMatch) {
      const colorSlug = varMatch[1];
      const root = document.documentElement;
      const resolved = window
        .getComputedStyle(root)
        .getPropertyValue(`--wp--preset--color--${colorSlug}`)
        .trim();
      return resolved || null;
    }

    return null;
  }

  /**
   * Fonction pour obtenir la couleur depuis les styles inline du bloc
   */
  function getColorFromBlock(blockWrapper, colorType) {
    if (!blockWrapper) return null;

    // Méthode 1 : Chercher directement dans les styles inline du bloc
    const inlineStyle = blockWrapper.getAttribute("style") || "";
    const regex = new RegExp(
      `--wp--preset--color--${colorType}:\\s*([^;]+)`,
      "i"
    );
    const match = inlineStyle.match(regex);

    if (match) {
      let colorValue = match[1].trim();
      if (colorValue.startsWith("var(")) {
        const resolved = resolveCssVariable(colorValue);
        if (resolved) return resolved;
      } else {
        return colorValue;
      }
    }

    // Méthode 2 : Utiliser getComputedStyle
    const computedStyle = window.getComputedStyle(blockWrapper);

    // Pour la bordure, chercher directement border-color calculé
    if (colorType === "border") {
      const borderColor = computedStyle.borderColor;
      if (
        borderColor &&
        borderColor !== "rgba(0, 0, 0, 0)" &&
        borderColor !== "transparent" &&
        borderColor !== "rgb(0, 0, 0)"
      ) {
        return borderColor;
      }
    }

    // Pour link, chercher la variable CSS
    let computedColor = computedStyle
      .getPropertyValue(`--wp--preset--color--${colorType}`)
      .trim();

    if (computedColor && computedColor !== "") {
      if (computedColor.startsWith("var(")) {
        const resolved = resolveCssVariable(computedColor);
        if (resolved) return resolved;
      } else {
        return computedColor;
      }
    }

    // Méthode 3 : Chercher dans le document root
    const root = document.documentElement;
    const rootColor = window
      .getComputedStyle(root)
      .getPropertyValue(`--wp--preset--color--${colorType}`)
      .trim();

    if (rootColor && rootColor !== "") {
      if (rootColor.startsWith("var(")) {
        const resolved = resolveCssVariable(rootColor);
        if (resolved) return resolved;
      } else {
        return rootColor;
      }
    }

    return null;
  }

  /**
   * Appliquer les couleurs (link et border) aux blocs
   */
  function applyColors() {
    const allBlocks = document.querySelectorAll(".g2rd-info-block");

    allBlocks.forEach(function (blockWrapper) {
      // ===== APPLIQUER LA COULEUR DE BORDURE =====
      let borderColor = getColorFromBlock(blockWrapper, "border");

      // Si pas trouvé, vérifier la classe has-border-color
      if (
        !borderColor ||
        borderColor === "inherit" ||
        borderColor === "currentColor"
      ) {
        if (blockWrapper.classList.contains("has-border-color")) {
          const computedStyle = window.getComputedStyle(blockWrapper);
          const borderColorVar = computedStyle
            .getPropertyValue("--wp--preset--color--border")
            .trim();
          if (borderColorVar) {
            if (borderColorVar.startsWith("var(")) {
              borderColor = resolveCssVariable(borderColorVar);
            } else {
              borderColor = borderColorVar;
            }
          }
        }
      }

      // Si toujours pas trouvé, utiliser la couleur du texte comme fallback
      // (comme WordPress le fait par défaut)
      if (
        !borderColor ||
        borderColor === "inherit" ||
        borderColor === "currentColor" ||
        borderColor === ""
      ) {
        const computedStyle = window.getComputedStyle(blockWrapper);
        const textColor = computedStyle.color;
        if (
          textColor &&
          textColor !== "rgba(0, 0, 0, 0)" &&
          textColor !== "transparent"
        ) {
          borderColor = textColor;
        }
      }

      // Appliquer la couleur de bordure
      if (
        borderColor &&
        borderColor !== "inherit" &&
        borderColor !== "currentColor" &&
        borderColor !== ""
      ) {
        blockWrapper.style.setProperty(
          "border-color",
          borderColor,
          "important"
        );
      } else {
        // Si aucune couleur n'est définie, retirer le style inline pour utiliser le CSS par défaut
        blockWrapper.style.removeProperty("border-color");
      }

      // ===== APPLIQUER LA COULEUR LINK À L'ICÔNE =====
      let linkColor = getColorFromBlock(blockWrapper, "link");

      // Si pas trouvé, vérifier la classe has-link-color
      if (
        !linkColor ||
        linkColor === "inherit" ||
        linkColor === "currentColor" ||
        linkColor === ""
      ) {
        if (blockWrapper.classList.contains("has-link-color")) {
          const computedStyle = window.getComputedStyle(blockWrapper);
          const linkColorVar = computedStyle
            .getPropertyValue("--wp--preset--color--link")
            .trim();
          if (linkColorVar) {
            if (linkColorVar.startsWith("var(")) {
              linkColor = resolveCssVariable(linkColorVar);
            } else {
              linkColor = linkColorVar;
            }
          }
        }
      }

      // Trouver les icônes dans le bloc
      const icons = blockWrapper.querySelectorAll(
        ".g2rd-info-icon-element, .g2rd-info-icon .dashicons"
      );

      if (icons.length > 0) {
        let blockId = blockWrapper.getAttribute("data-link-color-id");
        if (!blockId) {
          blockId = "g2rd-link-" + Math.random().toString(36).substr(2, 9);
          blockWrapper.setAttribute("data-link-color-id", blockId);
        }

        let styleId = "g2rd-info-link-style-" + blockId;
        let styleElement = document.getElementById(styleId);

        // Appliquer la couleur à l'icône
        if (
          linkColor &&
          linkColor !== "inherit" &&
          linkColor !== "currentColor" &&
          linkColor !== ""
        ) {
          if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }

          styleElement.textContent = `
            .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon-element::before,
            .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon .dashicons::before {
              color: ${linkColor} !important;
            }
          `;
        } else {
          if (styleElement) {
            styleElement.remove();
          }
          blockWrapper.removeAttribute("data-link-color-id");
        }
      }
    });
  }

  // Appliquer les couleurs au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyColors);
  } else {
    applyColors();
  }

  // Observer les changements pour les blocs chargés dynamiquement
  const observer = new MutationObserver(function (mutations) {
    let shouldApply = false;
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "style" ||
          mutation.attributeName === "class")
      ) {
        shouldApply = true;
      }
      if (mutation.type === "childList") {
        shouldApply = true;
      }
    });
    if (shouldApply) {
      setTimeout(applyColors, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
})();
