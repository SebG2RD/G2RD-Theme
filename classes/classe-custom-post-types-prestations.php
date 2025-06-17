<?php
/**
 * Gestion du type de contenu personnalisé Prestations
 * 
 * Cette classe gère l'enregistrement et la configuration du type de contenu Prestations.
 *
 * @package G2RD
 * @since 1.0.2
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Classe CPT_Prestations
 * 
 * Gère le type de contenu personnalisé Prestations et ses taxonomies.
 */
class CPT_Prestations
{
    /**
     * Enregistre les hooks nécessaires
     *
     * @since 1.0.2
     * @return void
     */
    public function registerHooks(): void
    {
        add_action('init', [$this, 'registerPostType']);
    }

    /**
     * Enregistre le type de contenu Prestations
     *
     * @since 1.0.2
     * @return void
     */
    public function registerPostType(): void
    {
        $labels = [
            'name' => 'Prestations',
            'all_items' => 'Toutes les prestations',
            'singular_name' => 'Prestation',
            'add_new_item' => 'Ajouter une prestation',
            'edit_item' => 'Modifier la prestation',
            'menu_name' => 'Prestations'
        ];
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => true,
            'supports' => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'revisions',
                'custom-fields',
                'page-attributes'
            ],
            'menu_position' => 6,
            'menu_icon' => 'dashicons-clipboard',
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'hierarchical' => false,
            'rewrite' => ['slug' => 'prestations'],
            'query_var' => true,
            'show_in_nav_menus' => true,
            'show_in_admin_bar' => true,
            'rest_base' => 'prestations',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
            'show_in_graphql' => true,
        ];
        register_post_type('prestations', $args);
        // Taxonomies associées
        $labels = [
            'name' => 'Catégories de prestations',
            'singular_name' => 'Catégorie de prestation',
            'add_new_item' => 'Ajouter une catégorie',
            'new_item_name' => 'Nom de la nouvelle catégorie',
            'parent_item' => 'Catégorie parente',
        ];
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
            'rewrite' => ['slug' => 'categories-prestations'],
            'show_admin_column' => true,
        ];
        register_taxonomy('categories-prestations', 'prestations', $args);
    }
} 