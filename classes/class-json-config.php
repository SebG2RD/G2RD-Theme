<?php

namespace G2RD;

class JsonConfig
{
    # La configuration récupérée en JSON
    public $configurationData = [];

    # Mise en place des hooks impactés par la configuration
    public function registerHooks(): void
    {
        # Charger le fichier de configuration et stocker les données
        $this->configurationData = $this->loadJsonConfig();

        # Assigner les hooks pour appliquer les différentes configurations
        foreach ($this->configurationData as $key => $data) {

            switch ($key) {
                case 'registerBlocksCategories':
                    add_filter('block_categories_all', [$this, 'registerBlocksCategories']);
                    break;
                case 'registerPatternsCategories':
                    add_action('init', [$this, 'registerPatternsCategories']);
                    break;
                case 'deregisterBlocks':
                    add_filter('allowed_block_types_all', [$this, 'deregisterBlocks']);
                    break;
                case 'deregisterBlocksStylesheets':
                    add_action('wp_enqueue_scripts', [$this, 'deregisterBlocksStylesheets']);
                    break;
                case 'deregisterBlocksStyles':
                    add_action('enqueue_block_editor_assets', [$this, 'deregisterBlocksStyles']);
                    break;
                default:
                    break;
            }
        }
    }

    # Déclarer de nouvelles catégories pour les blocs sur-mesure
    public function registerBlocksCategories($categories): array
    {
        $block_categories_to_register = $this->getConfigDataByKey('registerBlocksCategories');

        # New categories will appear at the top
        $new_categories = [];

        foreach ($block_categories_to_register as $slug => $title) {
            $new_categories[] = [
                'slug' => $slug,
                'title' => $title,
                'icon' => null
            ];
        }

        return array_merge($new_categories, $categories);
    }

    # Déclarer de nouvelles catégories de compositions
    public function registerPatternsCategories(): void
    {
        $patterns = $this->getConfigDataByKey('registerPatternsCategories');

        foreach ($patterns as $name => $label) {
            $category = ['label' => $label];
            register_block_pattern_category($name, $category);
        }
    }

    # Retirer certains blocs par défaut de l'éditeur
    public function deregisterBlocks(): array
    {
        $blocks_to_disable = $this->getConfigDataByKey('deregisterBlocks');

        $blocks = array_keys(\WP_Block_Type_Registry::get_instance()->get_all_registered());

        return array_values(array_diff($blocks, $blocks_to_disable));
    }

    # Retirer les feuilles de styles natives de certains blocs
    public function deregisterBlocksStylesheets(): void
    {
        $blocks_stylesheets_to_disable = $this->getConfigDataByKey('deregisterBlocksStylesheets');

        foreach ($blocks_stylesheets_to_disable as $block) {
            $handle = str_replace('core/', '', $block);
            wp_dequeue_style("wp-block-$handle");
        }
    }

    # Retirer certains styles de blocs par défaut
    public function deregisterBlocksStyles(): void
    {
        $blocks_styles_to_disable = $this->getConfigDataByKey('deregisterBlocksStyles');

        # Charger le script dédié
        wp_enqueue_script(
            'unregister-styles',
            get_template_directory_uri() . '/assets/js/unregister-blocks-styles.js',
            ['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
            wp_get_theme()->get('Version'),
            true
        );

        # Créer un objet JS pour les styles à désactiver
        $inline_js = "var disableBlocksStyles = " . json_encode($blocks_styles_to_disable) . ";\n";

        # Ajouter la variable dans la page HTML avant le script
        wp_add_inline_script('unregister-styles', $inline_js, 'before');
    }

    # Charger le fichier de configuration JSON
    protected function loadJsonConfig(): array
    {
        $filename = 'configuration.json';

        # Tester l'existence du fichier dans le thème
        if (!file_exists(get_template_directory() . '/' . $filename)) {
            return [];
        }

        # Extraire le JSON et l'interpréter
        $config_raw = file_get_contents(get_template_directory() . '/' . $filename);
        $config = json_decode($config_raw, true);

        # Vérifier que les données sont valides
        if (!is_array($config)) {
            throw new \Exception('Configuration file is not valid');
        }

        return $config;
    }

    # Récupérer une clé de la configuration 
    protected function getConfigDataByKey($key): array
    {
        return $this->configurationData[$key] ?? [];
    }
}
