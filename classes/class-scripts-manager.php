<?php
/**
 * Classe pour gérer les scripts du thème
 *
 * @package G2RD
 */

namespace G2RD;

/**
 * Class ScriptsManager
 *
 * Gère l'enregistrement et le chargement des scripts du thème
 */
class ScriptsManager
{
    /**
     * Enregistre les hooks WordPress
     */
    public function registerHooks()
    {
        // Utiliser le namespace global pour les fonctions WordPress
        \add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    /**
     * Enregistre et charge les scripts du thème
     */
    public function enqueueScripts()
    {
        // Script pour rendre les articles cliquables
        \wp_enqueue_script(
            'g2rd-clickable-articles',
            \get_template_directory_uri() . '/assets/js/clickable-articles.js',
            [],
            '1.0.0',
            true
        );
        
        // Script pour l'effet de particules
        \wp_enqueue_script(
            'g2rd-particles',
            \get_template_directory_uri() . '/assets/js/g2rd-particles.js',
            [],
            '1.0.0',
            true
        );
    }
} 