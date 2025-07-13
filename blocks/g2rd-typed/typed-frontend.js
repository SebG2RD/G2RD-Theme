document.addEventListener("DOMContentLoaded", function () {
  if (typeof Typed !== "function") return;
  var animated = document.querySelector(".g2rd-typed-animated");
  if (!animated) return;
  var stringsEl = animated.querySelector("#typed-strings");
  var typedEl = animated.querySelector("#typed");
  if (!stringsEl || !typedEl) return;

  // Récupère les options depuis les data-attributes
  var typeSpeed = parseInt(animated.getAttribute("data-type-speed")) || 70;
  var backSpeed = parseInt(animated.getAttribute("data-back-speed")) || 35;
  var loop = animated.getAttribute("data-loop") === "true";
  var showCursor = animated.getAttribute("data-show-cursor") !== "false";
  var typedColor = animated.getAttribute("data-typed-color") || "#1a1a1a";

  // Applique la couleur si précisé
  typedEl.style.color = typedColor;

  new Typed(typedEl, {
    stringsElement: stringsEl,
    typeSpeed: typeSpeed,
    backSpeed: backSpeed,
    loop: loop,
    showCursor: showCursor,
  });
});
