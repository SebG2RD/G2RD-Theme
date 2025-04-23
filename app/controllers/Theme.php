<?php
namespace G2RD\Controllers;

// Importer les fonctions WordPress
use function add_filter;
use function remove_accents;

class Theme {
    public static function register() {
        // Retirer les accents des noms de fichiers
        add_filter('sanitize_file_name', 'remove_accents');
        
        // Définir le contenu par défaut des publications du Portfolio
        add_filter('default_content', [self::class, 'add_default_content'], 10, 2);
    }
    
    /**
     * Définir le contenu par défaut des publications du Portfolio
     */
    public static function add_default_content($content, $post) {
        if ($post->post_type === 'site_web') {
            $content = '<!-- wp:pattern  { "slug":"mon-pattern" } /-->';
        }
        return $content;
    }
} 