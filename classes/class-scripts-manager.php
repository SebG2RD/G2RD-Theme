<?php

/**
 * Gestionnaire des scripts et styles
 * 
 * Cette classe gère le chargement et l'optimisation des scripts
 * et des feuilles de style du thème.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Gestionnaire des scripts JavaScript
 *
 * Cette classe gère l'enregistrement et le chargement des scripts JavaScript
 * nécessaires au fonctionnement du thème, notamment pour les interactions
 * utilisateur et les effets visuels.
 *
 * @package G2RD
 * @since 1.0.0
 */
class ScriptsManager
{
    /**
     * Version du thème pour le cache-busting
     */
    private string $theme_version;

    /**
     * Liste des scripts à charger en différé
     */
    private array $defer_scripts = [
        'g2rd-particles',
        'g2rd-clickable-articles',
        'g2rd-block-scripts'
    ];

    /**
     * Constructeur
     */
    public function __construct()
    {
        $this->theme_version = wp_get_theme()->get('Version');
    }

    /**
     * Enregistre les hooks WordPress pour la gestion des scripts
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        \add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        \add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);
        \add_action('wp_head', [$this, 'addPreloadLinks'], 1);
        \add_filter('script_loader_tag', [$this, 'addDeferAttribute'], 10, 3);
        \add_action('wp_head', [$this, 'addSecurityHeaders'], 1);
    }

    /**
     * Ajoute les en-têtes de sécurité
     */
    public function addSecurityHeaders(): void
    {
        if (!headers_sent()) {
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
        $template_uri = get_template_directory_uri();
        
        // Précharger les polices critiques
        echo '<link rel="preload" href="' . esc_url($template_uri) . '/assets/fonts/your-main-font.woff2" as="font" type="font/woff2" crossorigin>';
        
        // Précharger les styles critiques
        echo '<link rel="preload" href="' . esc_url($template_uri) . '/assets/css/critical.css" as="style">';
    }

    /**
     * Ajoute l'attribut defer aux scripts non critiques
     */
    public function addDeferAttribute($tag, $handle, $src): string
    {
        if (in_array($handle, $this->defer_scripts)) {
            return str_replace(' src', ' defer src', $tag);
        }
        return $tag;
    }

    /**
     * Enregistre et charge les scripts JavaScript du thème
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueScripts(): void
    {
        // Script pour rendre les articles cliquables
        \wp_enqueue_script(
            'g2rd-clickable-articles',
            \get_template_directory_uri() . '/assets/js/clickable-articles.js',
            [],
            $this->theme_version,
            true
        );

        // Script pour l'effet de particules
        \wp_enqueue_script(
            'g2rd-particles',
            \get_template_directory_uri() . '/assets/js/g2rd-particles.js',
            [],
            $this->theme_version,
            true
        );

        // Script pour les blocs
        \wp_enqueue_script(
            'g2rd-block-scripts',
            \get_template_directory_uri() . '/assets/js/blocks.js',
            [],
            $this->theme_version,
            true
        );

        // Ajouter les données localisées pour les scripts
        wp_localize_script('g2rd-particles', 'g2rdData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('g2rd-nonce')
        ]);
    }

    /**
     * Enregistre et charge les scripts JavaScript de l'administration
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueAdminScripts(): void
    {
        // Script pour la gestion des mots de passe
        \wp_enqueue_script(
            'g2rd-password-manager',
            \get_template_directory_uri() . '/assets/js/password-manager.js',
            ['jquery'],
            $this->theme_version,
            true
        );

        // Script pour l'éditeur de blocs
        if (\get_current_screen() && \get_current_screen()->is_block_editor()) {
            \wp_enqueue_script(
                'g2rd-block-editor',
                \get_template_directory_uri() . '/assets/js/block-editor.js',
                ['wp-blocks', 'wp-dom'],
                $this->theme_version,
                true
            );
        }
    }
}
