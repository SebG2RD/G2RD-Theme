<?php
/**
 * G2RD Theme
 * 
 * Point d'entrée principal du thème
 * Ce fichier charge et initialise tous les composants MVC du thème
 */

// Importer les fonctions WordPress nécessaires
use function add_action;
use function get_template_directory;

// Importer les classes nécessaires
require_once get_template_directory() . '/app/models/PostTypes.php';
require_once get_template_directory() . '/app/models/PluginMeta.php';
require_once get_template_directory() . '/app/controllers/LoginCustomizer.php';
require_once get_template_directory() . '/app/controllers/AdminCustomizer.php';

use G2RD\Models\PostTypes;
use G2RD\Models\PluginMeta;
use G2RD\Controllers\LoginCustomizer;
use G2RD\Controllers\AdminCustomizer;

// Charger les fichiers MVC
$mvc_files = [
    '/app/models/PostTypes.php',
    '/app/controllers/Assets.php',
    '/app/controllers/Patterns.php',
    '/app/controllers/Queries.php',
    '/app/controllers/Theme.php',
    '/app/controllers/LoginCustomizer.php',
    '/app/controllers/AdminCustomizer.php'
];

foreach ($mvc_files as $file) {
    require_once get_template_directory() . $file;
}

/**
 * Initialiser les composants du thème
 */
function g2rd_init() {
    // Initialiser les modèles
    PostTypes::register();

    // Initialiser les contrôleurs
    G2RD\Controllers\Assets::register();
    G2RD\Controllers\Patterns::register();
    G2RD\Controllers\Queries::register();
    G2RD\Controllers\Theme::register();
    LoginCustomizer::register();
    AdminCustomizer::register();
    
    // Réactiver les champs personnalisés natifs
    add_action('do_meta_boxes', 'g2rd_restore_custom_fields');
}

/**
 * Restaure les champs personnalisés natifs de WordPress
 */
function g2rd_restore_custom_fields() {
    $post_types = ['post', 'page', 'site_web', 'plugin'];
    
    foreach ($post_types as $post_type) {
        // Assurer que la meta box des champs personnalisés est affichée
        add_meta_box(
            'postcustom',
            'Champs personnalisés',
            'post_custom_meta_box',
            $post_type,
            'normal',
            'high'
        );
    }
    
    // S'assurer que la meta box des champs personnalisés n'est pas cachée par défaut
    add_filter('default_hidden_meta_boxes', function($hidden, $screen) {
        return array_diff($hidden, ['postcustom']);
    }, 10, 2);
}

// Initialiser le thème
add_action('init', 'g2rd_init');

// Supprimer tout le reste du fichier à partir d'ici




