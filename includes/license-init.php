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

// Inclure les classes nécessaires
require_once get_template_directory() . '/classes/class-surecart-license-manager.php';
require_once get_template_directory() . '/classes/class-github-updater.php';

// Enregistrer les paramètres (clé API)
add_action('admin_init', function() {
    register_setting('g2rd_license', 'g2rd_surecart_api_key');
});

// Clé API SureCart (à configurer dans les paramètres du thème)
$surecart_api_key = get_option('g2rd_surecart_api_key');

// Initialiser le gestionnaire de licences
$license_manager = new \G2RD\SureCartLicenseManager($surecart_api_key);

// Initialiser le gestionnaire de mises à jour
$github_updater = new \G2RD\GitHubUpdater($license_manager); 