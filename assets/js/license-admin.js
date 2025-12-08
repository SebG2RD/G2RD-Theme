/**
 * Script d'administration pour la gestion des licences G2RD
 *
 * @package G2RD
 * @since 1.0.0
 */

jQuery(document).ready(function ($) {
  // Vérification de la licence
  $("#verify-license-btn").on("click", function () {
    var $btn = $(this);
    var $result = $("#verify-license-result");

    // Désactiver le bouton et afficher le message de chargement
    $btn.prop("disabled", true).text(g2rdLicense.strings.verifying);
    $result.html(
      '<span style="color: blue;">' + g2rdLicense.strings.verifying + "</span>"
    );

    // Appel AJAX
    $.ajax({
      url: g2rdLicense.ajaxUrl,
      type: "POST",
      data: {
        action: "g2rd_verify_license",
        nonce: g2rdLicense.nonce,
      },
      success: function (response) {
        if (response.success) {
          $result.html(
            '<span style="color: green;">✓ ' + response.data.message + "</span>"
          );
          // Recharger la page après 2 secondes pour mettre à jour le statut
          setTimeout(function () {
            location.reload();
          }, 2000);
        } else {
          $result.html(
            '<span style="color: red;">✗ ' + response.data.message + "</span>"
          );
        }
      },
      error: function (xhr, status, error) {
        $result.html(
          '<span style="color: red;">✗ ' +
            g2rdLicense.strings.error +
            ": " +
            error +
            "</span>"
        );
      },
      complete: function () {
        // Réactiver le bouton
        $btn.prop("disabled", false).text("Vérifier la licence maintenant");
      },
    });
  });

  // Gestion des toggles CPT
  $(".g2rd-toggle-switch input[type='checkbox']").on("change", function () {
    var $toggle = $(this);
    var cpt = $toggle.data("cpt");
    var enabled = $toggle.is(":checked") ? "1" : "0";
    var $status = $("#cpt-" + cpt + "-status");
    var $nameSection = $("#cpt-" + cpt + "-name-section");
    var $nameInput = $("#cpt-" + cpt + "-name");
    var currentName = $nameInput.val().trim();

    // Si on essaie d'activer, vérifier que le nom est défini
    if (enabled === "1" && currentName === "") {
      // Réactiver le toggle
      $toggle.prop("checked", false);
      // Mettre en évidence le champ nom
      $nameInput
        .focus()
        .css("border-color", "#d63638")
        .css("box-shadow", "0 0 0 1px #d63638");
      $status
        .removeClass("success")
        .addClass("error")
        .html(
          '<span class="dashicons dashicons-warning" style="vertical-align: middle; margin-right: 4px;"></span>Vous devez d\'abord définir un nom pour ce type de contenu'
        );
      setTimeout(function () {
        $nameInput.css("border-color", "").css("box-shadow", "");
      }, 3000);
      return;
    }

    // Afficher le message de sauvegarde avec icône
    $status
      .removeClass("success error")
      .html(
        '<span class="dashicons dashicons-update" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 4px;"></span>' +
          g2rdLicense.strings.saving
      );

    // Désactiver le toggle pendant la sauvegarde
    $toggle.prop("disabled", true);

    // Appel AJAX
    $.ajax({
      url: g2rdLicense.ajaxUrl,
      type: "POST",
      data: {
        action: "g2rd_toggle_cpt",
        nonce: g2rdLicense.nonce,
        cpt: cpt,
        enabled: enabled,
      },
      success: function (response) {
        if (response.success) {
          $status
            .removeClass("error")
            .addClass("success")
            .html(
              '<span class="dashicons dashicons-yes-alt" style="vertical-align: middle; margin-right: 4px;"></span>' +
                response.data.message
            );
          // Recharger la page après 1 seconde pour que les changements prennent effet
          setTimeout(function () {
            location.reload();
          }, 1000);
        } else {
          $status
            .removeClass("success")
            .addClass("error")
            .html(
              '<span class="dashicons dashicons-warning" style="vertical-align: middle; margin-right: 4px;"></span>' +
                (response.data.message || g2rdLicense.strings.errorSaving)
            );
          // Réactiver le toggle et inverser l'état en cas d'erreur
          $toggle.prop("checked", !$toggle.prop("checked"));
          $toggle.prop("disabled", false);
        }
      },
      error: function (xhr, status, error) {
        $status
          .removeClass("success")
          .addClass("error")
          .html(
            '<span class="dashicons dashicons-warning" style="vertical-align: middle; margin-right: 4px;"></span>' +
              g2rdLicense.strings.errorSaving +
              ": " +
              error
          );
        // Réactiver le toggle et inverser l'état en cas d'erreur
        $toggle.prop("checked", !$toggle.prop("checked"));
        $toggle.prop("disabled", false);
      },
    });
  });

  // Gestion de la sauvegarde des noms de CPT
  $(".g2rd-save-cpt-name").on("click", function () {
    var $btn = $(this);
    var cpt = $btn.data("cpt");
    var $input = $("#cpt-" + cpt + "-name");
    var $status = $("#cpt-" + cpt + "-name-status");
    var name = $input.val().trim();

    // Vérifier que le nom n'est pas vide
    if (name === "") {
      $status
        .removeClass("success")
        .addClass("error")
        .html("✗ " + "Le nom ne peut pas être vide");
      return;
    }

    // Afficher le message de sauvegarde avec icône
    $status
      .removeClass("success error")
      .html(
        '<span class="dashicons dashicons-update" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 4px;"></span>' +
          g2rdLicense.strings.saving
      );

    // Désactiver le bouton pendant la sauvegarde
    $btn.prop("disabled", true).addClass("button-disabled");

    // Appel AJAX
    $.ajax({
      url: g2rdLicense.ajaxUrl,
      type: "POST",
      data: {
        action: "g2rd_save_cpt_name",
        nonce: g2rdLicense.nonce,
        cpt: cpt,
        name: name,
      },
      success: function (response) {
        if (response.success) {
          $status
            .removeClass("error")
            .addClass("success")
            .html(
              '<span class="dashicons dashicons-yes-alt" style="vertical-align: middle; margin-right: 4px;"></span>' +
                response.data.message
            );
          // Mettre à jour le header avec le nouveau nom
          var $headerName = $("#cpt-" + cpt + "-header-name");
          if ($headerName.length) {
            $headerName.text(response.data.name);
          }
          // Recharger la page après 1 seconde pour que les changements prennent effet
          setTimeout(function () {
            location.reload();
          }, 1000);
        } else {
          $status
            .removeClass("success")
            .addClass("error")
            .html(
              '<span class="dashicons dashicons-warning" style="vertical-align: middle; margin-right: 4px;"></span>' +
                (response.data.message || g2rdLicense.strings.nameError)
            );
          $btn.prop("disabled", false).removeClass("button-disabled");
        }
      },
      error: function (xhr, status, error) {
        $status
          .removeClass("success")
          .addClass("error")
          .html(
            '<span class="dashicons dashicons-warning" style="vertical-align: middle; margin-right: 4px;"></span>' +
              g2rdLicense.strings.nameError +
              ": " +
              error
          );
        $btn.prop("disabled", false).removeClass("button-disabled");
      },
    });
  });

  // Permettre la sauvegarde avec la touche Entrée dans les champs de nom
  $(".g2rd-cpt-name-input").on("keypress", function (e) {
    if (e.which === 13) {
      // Touche Entrée
      e.preventDefault();
      $(this).siblings(".g2rd-save-cpt-name").click();
    }
  });
});
