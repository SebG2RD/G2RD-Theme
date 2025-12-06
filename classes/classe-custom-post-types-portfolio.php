<?php
/**
 * Gestion du type de contenu personnalisé Portfolio
 * 
 * Cette classe gère l'enregistrement et la configuration du type de contenu Portfolio.
 *
 * @package G2RD
 * @since 1.0.2
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Classe CPT_Portfolio
 * 
 * Gère le type de contenu personnalisé Portfolio et ses métadonnées.
 */
class CPT_Portfolio
{
    /**
     * Enregistre les hooks nécessaires
     *
     * @since 1.0.2
     * @return void
     */
    public function registerHooks(): void
    {
        // Vérifier si le CPT est activé avant d'enregistrer les hooks
        if (\get_option('g2rd_cpt_portfolio_enabled', '1') !== '1') {
            return;
        }
        
        add_action('init', [$this, 'registerPostType']);
        add_action('add_meta_boxes', [$this, 'addMetaBox']);
        add_action('save_post_portfolio', [$this, 'saveMeta']);
        add_filter('use_block_editor_for_post_type', [$this, 'disableGutenberg'], 10, 2);
        add_filter('rest_prepare_portfolio', [$this, 'hideSensitiveFieldsFromAPI'], 10, 3);
        add_filter('manage_portfolio_posts_columns', [$this, 'addColumns']);
        add_action('manage_portfolio_posts_custom_column', [$this, 'renderColumns'], 10, 2);
    }

    /**
     * Enregistre le type de contenu Portfolio
     *
     * @since 1.0.2
     * @return void
     */
    public function registerPostType(): void
    {
        // Vérifier si le CPT est activé
        if (\get_option('g2rd_cpt_portfolio_enabled', '1') !== '1') {
            return;
        }
        
        // Récupérer le nom personnalisé ou utiliser le nom par défaut
        $custom_name = \get_option('g2rd_cpt_portfolio_name', 'Portfolio');
        $singular_name = 'Projet'; // On peut aussi personnaliser ça plus tard si besoin
        
        $labels = [
            'name' => $custom_name,
            'all_items' => 'Tous les projets',
            'singular_name' => $singular_name,
            'add_new_item' => 'Ajouter un ' . \strtolower($singular_name),
            'edit_item' => 'Modifier le ' . \strtolower($singular_name),
            'menu_name' => $custom_name
        ];
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields', 'excerpt', 'tags'],
            'menu_position' => 5,
            'menu_icon' => 'dashicons-admin-appearance',
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'hierarchical' => false,
            'rewrite' => ['slug' => 'portfolio'],
            'query_var' => true,
            'show_in_nav_menus' => true,
            'show_in_admin_bar' => true,
        ];
        register_post_type('portfolio', $args);
        // Taxonomies associées
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
            'rewrite' => ['slug' => 'type-projets'],
            'show_admin_column' => true,
        ];
        register_taxonomy('type-projets', 'portfolio', $args);
        $labels = [
            'name' => 'Qui',
            'singular_name' => 'Qui',
            'add_new_item' => 'Ajouter un membre',
            'new_item_name' => 'Nom du nouveau membre',
            'parent_item' => 'Membre parent',
        ];
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
            'rewrite' => ['slug' => 'qui'],
            'show_admin_column' => true,
        ];
        register_taxonomy('qui', 'portfolio', $args);
    }

    /**
     * Désactive l'éditeur Gutenberg pour le type de contenu Portfolio
     *
     * @since 1.0.2
     * @param bool $use_block_editor
     * @param string $post_type
     * @return bool
     */
    public function disableGutenberg($use_block_editor, $post_type): bool
    {
        if ($post_type === 'portfolio') {
            return false;
        }
        return $use_block_editor;
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
            'portfolio_link',
            'Lien du projet & Scores',
            [$this, 'renderMetaBox'],
            'portfolio',
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
        // Récupérer la valeur existante du lien
        $link = get_post_meta($post->ID, '_portfolio_link', true);
        $perf = get_post_meta($post->ID, '_portfolio_perf', true);
        $a11y = get_post_meta($post->ID, '_portfolio_a11y', true);
        $bp = get_post_meta($post->ID, '_portfolio_bp', true);
        $seo = get_post_meta($post->ID, '_portfolio_seo', true);
        $password = get_post_meta($post->ID, '_portfolio_password', true);
        $login = get_post_meta($post->ID, '_portfolio_login', true);
        $hebergement = get_post_meta($post->ID, '_portfolio_hebergement', true);
        $maintenance = get_post_meta($post->ID, '_portfolio_maintenance', true);
        $contrat = get_post_meta($post->ID, '_portfolio_contrat', true);
        $date_anniv = get_post_meta($post->ID, '_portfolio_date_anniv', true);

        wp_nonce_field('portfolio_link_nonce', 'portfolio_link_nonce');

        echo '<p><label for="portfolio_link">URL du projet :</label></p>';
        echo '<p><input type="url" id="portfolio_link" name="portfolio_link" value="' . esc_url($link) . '" style="width: 100%;" /></p>';
        echo '<p class="description">Entrez l\'URL complète du projet (ex: https://www.exemple.com)</p>';

        echo '<hr><h4>Identifiants du projet</h4>';
        echo '<div class="password-container" style="display:flex;gap:8px;align-items:center;">';
        echo '<input type="text" id="portfolio_login" name="portfolio_login" value="' . esc_attr($login) . '" placeholder="Login" style="width: 40%; min-width:120px;" />';
        echo '<input type="password" id="portfolio_password" name="portfolio_password" value="' . esc_attr($password) . '" placeholder="Mot de passe" style="width: 40%; min-width:120px;" />';
        echo '<button type="button" class="button dashicons dashicons-visibility toggle-password" data-target="portfolio_password" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-left:6px;"></button>';
        echo '</div>';
        echo '<p class="description">Entrez un login et un mot de passe pour protéger l\'accès au projet</p>';

        echo '<hr><h4>Informations complémentaires</h4>';
        echo '<p><label for="portfolio_hebergement">Hébergement :</label> ';
        echo '<select id="portfolio_hebergement" name="portfolio_hebergement">';
        $hebergements = [
            '' => '-- Sélectionner --',
            'Hostinger' => 'Hostinger',
            'Ionos' => 'Ionos',
            'Autres' => 'Autres'
        ];
        foreach ($hebergements as $val => $label) {
            echo '<option value="' . esc_attr($val) . '"' . selected($hebergement, $val, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select></p>';
        echo '<p><label><input type="checkbox" id="portfolio_maintenance" name="portfolio_maintenance" value="1"' . checked($maintenance, '1', false) . '> Maintenance</label></p>';
        $contrats = [
            '' => '-- Sélectionner --',
            'Hébergement' => 'Hébergement',
            'Base' => 'Base',
            'Standard' => 'Standard',
            'Business' => 'Business'
        ];
        $contrat_style = ($maintenance === '1') ? '' : 'style="display:none;"';
        echo '<div id="contrat_maintenance_fields" ' . $contrat_style . '>';
        echo '<p><label for="portfolio_contrat">Contrat de maintenance :</label> ';
        echo '<select id="portfolio_contrat" name="portfolio_contrat">';
        foreach ($contrats as $val => $label) {
            echo '<option value="' . esc_attr($val) . '"' . selected($contrat, $val, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select></p>';
        echo '<p><label for="portfolio_date_anniv">Date anniversaire du contrat :</label> ';
        echo '<input type="date" id="portfolio_date_anniv" name="portfolio_date_anniv" value="' . esc_attr($date_anniv) . '" /></p>';
        echo '</div>';
        echo '<script>jQuery(function($){$("#portfolio_maintenance").on("change",function(){if($(this).is(":checked")){$("#contrat_maintenance_fields").show();}else{$("#contrat_maintenance_fields").hide();}});});</script>';

        echo '<hr><h4>Scores du projet</h4>';
        echo '<table class="form-table"><tr>';
        echo '<th><label for="portfolio_perf">Performances</label></th>';
        echo '<th><label for="portfolio_a11y">Accessibilité</label></th>';
        echo '<th><label for="portfolio_bp">Bonnes pratiques</label></th>';
        echo '<th><label for="portfolio_seo">SEO</label></th>';
        echo '</tr><tr>';
        echo '<td><input type="number" id="portfolio_perf" name="portfolio_perf" value="' . esc_attr($perf) . '" min="0" max="100" step="1" class="small-text" /> /100</td>';
        echo '<td><input type="number" id="portfolio_a11y" name="portfolio_a11y" value="' . esc_attr($a11y) . '" min="0" max="100" step="1" class="small-text" /> /100</td>';
        echo '<td><input type="number" id="portfolio_bp" name="portfolio_bp" value="' . esc_attr($bp) . '" min="0" max="100" step="1" class="small-text" /> /100</td>';
        echo '<td><input type="number" id="portfolio_seo" name="portfolio_seo" value="' . esc_attr($seo) . '" min="0" max="100" step="1" class="small-text" /> /100</td>';
        echo '</tr></table>';
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
        if (!isset($_POST['portfolio_link_nonce']) || !wp_verify_nonce($_POST['portfolio_link_nonce'], 'portfolio_link_nonce')) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (isset($_POST['portfolio_link'])) {
            update_post_meta($post_id, '_portfolio_link', esc_url_raw($_POST['portfolio_link']));
        }
        if (isset($_POST['portfolio_login'])) {
            update_post_meta($post_id, '_portfolio_login', sanitize_text_field($_POST['portfolio_login']));
        }
        if (isset($_POST['portfolio_password'])) {
            update_post_meta($post_id, '_portfolio_password', sanitize_text_field($_POST['portfolio_password']));
        }
        $fields = [
            'portfolio_perf' => '_portfolio_perf',
            'portfolio_a11y' => '_portfolio_a11y',
            'portfolio_bp'   => '_portfolio_bp',
            'portfolio_seo'  => '_portfolio_seo',
        ];
        foreach ($fields as $field => $meta_key) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $meta_key, intval($_POST[$field]));
            }
        }
        if (isset($_POST['portfolio_hebergement'])) {
            update_post_meta($post_id, '_portfolio_hebergement', sanitize_text_field($_POST['portfolio_hebergement']));
        }
        update_post_meta($post_id, '_portfolio_maintenance', isset($_POST['portfolio_maintenance']) ? '1' : '0');
        if (isset($_POST['portfolio_contrat'])) {
            update_post_meta($post_id, '_portfolio_contrat', sanitize_text_field($_POST['portfolio_contrat']));
        }
        if (isset($_POST['portfolio_date_anniv'])) {
            update_post_meta($post_id, '_portfolio_date_anniv', sanitize_text_field($_POST['portfolio_date_anniv']));
        }
    }

    /**
     * Cache les champs sensibles de l'API REST
     *
     * @since 1.0.2
     * @param \WP_REST_Response $response
     * @param \WP_Post $post
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function hideSensitiveFieldsFromAPI($response, $post, $request): \WP_REST_Response
    {
        $data = $response->get_data();
        $fields_to_hide = [
            '_portfolio_password',
            '_portfolio_login',
            '_portfolio_hebergement',
            '_portfolio_maintenance',
            '_portfolio_contrat',
            '_portfolio_date_anniv',
        ];
        foreach ($fields_to_hide as $field) {
            if (isset($data['meta'][$field])) {
                unset($data['meta'][$field]);
            }
        }
        $response->set_data($data);
        return $response;
    }

    /**
     * Ajoute des colonnes personnalisées à la liste des projets
     *
     * @since 1.0.2
     * @param array $columns
     * @return array
     */
    public function addColumns($columns)
    {
        $columns['portfolio_login'] = __('Login', 'g2rd-theme');
        $columns['portfolio_password'] = __('Mot de passe', 'g2rd-theme');
        $columns['portfolio_hebergement'] = __('Hébergement', 'g2rd-theme');
        $columns['portfolio_maintenance'] = __('Maintenance', 'g2rd-theme');
        $columns['portfolio_contrat'] = __('Contrat', 'g2rd-theme');
        $columns['portfolio_date_anniv'] = __('Date anniversaire', 'g2rd-theme');
        return $columns;
    }

    /**
     * Affiche le contenu des colonnes personnalisées
     *
     * @since 1.0.2
     * @param string $column
     * @param int $post_id
     * @return void
     */
    public function renderColumns($column, $post_id)
    {
        if ($column === 'portfolio_login') {
            $login = get_post_meta($post_id, '_portfolio_login', true);
            echo esc_html($login);
        }
        if ($column === 'portfolio_password') {
            $password = get_post_meta($post_id, '_portfolio_password', true);
            echo '<div class="password-container" style="display:flex;align-items:center;gap:4px;">';
            echo '<span class="password-mask" data-password="' . esc_attr($password) . '">••••••••</span>';
            echo '<button type="button" class="button dashicons dashicons-visibility toggle-password" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;"></button>';
            echo '</div>';
        }
        if ($column === 'portfolio_hebergement') {
            $hebergement = get_post_meta($post_id, '_portfolio_hebergement', true);
            echo esc_html($hebergement);
        }
        if ($column === 'portfolio_maintenance') {
            $maintenance = get_post_meta($post_id, '_portfolio_maintenance', true);
            echo $maintenance === '1' ? __('Oui', 'g2rd-theme') : __('Non', 'g2rd-theme');
        }
        if ($column === 'portfolio_contrat') {
            $contrat = get_post_meta($post_id, '_portfolio_contrat', true);
            echo esc_html($contrat);
        }
        if ($column === 'portfolio_date_anniv') {
            $date_anniv = get_post_meta($post_id, '_portfolio_date_anniv', true);
            echo esc_html($date_anniv);
        }
    }
} 