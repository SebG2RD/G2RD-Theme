<?php

/**
 * Classe principale pour la configuration du thème
 * 
 * Cette classe gère l'initialisation et la configuration de base du thème,
 * incluant l'enregistrement des assets, la configuration des types MIME,
 * et la mise en place des fonctionnalités du thème.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Classe principale pour la configuration du thème
 * 
 * Cette classe gère l'initialisation et la configuration de base du thème,
 * incluant l'enregistrement des assets, la configuration des types MIME,
 * et la mise en place des fonctionnalités du thème.
 *
 * @package G2RD
 * @since 1.0.0
 */
class ThemeSetup
{
    /**
     * Version du thème pour le cache-busting
     */
    private string $theme_version;

    /**
     * Constructeur
     */
    public function __construct()
    {
        $this->theme_version = wp_get_theme()->get('Version');
    }

    /**
     * Enregistre tous les hooks nécessaires pour le thème
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        \add_action('after_setup_theme', [$this, 'loadThemeTextdomain']);
        \add_action('wp_enqueue_scripts', [$this, 'registerAssets']);
        \add_filter('upload_mimes', [$this, 'allowMimeTypes']);
        \add_filter('wp_check_filetype_and_ext', [$this, 'allowFileTypes'], 10, 4);
        \add_filter('sanitize_file_name', 'remove_accents');
        \add_action('init', [$this, 'g2rd_register_block_patterns']);
        \add_action('wp_head', [$this, 'addSecurityHeaders'], 1);
        \add_action('wp_head', [$this, 'addPreloadLinks'], 2);

        $this->setupFeatures();
    }

    /**
     * Ajoute les en-têtes de sécurité
     */
    public function addSecurityHeaders(): void
    {
        if (!is_admin()) {
            header('X-Content-Type-Options: nosniff');
            header('X-Frame-Options: SAMEORIGIN');
            header('X-XSS-Protection: 1; mode=block');
            header('Referrer-Policy: strict-origin-when-cross-origin');
        }
    }

    /**
     * Ajoute les liens de préchargement pour les ressources critiques
     */
    public function addPreloadLinks(): void
    {
        if (!is_admin()) {
            $template_dir = get_template_directory();
            $template_uri = get_template_directory_uri();

            // Précharger les polices (seulement si le fichier existe)
            $main_font = $template_dir . '/assets/fonts/your-main-font.woff2';
            if (file_exists($main_font)) {
                echo '<link rel="preload" href="' . esc_url($template_uri) . '/assets/fonts/your-main-font.woff2" as="font" type="font/woff2" crossorigin>';
            }

            // Précharger les styles critiques (seulement si les fichiers existent)
            if (file_exists(get_stylesheet_directory() . '/style.css')) {
                echo '<link rel="preload" href="' . esc_url(get_stylesheet_uri()) . '" as="style">';
            }

            $accessibility_css = $template_dir . '/assets/css/accessibility.css';
            if (file_exists($accessibility_css)) {
                echo '<link rel="preload" href="' . esc_url($template_uri) . '/assets/css/accessibility.css" as="style">';
            }
        }
    }

    /**
     * Enregistre et charge les styles et scripts principaux du thème
     *
     * @since 1.0.0
     * @return void
     */
    public function registerAssets(): void
    {
        // Styles principaux avec version du thème
        \wp_enqueue_style('main', \get_stylesheet_uri(), [], $this->theme_version);

        // Styles d'accessibilité
        \wp_enqueue_style(
            'g2rd-accessibility',
            \get_template_directory_uri() . '/assets/css/accessibility.css',
            [],
            $this->theme_version
        );

        // Scripts d'accessibilité avec chargement différé
        \wp_enqueue_script(
            'g2rd-accessibility',
            \get_template_directory_uri() . '/assets/js/accessibility.js',
            [],
            $this->theme_version,
            true
        );

        // Ajouter les données localisées pour les scripts
        wp_localize_script('g2rd-accessibility', 'g2rdData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('g2rd-nonce')
        ]);
    }

    /**
     * Ajoute le support pour les fichiers SVG et WebP
     *
     * @since 1.0.0
     * @param array $mimes Liste des types MIME autorisés
     * @return array Liste mise à jour des types MIME
     */
    public function allowMimeTypes($mimes): array
    {
        $mimes['svg'] = 'image/svg+xml';
        $mimes['webp'] = 'image/webp';
        $mimes['avif'] = 'image/avif';

        return $mimes;
    }

    /**
     * Configure la validation des types de fichiers pour SVG et WebP
     *
     * @since 1.0.0
     * @param array $types Types de fichiers
     * @param string $file Chemin du fichier
     * @param string $filename Nom du fichier
     * @param array $mimes Types MIME
     * @return array Types de fichiers mis à jour
     */
    public function allowFileTypes($types, $file, $filename, $mimes): array
    {
        if (false !== strpos($filename, '.webp')) {
            $types['ext'] = 'webp';
            $types['type'] = 'image/webp';
        } elseif (false !== strpos($filename, '.avif')) {
            $types['ext'] = 'avif';
            $types['type'] = 'image/avif';
        }

        return $types;
    }

    /**
     * Configure les fonctionnalités de base du thème
     *
     * @since 1.0.0
     * @return void
     */
    public function setupFeatures(): void
    {
        # Retirer la suggestion de blocs
        \remove_theme_support('core-block-patterns');

        # Ajouter des fonctionnalités
        \add_theme_support("editor-styles");
        \add_theme_support('responsive-embeds');
        \add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);

        # Désactiver l'ancienne API XML RPC
        \add_filter('xmlrpc_enabled', '__return_false');

        # Retirer les scripts des Emojis
        \remove_action('admin_print_styles', 'print_emoji_styles');
        \remove_action('wp_head', 'print_emoji_detection_script', 7);
        \remove_action('admin_print_scripts', 'print_emoji_detection_script');
        \remove_action('wp_print_styles', 'print_emoji_styles');
        \remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
        \remove_filter('the_content_feed', 'wp_staticize_emoji');
        \remove_filter('comment_text_rss', 'wp_staticize_emoji');

        # Désactiver les fonctionnalités inutiles
        \remove_action('wp_head', 'wp_generator');
        \remove_action('wp_head', 'wlwmanifest_link');
        \remove_action('wp_head', 'rsd_link');
        \remove_action('wp_head', 'wp_shortlink_wp_head');
    }

    /**
     * Enregistre les catégories de patterns de blocs personnalisés
     *
     * @since 1.0.0
     * @return void
     */
    function g2rd_register_block_patterns(): void
    {
        // Enregistrer les catégories
        $categories = [
            'design' => \__('Design', 'g2rd-theme'),
            'card' => \__('Card', 'g2rd-theme'),
            'hero' => \__('Hero', 'g2rd-theme'),
            'info' => \__('Info', 'g2rd-theme'),
            'posts' => \__('Posts', 'g2rd-theme'),
            'header' => \__('Header', 'g2rd-theme'),
            'footer' => \__('Footer', 'g2rd-theme'),
            'widgets' => \__('Widgets', 'g2rd-theme')
        ];

        foreach ($categories as $slug => $label) {
            \register_block_pattern_category($slug, ['label' => $label]);
        }
    }

    /**
     * Charge les traductions du thème
     *
     * @since 1.0.2
     * @return void
     */
    public function loadThemeTextdomain(): void
    {
        load_theme_textdomain('g2rd-theme', get_template_directory() . '/languages');
    }
}
