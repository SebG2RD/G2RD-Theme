jQuery(document).ready(function ($) {
  // Gérer l'affichage/masquage du mot de passe
  $(".toggle-password").on("click", function (e) {
    e.preventDefault();
    const container = $(this).closest(".password-container");
    const passwordMask = container.find(".password-mask");
    const password = passwordMask.data("password");

    if (passwordMask.text() === "••••••••") {
      passwordMask.text(password);
      $(this).removeClass("dashicons-visibility").addClass("dashicons-hidden");
    } else {
      passwordMask.text("••••••••");
      $(this).removeClass("dashicons-hidden").addClass("dashicons-visibility");
    }
  });

  // Gérer le clic sur le masque de mot de passe
  $(".password-mask").on("click", function () {
    $(this).closest(".password-container").find(".toggle-password").click();
  });

  // Gérer le double-clic sur le mot de passe pour le copier
  $(".password-mask").on("dblclick", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const passwordElement = $(this);
    const password = passwordElement.data("password");

    if (password) {
      // Sauvegarder l'état actuel pour le restaurer après feedback
      const originalText = passwordElement.text();
      const wasVisible = originalText !== "••••••••";

      // Fonction pour afficher le feedback visuel
      function showCopyFeedback() {
        passwordElement.addClass("copied").text("Copié !");

        setTimeout(() => {
          passwordElement.removeClass("copied");
          if (wasVisible) {
            passwordElement.text(password);
          } else {
            passwordElement.text("••••••••");
          }
        }, 1000);
      }

      // Utiliser l'API Clipboard moderne si disponible
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(password)
          .then(showCopyFeedback)
          .catch((error) => {
            console.error("Erreur lors de la copie :", error);
            // Utiliser la méthode de fallback en cas d'erreur
            copyWithFallback();
          });
      } else {
        // Méthode de fallback pour les navigateurs plus anciens
        copyWithFallback();
      }

      // Fonction de fallback utilisant document.execCommand
      function copyWithFallback() {
        const tempInput = $("<input>");
        $("body").append(tempInput);
        tempInput.val(password).select();
        const success = document.execCommand("copy");
        tempInput.remove();

        if (success) {
          showCopyFeedback();
        }
      }
    }
  });
});
