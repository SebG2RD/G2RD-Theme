<?php
// Retirer les accents des noms de fichiers
add_filter('sanitize_file_name', 'remove_accents');

// Déclarer les scripts et les styles
function g2rd_register_assets() {
    // Charger la feuille style.css du thème
    wp_enqueue_style('main', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));

}
add_action('wp_enqueue_scripts', 'g2rd_register_assets');


# Charger les styles des variations de blocs
function g2rd_register_blocks_assets()
{
    wp_enqueue_block_style(
        "core/group",
        [
            'handle' => "g2rd-group",
            'src'    => get_theme_file_uri("assets/css/core-group.css"),
            'path'   => get_theme_file_path("assets/css/core-group.css"),
            'ver'    => "1.0",
        ]
    );
}
add_action("init", "g2rd_register_blocks_assets");

function g2rd_deregister_blocks_variations()
{
    wp_enqueue_script(
        "unregister-styles",
        get_template_directory_uri() . "/assets/js/unregister-blocks-styles.js",
        ["wp-blocks", "wp-dom-ready", "wp-edit-post"],
        "1.0",
    );
}
add_action("enqueue_block_editor_assets", "g2rd_deregister_blocks_variations");

// Pour retirer les compositions par défaut, mais aussi les suggestions de compositions
remove_theme_support("core-block-patterns");

// retirer les suggestions de blocs en provenance du « Block Directory » de WordPress.org
remove_action("enqueue_block_editor_assets", "wp_enqueue_editor_block_directory_assets");

function g2rd_register_patterns_categories()
{
    register_block_pattern_category(
        "marketing",
        ["label" => __("Marketing", "g2rd")]
	);
    
    register_block_pattern_category(
        "card",
        ["label" => __("Cartes", "g2rd")]
	);
    
    register_block_pattern_category(
        "hero",
        ["label" => __("Hero", "g2rd")]
    );

    register_block_pattern_category(
        "post",
        ["label" => __("Publications", "g2rd")]
    );
}
add_filter("init", "g2rd_register_patterns_categories");


# Ajouter un code de vérification Google dans la balise <head>
// function capitaine_add_google_site_verification()
// {
//     echo '<meta name="google-site-verification" content="12345" />';
// }
// add_action('wp_head', 'g2rd_add_google_site_verification');

# Ajouter une classe CSS au body"
// function capitaine_body_class($classes)
// {
//     $classes[] = 'capitainewp';
//     return $classes;
// }
// add_filter('body_class', 'capitaine_body_class');

# Ajouter du markup au début de la page
// function capitaine_add_something_to_body()
// {
//     echo '<div>Tout premier élément de la page !</div>';
// }
// add_action('wp_body_open', 'capitaine_add_something_to_body');

# Déclaration des articles en single post pour les articles a lire également
function g2rd_related_posts_query($wp_query)
{
    if (!is_admin() && !$wp_query->is_main_query() && is_singular('post')) {
        
        // Récupérer l'ID de l'article actuel
        $current_post_id = get_the_ID();

        // Récupérer les ID de catégories de l'article actuel
        $current_post_cats = wp_get_post_categories($current_post_id, ['fields' => 'ids']);
        
		// Ignorer l'article actuel
        $wp_query->set('post__not_in', [$current_post_id]);
        
		// Inclure uniquement les articles des mêmes catégories que l'article
        $wp_query->set('cat', $current_post_cats);
    }
}
add_action('pre_get_posts', 'g2rd_related_posts_query');






