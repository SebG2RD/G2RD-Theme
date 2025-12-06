<?php

/**
 * Gestion du mode sombre (Dark Mode)
 * 
 * Cette classe gère l'activation/désactivation du mode sombre,
 * la sauvegarde de la préférence utilisateur et l'intégration
 * avec les variations de thème WordPress.
 *
 * @package G2RD
 * @since 1.0.0
 */

namespace G2RD;

/**
 * Classe pour gérer le dark mode
 * 
 * Cette classe permet de:
 * - Détecter la préférence système de l'utilisateur
 * - Sauvegarder le choix de l'utilisateur dans un cookie/localStorage
 * - Appliquer automatiquement le mode sombre
 * - Fournir un toggle pour basculer manuellement
 */
class DarkMode
{
    /**
     * Clé pour stocker la préférence utilisateur
     */
    private const PREFERENCE_KEY = 'g2rd_dark_mode';

    /**
     * Enregistre tous les hooks nécessaires
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        // Ajouter le script JavaScript pour le toggle
        add_action('wp_enqueue_scripts', [$this, 'enqueueDarkModeScripts']);

        // Ajouter les styles CSS pour le dark mode
        add_action('wp_enqueue_scripts', [$this, 'enqueueDarkModeStyles']);

        // Ajouter une classe au body pour le dark mode
        add_filter('body_class', [$this, 'addDarkModeBodyClass']);

        // Endpoint AJAX pour sauvegarder la préférence (optionnel)
        add_action('wp_ajax_g2rd_toggle_dark_mode', [$this, 'toggleDarkMode']);
        add_action('wp_ajax_nopriv_g2rd_toggle_dark_mode', [$this, 'toggleDarkMode']);
    }

    /**
     * Charge le script JavaScript pour le dark mode
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueDarkModeScripts(): void
    {
        // Charger Dashicons pour les icônes (nécessaire en frontend)
        wp_enqueue_style('dashicons');
        
        // Enregistrer le script
        wp_enqueue_script(
            'g2rd-dark-mode',
            get_template_directory_uri() . '/assets/js/dark-mode.js',
            [],
            wp_get_theme()->get('Version'),
            true
        );

        // Passer des données au script JavaScript
        wp_localize_script('g2rd-dark-mode', 'g2rdDarkMode', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('g2rd_dark_mode_nonce'),
            'preferenceKey' => self::PREFERENCE_KEY
        ]);
    }

    /**
     * Charge les styles CSS pour le dark mode
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueDarkModeStyles(): void
    {
        wp_enqueue_style(
            'g2rd-dark-mode',
            get_template_directory_uri() . '/assets/css/dark-mode.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    /**
     * Ajoute une classe au body si le dark mode est actif
     *
     * Cette classe permet d'appliquer des styles CSS spécifiques
     * quand le dark mode est activé.
     *
     * @since 1.0.0
     * @param array $classes Les classes existantes du body
     * @return array Les classes mises à jour
     */
    public function addDarkModeBodyClass(array $classes): array
    {
        // Le JavaScript ajoutera/retirera cette classe dynamiquement
        // On l'ajoute ici pour le cas où le cookie existe déjà
        if (isset($_COOKIE[self::PREFERENCE_KEY]) && $_COOKIE[self::PREFERENCE_KEY] === 'enabled') {
            $classes[] = 'dark-mode-active';
        }

        return $classes;
    }

    /**
     * Gère le toggle du dark mode via AJAX (optionnel)
     *
     * @since 1.0.0
     * @return void
     */
    public function toggleDarkMode(): void
    {
        // Vérifier le nonce pour la sécurité
        check_ajax_referer('g2rd_dark_mode_nonce', 'nonce');

        // Récupérer l'état actuel
        $current_state = isset($_POST['enabled']) ? sanitize_text_field($_POST['enabled']) : 'disabled';

        // Sauvegarder dans les options utilisateur (si connecté)
        if (is_user_logged_in()) {
            update_user_meta(get_current_user_id(), self::PREFERENCE_KEY, $current_state);
        }

        // Retourner une réponse JSON
        wp_send_json_success([
            'message' => 'Préférence sauvegardée',
            'state' => $current_state
        ]);
    }
}
