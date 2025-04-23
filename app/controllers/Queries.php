<?php
namespace G2RD\Controllers;

// Importer les fonctions WordPress
use function add_action;
use function is_admin;
use function is_singular;
use function get_the_ID;
use function wp_get_post_categories;

class Queries {
    public static function register() {
        add_action('pre_get_posts', [self::class, 'related_posts_query']);
    }

    public static function related_posts_query($wp_query) {
        if (!is_admin() && !$wp_query->is_main_query() && is_singular('post')) {
            // Récupérer l'ID de l'article actuel
            $current_post_id = get_the_ID();

            // Récupérer les ID de catégories de l'article actuel
            $current_post_cats = wp_get_post_categories($current_post_id, ['fields' => 'ids']);
            
            // Ignorer l'article actuel
            $wp_query->set('post__not_in', [$current_post_id]);
            
            // Inclure uniquement les articles des mêmes catégories que l'article
            $wp_query->set('cat', $current_post_cats);
        }
    }
} 