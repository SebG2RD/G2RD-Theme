<?php

namespace G2RD;

/**
 * Gestion des requêtes personnalisées pour le portfolio
 * 
 * Cette classe gère les requêtes personnalisées pour afficher les projets
 * en fonction du membre de l'équipe.
 *
 * @package G2RD
 * @since 1.0.0
 */
class PortfolioQuery
{
    /**
     * Enregistre les hooks nécessaires
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        \add_filter('query_loop_block_query_vars', [$this, 'filterPortfolioQuery'], 10, 2);
    }

    /**
     * Filtre la requête pour afficher les projets par membre
     *
     * @since 1.0.0
     * @param array $query_args Arguments de la requête
     * @param \WP_Block $block Instance du bloc
     * @return array Arguments de la requête modifiés
     */
    public function filterPortfolioQuery($query_args, $block): array
    {
        // Vérifier si nous sommes sur une page single-qui-sommes-nous
        if (!\is_singular('qui-sommes-nous')) {
            return $query_args;
        }

        // Vérifier si c'est bien une requête pour le portfolio
        if ($query_args['post_type'] !== 'portfolio') {
            return $query_args;
        }

        // On récupère le prénom du membre depuis le titre de la page "qui-sommes-nous"
        $member_name = \get_the_title();

        // On filtre sur la taxonomie 'qui' (nouveau nom)
        $query_args['tax_query'] = [
            [
                'taxonomy' => 'qui',
                'field'    => 'name',
                'terms'    => $member_name,
            ],
        ];

        // Activer le débogage pour voir la requête SQL
        if (defined('WP_DEBUG') && WP_DEBUG) {
            \add_filter('posts_request', function ($sql) {
                error_log('Portfolio Query SQL: ' . $sql);
                return $sql;
            });
        }

        return $query_args;
    }
}
