<?php
namespace G2RD\Controllers;

use function add_action;
use function wp_enqueue_style;
use function get_template_directory_uri;
use function home_url;
use function wp_add_inline_style;
use function add_filter;
use function esc_url;
use function esc_html;
use function function_exists;

class LoginCustomizer {
    public static function register() {
        \add_action('login_enqueue_scripts', [self::class, 'enqueue_login_styles']);
        \add_filter('login_headerurl', [self::class, 'custom_login_logo_url']);
        \add_filter('login_headertext', [self::class, 'custom_login_logo_title']);
        \add_action('login_header', [self::class, 'add_login_container_start']);
        \add_action('login_footer', [self::class, 'add_login_container_end'], 20);
    }

    public static function enqueue_login_styles() {
        // Charger le CSS personnalisé
        \wp_enqueue_style(
            'g2rd-login-style',
            \get_template_directory_uri() . '/assets/css/login.css',
            [],
            '1.0.0'
        );

        // Ajouter le style inline pour le logo
        $logo_url = \get_template_directory_uri() . '/assets/img/Nouveau-logo-G2RD-Agence-Web-blanc-Horizontale@3x.png';
        
        $custom_css = "
            .login h1 a {
                background-image: url({$logo_url}) !important;
                background-size: contain !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                width: 320px !important;
                height: 100px !important;
                margin: 0 auto 30px !important;
                padding: 0 !important;
            }
        ";
        \wp_add_inline_style('g2rd-login-style', $custom_css);
    }

    public static function custom_login_logo_url() {
        return \home_url();
    }

    public static function custom_login_logo_title() {
        return 'G2RD - Agence Web';
    }

    public static function add_login_container_start() {
        echo '<div class="login-container">';
    }

    public static function add_login_container_end() {
        echo '<div class="login-image"></div></div>';
    }
} 