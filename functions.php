<?php

/**
 * Fichier principal du thème G2RD
 *
 * Ce fichier sert de point d'entrée pour le thème et initie les différentes
 * classes et fonctionnalités du thème.
 *
 * @package G2RD
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

// Inclure les fichiers des classes principales
require_once __DIR__ . '/classes/class-theme-setup.php';
require_once __DIR__ . '/classes/class-shortcode.php';
require_once __DIR__ . '/classes/class-block-editor-autoload.php';
require_once __DIR__ . '/classes/class-theme-admin.php';
require_once __DIR__ . '/classes/class-gsap-animations.php';
require_once __DIR__ . '/classes/class-json-config.php';
require_once __DIR__ . '/classes/class-scripts-manager.php';
require_once __DIR__ . '/classes/class-particules-effect.php';
require_once __DIR__ . '/classes/class-clickable-articles.php';
require_once __DIR__ . '/classes/class-github-updater.php';
require_once __DIR__ . '/classes/class-portfolio-query.php';
require_once __DIR__ . '/classes/classe-custom-post-types-portfolio.php';
require_once __DIR__ . '/classes/classe-custom-post-types-prestations.php';
require_once __DIR__ . '/classes/classe-custom-post-types-qui-sommes-nous.php';
require_once __DIR__ . '/classes/class-surecart-license-manager.php';

/**
 * Affiche un avertissement si la clé API n'est pas configurée
 */
function display_api_key_warning() {
    $screen = get_current_screen();
    // Ne pas afficher l'avertissement sur la page des paramètres du thème
    if ($screen && $screen->id === 'appearance_page_g2rd-theme-settings') {
        return;
    }
    ?>
    <div class="notice notice-warning is-dismissible">
        <p>
            <strong><?php _e('G2RD Theme - Configuration requise', 'g2rd'); ?></strong>
        </p>
        <p>
            <?php _e('La clé API SureCart n\'est pas configurée. Pour bénéficier des mises à jour du thème, veuillez configurer votre clé API.', 'g2rd'); ?>
        </p>
        <p>
            <a href="<?php echo esc_url(admin_url('themes.php?page=g2rd-theme-settings')); ?>" class="button button-primary">
                <?php _e('Configurer la clé API', 'g2rd'); ?>
            </a>
        </p>
    </div>
    <?php
}

/**
 * Initialise toutes les composantes du thème
 */
function bootstrap_theme()
{
    // Charger les traductions
    \load_theme_textdomain('G2RD', \get_template_directory() . '/languages');

    // Vérifier si la clé API SureCart est configurée
    // $surecart_api_key = get_option('g2rd_surecart_api_key');
    // if (empty($surecart_api_key)) {
    //     add_action('admin_notices', 'G2RD\\display_api_key_warning');
    // } else {
    //     // Initialiser le système de licences
    //     $license_manager = new SureCartLicenseManager($surecart_api_key);
    //     $github_updater = new GitHubUpdater($license_manager);
    // }

    // Instancier et initialiser les classes principales
    $classes = [
        ThemeSetup::class,
        CPT_Portfolio::class,
        CPT_Prestations::class,
        CPT_QuiSommesNous::class,
        BlockEditorAutoload::class,
        ThemeAdmin::class,
        GSAPAnimations::class,
        JsonConfig::class,
        ScriptsManager::class,
        ParticlesEffect::class,
        ClickableArticles::class,
        PortfolioQuery::class
    ];

    // Enregistrer les hooks pour chaque classe
    foreach ($classes as $class) {
        (new $class)->registerHooks();
    }

    // Instancier la classe Shortcode pour enregistrer les shortcodes
    if (class_exists('G2RD\\Shortcode')) {
        (new \G2RD\Shortcode())->registerHooks();
    }
}

// Démarrer le thème
bootstrap_theme();

// Inclusion explicite de la page d'options (hors namespace, à la fin)
require_once get_template_directory() . '/includes/license-init.php';
