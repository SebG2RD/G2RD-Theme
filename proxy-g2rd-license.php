<?php
/**
 * Proxy sécurisé pour la validation de licence SureCart
 * Place ce fichier dans un mu-plugin ou dans le functions.php de ton site g2rd.fr
 * Il expose l'endpoint /wp-json/g2rd/v1/validate-license
 * et logge tous les accès dans g2rd-license-proxy.log
 */

// La clé secrète DOIT être définie dans wp-config.php pour des raisons de sécurité
if (!defined('G2RD_SURECART_SECRET')) {
    // Si la clé n'est pas définie, afficher une erreur et arrêter l'exécution
    error_log('G2RD License Proxy: G2RD_SURECART_SECRET non définie dans wp-config.php');
    return;
}

add_action('rest_api_init', function () {
    register_rest_route('g2rd/v1', '/validate-license', [
        'methods' => 'POST',
        'callback' => 'g2rd_validate_license_proxy',
        'permission_callback' => '__return_true', // à sécuriser si besoin
    ]);
});

function g2rd_validate_license_proxy(WP_REST_Request $request) {
    // Token partagé à définir (garde-le secret, change-le régulièrement si besoin)
    $shared_token = 'g2rd_proxy_token_2024';

    $access_token = $request->get_param('access_token');
    $license_key  = $request->get_param('license_key');
    $product_id   = $request->get_param('product_id');

    // LOGGING : enregistre chaque accès dans un fichier
    $log_entry = sprintf(
        "[%s] IP: %s | Token: %s | License: %s | Product: %s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        substr($access_token, 0, 8) . '...',
        substr($license_key, 0, 8) . '...',
        $product_id
    );
    file_put_contents(__DIR__ . '/g2rd-license-proxy.log', $log_entry, FILE_APPEND);

    if (empty($access_token) || $access_token !== $shared_token) {
        $err = sprintf("[%s] ERROR: Unauthorized access. IP: %s | Token: %s\n", date('Y-m-d H:i:s'), $_SERVER['REMOTE_ADDR'] ?? 'unknown', substr($access_token, 0, 8) . '...');
        file_put_contents(__DIR__ . '/g2rd-license-proxy.log', $err, FILE_APPEND);
        return new WP_Error('unauthorized', 'Invalid access token', ['status' => 401]);
    }
    if (empty($license_key) || empty($product_id)) {
        $err = sprintf("[%s] ERROR: Missing params. IP: %s\n", date('Y-m-d H:i:s'), $_SERVER['REMOTE_ADDR'] ?? 'unknown');
        file_put_contents(__DIR__ . '/g2rd-license-proxy.log', $err, FILE_APPEND);
        return new WP_Error('missing_params', 'Missing parameters', ['status' => 400]);
    }

    // Utiliser la clé secrète définie en haut ou dans wp-config.php
    $surecart_secret = G2RD_SURECART_SECRET;

    $response = wp_remote_post('https://api.surecart.com/v1/licenses/validate', [
        'headers' => [
            'Authorization' => 'Bearer ' . $surecart_secret,
            'Content-Type'  => 'application/json',
        ],
        'body' => json_encode([
            'license_key' => $license_key,
            'product_id'  => $product_id,
        ]),
        'timeout' => 15,
    ]);

    if (is_wp_error($response)) {
        $err = sprintf("[%s] ERROR: API error. IP: %s | Message: %s\n", date('Y-m-d H:i:s'), $_SERVER['REMOTE_ADDR'] ?? 'unknown', $response->get_error_message());
        file_put_contents(__DIR__ . '/g2rd-license-proxy.log', $err, FILE_APPEND);
        return new WP_Error('api_error', $response->get_error_message(), ['status' => 500]);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    // Log la réponse de SureCart si besoin (optionnel)
    // file_put_contents(__DIR__ . '/g2rd-license-proxy.log', "[".date('Y-m-d H:i:s')."] API Response: ".json_encode($body)."\n", FILE_APPEND);
    return $body;
} 