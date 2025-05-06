document.addEventListener("DOMContentLoaded", function () {
  // Sélectionne tous les éléments avec la classe h-article
  const articles = document.querySelectorAll(".h-article");

  articles.forEach(function (article) {
    // Trouve le premier lien à l'intérieur de l'article
    const link = article.querySelector("a");

    if (link) {
      // Ajoute un écouteur de clic à tout l'article
      article.addEventListener("click", function (e) {
        // Si on n'a pas cliqué directement sur un lien ou un bouton
        if (!e.target.closest("a") && !e.target.closest("button")) {
          // On simule un clic sur le premier lien
          link.click();
        }
      });
    }
  });
});
