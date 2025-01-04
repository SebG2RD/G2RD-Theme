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

// function filter_theme_json_theme($theme_json) {
// 	$new_data = [
// 		"version" => 3,
// 		"settings" => [
// 			"color" => [
// 				"palette" => [
// 					[
// 						"slug"  => "primary",
// 						"color" => "#023047",
// 						"name"  => "Nouvelle couleur principale",
// 					],
// 					[
// 						"slug"  => "secondary",
// 						"color" => "#FB8500",
// 						"name"  => "Nouvelle couleur secondaire",
// 					],
//                 ],
//             ],
//         ],
//         "styles" => [
//             "elements" => [
//                 "h1" => [
//                     "typography" => [
//                         "fontSize" => "var:preset|font-size|xl",
//                     ],
//                 ],
//             ],
//         ],	
//     ];

// 	return $theme_json->update_with( $new_data );
// }

// add_filter('wp_theme_json_data_theme', 'filter_theme_json_theme');

