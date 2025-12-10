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
require_once __DIR__ . '/classes/class-dark-mode.php';
require_once __DIR__ . '/classes/class-portfolio-universel-api.php';

/**
 * Affiche un avertissement si la clé API n'est pas configurée
 * 
 * NOTE: Cette fonction est désactivée car le système de licences est optionnel.
 * Le thème fonctionne parfaitement sans licence. Cette fonction peut être réactivée
 * si vous souhaitez informer les utilisateurs de la possibilité d'activer les mises à jour.
 */
function display_api_key_warning()
{
    // Désactivé : Le système de licences est optionnel
    // Le thème fonctionne sans licence, donc aucun avertissement n'est nécessaire
    return;

    /* Code commenté pour référence future
    $screen = get_current_screen();
    // Ne pas afficher l'avertissement sur la page des paramètres du thème
    if ($screen && $screen->id === 'appearance_page_g2rd-theme-settings') {
        return;
    }
    ?>
    <div class="notice notice-info is-dismissible">
        <p>
            <strong><?php _e('G2RD Theme - Mises à jour optionnelles', 'g2rd-theme'); ?></strong>
        </p>
        <p>
            <?php _e('Le thème fonctionne parfaitement sans licence. Pour bénéficier des mises à jour automatiques, vous pouvez configurer votre clé API SureCart (optionnel).', 'g2rd-theme'); ?>
        </p>
        <p>
            <a href="<?php echo esc_url(admin_url('themes.php?page=g2rd-license')); ?>" class="button button-secondary">
                <?php _e('Configurer les mises à jour (optionnel)', 'g2rd-theme'); ?>
            </a>
        </p>
    </div>
    <?php
    */
}

/**
 * Initialise toutes les composantes du thème
 */
function bootstrap_theme()
{
    // Charger les traductions
    \load_theme_textdomain('g2rd-theme', \get_template_directory() . '/languages');

    // Le système de licences est optionnel
    // Le thème fonctionne parfaitement sans licence
    // Les mises à jour automatiques ne sont disponibles que si une clé API est configurée

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
        \G2RD\DarkMode::class, // Gestion du mode sombre
        \G2RD\PortfolioUniverselAPI::class, // API REST pour le portfolio universel
    ];

    // Initialiser le système de licences (toujours, même sans clé API)
    // Le système de licences est complètement optionnel - le thème fonctionne sans
    // Le menu de licence est toujours accessible pour permettre la configuration
    $api_key = defined('G2RD_SURECART_API_KEY') ? G2RD_SURECART_API_KEY : '';
    $api_key_from_option = get_option('g2rd_surecart_api_key', '');

    // Utiliser la clé API depuis la constante ou l'option
    $final_api_key = !empty($api_key) ? $api_key : $api_key_from_option;

    // Toujours initialiser le gestionnaire de licences (même sans clé API)
    // pour que le menu soit accessible et permettre la configuration
    $license_manager = new \G2RD\SureCartLicenseManager($final_api_key);
    $license_manager->registerHooks();

    // Initialiser le gestionnaire de mises à jour GitHub uniquement si une clé API est fournie
    // Les mises à jour automatiques ne sont disponibles que si une licence est configurée
    if (!empty($final_api_key)) {
        $github_updater = new \G2RD\GitHubUpdater($license_manager);
        $github_updater->registerHooks();
    }

    // Initialiser les autres classes
    foreach ($classes as $class) {
        (new $class)->registerHooks();
    }
}

// Démarrer le thème
bootstrap_theme();

// Inclusion optionnelle de la page d'options de licence (hors namespace, à la fin)
// Ce fichier est optionnel et ne bloque pas le fonctionnement du thème
if (file_exists(get_template_directory() . '/includes/license-init.php')) {
    require_once get_template_directory() . '/includes/license-init.php';
}
