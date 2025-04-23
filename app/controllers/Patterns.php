<?php
namespace G2RD\Controllers;

// Importer les fonctions WordPress
use function add_action;
use function remove_theme_support;
use function remove_action;
use function register_block_pattern_category;
use function __;

class Patterns {
    public static function register() {
        add_action('init', [self::class, 'register_patterns_categories']);
        remove_theme_support("core-block-patterns");
        remove_action("enqueue_block_editor_assets", "wp_enqueue_editor_block_directory_assets");
    }

    public static function register_patterns_categories() {
        register_block_pattern_category(
            "marketing",
            ["label" => __("Marketing", "g2rd")]
        );
        
        register_block_pattern_category(
            "card",
            ["label" => __("Cartes", "g2rd")]
        );
        
        register_block_pattern_category(
            "hero",
            ["label" => __("Hero", "g2rd")]
        );

        register_block_pattern_category(
            "post",
            ["label" => __("Publications", "g2rd")]
        );
    }
} 