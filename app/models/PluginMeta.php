<?php
namespace G2RD\Models;

// Importer les fonctions WordPress
use function add_action;
use function add_meta_box;
use function get_post_meta;
use function update_post_meta;
use function wp_nonce_field;
use function wp_verify_nonce;
use function current_user_can;
use function wp_enqueue_script;
use function wp_enqueue_style;
use function get_template_directory_uri;
use function get_template_directory;

class PluginMeta {
    public static function register() {
        add_action('add_meta_boxes', [self::class, 'add_meta_boxes']);
        add_action('save_post_plugin', [self::class, 'save_meta_boxes']);
        add_action('admin_enqueue_scripts', [self::class, 'enqueue_scripts']);
    }

    public static function add_meta_boxes() {
        add_meta_box(
            'plugin_details',
            'Détails du plugin',
            [self::class, 'render_meta_box'],
            'plugin',
            'normal',
            'high'
        );
    }

    public static function render_meta_box($post) {
        // Récupérer les valeurs existantes
        $expiration_date = get_post_meta($post->ID, '_plugin_expiration_date', true);
        $price = get_post_meta($post->ID, '_plugin_price', true);
        $website_url = get_post_meta($post->ID, '_plugin_website_url', true);
        $login = get_post_meta($post->ID, '_plugin_login', true);
        $password = get_post_meta($post->ID, '_plugin_password', true);
        $activation_key = get_post_meta($post->ID, '_plugin_activation_key', true);

        // Calculer les jours avant expiration
        $days_remaining = '';
        if (!empty($expiration_date)) {
            $expiration_timestamp = strtotime($expiration_date);
            $current_timestamp = time();
            $days_remaining = floor(($expiration_timestamp - $current_timestamp) / (60 * 60 * 24));
        }

        // Nonce pour la sécurité
        wp_nonce_field('plugin_meta_box', 'plugin_meta_box_nonce');
        ?>
        <div class="plugin-meta-box">
            <style>
                .plugin-meta-box .form-group {
                    margin-bottom: 15px;
                }
                .plugin-meta-box label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .plugin-meta-box input[type="text"],
                .plugin-meta-box input[type="number"],
                .plugin-meta-box input[type="date"],
                .plugin-meta-box input[type="password"] {
                    width: 100%;
                    padding: 8px;
                }
                .plugin-meta-box .password-container {
                    position: relative;
                }
                .plugin-meta-box .toggle-password {
                    position: absolute;
                    right: 10px;
                    top: 8px;
                    cursor: pointer;
                }
                .plugin-meta-box .days-remaining {
                    margin-top: 5px;
                    font-style: italic;
                }
                .plugin-meta-box .days-remaining.warning {
                    color: #d63638;
                }
            </style>

            <div class="form-group">
                <label for="plugin_expiration_date">Date de fin</label>
                <input type="date" id="plugin_expiration_date" name="plugin_expiration_date" value="<?php echo esc_attr($expiration_date); ?>" />
                <div class="days-remaining" id="days_remaining">
                    <?php if ($days_remaining !== '') : ?>
                        <?php if ($days_remaining < 30) : ?>
                            <span class="warning">Attention : <?php echo $days_remaining; ?> jours avant expiration</span>
                        <?php else : ?>
                            <?php echo $days_remaining; ?> jours avant expiration
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
            </div>

            <div class="form-group">
                <label for="plugin_price">Prix (€)</label>
                <input type="number" id="plugin_price" name="plugin_price" value="<?php echo esc_attr($price); ?>" step="0.01" min="0" />
            </div>

            <div class="form-group">
                <label for="plugin_website_url">URL du site web</label>
                <input type="text" id="plugin_website_url" name="plugin_website_url" value="<?php echo esc_url($website_url); ?>" />
            </div>

            <div class="form-group">
                <label for="plugin_login">Login</label>
                <input type="text" id="plugin_login" name="plugin_login" value="<?php echo esc_attr($login); ?>" />
            </div>

            <div class="form-group">
                <label for="plugin_password">Mot de passe</label>
                <div class="password-container">
                    <input type="password" id="plugin_password" name="plugin_password" value="<?php echo esc_attr($password); ?>" />
                    <span class="toggle-password dashicons dashicons-visibility" data-target="plugin_password"></span>
                </div>
            </div>

            <div class="form-group">
                <label for="plugin_activation_key">Clé d'activation</label>
                <div class="password-container">
                    <input type="password" id="plugin_activation_key" name="plugin_activation_key" value="<?php echo esc_attr($activation_key); ?>" />
                    <span class="toggle-password dashicons dashicons-visibility" data-target="plugin_activation_key"></span>
                </div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    // Calculer les jours restants
                    function updateDaysRemaining() {
                        const expirationDate = document.getElementById('plugin_expiration_date').value;
                        if (expirationDate) {
                            const expirationTimestamp = new Date(expirationDate).getTime();
                            const currentTimestamp = new Date().getTime();
                            const daysRemaining = Math.floor((expirationTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24));
                            
                            const daysRemainingElement = document.getElementById('days_remaining');
                            if (daysRemaining < 30) {
                                daysRemainingElement.innerHTML = `<span class="warning">Attention : ${daysRemaining} jours avant expiration</span>`;
                            } else {
                                daysRemainingElement.innerHTML = `${daysRemaining} jours avant expiration`;
                            }
                        }
                    }

                    // Mettre à jour les jours restants lors du changement de date
                    document.getElementById('plugin_expiration_date').addEventListener('change', updateDaysRemaining);

                    // Afficher/masquer les champs de type password
                    document.querySelectorAll('.toggle-password').forEach(function(toggle) {
                        toggle.addEventListener('click', function() {
                            const passwordInput = document.getElementById(this.dataset.target);
                            if (passwordInput.type === 'password') {
                                passwordInput.type = 'text';
                                this.classList.remove('dashicons-visibility');
                                this.classList.add('dashicons-hidden');
                            } else {
                                passwordInput.type = 'password';
                                this.classList.remove('dashicons-hidden');
                                this.classList.add('dashicons-visibility');
                            }
                        });
                    });
                });
            </script>
        </div>
        <?php
    }

    public static function save_meta_boxes($post_id) {
        // Vérifier le nonce
        if (!isset($_POST['plugin_meta_box_nonce']) || !wp_verify_nonce($_POST['plugin_meta_box_nonce'], 'plugin_meta_box')) {
            return;
        }

        // Vérifier les permissions
        if (!current_user_can('manage_options')) {
            return;
        }

        // Sauvegarder les données
        if (isset($_POST['plugin_expiration_date'])) {
            update_post_meta($post_id, '_plugin_expiration_date', sanitize_text_field($_POST['plugin_expiration_date']));
        }

        if (isset($_POST['plugin_price'])) {
            update_post_meta($post_id, '_plugin_price', sanitize_text_field($_POST['plugin_price']));
        }

        if (isset($_POST['plugin_website_url'])) {
            update_post_meta($post_id, '_plugin_website_url', esc_url_raw($_POST['plugin_website_url']));
        }

        if (isset($_POST['plugin_login'])) {
            update_post_meta($post_id, '_plugin_login', sanitize_text_field($_POST['plugin_login']));
        }

        if (isset($_POST['plugin_password'])) {
            update_post_meta($post_id, '_plugin_password', sanitize_text_field($_POST['plugin_password']));
        }

        if (isset($_POST['plugin_activation_key'])) {
            update_post_meta($post_id, '_plugin_activation_key', sanitize_text_field($_POST['plugin_activation_key']));
        }
    }

    public static function enqueue_scripts($hook) {
        global $post_type;
        
        // Ne charger que sur l'écran d'édition du CPT plugin
        if ($hook == 'post-new.php' || $hook == 'post.php') {
            if ($post_type === 'plugin') {
                wp_enqueue_style('dashicons');
            }
        }
    }
} 