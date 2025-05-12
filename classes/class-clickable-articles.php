<?php
/**
 * Gestion des articles cliquables
 * 
 * Cette classe gère la fonctionnalité des articles cliquables,
 * permettant de rendre l'ensemble d'un article interactif.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Gestion des articles cliquables
 * 
 * Cette classe gère l'ajout et la configuration de la fonctionnalité
 * de clic sur les articles dans les blocs de type group.
 *
 * @package G2RD
 * @since 1.0.0
 */
class ClickableArticles
{
    /**
     * Enregistre les hooks nécessaires pour les articles cliquables
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        // Charger les scripts sur le frontend
        \add_action('wp_enqueue_scripts', [$this, 'registerFrontendScripts']);

        // Charger les contrôles de bloc dans l'éditeur
        \add_action('enqueue_block_editor_assets', [$this, 'registerEditorScripts']);

        // Ajouter l'attribut data-clickable-articles aux blocs
        \add_filter('render_block', [$this, 'addClickableAttribute'], 10, 2);
    }

    /**
     * Enregistre et charge les scripts pour le frontend
     *
     * @since 1.0.0
     * @return void
     */
    public function registerFrontendScripts(): void
    {
        // Charger le script uniquement sur le frontend
        if (!\is_admin()) {
            \wp_enqueue_script(
                'g2rd-clickable-articles',
                \get_template_directory_uri() . '/assets/js/clickable-articles.js',
                [],
                \filemtime(\get_template_directory() . '/assets/js/clickable-articles.js'),
                true
            );
        }
    }

    /**
     * Enregistre et charge les contrôles dans l'éditeur
     *
     * @since 1.0.0
     * @return void
     */
    public function registerEditorScripts(): void
    {
        \wp_enqueue_script(
            'g2rd-clickable-articles-sidebar',
            \get_template_directory_uri() . '/assets/js/g2rd-clickable-articles-sidebar.js',
            [
                'wp-blocks',
                'wp-dom-ready',
                'wp-element',
                'wp-components',
                'wp-block-editor',
                'wp-compose',
                'wp-data',
                'wp-i18n',
                'wp-hooks',
            ],
            \filemtime(\get_template_directory() . '/assets/js/g2rd-clickable-articles-sidebar.js'),
            true
        );
    }

    /**
     * Ajoute l'attribut data-clickable-articles aux blocs de type group et columns
     *
     * @since 1.0.0
     * @param string $block_content Le contenu HTML du bloc
     * @param array  $block        Les informations du bloc
     * @return string Le contenu HTML modifié
     */
    public function addClickableAttribute(string $block_content, array $block): string
    {
        // Vérifier si c'est un bloc de type group ou columns
        if ($block['blockName'] !== 'core/group' && $block['blockName'] !== 'core/columns') {
            return $block_content;
        }

        // Vérifier si l'option clickableArticles est activée
        if (!isset($block['attrs']['clickableArticles']) || !$block['attrs']['clickableArticles']) {
            return $block_content;
        }

        // Ajouter l'attribut data-clickable-articles
        $class_name = $block['blockName'] === 'core/group' ? 'wp-block-group' : 'wp-block-columns';

        // Utiliser une expression régulière pour s'assurer que nous remplaçons la classe correctement
        $pattern = '/class="' . preg_quote($class_name, '/') . '([^"]*)"/';
        $replacement = 'class="' . $class_name . '$1" data-clickable-articles="true"';

        $block_content = preg_replace($pattern, $replacement, $block_content);

        // Ajouter la classe g2rd-clickable-article aux articles dans le bloc
        if (strpos($block_content, '<article') !== false || strpos($block_content, 'wp-block-post') !== false) {
            // Ajouter la classe aux articles
            $block_content = preg_replace(
                '/<article([^>]*)class="([^"]*)"/',
                '<article$1class="$2 g2rd-clickable-article"',
                $block_content
            );

            // Ajouter la classe aux blocs de post
            $block_content = preg_replace(
                '/<div([^>]*)class="([^"]*wp-block-post[^"]*)"/',
                '<div$1class="$2 g2rd-clickable-article"',
                $block_content
            );
        }

        return $block_content;
    }
}
