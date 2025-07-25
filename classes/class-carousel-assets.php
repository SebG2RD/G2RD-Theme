<?php
/**
 * Gestionnaire des assets pour le block G2RD Carousel (Swiper.js)
 *
 * @package G2RD
 * @since 1.0.0
 */

namespace G2RD;

class CarouselAssets {
    /**
     * Enregistre les hooks WordPress
     */
    public function registerHooks() {
        \add_action('wp_enqueue_scripts', [ $this, 'enqueueCarouselAssets' ]);
    }

    /**
     * Enqueue les scripts et styles nécessaires au carrousel
     */
    public function enqueueCarouselAssets() {
        // Charger Swiper.js depuis les fichiers locaux
        \wp_enqueue_script(
            'swiper-js',
            get_template_directory_uri() . '/blocks/g2rd-carousel/swiper-bundle.min.js',
            [],
            '11.0.5',
            true
        );

        // Charger les styles Swiper
        \wp_enqueue_style(
            'swiper-css',
            get_template_directory_uri() . '/blocks/g2rd-carousel/swiper-bundle.min.css',
            [],
            '11.0.5'
        );

        // Charger les styles du block carrousel
        \wp_enqueue_style(
            'g2rd-carousel-style',
            get_template_directory_uri() . '/blocks/g2rd-carousel/src/carousel.css',
            ['swiper-css'],
            '1.0.0'
        );

        // Charger le script frontend du carrousel APRÈS Swiper
        \wp_enqueue_script(
            'g2rd-carousel-frontend',
            get_template_directory_uri() . '/blocks/g2rd-carousel/build/carousel-frontend.js',
            ['swiper-js'],
            '1.0.0',
            true
        );

        // Ajouter des données localisées pour le debug
        \wp_localize_script('g2rd-carousel-frontend', 'g2rdCarouselData', [
            'swiperUrl' => get_template_directory_uri() . '/blocks/g2rd-carousel/swiper-bundle.min.js',
            'themeUrl' => get_template_directory_uri(),
        ]);
    }
} 