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
        if (empty($transient->checked)) {
            return $transient;
        }

        $theme_slug = basename(\get_template_directory());
        $theme_data = \wp_get_theme($theme_slug);
        $current_version = $theme_data->get('Version');

        // Récupérer les informations de la dernière version depuis GitHub
        $response = \wp_remote_get('https://api.github.com/repos/SebG2RD/G2RD-Theme-FSE/releases/latest');

        if (\is_wp_error($response)) {
            return $transient;
        }

        $release_data = json_decode(\wp_remote_retrieve_body($response), true);

        if (empty($release_data) || !isset($release_data['tag_name'])) {
            return $transient;
        }

        $latest_version = ltrim($release_data['tag_name'], 'v');

        if (version_compare($current_version, $latest_version, '<')) {
            $transient->response[$theme_slug] = [
                'theme' => $theme_slug,
                'new_version' => $latest_version,
                'url' => $this->github_url,
                'package' => $release_data['zipball_url'],
            ];
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

        $response = \wp_remote_get('https://api.github.com/repos/SebG2RD/G2RD-Theme-FSE/releases/latest');

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
}
