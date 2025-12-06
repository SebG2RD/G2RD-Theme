/**
 * Gestion du mode sombre (Dark Mode)
 *
 * Ce script gère:
 * - La détection de la préférence système (prefers-color-scheme)
 * - Le toggle manuel via un bouton
 * - La sauvegarde de la préférence dans localStorage
 * - L'application de la classe CSS pour le dark mode
 */

(function () {
  "use strict";

  // Configuration
  const STORAGE_KEY = "g2rd_dark_mode";
  const BODY_CLASS = "dark-mode-active";
  const THEME_VARIATION_CLASS = "is-style-dark";

  /**
   * Classe principale pour gérer le dark mode
   */
  class DarkModeManager {
    constructor() {
      // État actuel du dark mode
      this.isDarkMode = false;

      // Initialiser le dark mode au chargement
      this.init();
    }

    /**
     * Initialise le dark mode
     * Vérifie d'abord localStorage, puis la préférence système
     */
    init() {
      // Vérifier si une préférence est sauvegardée
      const savedPreference = localStorage.getItem(STORAGE_KEY);

      if (savedPreference === "enabled") {
        this.enableDarkMode();
      } else if (savedPreference === "disabled") {
        this.disableDarkMode();
      } else {
        // Si aucune préférence sauvegardée, utiliser la préférence système
        this.followSystemPreference();
      }

      // Créer le bouton toggle si nécessaire
      this.createToggleButton();

      // Écouter les changements de préférence système
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", () => {
          // Seulement si l'utilisateur n'a pas fait de choix manuel
          if (!localStorage.getItem(STORAGE_KEY)) {
            this.followSystemPreference();
          }
        });
      }
    }

    /**
     * Active le mode sombre
     */
    enableDarkMode() {
      this.isDarkMode = true;
      document.body.classList.add(BODY_CLASS);

      // Appliquer la variation de thème WordPress si disponible
      const htmlElement = document.documentElement;
      if (htmlElement) {
        htmlElement.setAttribute("data-theme", "dark");
      }

      // Sauvegarder la préférence
      localStorage.setItem(STORAGE_KEY, "enabled");

      // Mettre à jour le bouton toggle
      this.updateToggleButton();
    }

    /**
     * Désactive le mode sombre
     */
    disableDarkMode() {
      this.isDarkMode = false;
      document.body.classList.remove(BODY_CLASS);

      // Retirer la variation de thème
      const htmlElement = document.documentElement;
      if (htmlElement) {
        htmlElement.removeAttribute("data-theme");
      }

      // Sauvegarder la préférence
      localStorage.setItem(STORAGE_KEY, "disabled");

      // Mettre à jour le bouton toggle
      this.updateToggleButton();
    }

    /**
     * Suit la préférence système
     */
    followSystemPreference() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    }

    /**
     * Bascule entre dark mode et light mode
     */
    toggle() {
      if (this.isDarkMode) {
        this.disableDarkMode();
      } else {
        this.enableDarkMode();
      }
    }

    /**
     * Crée le bouton toggle pour le dark mode
     */
    createToggleButton() {
      // Vérifier si le bouton existe déjà
      if (document.getElementById("g2rd-dark-mode-toggle")) {
        return;
      }

      // Créer le bouton
      const button = document.createElement("button");
      button.id = "g2rd-dark-mode-toggle";
      button.className = "g2rd-dark-mode-toggle";
      button.setAttribute("aria-label", "Basculer le mode sombre");
      button.innerHTML = this.getToggleIcon();

      // Ajouter l'événement de clic
      button.addEventListener("click", () => {
        this.toggle();
      });

      // Ajouter le bouton au body (vous pouvez modifier l'emplacement)
      // Option 1: Ajouter au début du body
      document.body.insertBefore(button, document.body.firstChild);

      // Option 2: Ajouter à un élément spécifique (décommentez si nécessaire)
      // const header = document.querySelector('header');
      // if (header) {
      //     header.appendChild(button);
      // }
    }

    /**
     * Met à jour l'icône du bouton toggle
     */
    updateToggleButton() {
      const button = document.getElementById("g2rd-dark-mode-toggle");
      if (button) {
        button.innerHTML = this.getToggleIcon();
      }
    }

    /**
     * Retourne l'icône appropriée selon l'état
     * Utilise les Dashicons WordPress pour être cohérent avec le thème
     */
    getToggleIcon() {
      if (this.isDarkMode) {
        // Icône soleil (lightbulb) pour désactiver le dark mode
        return '<span class="dashicons dashicons-lightbulb" aria-hidden="true"></span>';
      } else {
        // Icône lune (admin-appearance) pour activer le dark mode
        return '<span class="dashicons dashicons-admin-appearance" aria-hidden="true"></span>';
      }
    }
  }

  // Initialiser le dark mode quand le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new DarkModeManager();
    });
  } else {
    new DarkModeManager();
  }
})();
