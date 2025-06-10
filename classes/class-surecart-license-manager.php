<?php

/**
 * Classe pour gérer les licences du thème via SureCart
 *
 * Cette classe permet de vérifier et de gérer les licences du thème
 * en utilisant l'API SureCart. Elle s'intègre avec le système de mise à jour
 * du thème pour contrôler l'accès aux mises à jour.
 *
 * @package G2RD
 * @since 1.0.0
 * @license EUPL-1.2
 * @copyright (c) 2024 Sebastien GERARD
 */

namespace G2RD;

// Alias des fonctions WordPress
use function add_action;
use function add_submenu_page;
use function register_setting;
use function get_option;
use function wp_remote_get;
use function is_wp_error;
use function wp_remote_retrieve_body;
use function _e;
use function esc_attr;
use function submit_button;

class SureCartLicenseManager {
    /**
     * URL de l'API SureCart
     *
     * @since 1.0.0
     * @var string
     */
    private $api_url = 'https://api.surecart.com/v1';

    /**
     * Clé API SureCart
     *
     * @since 1.0.0
     * @var string
     */
    private $api_key;

    /**
     * Constructeur de la classe
     *
     * @since 1.0.0
     * @param string $api_key Clé API SureCart
     */
    public function __construct($api_key) {
        $this->api_key = $api_key;
        $this->registerHooks();
    }

    /**
     * Enregistre les hooks WordPress nécessaires
     *
     * @since 1.0.0
     * @return void
     */
    public function registerHooks() {
        // Un seul menu : G2RD License
        add_action('admin_menu', [$this, 'addLicenseMenu']);
        add_action('admin_init', [$this, 'registerLicenseSettings']);
        add_action('admin_notices', [$this, 'displayLicenseNotices']);
    }

    /**
     * Ajoute le menu de gestion des licences
     *
     * @since 1.0.0
     * @return void
     */
    public function addLicenseMenu() {
        add_submenu_page(
            'themes.php',
            'G2RD License',
            'G2RD License',
            'manage_options',
            'g2rd-license',
            [$this, 'renderLicensePage']
        );
    }

    /**
     * Enregistre les paramètres de licence
     *
     * @since 1.0.0
     * @return void
     */
    public function registerLicenseSettings() {
        register_setting('g2rd_license', 'g2rd_license_key');
        // Ne plus enregistrer la clé API côté client
    }

    /**
     * Affiche les notifications de licence
     *
     * @since 1.0.0
     * @return void
     */
    public function displayLicenseNotices() {
        if (!$this->isLicenseValid()) {
            ?>
            <div class="notice notice-warning">
                <p><?php _e('Votre licence G2RD Theme n\'est pas active. Veuillez activer votre licence pour bénéficier des mises à jour.', 'g2rd'); ?></p>
            </div>
            <?php
        }
    }

    /**
     * Vérifie si la licence est valide via le proxy sécurisé
     *
     * @since 1.0.0
     * @return bool
     */
    public function isLicenseValid() {
        $license_key = get_option('g2rd_license_key');
        if (empty($license_key)) {
            return false;
        }
        $shared_token = 'g2rd_proxy_token_2024'; // Doit correspondre à celui du proxy sur g2rd.fr
        $response = wp_remote_post('https://g2rd.fr/wp-json/g2rd/v1/validate-license', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode([
                'access_token' => $shared_token,
                'license_key'  => $license_key,
                'product_id'   => 'g2rd-theme',
            ]),
            'timeout' => 15,
        ]);
        if (is_wp_error($response)) {
            return false;
        }
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return isset($body['valid']) && $body['valid'] === true;
    }

    /**
     * Récupère les licences de l'utilisateur depuis SureCart
     *
     * @since 1.0.0
     * @return array
     */
    public function getUserLicenses() {
        $response = wp_remote_get($this->api_url . '/licenses', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ],
        ]);

        if (is_wp_error($response)) {
            return [];
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        return isset($body['licenses']) ? $body['licenses'] : [];
    }

    /**
     * Affiche la page de gestion des licences (clé API supprimée)
     *
     * @since 1.0.0
     * @return void
     */
    public function renderLicensePage() {
        ?>
        <div class="wrap">
            <h1><?php _e('G2RD License', 'g2rd'); ?></h1>

            <form method="post" action="options.php">
                <?php settings_fields('g2rd_license'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Clé de licence', 'g2rd'); ?></th>
                        <td>
                            <input type="text" name="g2rd_license_key" value="<?php echo esc_attr(get_option('g2rd_license_key')); ?>" class="regular-text">
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>

            <h2><?php _e('Vos licences', 'g2rd'); ?></h2>
            <?php
            $licenses = $this->getUserLicenses();
            if (!empty($licenses)):
            ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th><?php _e('Clé', 'g2rd'); ?></th>
                            <th><?php _e('Statut', 'g2rd'); ?></th>
                            <th><?php _e('Date d\'expiration', 'g2rd'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($licenses as $license): ?>
                            <tr>
                                <td><?php echo esc_html($license['key']); ?></td>
                                <td><?php echo esc_html($license['status']); ?></td>
                                <td><?php echo esc_html($license['expires_at']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p><?php _e('Aucune licence trouvée.', 'g2rd'); ?></p>
            <?php endif; ?>
        </div>
        <?php
    }
} 