<?php

/**
 * Gestion des types de contenu personnalisés
 * 
 * Cette classe gère la création et la configuration des types de contenu
 * personnalisés (CPT) et leurs taxonomies associées. Elle inclut également
 * la gestion des métadonnées personnalisées et des shortcodes pour l'affichage
 * des données dans les templates.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Gestion des types de contenu personnalisés (CPT) et taxonomies
 * 
 * Cette classe gère la création et la configuration des types de contenu personnalisés,
 * notamment le portfolio, les prestations et la section "Qui sommes nous", ainsi que
 * leurs taxonomies associées et métadonnées. Elle utilise les classes natives de WordPress
 * pour l'interface d'administration.
 *
 * @package G2RD
 * @since 1.0.0
 */
class CPT
{
    /**
     * Enregistre tous les hooks nécessaires pour les CPT
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        add_action('init', [$this, 'registerPostTypes']);
        add_action('add_meta_boxes', [$this, 'addPortfolioMetaBox']);
        add_action('add_meta_boxes', [$this, 'addQuiSommesNousMetaBox']);
        add_action('save_post_portfolio', [$this, 'savePortfolioMeta']);
        add_action('save_post_qui-sommes-nous', [$this, 'saveQuiSommesNousMeta']);
        add_filter('use_block_editor_for_post_type', [$this, 'disableGutenbergForCPT'], 10, 2);
        add_action('init', [$this, 'registerBindingSources']);
    }

    /**
     * Désactive l'éditeur Gutenberg pour certains types de contenu
     *
     * @since 1.0.0
     * @param bool $use_block_editor État actuel de l'éditeur de blocs
     * @param string $post_type Type de contenu
     * @return bool État modifié de l'éditeur de blocs
     */
    public function disableGutenbergForCPT($use_block_editor, $post_type): bool
    {
        $disabled_types = ['portfolio', 'prestations', 'qui-sommes-nous'];
        if (in_array($post_type, $disabled_types)) {
            return false;
        }
        return $use_block_editor;
    }

    /**
     * Enregistre les types de contenu personnalisés et leurs taxonomies
     *
     * @since 1.0.0
     * @return void
     */
    public function registerPostTypes(): void
    {
        # CPT « Portfolio »
        $labels = [
            'name' => 'Portfolio',
            'all_items' => 'Tous les projets',
            'singular_name' => 'Projet',
            'add_new_item' => 'Ajouter un projet',
            'edit_item' => 'Modifier le projet',
            'menu_name' => 'Portfolio'
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields', 'excerpt', 'tags'],
            'menu_position' => 5,
            'menu_icon' => 'dashicons-admin-appearance',
        ];

        register_post_type('portfolio', $args);

        # CPT « Prestations »
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
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields'],
            'menu_position' => 6,
            'menu_icon' => 'dashicons-clipboard',
        ];

        register_post_type('prestations', $args);

        # Taxonomy « Type de projets »
        $labels = [
            'name' => 'Types de projets',
            'singular_name' => 'Type de projet',
            'add_new_item' => 'Ajouter un Type de Projet',
            'new_item_name' => 'Nom du nouveau Projet',
            'parent_item' => 'Type de projet parent',
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
        ];

        register_taxonomy('type-projets', 'portfolio', $args);

        # Taxonomy « Qui ? »
        $labels = [
            'name' => 'Qui ?',
            'singular_name' => 'Qui ?',
            'add_new_item' => 'Ajouter un Qui ?',
            'new_item_name' => 'Nom du nouveau Qui ?',
            'parent_item' => 'Qui ? parent',
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => false, // Non hiérarchique car les technologies n'ont pas besoin d'être organisées en catégories
        ];

        register_taxonomy('technologies', 'portfolio', $args);

        # Taxonomy « Catégories de prestations »
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
        ];

        register_taxonomy('categories-prestations', 'prestations', $args);

        # CPT « Qui sommes nous ? »
        $labels = [
            'name' => 'Qui sommes nous',
            'all_items' => 'Les membres de l\'équipe',
            'singular_name' => 'Membre',
            'add_new_item' => 'Ajouter un membre',
            'edit_item' => 'Modifier le membre',
            'menu_name' => 'Qui sommes nous'
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields', 'excerpt'],
            'menu_position' => 7,
            'menu_icon' => 'dashicons-groups',
        ];

        register_post_type('qui-sommes-nous', $args);

        # Taxonomy « Catégories Qui sommes nous ? »
        $labels = [
            'name' => 'Métiers',
            'singular_name' => 'Métier',
            'add_new_item' => 'Ajouter un métier',
            'new_item_name' => 'Nom du nouveau métier',
            'parent_item' => 'Métier parent',
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
        ];

        register_taxonomy('categories-qui-sommes-nous', 'qui-sommes-nous', $args);
    }

    /**
     * Ajoute une boîte de métadonnées pour le lien du portfolio
     *
     * @since 1.0.0
     * @return void
     */
    public function addPortfolioMetaBox(): void
    {
        add_meta_box(
            'portfolio_link', // ID unique
            'Lien du projet', // Titre de la boîte
            [$this, 'renderPortfolioLinkMetaBox'], // Fonction de rendu
            'portfolio', // Type de post
            'normal', // Contexte
            'high' // Priorité
        );
    }

    /**
     * Affiche le champ de lien dans la boîte de métadonnées
     *
     * @since 1.0.0
     * @param \WP_Post $post L'objet post actuel
     * @return void
     */
    public function renderPortfolioLinkMetaBox($post): void
    {
        // Récupérer la valeur existante du lien
        $link = get_post_meta($post->ID, '_portfolio_link', true);

        // Ajouter un champ nonce pour la sécurité
        wp_nonce_field('portfolio_link_nonce', 'portfolio_link_nonce');

        // Afficher le champ de saisie
        echo '<p><label for="portfolio_link">URL du projet :</label></p>';
        echo '<p><input type="url" id="portfolio_link" name="portfolio_link" value="' . esc_url($link) . '" style="width: 100%;" /></p>';
        echo '<p class="description">Entrez l\'URL complète du projet (ex: https://www.exemple.com)</p>';
    }

    /**
     * Sauvegarde le lien du portfolio en base de données
     *
     * @since 1.0.0
     * @param int $post_id ID du post
     * @return void
     */
    public function savePortfolioMeta($post_id): void
    {
        // Vérifier le nonce
        if (!isset($_POST['portfolio_link_nonce']) || !wp_verify_nonce($_POST['portfolio_link_nonce'], 'portfolio_link_nonce')) {
            return;
        }

        // Vérifier les permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Sauvegarder le lien
        if (isset($_POST['portfolio_link'])) {
            update_post_meta($post_id, '_portfolio_link', esc_url_raw($_POST['portfolio_link']));
        }
    }

    /**
     * Ajoute une boîte de métadonnées pour les informations du membre
     *
     * @since 1.0.0
     * @return void
     */
    public function addQuiSommesNousMetaBox(): void
    {
        add_meta_box(
            'qui_sommes_nous_info', // ID unique
            'Informations du membre', // Titre de la boîte
            [$this, 'renderQuiSommesNousMetaBox'], // Fonction de rendu
            'qui-sommes-nous', // Type de post
            'normal', // Contexte
            'high' // Priorité
        );
    }

    /**
     * Affiche les champs dans la boîte de métadonnées
     *
     * Cette méthode affiche les champs de saisie pour les informations du membre,
     * incluant l'expérience, les soft skills, la méthodologie, l'objectif et les icônes.
     * Les icônes sont gérées via le sélecteur de médias WordPress avec prévisualisation.
     *
     * @since 1.0.0
     * @param \WP_Post $post L'objet post actuel
     * @return void
     */
    public function renderQuiSommesNousMetaBox($post): void
    {
        // Récupérer les valeurs existantes
        $experience = get_post_meta($post->ID, '_experience_dev', true);
        $soft_skills = get_post_meta($post->ID, '_soft_skills', true);
        $methodologie = get_post_meta($post->ID, '_methodologie', true);
        $objectif = get_post_meta($post->ID, '_objectif', true);
        $images = get_post_meta($post->ID, '_icones_images', true);
        if (!is_array($images)) {
            $images = [];
        }

        // Ajouter un champ nonce pour la sécurité
        wp_nonce_field('qui_sommes_nous_nonce', 'qui_sommes_nous_nonce');

        // Afficher les champs de saisie
        echo '<p><label for="experience_dev">Expérience en développement :</label></p>';
        echo '<p><textarea id="experience_dev" name="experience_dev" style="width: 100%;" rows="4">' . esc_textarea($experience) . '</textarea></p>';

        echo '<p><label for="soft_skills">Soft skills :</label></p>';
        echo '<p><textarea id="soft_skills" name="soft_skills" style="width: 100%;" rows="4">' . esc_textarea($soft_skills) . '</textarea></p>';

        echo '<p><label for="methodologie">Méthodologie :</label></p>';
        echo '<p><textarea id="methodologie" name="methodologie" style="width: 100%;" rows="4">' . esc_textarea($methodologie) . '</textarea></p>';

        echo '<p><label for="objectif">Objectif :</label></p>';
        echo '<p><textarea id="objectif" name="objectif" style="width: 100%;" rows="4">' . esc_textarea($objectif) . '</textarea></p>';

        // Champ pour les images
        echo '<div class="member-icones-container">';
        echo '<p><label>Icônes supplémentaires :</label></p>';
        echo '<div id="member-icones-list">';

        foreach ($images as $index => $image) {
            echo '<div class="member-image-item">';
            echo '<div class="media-item postbox">';
            echo '<div class="media-item-preview">';
            if (!empty($image)) {
                echo '<img src="' . esc_attr($image) . '" alt="Aperçu" class="media-preview" />';
            }
            echo '</div>';
            echo '<div class="media-item-inputs">';
            echo '<input type="text" name="icones_images[]" value="' . esc_attr($image) . '" class="regular-text" />';
            echo '<button type="button" class="button media-button select-media">Sélectionner</button>';
            echo '<button type="button" class="button media-button remove-image">Supprimer</button>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }

        echo '</div>';
        echo '<button type="button" class="button button-primary add-image">Ajouter une icône</button>';
        echo '</div>';

        // Ajouter le JavaScript pour gérer les images
?>
        <script>
            jQuery(document).ready(function($) {
                // Fonction pour ouvrir le sélecteur de médias
                function openMediaSelector(button) {
                    var frame = wp.media({
                        title: 'Sélectionner une icône',
                        multiple: false,
                        library: {
                            type: 'image'
                        }
                    });

                    frame.on('select', function() {
                        var attachment = frame.state().get('selection').first().toJSON();
                        var mediaItem = $(button).closest('.media-item');
                        mediaItem.find('input').val(attachment.url);

                        // Mettre à jour ou créer l'aperçu
                        var previewContainer = mediaItem.find('.media-item-preview');
                        if (previewContainer.length === 0) {
                            previewContainer = $('<div class="media-item-preview"></div>');
                            mediaItem.prepend(previewContainer);
                        }
                        previewContainer.html('<img src="' + attachment.url + '" alt="Aperçu" class="media-preview" />');
                    });

                    frame.open();
                }

                // Ajouter une nouvelle image
                $('.add-image').on('click', function() {
                    var newImage = '<div class="member-image-item">' +
                        '<div class="media-item postbox">' +
                        '<div class="media-item-preview"></div>' +
                        '<div class="media-item-inputs">' +
                        '<input type="text" name="icones_images[]" value="" class="regular-text" />' +
                        '<button type="button" class="button media-button select-media">Sélectionner</button>' +
                        '<button type="button" class="button media-button remove-image">Supprimer</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $('#member-icones-list').append(newImage);
                });

                // Ouvrir le sélecteur de médias
                $(document).on('click', '.select-media', function() {
                    openMediaSelector(this);
                });

                // Supprimer une image
                $(document).on('click', '.remove-image', function() {
                    $(this).closest('.member-image-item').remove();
                });
            });
        </script>
<?php
    }

    /**
     * Sauvegarde les métadonnées du membre en base de données
     *
     * Cette méthode sauvegarde toutes les métadonnées du membre, y compris
     * les icônes sélectionnées via le sélecteur de médias WordPress.
     * Les données sont nettoyées et validées avant la sauvegarde.
     *
     * @since 1.0.0
     * @param int $post_id ID du post
     * @return void
     */
    public function saveQuiSommesNousMeta($post_id): void
    {
        // Vérifier le nonce
        if (!isset($_POST['qui_sommes_nous_nonce']) || !wp_verify_nonce($_POST['qui_sommes_nous_nonce'], 'qui_sommes_nous_nonce')) {
            return;
        }

        // Vérifier les permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Sauvegarder les champs
        $fields = [
            'experience_dev' => '_experience_dev',
            'soft_skills' => '_soft_skills',
            'methodologie' => '_methodologie',
            'objectif' => '_objectif'
        ];

        foreach ($fields as $field => $meta_key) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $meta_key, sanitize_textarea_field($_POST[$field]));
            }
        }

        // Sauvegarder les images
        if (isset($_POST['icones_images'])) {
            $images = array_filter($_POST['icones_images']); // Supprimer les entrées vides
            update_post_meta($post_id, '_icones_images', $images);
        } else {
            update_post_meta($post_id, '_icones_images', []);
        }
    }

    /**
     * Enregistre les sources de données personnalisées pour le block binding
     *
     * Cette méthode enregistre les shortcodes pour l'affichage des métadonnées
     * dans les templates, incluant les icônes sélectionnées.
     *
     * @since 1.0.0
     * @return void
     */
    public function registerBindingSources(): void
    {
        // Enregistrer les shortcodes
        add_shortcode('portfolio_link', [$this, 'portfolioLinkShortcode']);
        add_shortcode('experience_dev', [$this, 'experienceDevShortcode']);
        add_shortcode('soft_skills', [$this, 'softSkillsShortcode']);
        add_shortcode('methodologie', [$this, 'methodologieShortcode']);
        add_shortcode('objectif', [$this, 'objectifShortcode']);
        add_shortcode('icones_images', [$this, 'iconesImagesShortcode']);
    }

    /**
     * Shortcode pour afficher le lien du portfolio
     *
     * @since 1.0.0
     * @return string URL du projet ou '#' si non définie
     */
    public function portfolioLinkShortcode(): string
    {
        $post_id = get_the_ID();
        $link = get_post_meta($post_id, '_portfolio_link', true);

        if (empty($link)) {
            return '#';
        }

        return esc_url($link);
    }

    /**
     * Shortcode pour afficher l'expérience en développement
     *
     * @since 1.0.0
     * @return string Expérience en développement ou message par défaut
     */
    public function experienceDevShortcode(): string
    {
        $post_id = get_the_ID();
        $experience = get_post_meta($post_id, '_experience_dev', true);

        if (empty($experience)) {
            return 'Aucune expérience en développement spécifiée';
        }

        return wp_kses_post($experience);
    }

    /**
     * Shortcode pour afficher les soft skills
     *
     * @since 1.0.0
     * @return string Soft skills ou message par défaut
     */
    public function softSkillsShortcode(): string
    {
        $post_id = get_the_ID();
        $soft_skills = get_post_meta($post_id, '_soft_skills', true);

        if (empty($soft_skills)) {
            return 'Aucun soft skill spécifié';
        }

        return wp_kses_post($soft_skills);
    }

    /**
     * Shortcode pour afficher la méthodologie
     *
     * @since 1.0.0
     * @return string Méthodologie ou message par défaut
     */
    public function methodologieShortcode(): string
    {
        $post_id = get_the_ID();
        $methodologie = get_post_meta($post_id, '_methodologie', true);

        if (empty($methodologie)) {
            return 'Aucune méthodologie spécifiée';
        }

        return wp_kses_post($methodologie);
    }

    /**
     * Shortcode pour afficher l'objectif
     *
     * @since 1.0.0
     * @return string Objectif ou message par défaut
     */
    public function objectifShortcode(): string
    {
        $post_id = get_the_ID();
        $objectif = get_post_meta($post_id, '_objectif', true);

        if (empty($objectif)) {
            return 'Aucun objectif spécifié';
        }

        return wp_kses_post($objectif);
    }

    /**
     * Shortcode pour afficher les icônes images
     *
     * Ce shortcode affiche les icônes sélectionnées pour un membre
     * dans un conteneur HTML. Les images sont affichées avec leurs
     * attributs alt appropriés.
     *
     * @since 1.0.0
     * @return string HTML des icônes images ou message par défaut
     */
    public function iconesImagesShortcode(): string
    {
        $post_id = get_the_ID();
        $images = get_post_meta($post_id, '_icones_images', true);

        if (empty($images) || !is_array($images)) {
            return 'Aucune icône spécifiée';
        }

        $output = '';
        foreach ($images as $image) {
            if (!empty($image)) {
                $output .= '<div class="wp-block-image">';
                $output .= '<figure class="aligncenter">';
                $output .= '<img src="' . esc_url($image) . '" alt="Icône" class="wp-image-icon" />';
                $output .= '</figure>';
                $output .= '</div>';
            }
        }

        return $output;
    }
}
