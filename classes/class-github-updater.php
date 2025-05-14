<?php

/**
 * Classe pour gérer les mises à jour du thème via GitHub
 *
 * Cette classe permet de vérifier et d'installer automatiquement les mises à jour
 * du thème depuis le dépôt GitHub. Elle s'intègre avec le système de mise à jour
 * natif de WordPress.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 */

namespace G2RD;

class GitHubUpdater
{
    /**
     * URL du dépôt GitHub
     *
     * @since 1.0.0
     * @var string
     */
    private $github_url = 'https://github.com/SebG2RD/G2RD-Theme-FSE';

    /**
     * Enregistre les hooks WordPress nécessaires
     *
     * Cette méthode ajoute les filtres WordPress requis pour intégrer
     * le système de mise à jour personnalisé dans l'interface d'administration.
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks()
    {
        \add_filter('pre_set_site_transient_update_themes', [$this, 'checkForUpdates']);
        \add_filter('themes_api', [$this, 'getThemeInfo'], 10, 3);
        \add_filter('upgrader_source_selection', [$this, 'preventThemeRename'], 10, 4);
    }

    /**
     * Vérifie les mises à jour disponibles
     *
     * Cette méthode compare la version actuelle du thème avec la dernière
     * version disponible sur GitHub et ajoute les informations de mise à jour
     * si nécessaire.
     *
     * @since 1.0.0
     * @param object $transient Données de mise à jour WordPress
     * @return object Données de mise à jour modifiées
     */
    public function checkForUpdates($transient)
    {
        // Si les données de mise à jour ne sont pas initialisées, on retourne le transient tel quel
        if (empty($transient->checked)) {
            return $transient;
        }

        $theme_slug = basename(\get_template_directory());
        $theme_data = \wp_get_theme($theme_slug);
        $current_version = $theme_data->get('Version');

        // Récupérer les informations de la dernière version depuis GitHub
        $response = \wp_remote_get('https://github.com/SebG2RD/G2RD-Theme/releases/latest', [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
                'User-Agent' => 'WordPress Theme Update Check'
            ]
        ]);

        if (\is_wp_error($response)) {
            return $transient;
        }

        $release_data = json_decode(\wp_remote_retrieve_body($response), true);

        if (empty($release_data) || !isset($release_data['tag_name'])) {
            return $transient;
        }

        $latest_version = ltrim($release_data['tag_name'], 'v');

        // Comparaison stricte des versions
        if (version_compare($current_version, $latest_version, '<')) {
            // Ajout des informations de mise à jour
            $transient->response[$theme_slug] = [
                'theme' => $theme_slug,
                'new_version' => $latest_version,
                'url' => $this->github_url,
                'package' => $release_data['zipball_url'],
                'requires' => '5.0', // Version minimale de WordPress requise
                'requires_php' => '7.4', // Version minimale de PHP requise
                'last_updated' => $release_data['published_at'],
                'sections' => [
                    'description' => $release_data['body'],
                    'changelog' => $release_data['body']
                ]
            ];
        } else {
            // Si la version est identique ou plus récente, on s'assure qu'il n'y a pas de notification
            unset($transient->response[$theme_slug]);
        }

        return $transient;
    }

    /**
     * Récupère les informations du thème pour l'API WordPress
     *
     * Cette méthode fournit les informations détaillées du thème pour
     * l'interface de mise à jour de WordPress, incluant la description,
     * le changelog et le lien de téléchargement.
     *
     * @since 1.0.0
     * @param bool|object $false Valeur par défaut
     * @param string $action Type d'action demandée
     * @param object $args Arguments de la requête
     * @return array|bool Informations du thème ou false
     */
    public function getThemeInfo($false, $action, $args)
    {
        if ($action !== 'theme_information') {
            return $false;
        }

        $theme_slug = basename(\get_template_directory());

        if ($args->slug !== $theme_slug) {
            return $false;
        }

        $response = \wp_remote_get('https://github.com/SebG2RD/G2RD-Theme/releases/latest');

        if (\is_wp_error($response)) {
            return $false;
        }

        $release_data = json_decode(\wp_remote_retrieve_body($response), true);

        if (empty($release_data)) {
            return $false;
        }

        return [
            'name' => 'G2RD Theme',
            'slug' => $theme_slug,
            'version' => ltrim($release_data['tag_name'], 'v'),
            'author' => 'Sebastien GERARD',
            'author_profile' => 'https://github.com/SebG2RD',
            'last_updated' => $release_data['published_at'],
            'homepage' => $this->github_url,
            'sections' => [
                'description' => $release_data['body'],
                'changelog' => $release_data['body'],
            ],
            'download_link' => $release_data['zipball_url'],
        ];
    }

    /**
     * Empêche le renommage du thème lors de la mise à jour
     *
     * Cette méthode intercepte le processus de mise à jour pour conserver
     * le nom original du dossier du thème.
     *
     * @since 1.0.0
     * @param string $source Chemin du dossier source
     * @param string $remote_source URL de la source distante
     * @param \WP_Upgrader $upgrader Instance de l'upgrader
     * @param array $args Arguments supplémentaires
     * @return string Chemin du dossier source modifié
     */
    public function preventThemeRename($source, $remote_source, $upgrader, $args)
    {
        if (!isset($args['theme'])) {
            return $source;
        }

        $theme_slug = basename(\get_template_directory());

        if ($args['theme'] !== $theme_slug) {
            return $source;
        }

        // Récupérer le nom du dossier source
        $source_dir = basename($source);

        // Si le dossier source ne correspond pas au slug du thème
        if ($source_dir !== $theme_slug) {
            // Créer un nouveau chemin avec le bon nom de dossier
            $new_source = dirname($source) . '/' . $theme_slug;

            // Renommer le dossier
            if (\rename($source, $new_source)) {
                return $new_source;
            }
        }

        return $source;
    }
}
