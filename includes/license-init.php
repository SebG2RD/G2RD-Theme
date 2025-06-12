<?php

/**
 * Initialisation du système de licences
 *
 * Ce fichier initialise et configure le système de licences
 * pour le thème G2RD.
 *
 * @package G2RD
 * @since 1.0.2
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

// Enregistrer les paramètres (clé API)
add_action('admin_init', function() {
    register_setting('g2rd_license', 'g2rd_surecart_api_key');
});

// La gestion de l'initialisation du gestionnaire de licence et du gestionnaire de mises à jour
// est désormais centralisée dans functions.php pour éviter les doublons. 