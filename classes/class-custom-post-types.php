<?php

namespace G2RD;

class CPT
{
    public function registerHooks(): void
    {
        add_action('init', [$this, 'registerPostTypes']);
        add_action('add_meta_boxes', [$this, 'addPortfolioMetaBox']);
        add_action('save_post_portfolio', [$this, 'savePortfolioMeta']);
        add_filter('use_block_editor_for_post_type', [$this, 'disableGutenbergForPortfolio'], 10, 2);
        add_action('init', [$this, 'registerBindingSources']);
    }

    # Désactiver Gutenberg pour le CPT Portfolio
    public function disableGutenbergForPortfolio($use_block_editor, $post_type): bool
    {
        if ($post_type === 'portfolio') {
            return false;
        }
        return $use_block_editor;
    }

    # Déclarer des types de publication personnalisés
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
            'show_in_rest' => true, // Garde l'API REST active
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields'],
            'menu_position' => 5,
            'menu_icon' => 'dashicons-admin-appearance',
        ];

        register_post_type('portfolio', $args);

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
    }

    # Ajouter la boîte de métadonnées pour le lien
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

    # Afficher le champ de lien dans la boîte de métadonnées
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

    # Sauvegarder le lien en base de données
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

    # Déclarer des sources de données personnalisées pour le block binding
    public function registerBindingSources(): void
    {
        // Enregistrer le shortcode
        add_shortcode('portfolio_link', [$this, 'portfolioLinkShortcode']);
    }

    # Shortcode pour afficher le lien du portfolio
    public function portfolioLinkShortcode(): string
    {
        $post_id = get_the_ID();
        $link = get_post_meta($post_id, '_portfolio_link', true);

        if (empty($link)) {
            return '#';
        }

        return esc_url($link);
    }
}
