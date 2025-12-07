/**
 * G2RD Info Block - Personnalisation du label et application des couleurs
 *
 * Ce script :
 * 1. Change le label de l'élément "link" en "Icône" dans l'onglet Styles
 * 2. Applique la couleur link à l'icône (via ::before)
 * 3. Applique la couleur de bordure depuis l'onglet Styles
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

// Imports WordPress
import { createElement, useEffect } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";

// Ne s'exécuter que dans l'éditeur WordPress
if (typeof window.wp !== "undefined" && window.wp.blockEditor) {
  try {
    /**
     * Fonction utilitaire pour résoudre une variable CSS WordPress
     */
    function resolveCssVariable(variableValue) {
      if (!variableValue || !variableValue.startsWith("var(")) {
        return variableValue;
      }

      const varMatch = variableValue.match(
        /var\(--wp--preset--color--([^,)]+)/
      );
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
     * WordPress applique les couleurs via useBlockProps qui génère des styles inline
     */
    function getColorFromBlock(blockWrapper, colorType) {
      if (!blockWrapper) return null;

      // Méthode 1 : Chercher directement dans les styles inline du bloc
      const inlineStyle = blockWrapper.getAttribute("style") || "";

      // Chercher --wp--preset--color--link ou --wp--preset--color--border
      const regex = new RegExp(
        `--wp--preset--color--${colorType}:\\s*([^;]+)`,
        "i"
      );
      const match = inlineStyle.match(regex);

      if (match) {
        let colorValue = match[1].trim();
        // Si c'est une variable CSS, la résoudre
        if (colorValue.startsWith("var(")) {
          const resolved = resolveCssVariable(colorValue);
          if (resolved) return resolved;
        } else {
          // Si c'est déjà une valeur directe (hex, rgb, etc.)
          return colorValue;
        }
      }

      // Méthode 2 : Utiliser getComputedStyle pour obtenir la couleur réelle
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

      // Pour link, chercher la variable CSS dans les computed styles
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

      // Méthode 3 : Chercher dans le document root (pour les variables globales)
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
      // Trouver tous les blocs g2rd/info dans l'éditeur
      // Dans l'éditeur, les blocs peuvent être dans différents contextes
      const selectors = [
        '[data-type="g2rd/info"]',
        ".wp-block-g2rd-info",
        ".g2rd-info-block",
        ".editor-styles-wrapper .g2rd-info-block",
        ".block-editor-block-list__block .g2rd-info-block",
      ];

      let allBlocks = [];
      selectors.forEach(function (selector) {
        const found = document.querySelectorAll(selector);
        allBlocks = allBlocks.concat(Array.from(found));
      });

      // Supprimer les doublons
      const uniqueBlocks = Array.from(new Set(allBlocks));

      uniqueBlocks.forEach(function (blockElement) {
        // Trouver le wrapper du bloc
        let blockWrapper =
          blockElement.querySelector(".g2rd-info-block") ||
          (blockElement.classList.contains("g2rd-info-block")
            ? blockElement
            : null) ||
          blockElement.closest(".g2rd-info-block");

        // Si toujours pas trouvé, chercher dans le parent
        if (!blockWrapper && blockElement.parentElement) {
          blockWrapper =
            blockElement.parentElement.querySelector(".g2rd-info-block");
        }

        if (!blockWrapper) {
          return;
        }

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
          // Appliquer via style inline avec !important
          blockWrapper.style.setProperty(
            "border-color",
            borderColor,
            "important"
          );

          // Aussi appliquer via une classe CSS pour plus de spécificité dans l'éditeur
          blockWrapper.classList.add("has-border-color-applied");
        } else {
          // Si aucune couleur n'est définie, retirer le style inline pour utiliser le CSS par défaut
          blockWrapper.style.removeProperty("border-color");
          blockWrapper.classList.remove("has-border-color-applied");
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
          // Créer un identifiant unique pour ce bloc
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

            // Appliquer la couleur au ::before des Dashicons
            // Utiliser des sélecteurs très spécifiques pour l'éditeur
            styleElement.textContent = `
              .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon-element::before,
              .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon .dashicons::before,
              .editor-styles-wrapper .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon-element::before,
              .editor-styles-wrapper .g2rd-info-block[data-link-color-id="${blockId}"] .g2rd-info-icon .dashicons::before {
                color: ${linkColor} !important;
              }
            `;
          } else {
            // Si pas de couleur, retirer le style
            if (styleElement) {
              styleElement.remove();
            }
            blockWrapper.removeAttribute("data-link-color-id");
          }
        }
      });
    }

    /**
     * Ajouter un contrôle de couleur de bordure dans l'onglet Styles
     */
    function addBorderColorControl() {
      // Trouver le panneau de couleurs dans l'onglet Styles
      const colorPanels = document.querySelectorAll(
        '.block-editor-panel-color-settings, [class*="color-settings"], .components-panel__body[class*="color"]'
      );

      colorPanels.forEach(function (panel) {
        // Vérifier si le contrôle de bordure existe déjà
        const existingBorderControl = panel.querySelector(
          "[data-g2rd-border-color-control]"
        );
        if (existingBorderControl) {
          return; // Déjà ajouté
        }

        // Vérifier si c'est pour le bloc g2rd/info
        const selectedBlock = document.querySelector(
          '.block-editor-block-list__block.is-selected[data-type="g2rd/info"]'
        );
        if (!selectedBlock) {
          return;
        }

        // Trouver le bloc wrapper
        const blockWrapper = selectedBlock.querySelector(".g2rd-info-block");
        if (!blockWrapper) {
          return;
        }

        // Créer le contrôle de couleur de bordure
        const borderColorControl = document.createElement("div");
        borderColorControl.setAttribute(
          "data-g2rd-border-color-control",
          "true"
        );
        borderColorControl.style.marginTop = "16px";
        borderColorControl.style.paddingTop = "16px";
        borderColorControl.style.borderTop = "1px solid #ddd";

        // Créer le label
        const label = document.createElement("label");
        label.className = "components-base-control__label";
        label.textContent = __("Bordure", "g2rd-theme");
        borderColorControl.appendChild(label);

        // Créer le sélecteur de couleur
        const colorPickerWrapper = document.createElement("div");
        colorPickerWrapper.style.marginTop = "8px";

        // Récupérer les couleurs de la palette WordPress depuis les boutons existants
        const colorPalette = [];
        const existingColorButtons = panel.querySelectorAll(
          '.components-circular-option-picker__option, button[aria-label*="color"], [data-color]'
        );

        // Si on trouve des boutons de couleur existants, récupérer leurs couleurs
        if (existingColorButtons.length > 0) {
          existingColorButtons.forEach(function (button) {
            const colorValue =
              button.getAttribute("data-color") ||
              button.style.backgroundColor ||
              window.getComputedStyle(button).backgroundColor;
            if (colorValue && colorValue !== "transparent") {
              // Éviter les doublons
              const alreadyExists = colorPalette.some(
                (item) => item.color === colorValue
              );
              if (!alreadyExists) {
                colorPalette.push({
                  slug: colorValue,
                  color: colorValue,
                });
              }
            }
          });
        }

        // Si pas de couleurs trouvées, récupérer depuis les variables CSS WordPress
        if (colorPalette.length === 0) {
          const root = document.documentElement;
          const computedStyle = window.getComputedStyle(root);
          const colorSlugs = [
            "primary",
            "secondary",
            "accent",
            "background",
            "foreground",
            "text",
            "heading",
            "link",
            "border",
            "white",
            "black",
            "gray",
            "dark",
            "light",
          ];

          colorSlugs.forEach(function (slug) {
            const colorValue = computedStyle
              .getPropertyValue(`--wp--preset--color--${slug}`)
              .trim();
            if (colorValue && colorValue !== "") {
              colorPalette.push({
                slug: slug,
                color: colorValue,
              });
            }
          });
        }

        // Si toujours pas de couleurs, utiliser les couleurs par défaut
        if (colorPalette.length === 0) {
          colorPalette.push(
            { slug: "primary", color: "#0073aa" },
            { slug: "secondary", color: "#00a0d2" },
            { slug: "accent", color: "#d54e21" },
            { slug: "text", color: "#333333" },
            { slug: "background", color: "#ffffff" }
          );
        }

        // Créer la palette de couleurs
        const paletteContainer = document.createElement("div");
        paletteContainer.className = "components-circular-option-picker";
        paletteContainer.style.display = "flex";
        paletteContainer.style.flexWrap = "wrap";
        paletteContainer.style.gap = "8px";

        // Ajouter les boutons de couleur
        colorPalette.forEach(function (colorItem) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "components-circular-option-picker__option";
          button.style.width = "32px";
          button.style.height = "32px";
          button.style.borderRadius = "50%";
          button.style.border = "2px solid transparent";
          button.style.backgroundColor = colorItem.color;
          button.style.cursor = "pointer";
          button.setAttribute("data-color", colorItem.color);
          button.setAttribute("title", colorItem.color);

          button.addEventListener("click", function () {
            const colorValue = colorItem.color;

            // Appliquer la couleur de bordure au bloc
            const currentStyle = blockWrapper.getAttribute("style") || "";
            const newStyle =
              currentStyle.replace(/--wp--preset--color--border:[^;]+;?/g, "") +
              ` --wp--preset--color--border: ${colorValue};`;
            blockWrapper.setAttribute("style", newStyle.trim());

            // Ajouter la classe has-border-color
            blockWrapper.classList.add("has-border-color");

            // Déclencher l'application des couleurs
            setTimeout(applyColors, 100);
          });

          paletteContainer.appendChild(button);
        });

        colorPickerWrapper.appendChild(paletteContainer);
        borderColorControl.appendChild(colorPickerWrapper);

        // Ajouter le contrôle après les autres contrôles de couleur
        panel.appendChild(borderColorControl);
      });
    }

    /**
     * Modifier le label dans l'interface de l'éditeur
     */
    addFilter(
      "editor.BlockEdit",
      "g2rd/info-element-label-ui",
      function (BlockEdit) {
        return function (props) {
          if (props.name !== "g2rd/info") {
            return createElement(BlockEdit, props);
          }

          // Modifier le label "Link" en "Icône" et ajouter le contrôle de bordure
          useEffect(function () {
            function updateLabels() {
              const selectedBlock = document.querySelector(
                '.block-editor-block-list__block.is-selected[data-type="g2rd/info"]'
              );
              if (!selectedBlock) {
                return;
              }

              const stylePanels = document.querySelectorAll(
                '.block-editor-panel-color-settings, [class*="color-settings"], .components-panel__body[class*="color"]'
              );

              stylePanels.forEach(function (panel) {
                const labels = panel.querySelectorAll(
                  'label, .components-base-control__label, [class*="label"], span[class*="label"]'
                );

                labels.forEach(function (label) {
                  const text = label.textContent || "";
                  if (
                    (text.includes("Link") ||
                      text.includes("Lien") ||
                      text.toLowerCase().includes("link")) &&
                    !text.includes("Icône")
                  ) {
                    const newText = text.replace(
                      /Link|Lien|link/gi,
                      __("Icône", "g2rd-theme")
                    );
                    if (newText !== text) {
                      label.textContent = newText;
                    }
                  }
                });
              });

              // Ajouter le contrôle de couleur de bordure
              addBorderColorControl();
            }

            const timeoutId = setTimeout(updateLabels, 200);
            const observer = new MutationObserver(updateLabels);
            const targetNode = document.querySelector(
              ".interface-complementary-area, .block-editor-block-inspector"
            );

            if (targetNode) {
              observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true,
              });
            }

            return function () {
              clearTimeout(timeoutId);
              observer.disconnect();
            };
          }, []);

          // Appliquer les couleurs (link et border)
          useEffect(function () {
            // S'assurer qu'on est bien dans l'éditeur
            if (!window.wp || !window.wp.blockEditor) {
              return;
            }

            // Fonction pour appliquer avec plusieurs tentatives
            function applyColorsWithRetry(retries = 3) {
              applyColors();

              // Réessayer si nécessaire (pour les blocs chargés dynamiquement)
              if (retries > 0) {
                setTimeout(function () {
                  applyColorsWithRetry(retries - 1);
                }, 500);
              }
            }

            // Appliquer immédiatement avec plusieurs tentatives
            applyColorsWithRetry();

            // Observer les changements dans le DOM
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
                // Délai pour laisser WordPress appliquer ses styles
                setTimeout(applyColors, 100);
              }
            });

            // Observer tous les blocs g2rd/info et leurs conteneurs
            const observeTargets = [
              document.body,
              document.querySelector(".editor-styles-wrapper"),
              document.querySelector(".block-editor-block-list__layout"),
            ].filter(Boolean);

            observeTargets.forEach(function (target) {
              if (target) {
                observer.observe(target, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ["style", "class"],
                });
              }
            });

            // Observer aussi les changements dans le document
            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });

            // Réappliquer plus fréquemment pour s'assurer que la couleur est toujours correcte
            const intervalId = setInterval(applyColors, 1000);

            return function () {
              observer.disconnect();
              if (intervalId) {
                clearInterval(intervalId);
              }
            };
          }, []);

          return createElement(BlockEdit, props);
        };
      },
      20
    );
  } catch (e) {
    console.error("Error initializing G2RD Info Element Label", e);
  }
}
