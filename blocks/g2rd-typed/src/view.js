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

      // Charger Typed.js depuis CDN si pas déjà chargé
      if (typeof Typed === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/typed.js@2.0.12";
        script.onload = () => {
          initializeTyped(typedElement, stringsElement, config);
        };
        document.head.appendChild(script);
      } else {
        initializeTyped(typedElement, stringsElement, config);
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
