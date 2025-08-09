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
        add_action('add_meta_boxes', [$this, 'addMetaBox']);
        add_action('save_post_prestations', [$this, 'saveMeta']);
        add_filter('use_block_editor_for_post_type', [$this, 'disableGutenberg'], 10, 2);
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

    /**
     * Ajoute la boîte de métadonnées
     *
     * @since 1.0.2
     * @return void
     */
    public function addMetaBox(): void
    {
        add_meta_box(
            'prestations_details',
            'Détails de la prestation',
            [$this, 'renderMetaBox'],
            'prestations',
            'normal',
            'high'
        );
    }

    /**
     * Affiche la boîte de métadonnées
     *
     * @since 1.0.2
     * @param \WP_Post $post
     * @return void
     */
    public function renderMetaBox($post): void
    {
        // Récupérer les valeurs existantes
        $title_1 = get_post_meta($post->ID, '_prestation_title_1', true);
        $title_2 = get_post_meta($post->ID, '_prestation_title_2', true);
        $title_3 = get_post_meta($post->ID, '_prestation_title_3', true);
        $title_4 = get_post_meta($post->ID, '_prestation_title_4', true);
        $title_5 = get_post_meta($post->ID, '_prestation_title_5', true);

        $description_1 = get_post_meta($post->ID, '_prestation_description_1', true);
        $description_2 = get_post_meta($post->ID, '_prestation_description_2', true);
        $description_3 = get_post_meta($post->ID, '_prestation_description_3', true);
        $description_4 = get_post_meta($post->ID, '_prestation_description_4', true);
        $description_5 = get_post_meta($post->ID, '_prestation_description_5', true);

        $image_1 = get_post_meta($post->ID, '_prestation_image_1', true);
        $image_2 = get_post_meta($post->ID, '_prestation_image_2', true);
        $image_3 = get_post_meta($post->ID, '_prestation_image_3', true);
        $image_4 = get_post_meta($post->ID, '_prestation_image_4', true);
        $image_5 = get_post_meta($post->ID, '_prestation_image_5', true);

        wp_nonce_field('prestations_nonce', 'prestations_nonce');

        // Section 1
        echo '<div class="prestation-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">';
        echo '<h3 style="margin-top: 0;">Section 1</h3>';
        echo '<p><label for="prestation_title_1"><strong>Titre 1 :</strong></label></p>';
        echo '<p><input type="text" id="prestation_title_1" name="prestation_title_1" value="' . esc_attr($title_1) . '" style="width: 100%;" /></p>';
        echo '<p><label for="prestation_description_1"><strong>Description 1 :</strong></label></p>';
        wp_editor($description_1, 'prestation_description_1', [
            'textarea_name' => 'prestation_description_1',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
            'tinymce' => [
                'toolbar1' => 'bold,italic,underline,link,unlink,bullist,numlist',
                'toolbar2' => '',
                'toolbar3' => ''
            ]
        ]);
        echo '<p><label for="prestation_image_1"><strong>Image 1 :</strong></label></p>';
        echo '<div class="image-upload-container">';
        echo '<input type="hidden" id="prestation_image_1" name="prestation_image_1" value="' . esc_attr($image_1) . '" />';
        echo '<button type="button" class="button upload-image-btn" data-target="prestation_image_1">Sélectionner une image</button>';
        echo '<div id="prestation_image_1_preview" class="image-preview" style="margin-top: 10px;">';
        if (!empty($image_1)) {
            echo '<img src="' . esc_url($image_1) . '" style="max-width: 200px; height: auto;" />';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';

        // Section 2
        echo '<div class="prestation-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">';
        echo '<h3 style="margin-top: 0;">Section 2</h3>';
        echo '<p><label for="prestation_title_2"><strong>Titre 2 :</strong></label></p>';
        echo '<p><input type="text" id="prestation_title_2" name="prestation_title_2" value="' . esc_attr($title_2) . '" style="width: 100%;" /></p>';
        echo '<p><label for="prestation_description_2"><strong>Description 2 :</strong></label></p>';
        wp_editor($description_2, 'prestation_description_2', [
            'textarea_name' => 'prestation_description_2',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
            'tinymce' => [
                'toolbar1' => 'bold,italic,underline,link,unlink,bullist,numlist',
                'toolbar2' => '',
                'toolbar3' => ''
            ]
        ]);
        echo '<p><label for="prestation_image_2"><strong>Image 2 :</strong></label></p>';
        echo '<div class="image-upload-container">';
        echo '<input type="hidden" id="prestation_image_2" name="prestation_image_2" value="' . esc_attr($image_2) . '" />';
        echo '<button type="button" class="button upload-image-btn" data-target="prestation_image_2">Sélectionner une image</button>';
        echo '<div id="prestation_image_2_preview" class="image-preview" style="margin-top: 10px;">';
        if (!empty($image_2)) {
            echo '<img src="' . esc_url($image_2) . '" style="max-width: 200px; height: auto;" />';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';

        // Section 3
        echo '<div class="prestation-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">';
        echo '<h3 style="margin-top: 0;">Section 3</h3>';
        echo '<p><label for="prestation_title_3"><strong>Titre 3 :</strong></label></p>';
        echo '<p><input type="text" id="prestation_title_3" name="prestation_title_3" value="' . esc_attr($title_3) . '" style="width: 100%;" /></p>';
        echo '<p><label for="prestation_description_3"><strong>Description 3 :</strong></label></p>';
        wp_editor($description_3, 'prestation_description_3', [
            'textarea_name' => 'prestation_description_3',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
            'tinymce' => [
                'toolbar1' => 'bold,italic,underline,link,unlink,bullist,numlist',
                'toolbar2' => '',
                'toolbar3' => ''
            ]
        ]);
        echo '<p><label for="prestation_image_3"><strong>Image 3 :</strong></label></p>';
        echo '<div class="image-upload-container">';
        echo '<input type="hidden" id="prestation_image_3" name="prestation_image_3" value="' . esc_attr($image_3) . '" />';
        echo '<button type="button" class="button upload-image-btn" data-target="prestation_image_3">Sélectionner une image</button>';
        echo '<div id="prestation_image_3_preview" class="image-preview" style="margin-top: 10px;">';
        if (!empty($image_3)) {
            echo '<img src="' . esc_url($image_3) . '" style="max-width: 200px; height: auto;" />';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';

        // Section 4
        echo '<div class="prestation-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">';
        echo '<h3 style="margin-top: 0;">Section 4</h3>';
        echo '<p><label for="prestation_title_4"><strong>Titre 4 :</strong></label></p>';
        echo '<p><input type="text" id="prestation_title_4" name="prestation_title_4" value="' . esc_attr($title_4) . '" style="width: 100%;" /></p>';
        echo '<p><label for="prestation_description_4"><strong>Description 4 :</strong></label></p>';
        wp_editor($description_4, 'prestation_description_4', [
            'textarea_name' => 'prestation_description_4',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
            'tinymce' => [
                'toolbar1' => 'bold,italic,underline,link,unlink,bullist,numlist',
                'toolbar2' => '',
                'toolbar3' => ''
            ]
        ]);
        echo '<p><label for="prestation_image_4"><strong>Image 4 :</strong></label></p>';
        echo '<div class="image-upload-container">';
        echo '<input type="hidden" id="prestation_image_4" name="prestation_image_4" value="' . esc_attr($image_4) . '" />';
        echo '<button type="button" class="button upload-image-btn" data-target="prestation_image_4">Sélectionner une image</button>';
        echo '<div id="prestation_image_4_preview" class="image-preview" style="margin-top: 10px;">';
        if (!empty($image_4)) {
            echo '<img src="' . esc_url($image_4) . '" style="max-width: 200px; height: auto;" />';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';

        // Section 5
        echo '<div class="prestation-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">';
        echo '<h3 style="margin-top: 0;">Section 5</h3>';
        echo '<p><label for="prestation_title_5"><strong>Titre 5 :</strong></label></p>';
        echo '<p><input type="text" id="prestation_title_5" name="prestation_title_5" value="' . esc_attr($title_5) . '" style="width: 100%;" /></p>';
        echo '<p><label for="prestation_description_5"><strong>Description 5 :</strong></label></p>';
        wp_editor($description_5, 'prestation_description_5', [
            'textarea_name' => 'prestation_description_5',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
            'tinymce' => [
                'toolbar1' => 'bold,italic,underline,link,unlink,bullist,numlist',
                'toolbar2' => '',
                'toolbar3' => ''
            ]
        ]);
        echo '<p><label for="prestation_image_5"><strong>Image 5 :</strong></label></p>';
        echo '<div class="image-upload-container">';
        echo '<input type="hidden" id="prestation_image_5" name="prestation_image_5" value="' . esc_attr($image_5) . '" />';
        echo '<button type="button" class="button upload-image-btn" data-target="prestation_image_5">Sélectionner une image</button>';
        echo '<div id="prestation_image_5_preview" class="image-preview" style="margin-top: 10px;">';
        if (!empty($image_5)) {
            echo '<img src="' . esc_url($image_5) . '" style="max-width: 200px; height: auto;" />';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';

        // Script JavaScript pour l'upload d'images
        echo '<script>
        jQuery(function($) {
            $(".upload-image-btn").on("click", function() {
                const button = $(this);
                const target = button.data("target");
                const input = $("#" + target);
                const preview = $("#" + target + "_preview");
                
                const frame = wp.media({
                    title: "Sélectionner une image",
                    button: {
                        text: "Utiliser cette image"
                    },
                    multiple: false
                });
                
                frame.on("select", function() {
                    const attachment = frame.state().get("selection").first().toJSON();
                    input.val(attachment.url);
                    preview.html("<img src=\"" + attachment.url + "\" style=\"max-width: 200px; height: auto;\" />");
                });
                
                frame.open();
            });
        });
        </script>';
    }

    /**
     * Sauvegarde les métadonnées
     *
     * @since 1.0.2
     * @param int $post_id
     * @return void
     */
    public function saveMeta($post_id): void
    {
        if (!isset($_POST['prestations_nonce']) || !wp_verify_nonce($_POST['prestations_nonce'], 'prestations_nonce')) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Sauvegarder les titres
        $title_fields = [
            'prestation_title_1' => '_prestation_title_1',
            'prestation_title_2' => '_prestation_title_2',
            'prestation_title_3' => '_prestation_title_3',
            'prestation_title_4' => '_prestation_title_4',
            'prestation_title_5' => '_prestation_title_5'
        ];

        foreach ($title_fields as $field => $meta_key) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$field]));
            }
        }

        // Sauvegarder les descriptions
        $description_fields = [
            'prestation_description_1' => '_prestation_description_1',
            'prestation_description_2' => '_prestation_description_2',
            'prestation_description_3' => '_prestation_description_3',
            'prestation_description_4' => '_prestation_description_4',
            'prestation_description_5' => '_prestation_description_5'
        ];

        foreach ($description_fields as $field => $meta_key) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $meta_key, wp_kses_post($_POST[$field]));
            }
        }

        // Sauvegarder les images
        $image_fields = [
            'prestation_image_1' => '_prestation_image_1',
            'prestation_image_2' => '_prestation_image_2',
            'prestation_image_3' => '_prestation_image_3',
            'prestation_image_4' => '_prestation_image_4',
            'prestation_image_5' => '_prestation_image_5'
        ];

        foreach ($image_fields as $field => $meta_key) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $meta_key, esc_url_raw($_POST[$field]));
            }
        }
    }

    /**
     * Désactive l'éditeur Gutenberg pour le type de contenu Prestations
     *
     * @since 1.0.2
     * @param bool $use_block_editor
     * @param string $post_type
     * @return bool
     */
    public function disableGutenberg($use_block_editor, $post_type): bool
    {
        if ($post_type === 'prestations') {
            return false;
        }
        return $use_block_editor;
    }
}
