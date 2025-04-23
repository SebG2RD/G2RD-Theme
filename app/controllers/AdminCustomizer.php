<?php
namespace G2RD\Controllers;

class AdminCustomizer {

    /**
     * Register hooks related to admin customization.
     */
    public static function register() {
        \add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_styles']);
    }

    /**
     * Enqueue custom styles for the WordPress admin area.
     */
    public static function enqueue_admin_styles() {
        // Make sure theme path function exists
        if (!\function_exists('get_template_directory_uri')) {
            // Maybe log an error or handle it silently
            return;
        }

        $theme_version = \wp_get_theme()->get('Version'); // Get theme version for cache busting
        $admin_css_path = \get_template_directory_uri() . '/assets/css/admin.css';

        \wp_enqueue_style(
            'g2rd-admin-style',        // Handle
            $admin_css_path,           // Source
            [],                        // Dependencies
            $theme_version,            // Version
            'all'                      // Media
        );
    }
} 