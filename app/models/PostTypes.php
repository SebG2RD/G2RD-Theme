<?php
namespace G2RD\Models;

// Importer les fonctions WordPress
use function register_post_type;
use function register_taxonomy;
use function current_user_can;
use function add_action;
use function add_filter;
use function get_post_meta;
use function esc_url;
use function esc_html;
use function wp_enqueue_style;
use function wp_enqueue_script;
use function get_the_post_thumbnail_url;
use function get_the_post_thumbnail;

class PostTypes {
    public static function register() {
        self::register_site_web_post_type();
        self::register_site_web_taxonomy();
        self::register_plugin_post_type();
        add_action('init', [self::class, 'register_plugin_post_type']);
        add_filter('manage_plugin_posts_columns', [self::class, 'set_plugin_columns']);
        add_action('manage_plugin_posts_custom_column', [self::class, 'plugin_custom_column'], 10, 2);
        add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_scripts']);
        
        // Enregistrer les meta boxes du plugin
        PluginMeta::register();
    }

    public static function enqueue_admin_scripts($hook) {
        global $post_type;
        
        // Ne charger que sur la page de liste des plugins
        if ($hook == 'edit.php' && $post_type === 'plugin') {
            wp_enqueue_style('dashicons');
            
            // Ajouter le style personnalisé
            wp_enqueue_style(
                'plugin-admin-style',
                get_template_directory_uri() . '/assets/css/admin.css',
                [],
                '1.0.0'
            );
            
            // Ajouter le script personnalisé
            wp_enqueue_script(
                'plugin-admin-script',
                get_template_directory_uri() . '/assets/js/admin.js',
                ['jquery'],
                '1.0.0',
                true
            );
        }
    }

    private static function register_site_web_post_type() {
        $labels = [
            'name' => 'site_web',
            'all_items' => 'Tous les sites web',
            'singular_name' => 'site web',
            'add_new_item' => 'Ajouter un site web',
            'edit_item' => 'Modifier le site web',
            'menu_name' => 'Sites web'
        ];
        
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => false,
            'has_archive' => false,
            'rewrite' => ['slug' => 'sites-web'],
            'supports' => ['title', 'editor', 'thumbnail', 'revisions', 'custom-fields'],
            'menu_position' => 4,
            'menu_icon' => 'dashicons-format-gallery',
            'taxonomies' => ['category', 'post_tag'],
            'hierarchical' => true,
        ];
        
        register_post_type('site_web', $args);
    }

    private static function register_site_web_taxonomy() {
        $labels = [
            'name' => 'Types de sites web',
            'singular_name' => 'Type de site web',
            'add_new_item' => 'Ajouter un Type de site web',
            'new_item_name' => 'Nom du nouveau site web',
            'parent_item' => 'Type de site web parent',
        ];
        
        $args = [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
        ];

        register_taxonomy('site_web_type', 'site_web', $args);
    }

    public static function register_plugin_post_type() {
        $labels = [
            'name'               => 'Plugins',
            'singular_name'      => 'Plugin',
            'menu_name'          => 'Plugins',
            'add_new'            => 'Ajouter',
            'add_new_item'       => 'Ajouter un plugin',
            'edit_item'          => 'Modifier le plugin',
            'new_item'           => 'Nouveau plugin',
            'view_item'          => 'Voir le plugin',
            'search_items'       => 'Rechercher des plugins',
            'not_found'          => 'Aucun plugin trouvé',
            'not_found_in_trash' => 'Aucun plugin trouvé dans la corbeille',
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'has_archive'         => true,
            'publicly_queryable'  => true,
            'query_var'           => true,
            'rewrite'            => ['slug' => 'plugin'],
            'capability_type'    => 'post',
            'hierarchical'       => false,
            'supports'           => ['title', 'editor', 'thumbnail'],
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-admin-plugins',
            'show_in_rest'       => false,
        ];

        register_post_type('plugin', $args);
    }

    public static function set_plugin_columns($columns) {
        $columns = [
            'cb' => '<input type="checkbox" />',
            'thumbnail' => 'Image',
            'title' => 'Titre',
            'expiration_date' => 'Date de fin',
            'days_remaining' => 'Jours restants',
            'price' => 'Prix',
            'website_url' => 'Site web',
            'login' => 'Login',
            'password' => 'Mot de passe',
            'activation_key' => 'Clé d\'activation'
        ];
        return $columns;
    }

    public static function plugin_custom_column($column, $post_id) {
        switch ($column) {
            case 'thumbnail':
                if (has_post_thumbnail($post_id)) {
                    $thumbnail_url = get_the_post_thumbnail_url($post_id, 'thumbnail');
                    echo '<img src="' . esc_url($thumbnail_url) . '" alt="' . esc_attr(get_the_title($post_id)) . '" class="plugin-thumbnail" />';
                } else {
                    echo '<span class="dashicons dashicons-format-image" style="color: #ccc;"></span>';
                }
                break;
            case 'expiration_date':
                $expiration_date = get_post_meta($post_id, '_plugin_expiration_date', true);
                echo $expiration_date ? date('d/m/Y', strtotime($expiration_date)) : '-';
                break;
            case 'days_remaining':
                $expiration_date = get_post_meta($post_id, '_plugin_expiration_date', true);
                if ($expiration_date) {
                    $expiration_timestamp = strtotime($expiration_date);
                    $current_timestamp = time();
                    $days_remaining = floor(($expiration_timestamp - $current_timestamp) / (60 * 60 * 24));
                    
                    if ($days_remaining < 30) {
                        echo '<span style="color: #d63638;">' . $days_remaining . ' jours</span>';
                    } else {
                        echo $days_remaining . ' jours';
                    }
                } else {
                    echo '-';
                }
                break;
            case 'price':
                $price = get_post_meta($post_id, '_plugin_price', true);
                echo $price ? number_format($price, 2) . ' €' : '-';
                break;
            case 'website_url':
                $website_url = get_post_meta($post_id, '_plugin_website_url', true);
                if ($website_url) {
                    echo '<a href="' . esc_url($website_url) . '" target="_blank" class="website-link">' . esc_url($website_url) . '</a>';
                } else {
                    echo '-';
                }
                break;
            case 'login':
                $login = get_post_meta($post_id, '_plugin_login', true);
                echo $login ? esc_html($login) : '-';
                break;
            case 'password':
                $password = get_post_meta($post_id, '_plugin_password', true);
                if ($password) {
                    echo '<div class="password-container">';
                    echo '<span class="password-mask" data-password="' . esc_attr($password) . '">••••••••</span>';
                    echo '<span class="toggle-password dashicons dashicons-visibility" title="Afficher/Masquer"></span>';
                    echo '</div>';
                } else {
                    echo '-';
                }
                break;
            case 'activation_key':
                $activation_key = get_post_meta($post_id, '_plugin_activation_key', true);
                if ($activation_key) {
                    echo '<div class="password-container">';
                    echo '<span class="password-mask" data-password="' . esc_attr($activation_key) . '">••••••••</span>';
                    echo '<span class="toggle-password dashicons dashicons-visibility" title="Afficher/Masquer"></span>';
                    echo '</div>';
                } else {
                    echo '-';
                }
                break;
        }
    }
} 