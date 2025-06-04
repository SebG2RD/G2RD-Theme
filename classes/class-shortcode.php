<?php
/**
 * Gestion des shortcodes personnalisés
 * 
 * Cette classe gère l'enregistrement et l'affichage des shortcodes pour les métadonnées personnalisées.
 *
 * @package G2RD
 * @since 1.0.2
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 * @link https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 */

namespace G2RD;

/**
 * Classe Shortcode
 * 
 * Gère les shortcodes personnalisés pour l'affichage des métadonnées dans les templates.
 */
class Shortcode
{
    /**
     * Enregistre les hooks globaux nécessaires (pour les shortcodes)
     *
     * @since 1.0.2
     * @return void
     */
    public function registerHooks(): void
    {
        add_action('init', [$this, 'registerBindingSources']);
    }

    /**
     * Enregistre les shortcodes pour l'affichage des métadonnées dans les templates
     *
     * @since 1.0.2
     * @return void
     */
    public function registerBindingSources(): void
    {
        // Portfolio
        add_shortcode('portfolio_link', [$this, 'portfolioLinkShortcode']);
        add_shortcode('portfolio_perf', [$this, 'portfolioPerfShortcode']);
        add_shortcode('portfolio_a11y', [$this, 'portfolioA11yShortcode']);
        add_shortcode('portfolio_bp', [$this, 'portfolioBpShortcode']);
        add_shortcode('portfolio_seo', [$this, 'portfolioSeoShortcode']);
        // Qui sommes-nous
        add_shortcode('experience_dev', [$this, 'experienceDevShortcode']);
        add_shortcode('soft_skills', [$this, 'softSkillsShortcode']);
        add_shortcode('methodologie', [$this, 'methodologieShortcode']);
        add_shortcode('objectif', [$this, 'objectifShortcode']);
        add_shortcode('icones_images', [$this, 'iconesImagesShortcode']);
    }

    // === Shortcodes Portfolio ===
    /**
     * Affiche le lien du portfolio
     *
     * @since 1.0.2
     * @return string
     */
    public function portfolioLinkShortcode(): string
    {
        if (!is_singular('portfolio')) {
            return '';
        }
        $post_id = get_the_ID();
        $link = get_post_meta($post_id, '_portfolio_link', true);
        if (empty($link)) {
            return '#';
        }
        return esc_url($link);
    }

    /**
     * Affiche le score de performance du portfolio
     *
     * @since 1.0.2
     * @return string
     */
    public function portfolioPerfShortcode(): string
    {
        if (!is_singular('portfolio')) {
            return '';
        }
        $post_id = get_the_ID();
        $value = get_post_meta($post_id, '_portfolio_perf', true);
        if ($value === '' || $value === false) {
            return '—';
        }
        return esc_html($value) . ' / 100';
    }

    /**
     * Affiche le score d'accessibilité du portfolio
     *
     * @since 1.0.2
     * @return string
     */
    public function portfolioA11yShortcode(): string
    {
        if (!is_singular('portfolio')) {
            return '';
        }
        $post_id = get_the_ID();
        $value = get_post_meta($post_id, '_portfolio_a11y', true);
        if ($value === '' || $value === false) {
            return '—';
        }
        return esc_html($value) . ' / 100';
    }

    /**
     * Affiche le score de bonnes pratiques du portfolio
     *
     * @since 1.0.2
     * @return string
     */
    public function portfolioBpShortcode(): string
    {
        if (!is_singular('portfolio')) {
            return '';
        }
        $post_id = get_the_ID();
        $value = get_post_meta($post_id, '_portfolio_bp', true);
        if ($value === '' || $value === false) {
            return '—';
        }
        return esc_html($value) . ' / 100';
    }

    /**
     * Affiche le score SEO du portfolio
     *
     * @since 1.0.2
     * @return string
     */
    public function portfolioSeoShortcode(): string
    {
        if (!is_singular('portfolio')) {
            return '';
        }
        $post_id = get_the_ID();
        $value = get_post_meta($post_id, '_portfolio_seo', true);
        if ($value === '' || $value === false) {
            return '—';
        }
        return esc_html($value) . ' / 100';
    }

    // === Shortcodes Qui sommes-nous ===
    /**
     * Affiche l'expérience en développement
     *
     * @since 1.0.2
     * @return string
     */
    public function experienceDevShortcode(): string
    {
        if (!is_singular('qui-sommes-nous')) {
            return '';
        }
        $post_id = get_the_ID();
        $experience = get_post_meta($post_id, '_experience_dev', true);
        if (empty($experience)) {
            return 'Aucune expérience en développement spécifiée';
        }
        return wp_kses_post($experience);
    }

    /**
     * Affiche les soft skills
     *
     * @since 1.0.2
     * @return string
     */
    public function softSkillsShortcode(): string
    {
        if (!is_singular('qui-sommes-nous')) {
            return '';
        }
        $post_id = get_the_ID();
        $soft_skills = get_post_meta($post_id, '_soft_skills', true);
        if (empty($soft_skills)) {
            return 'Aucun soft skill spécifié';
        }
        return wp_kses_post($soft_skills);
    }

    /**
     * Affiche la méthodologie
     *
     * @since 1.0.2
     * @return string
     */
    public function methodologieShortcode(): string
    {
        if (!is_singular('qui-sommes-nous')) {
            return '';
        }
        $post_id = get_the_ID();
        $methodologie = get_post_meta($post_id, '_methodologie', true);
        if (empty($methodologie)) {
            return 'Aucune méthodologie spécifiée';
        }
        return wp_kses_post($methodologie);
    }

    /**
     * Affiche l'objectif
     *
     * @since 1.0.2
     * @return string
     */
    public function objectifShortcode(): string
    {
        if (!is_singular('qui-sommes-nous')) {
            return '';
        }
        $post_id = get_the_ID();
        $objectif = get_post_meta($post_id, '_objectif', true);
        if (empty($objectif)) {
            return 'Aucun objectif spécifié';
        }
        return wp_kses_post($objectif);
    }

    /**
     * Affiche les icônes
     *
     * @since 1.0.2
     * @return string
     */
    public function iconesImagesShortcode(): string
    {
        if (!is_singular('qui-sommes-nous')) {
            return '';
        }
        $post_id = get_the_ID();
        $images = get_post_meta($post_id, '_icones_images', true);
        if (empty($images) || !is_array($images)) {
            return 'Aucune icône spécifiée';
        }
        $output = '';
        foreach ($images as $image) {
            if (!empty($image)) {
                $output .= '<div class="wp-block-image">';
                $output .= '<figure class="aligncenter">';
                $output .= '<img src="' . esc_url($image) . '" alt="Icône" class="wp-image-icon" />';
                $output .= '</figure>';
                $output .= '</div>';
            }
        }
        return $output;
    }
} 