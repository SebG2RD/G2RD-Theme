<?php
namespace G2RD\Controllers;

// Importer les fonctions WordPress
use function add_action;
use function wp_enqueue_style;
use function get_stylesheet_uri;
use function wp_get_theme;
use function wp_enqueue_block_style;
use function get_theme_file_uri;
use function get_theme_file_path;
use function wp_enqueue_script;
use function get_template_directory_uri;

class Assets {
    public static function register() {
        add_action('wp_enqueue_scripts', [self::class, 'register_assets']);
        add_action('init', [self::class, 'register_blocks_assets']);
        add_action('enqueue_block_editor_assets', [self::class, 'deregister_blocks_variations']);
    }

    public static function register_assets() {
        wp_enqueue_style('main', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
    }

    public static function register_blocks_assets() {
        wp_enqueue_block_style(
            "core/group",
            [
                'handle' => "g2rd-group",
                'src'    => get_theme_file_uri("assets/css/core-group.css"),
                'path'   => get_theme_file_path("assets/css/core-group.css"),
                'ver'    => "1.0",
            ]
        );
    }

    public static function deregister_blocks_variations() {
        wp_enqueue_script(
            "unregister-styles",
            get_template_directory_uri() . "/assets/js/unregister-blocks-styles.js",
            ["wp-blocks", "wp-dom-ready", "wp-edit-post"],
            "1.0",
        );
    }
} 