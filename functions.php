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

use WP_Block_Type_Registry;

// Définition de la clé API SureCart
if (!defined('G2RD_SURECART_API_KEY')) {
    define('G2RD_SURECART_API_KEY', '');
}

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
require_once __DIR__ . '/classes/class-block-patterns.php';
require_once __DIR__ . '/classes/class-block-styles.php';
require_once __DIR__ . '/classes/class-block-categories.php';
require_once __DIR__ . '/classes/class-glass-effect.php';
require_once __DIR__ . '/classes/class-carousel-assets.php';

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

    // Liste des classes à initialiser
    $classes = [
        \G2RD\ThemeSetup::class,
        \G2RD\BlockEditorAutoload::class,
        \G2RD\ScriptsManager::class,
        \G2RD\BlockPatterns::class,
        \G2RD\BlockStyles::class,
        \G2RD\BlockCategories::class,
        \G2RD\ClickableArticles::class,
        \G2RD\ParticlesEffect::class,
        \G2RD\GSAPAnimations::class,
        \G2RD\PortfolioQuery::class,
        \G2RD\ThemeAdmin::class,
        \G2RD\CPT_Portfolio::class,
        \G2RD\CPT_QuiSommesNous::class,
        \G2RD\CPT_Prestations::class,
        \G2RD\Shortcode::class,
        \G2RD\JsonConfig::class,
        \G2RD\GlassEffect::class,
        \G2RD\CarouselAssets::class, // Ajout du gestionnaire d'assets carrousel
    ];

    // Initialiser d'abord le gestionnaire de licences
    $api_key = defined('G2RD_SURECART_API_KEY') ? G2RD_SURECART_API_KEY : '';
    $license_manager = new \G2RD\SureCartLicenseManager($api_key);
    $license_manager->registerHooks();

    // Initialiser le gestionnaire de mises à jour GitHub avec le gestionnaire de licences
    $github_updater = new \G2RD\GitHubUpdater($license_manager);
    $github_updater->registerHooks();

    // Initialiser les autres classes
    foreach ($classes as $class) {
        (new $class)->registerHooks();
    }
}

// Démarrer le thème
bootstrap_theme();

// Inclusion explicite de la page d'options (hors namespace, à la fin)
require_once get_template_directory() . '/includes/license-init.php';

// Forcer Dashicons dans l'éditeur Gutenberg
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_style('dashicons');
});
