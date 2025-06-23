document.addEventListener("DOMContentLoaded", () => {
  const toggleBlocks = document.querySelectorAll(
    ".wp-block-g2rd-toggle-content"
  );

  toggleBlocks.forEach((block) => {
    // Ne pas ajouter de switch si on est dans l'éditeur (iframe)
    if (block.closest('iframe[name="editor-canvas"]')) {
      return;
    }

    const toggleSwitch = document.createElement("div");
    toggleSwitch.className = "toggle-switch";
    toggleSwitch.innerHTML = `
      <span>Contenu Droite</span>
      <label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
      </label>
      <span>Contenu Gauche</span>
    `;

    // Insérer l'interrupteur avant le bloc lui-même
    block.parentNode?.insertBefore(toggleSwitch, block);

    /** @type {HTMLInputElement | null} */
    const checkbox = toggleSwitch.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    // Cocher la case si 'show-left' est la classe par défaut
    checkbox.checked = block.classList.contains("show-left");

    checkbox.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;

      if (target.checked) {
        block.classList.add("show-left");
        block.classList.remove("show-right");
      } else {
        block.classList.add("show-right");
        block.classList.remove("show-left");
      }
    });

    // Initial state based on checkbox
    if (checkbox.checked) {
      block.classList.add("show-left");
      block.classList.remove("show-right");
    } else {
      block.classList.add("show-right");
      block.classList.remove("show-left");
    }
  });
});
