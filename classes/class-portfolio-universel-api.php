<?php

/**
 * API REST pour le bloc Portfolio Universel Filtrable
 * 
 * Cette classe gère les endpoints REST pour récupérer les posts, CPT et produits WooCommerce
 * avec filtres dynamiques (catégories, tags, taxonomies, date, auteur, recherche).
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 */

namespace G2RD;

/**
 * Classe PortfolioUniverselAPI
 * 
 * Gère les endpoints REST API pour le bloc portfolio universel.
 */
class PortfolioUniverselAPI
{
    /**
     * Enregistre les hooks nécessaires
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks(): void
    {
        add_action('rest_api_init', [$this, 'registerRoutes']);
    }

    /**
     * Enregistre les routes REST API
     *
     * @since 1.0.0
     * @return void
     */
    public function registerRoutes(): void
    {
        // Route pour récupérer les posts avec filtres
        register_rest_route('g2rd/v1', '/portfolio-universel', [
            'methods' => 'GET',
            'callback' => [$this, 'getPortfolioItems'],
            'permission_callback' => '__return_true', // Public, pas besoin d'authentification
            'args' => [
                'post_types' => [
                    'description' => 'Types de posts à récupérer (séparés par des virgules)',
                    'type' => 'string',
                    'default' => 'post',
                ],
                'include_woocommerce' => [
                    'description' => 'Inclure les produits WooCommerce',
                    'type' => 'boolean',
                    'default' => false,
                ],
                'per_page' => [
                    'description' => 'Nombre d\'éléments par page',
                    'type' => 'integer',
                    'default' => 12,
                    'minimum' => 1,
                    'maximum' => 100,
                ],
                'page' => [
                    'description' => 'Numéro de page',
                    'type' => 'integer',
                    'default' => 1,
                    'minimum' => 1,
                ],
                'categories' => [
                    'description' => 'IDs des catégories (séparés par des virgules)',
                    'type' => 'string',
                ],
                'tags' => [
                    'description' => 'IDs des tags (séparés par des virgules)',
                    'type' => 'string',
                ],
                'taxonomies' => [
                    'description' => 'Taxonomies custom au format JSON: {"taxonomy_name": [ids]}',
                    'type' => 'string',
                ],
                'date_from' => [
                    'description' => 'Date de début (format YYYY-MM-DD)',
                    'type' => 'string',
                ],
                'date_to' => [
                    'description' => 'Date de fin (format YYYY-MM-DD)',
                    'type' => 'string',
                ],
                'author' => [
                    'description' => 'ID de l\'auteur',
                    'type' => 'integer',
                ],
                'search' => [
                    'description' => 'Terme de recherche (titre et contenu)',
                    'type' => 'string',
                ],
                'orderby' => [
                    'description' => 'Ordre de tri',
                    'type' => 'string',
                    'default' => 'date',
                    'enum' => ['date', 'title', 'modified', 'menu_order', 'rand'],
                ],
                'order' => [
                    'description' => 'Direction du tri',
                    'type' => 'string',
                    'default' => 'DESC',
                    'enum' => ['ASC', 'DESC'],
                ],
            ],
        ]);

        // Route pour récupérer les filtres disponibles (catégories, tags, taxonomies, auteurs)
        register_rest_route('g2rd/v1', '/portfolio-universel/filters', [
            'methods' => 'GET',
            'callback' => [$this, 'getAvailableFilters'],
            'permission_callback' => '__return_true',
            'args' => [
                'post_types' => [
                    'description' => 'Types de posts (séparés par des virgules)',
                    'type' => 'string',
                    'default' => 'post',
                ],
                'include_woocommerce' => [
                    'description' => 'Inclure les produits WooCommerce',
                    'type' => 'boolean',
                    'default' => false,
                ],
            ],
        ]);

        // Route pour récupérer les types de posts disponibles (incluant les CPT)
        register_rest_route('g2rd/v1', '/portfolio-universel/post-types', [
            'methods' => 'GET',
            'callback' => [$this, 'getAvailablePostTypes'],
            'permission_callback' => '__return_true',
        ]);

        // Route pour récupérer les couleurs du thème
        register_rest_route('g2rd/v1', '/portfolio-universel/theme-colors', [
            'methods' => 'GET',
            'callback' => [$this, 'getThemeColors'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Récupère les éléments du portfolio avec filtres
     *
     * @param \WP_REST_Request $request Requête REST
     * @return \WP_REST_Response Réponse avec les éléments
     */
    public function getPortfolioItems(\WP_REST_Request $request)
    {
        // Récupérer les paramètres
        $post_types = explode(',', $request->get_param('post_types'));
        $post_types = array_map('trim', $post_types);
        $include_woocommerce = $request->get_param('include_woocommerce');
        $per_page = (int) $request->get_param('per_page');
        $page = (int) $request->get_param('page');
        $offset = ($page - 1) * $per_page;

        // Ajouter WooCommerce si demandé
        if ($include_woocommerce && post_type_exists('product')) {
            $post_types[] = 'product';
        }

        // Filtrer les post types pour ne garder que ceux qui existent
        $valid_post_types = [];
        foreach ($post_types as $post_type) {
            if (post_type_exists($post_type)) {
                $valid_post_types[] = $post_type;
            }
        }

        // Si aucun type valide, retourner une réponse vide
        if (empty($valid_post_types)) {
            return new \WP_REST_Response([
                'items' => [],
                'total' => 0,
                'pages' => 0,
                'current_page' => $page,
                'per_page' => $per_page,
            ], 200);
        }

        // Construire la requête WP_Query
        $args = [
            'post_type' => $valid_post_types,
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'offset' => $offset,
            'orderby' => $request->get_param('orderby'),
            'order' => $request->get_param('order'),
        ];

        // Filtre par catégories et tags (gérer posts et WooCommerce)
        $tax_query = [];

        if ($categories = $request->get_param('categories')) {
            $category_ids = array_map('intval', explode(',', $categories));
            // Séparer les catégories posts et WooCommerce
            $post_cats = [];
            $product_cats = [];
            foreach ($category_ids as $cat_id) {
                $term = get_term($cat_id);
                if ($term && !is_wp_error($term)) {
                    if ($term->taxonomy === 'product_cat') {
                        $product_cats[] = $cat_id;
                    } else {
                        $post_cats[] = $cat_id;
                    }
                }
            }
            if (!empty($post_cats)) {
                $args['category__in'] = $post_cats;
            }
            if (!empty($product_cats)) {
                $tax_query[] = [
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id',
                    'terms' => $product_cats,
                ];
            }
        }

        if ($tags = $request->get_param('tags')) {
            $tag_ids = array_map('intval', explode(',', $tags));
            // Séparer les tags posts et WooCommerce
            $post_tags = [];
            $product_tags = [];
            foreach ($tag_ids as $tag_id) {
                $term = get_term($tag_id);
                if ($term && !is_wp_error($term)) {
                    if ($term->taxonomy === 'product_tag') {
                        $product_tags[] = $tag_id;
                    } else {
                        $post_tags[] = $tag_id;
                    }
                }
            }
            if (!empty($post_tags)) {
                $args['tag__in'] = $post_tags;
            }
            if (!empty($product_tags)) {
                $tax_query[] = [
                    'taxonomy' => 'product_tag',
                    'field' => 'term_id',
                    'terms' => $product_tags,
                ];
            }
        }

        // Filtre par taxonomies custom
        if ($taxonomies = $request->get_param('taxonomies')) {
            $tax_data = json_decode($taxonomies, true);
            if (is_array($tax_data)) {
                foreach ($tax_data as $taxonomy => $term_ids) {
                    if (!empty($term_ids) && is_array($term_ids)) {
                        $tax_query[] = [
                            'taxonomy' => sanitize_key($taxonomy),
                            'field' => 'term_id',
                            'terms' => array_map('intval', $term_ids),
                        ];
                    }
                }
            }
        }

        // Ajouter la tax_query si nécessaire
        if (!empty($tax_query)) {
            if (count($tax_query) > 1) {
                $tax_query['relation'] = 'AND';
            }
            $args['tax_query'] = $tax_query;
        }

        // Filtre par date
        $date_from = $request->get_param('date_from');
        $date_to = $request->get_param('date_to');
        if ($date_from || $date_to) {
            $date_query = [];
            if ($date_from) {
                $date_query['after'] = sanitize_text_field($date_from);
            }
            if ($date_to) {
                $date_query['before'] = sanitize_text_field($date_to);
            }
            if (!empty($date_query)) {
                $args['date_query'] = [$date_query];
            }
        }

        // Filtre par auteur
        if ($author = $request->get_param('author')) {
            $args['author'] = (int) $author;
        }

        // Recherche (titre et contenu)
        if ($search = $request->get_param('search')) {
            $args['s'] = sanitize_text_field($search);
        }

        // Exécuter la requête
        $query = new \WP_Query($args);

        // Formater les résultats
        $items = [];
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();
                $post_type = get_post_type();

                // Récupérer l'image mise en avant
                $featured_image = '';
                $featured_image_alt = '';
                if (has_post_thumbnail($post_id)) {
                    $image_id = get_post_thumbnail_id($post_id);
                    $image = wp_get_attachment_image_src($image_id, 'large');
                    $featured_image = $image ? $image[0] : '';
                    $featured_image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                }

                // Récupérer les catégories et tags
                $categories = [];
                $tags = [];

                if ($post_type === 'product') {
                    // Pour WooCommerce
                    $terms = wp_get_post_terms($post_id, 'product_cat');
                    foreach ($terms as $term) {
                        $categories[] = [
                            'id' => $term->term_id,
                            'name' => $term->name,
                            'slug' => $term->slug,
                        ];
                    }
                    $terms = wp_get_post_terms($post_id, 'product_tag');
                    foreach ($terms as $term) {
                        $tags[] = [
                            'id' => $term->term_id,
                            'name' => $term->name,
                            'slug' => $term->slug,
                        ];
                    }
                } elseif ($post_type === 'post') {
                    // Pour les posts standards
                    $cats = get_the_category($post_id);
                    foreach ($cats as $cat) {
                        $categories[] = [
                            'id' => $cat->term_id,
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                        ];
                    }
                    $post_tags = get_the_tags($post_id);
                    if ($post_tags) {
                        foreach ($post_tags as $tag) {
                            $tags[] = [
                                'id' => $tag->term_id,
                                'name' => $tag->name,
                                'slug' => $tag->slug,
                            ];
                        }
                    }
                } else {
                    // Pour les CPT : chercher les taxonomies de type "category" et "tag"
                    $taxonomies = get_object_taxonomies($post_type, 'objects');
                    foreach ($taxonomies as $taxonomy) {
                        if ($taxonomy->hierarchical) {
                            // Taxonomie hiérarchique (comme category)
                            $terms = wp_get_post_terms($post_id, $taxonomy->name);
                            foreach ($terms as $term) {
                                $categories[] = [
                                    'id' => $term->term_id,
                                    'name' => $term->name,
                                    'slug' => $term->slug,
                                ];
                            }
                        } else {
                            // Taxonomie non-hiérarchique (comme tag)
                            $terms = wp_get_post_terms($post_id, $taxonomy->name);
                            foreach ($terms as $term) {
                                $tags[] = [
                                    'id' => $term->term_id,
                                    'name' => $term->name,
                                    'slug' => $term->slug,
                                ];
                            }
                        }
                    }
                }

                // Récupérer les taxonomies custom
                $custom_taxonomies = [];
                $taxonomies = get_object_taxonomies($post_type, 'objects');
                foreach ($taxonomies as $taxonomy) {
                    if (!in_array($taxonomy->name, ['category', 'post_tag', 'product_cat', 'product_tag'])) {
                        $terms = wp_get_post_terms($post_id, $taxonomy->name);
                        if (!empty($terms)) {
                            $custom_taxonomies[$taxonomy->name] = [];
                            foreach ($terms as $term) {
                                $custom_taxonomies[$taxonomy->name][] = [
                                    'id' => $term->term_id,
                                    'name' => $term->name,
                                    'slug' => $term->slug,
                                ];
                            }
                        }
                    }
                }

                // Informations sur l'auteur
                $author_id = get_post_field('post_author', $post_id);
                $author = [
                    'id' => $author_id,
                    'name' => get_the_author_meta('display_name', $author_id),
                    'url' => get_author_posts_url($author_id),
                ];

                // Prix pour WooCommerce
                $price = '';
                $price_html = '';
                if ($post_type === 'product' && function_exists('wc_get_product')) {
                    $product = wc_get_product($post_id);
                    if ($product) {
                        $price = $product->get_price();
                        $price_html = $product->get_price_html();
                    }
                }

                $items[] = [
                    'id' => $post_id,
                    'title' => get_the_title(),
                    'excerpt' => get_the_excerpt(),
                    'content' => get_the_content(),
                    'link' => get_permalink(),
                    'date' => get_the_date('c'),
                    'dateFormatted' => get_the_date(),
                    'modified' => get_the_modified_date('c'),
                    'postType' => $post_type,
                    'featuredImage' => $featured_image,
                    'featuredImageAlt' => $featured_image_alt,
                    'categories' => $categories,
                    'tags' => $tags,
                    'taxonomies' => $custom_taxonomies,
                    'author' => $author,
                    'price' => $price,
                    'priceHtml' => $price_html,
                ];
            }
            wp_reset_postdata();
        }

        // Retourner la réponse
        return new \WP_REST_Response([
            'items' => $items,
            'total' => (int) $query->found_posts,
            'pages' => (int) $query->max_num_pages,
            'current_page' => $page,
            'per_page' => $per_page,
        ], 200);
    }

    /**
     * Récupère les filtres disponibles
     *
     * @param \WP_REST_Request $request Requête REST
     * @return \WP_REST_Response Réponse avec les filtres
     */
    public function getAvailableFilters(\WP_REST_Request $request)
    {
        $post_types = explode(',', $request->get_param('post_types'));
        $post_types = array_map('trim', $post_types);
        $include_woocommerce = $request->get_param('include_woocommerce');

        if ($include_woocommerce && post_type_exists('product')) {
            $post_types[] = 'product';
        }

        $filters = [
            'categories' => [],
            'tags' => [],
            'taxonomies' => [],
            'authors' => [],
        ];

        // Récupérer les catégories et tags pour tous les post types
        $category_taxonomies = [];
        $tag_taxonomies = [];

        // Pour chaque post type, identifier ses taxonomies
        foreach ($post_types as $post_type) {
            if (!post_type_exists($post_type)) {
                continue;
            }

            $taxonomies = get_object_taxonomies($post_type, 'objects');
            foreach ($taxonomies as $taxonomy) {
                // Identifier les taxonomies de type "category" (hiérarchiques)
                if ($taxonomy->hierarchical && !in_array($taxonomy->name, ['product_cat'])) {
                    if (!in_array($taxonomy->name, $category_taxonomies)) {
                        $category_taxonomies[] = $taxonomy->name;
                    }
                }
                // Identifier les taxonomies de type "tag" (non-hiérarchiques)
                if (!$taxonomy->hierarchical && !in_array($taxonomy->name, ['product_tag', 'post_tag'])) {
                    if (!in_array($taxonomy->name, $tag_taxonomies)) {
                        $tag_taxonomies[] = $taxonomy->name;
                    }
                }
            }
        }

        // Récupérer les catégories (posts standards)
        if (in_array('post', $post_types)) {
            $categories = get_categories(['hide_empty' => true]);
            foreach ($categories as $cat) {
                $filters['categories'][] = [
                    'id' => $cat->term_id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'count' => $cat->count,
                ];
            }
        }

        // Récupérer les catégories WooCommerce si activé
        if ($include_woocommerce && taxonomy_exists('product_cat')) {
            $product_cats = get_terms([
                'taxonomy' => 'product_cat',
                'hide_empty' => true,
            ]);
            if (!is_wp_error($product_cats)) {
                foreach ($product_cats as $cat) {
                    $filters['categories'][] = [
                        'id' => $cat->term_id,
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                        'count' => $cat->count,
                    ];
                }
            }
        }

        // Récupérer les catégories des CPT (taxonomies hiérarchiques)
        foreach ($category_taxonomies as $taxonomy_name) {
            $terms = get_terms([
                'taxonomy' => $taxonomy_name,
                'hide_empty' => true,
            ]);
            if (!is_wp_error($terms)) {
                foreach ($terms as $term) {
                    $filters['categories'][] = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                        'count' => $term->count,
                    ];
                }
            }
        }

        // Récupérer les tags (posts standards)
        if (in_array('post', $post_types)) {
            $tags = get_tags(['hide_empty' => true]);
            foreach ($tags as $tag) {
                $filters['tags'][] = [
                    'id' => $tag->term_id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'count' => $tag->count,
                ];
            }
        }

        // Récupérer les tags WooCommerce si activé
        if ($include_woocommerce && taxonomy_exists('product_tag')) {
            $product_tags = get_terms([
                'taxonomy' => 'product_tag',
                'hide_empty' => true,
            ]);
            if (!is_wp_error($product_tags)) {
                foreach ($product_tags as $tag) {
                    $filters['tags'][] = [
                        'id' => $tag->term_id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                        'count' => $tag->count,
                    ];
                }
            }
        }

        // Récupérer les tags des CPT (taxonomies non-hiérarchiques)
        foreach ($tag_taxonomies as $taxonomy_name) {
            $terms = get_terms([
                'taxonomy' => $taxonomy_name,
                'hide_empty' => true,
            ]);
            if (!is_wp_error($terms)) {
                foreach ($terms as $term) {
                    $filters['tags'][] = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                        'count' => $term->count,
                    ];
                }
            }
        }

        // Récupérer les taxonomies custom pour chaque post type
        foreach ($post_types as $post_type) {
            $taxonomies = get_object_taxonomies($post_type, 'objects');
            foreach ($taxonomies as $taxonomy) {
                if (!in_array($taxonomy->name, ['category', 'post_tag', 'product_cat', 'product_tag'])) {
                    if (!isset($filters['taxonomies'][$taxonomy->name])) {
                        $filters['taxonomies'][$taxonomy->name] = [
                            'name' => $taxonomy->label,
                            'slug' => $taxonomy->name,
                            'terms' => [],
                        ];
                    }
                    $terms = get_terms([
                        'taxonomy' => $taxonomy->name,
                        'hide_empty' => true,
                    ]);
                    if (!is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            $filters['taxonomies'][$taxonomy->name]['terms'][] = [
                                'id' => $term->term_id,
                                'name' => $term->name,
                                'slug' => $term->slug,
                                'count' => $term->count,
                            ];
                        }
                    }
                }
            }
        }

        // Récupérer les auteurs
        $authors = get_users([
            'has_published_posts' => $post_types,
            'fields' => ['ID', 'display_name', 'user_nicename'],
        ]);
        foreach ($authors as $author) {
            $filters['authors'][] = [
                'id' => $author->ID,
                'name' => $author->display_name,
                'slug' => $author->user_nicename,
            ];
        }

        return new \WP_REST_Response($filters, 200);
    }

    /**
     * Récupère les types de posts disponibles (incluant les CPT)
     *
     * @param \WP_REST_Request $request Requête REST
     * @return \WP_REST_Response Réponse avec les types de posts
     */
    public function getAvailablePostTypes(\WP_REST_Request $request)
    {
        $post_types_list = [];
        $added_types = []; // Pour éviter les doublons

        // Mapping des CPT connus vers leurs noms d'options
        $known_cpts_mapping = [
            'portfolio' => 'g2rd_cpt_portfolio_enabled',
            'prestations' => 'g2rd_cpt_prestations_enabled',
            'qui-sommes-nous' => 'g2rd_cpt_qui_sommes_nous_enabled',
        ];

        // D'abord, vérifier les CPT connus du thème même s'ils ne sont pas encore enregistrés
        foreach ($known_cpts_mapping as $cpt_key => $option_key) {
            $is_enabled = get_option($option_key, '0') === '1';

            if ($is_enabled) {
                // Le CPT est activé, vérifier s'il est enregistré
                $post_type_obj = get_post_type_object($cpt_key);

                if ($post_type_obj) {
                    // CPT enregistré, l'ajouter à la liste
                    $post_types_list[] = [
                        'value' => $cpt_key,
                        'label' => $post_type_obj->label ?: $cpt_key,
                        'name' => $post_type_obj->name,
                        'rest_base' => $post_type_obj->rest_base ?? $cpt_key,
                    ];
                    $added_types[] = $cpt_key;
                } else {
                    // CPT activé mais pas encore enregistré (peut arriver si l'option est activée mais le CPT n'est pas chargé)
                    // On l'ajoute quand même avec un label par défaut
                    $labels = [
                        'portfolio' => 'Portfolio',
                        'prestations' => 'Prestations',
                        'qui-sommes-nous' => 'Qui sommes-nous',
                    ];
                    $post_types_list[] = [
                        'value' => $cpt_key,
                        'label' => $labels[$cpt_key] ?? ucfirst(str_replace('-', ' ', $cpt_key)),
                        'name' => $cpt_key,
                        'rest_base' => $cpt_key,
                    ];
                    $added_types[] = $cpt_key;
                }
            }
        }

        // Récupérer tous les autres types de posts publics
        $post_types = get_post_types([
            'public' => true,
        ], 'objects');

        // Types à exclure
        $excluded_types = [
            'attachment',
            'wp_block',
            'wp_navigation',
            'wp_template',
            'wp_template_part',
            'revision',
            'nav_menu_item',
            'page', // On n'inclut pas les pages par défaut
        ];

        foreach ($post_types as $post_type_key => $post_type_obj) {
            // Ignorer les types déjà ajoutés
            if (in_array($post_type_key, $added_types)) {
                continue;
            }

            // Exclure les types système
            if (in_array($post_type_key, $excluded_types)) {
                continue;
            }

            // Vérifier que le type est bien public
            if (!$post_type_obj->public) {
                continue;
            }

            // Vérifier show_in_rest (peut être true, false, ou un objet)
            $show_in_rest = $post_type_obj->show_in_rest;
            if ($show_in_rest === false || $show_in_rest === '0') {
                continue;
            }

            // Ajouter le type à la liste
            $post_types_list[] = [
                'value' => $post_type_key,
                'label' => $post_type_obj->label ?: $post_type_obj->name,
                'name' => $post_type_obj->name,
                'rest_base' => $post_type_obj->rest_base ?? $post_type_key,
            ];
            $added_types[] = $post_type_key;
        }

        // S'assurer que "post" est toujours présent
        if (!in_array('post', $added_types)) {
            $post_obj = get_post_type_object('post');
            if ($post_obj) {
                array_unshift($post_types_list, [
                    'value' => 'post',
                    'label' => $post_obj->label ?: 'Articles',
                    'name' => 'post',
                    'rest_base' => 'posts',
                ]);
            }
        }

        // Trier : post en premier, puis les autres par ordre alphabétique
        usort($post_types_list, function ($a, $b) {
            if ($a['value'] === 'post') {
                return -1;
            }
            if ($b['value'] === 'post') {
                return 1;
            }
            return strcmp($a['label'], $b['label']);
        });

        return new \WP_REST_Response([
            'postTypes' => $post_types_list,
        ], 200);
    }

    /**
     * Récupère les couleurs du thème depuis theme-settings.json
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request Requête REST
     * @return \WP_REST_Response Réponse avec les couleurs du thème
     */
    public function getThemeColors(\WP_REST_Request $request)
    {
        $theme_dir = get_template_directory();
        $theme_settings_file = $theme_dir . '/theme-settings.json';

        // Charger les couleurs depuis theme-settings.json
        if (file_exists($theme_settings_file)) {
            $theme_settings = json_decode(file_get_contents($theme_settings_file), true);

            if (isset($theme_settings['settings']['color']['palette']) && is_array($theme_settings['settings']['color']['palette'])) {
                return new \WP_REST_Response([
                    'colors' => $theme_settings['settings']['color']['palette'],
                ], 200);
            }
        }

        // Fallback : essayer de récupérer depuis WordPress Theme JSON
        $theme_json = \WP_Theme_JSON_Resolver::get_theme_data();
        $theme_data = $theme_json->get_data();

        if (isset($theme_data['settings']['color']['palette']['theme']) && is_array($theme_data['settings']['color']['palette']['theme'])) {
            return new \WP_REST_Response([
                'colors' => $theme_data['settings']['color']['palette']['theme'],
            ], 200);
        }

        // Si aucune couleur trouvée, retourner un tableau vide
        return new \WP_REST_Response([
            'colors' => [],
        ], 200);
    }
}
