<?php
// Retirer les accents des noms de fichiers
add_filter('sanitize_file_name', 'remove_accents');

// Déclarer les scripts et les styles
function g2rd_register_assets() {
    // Charger la feuille style.css du thème
    wp_enqueue_style('main', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));

}
add_action('wp_enqueue_scripts', 'g2rd_register_assets');
?>

