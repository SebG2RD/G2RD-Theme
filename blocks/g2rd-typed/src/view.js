document.addEventListener("DOMContentLoaded", function () {
  const typedBlocks = document.querySelectorAll(".g2rd-typed");

  typedBlocks.forEach((block) => {
    const typedElement = block.querySelector("#typed");
    const stringsElement = block.querySelector("#typed-strings");
    const configData = block.getAttribute("data-typed-config");

    if (!typedElement || !stringsElement || !configData) {
      return;
    }

    try {
      const config = JSON.parse(configData);

      // Typed.js est chargé via wp_enqueue_script depuis les fichiers locaux du thème
      // Vérifier si Typed.js est déjà disponible, sinon attendre qu'il soit chargé
      if (typeof Typed !== "undefined") {
        // Typed.js est déjà chargé, initialiser directement
        initializeTyped(typedElement, stringsElement, config);
      } else {
        // Attendre que Typed.js soit chargé par WordPress
        // Le script est enregistré avec wp_enqueue_script, donc il sera chargé automatiquement
        const checkTyped = setInterval(() => {
          if (typeof Typed !== "undefined") {
            clearInterval(checkTyped);
            initializeTyped(typedElement, stringsElement, config);
          }
        }, 50);

        // Timeout de sécurité après 5 secondes
        setTimeout(() => {
          clearInterval(checkTyped);
          if (typeof Typed !== "undefined") {
            initializeTyped(typedElement, stringsElement, config);
          } else {
            console.error("Typed.js n'a pas pu être chargé");
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Typed.js:", error);
    }
  });

  function initializeTyped(typedElement, stringsElement, config) {
    const typedConfig = {
      stringsElement: stringsElement,
      typeSpeed: config.typeSpeed || 70,
      backSpeed: config.backSpeed || 35,
      loop: config.loop !== undefined ? config.loop : true,
      startDelay: config.startDelay || 0,
      backDelay: config.backDelay || 500,
      fadeOut: config.fadeOut || false,
      fadeOutClass: config.fadeOutClass || "typed-fade-out",
      fadeOutDelay: config.fadeOutDelay || 500,
      smartBackspace:
        config.smartBackspace !== undefined ? config.smartBackspace : true,
      shuffle: config.shuffle || false,
      showCursor: config.showCursor !== undefined ? config.showCursor : true,
      cursorChar: config.cursorChar || "|",
      autoInsertCss:
        config.autoInsertCss !== undefined ? config.autoInsertCss : true,
      attr: config.attr || "",
      bindInputFocusEvents: config.bindInputFocusEvents || false,
      contentType: config.contentType || "html",
    };

    new Typed(typedElement, typedConfig);
  }
});
