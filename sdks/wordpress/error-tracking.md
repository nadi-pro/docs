# WordPress Error Tracking

Capture and report errors from your WordPress site.

## Automatic Error Capturing

The plugin automatically captures:

- PHP errors (fatal, warning, notice)
- Uncaught exceptions
- WordPress errors (WP_Error)
- Database errors ($wpdb errors)
- AJAX errors
- REST API errors

## Manual Error Capturing

### Capturing Exceptions

```php
try {
    $result = risky_operation();
} catch (Exception $e) {
    if (function_exists('nadi_capture_exception')) {
        nadi_capture_exception($e);
    }
    // Handle the error
}
```

### With Context

```php
nadi_capture_exception($e, [
    'tags' => [
        'feature' => 'checkout',
        'payment_gateway' => 'stripe',
    ],
    'extra' => [
        'order_id' => $order_id,
        'cart_total' => $cart_total,
    ],
]);
```

### Capturing Messages

```php
// Info level
nadi_capture_message('User upgraded to premium');

// With explicit level
nadi_capture_message('Payment processing slow', 'warning');

// With context
nadi_capture_message('Large file uploaded', 'info', [
    'extra' => [
        'file_size' => $file_size,
        'file_type' => $file_type,
    ],
]);
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Error Levels

### Configure Error Types

Via wp-config.php:

```php
// Capture all errors except notices
define('NADI_ERROR_TYPES', E_ALL & ~E_NOTICE);
```

Via filter:

```php
add_filter('nadi_error_types', function($types) {
    // Don't capture deprecated notices
    return $types & ~E_DEPRECATED;
});
```

### Error Level Mapping

| PHP Level | Nadi Level |
|-----------|------------|
| E_ERROR | fatal |
| E_PARSE | fatal |
| E_CORE_ERROR | fatal |
| E_WARNING | warning |
| E_NOTICE | info |
| E_DEPRECATED | info |
| Exception | error |

## Filtering Errors

### Ignore Specific Errors

```php
add_filter('nadi_should_capture', function($should_capture, $error) {
    // Ignore specific message
    if (strpos($error['message'], 'Undefined index') !== false) {
        return false;
    }

    // Ignore errors from specific plugin
    if (strpos($error['file'], 'plugins/problematic-plugin') !== false) {
        return false;
    }

    return $should_capture;
}, 10, 2);
```

### Filter by Error Type

```php
add_filter('nadi_should_capture', function($should_capture, $error) {
    // Only capture errors and above
    $ignore_types = [E_NOTICE, E_WARNING, E_DEPRECATED];

    if (in_array($error['type'], $ignore_types)) {
        return false;
    }

    return $should_capture;
}, 10, 2);
```

### Modify Before Capture

```php
add_filter('nadi_before_capture', function($event) {
    // Add custom tag
    $event['tags']['site_type'] = is_multisite() ? 'multisite' : 'single';

    // Remove sensitive data
    unset($event['request']['data']['password']);

    return $event;
});
```

## Context

### User Context

Logged-in users are automatically captured:

```php
add_filter('nadi_user_context', function($user) {
    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();

        return [
            'id' => $current_user->ID,
            'email' => $current_user->user_email,
            'name' => $current_user->display_name,
            'roles' => $current_user->roles,
            'subscription' => get_user_meta($current_user->ID, 'subscription', true),
        ];
    }

    return null;
});
```

### Request Context

```php
add_filter('nadi_request_context', function($request) {
    $request['admin_page'] = $GLOBALS['pagenow'] ?? null;
    $request['is_admin'] = is_admin();
    $request['is_ajax'] = wp_doing_ajax();
    return $request;
});
```

### Custom Tags

```php
add_filter('nadi_tags', function($tags) {
    $tags['theme'] = get_template();
    $tags['is_multisite'] = is_multisite() ? 'yes' : 'no';

    if (function_exists('wc_get_page_id')) {
        $tags['woocommerce'] = 'active';
    }

    return $tags;
});
```

### Extra Data

```php
add_filter('nadi_extra_context', function($extra) {
    $extra['active_plugins'] = get_option('active_plugins');
    $extra['memory_usage'] = memory_get_usage(true);
    $extra['php_version'] = phpversion();
    return $extra;
});
```

## WordPress-Specific Errors

### WP_Error Handling

```php
$result = wp_remote_get('https://api.example.com/data');

if (is_wp_error($result)) {
    nadi_capture_wp_error($result, [
        'tags' => ['api' => 'external'],
    ]);
}
```

### Database Errors

Database errors are automatically captured. Configure:

```php
define('NADI_CAPTURE_DB_ERRORS', true);
```

### Cron Errors

Capture errors in scheduled tasks:

```php
add_action('my_cron_hook', function() {
    try {
        process_scheduled_task();
    } catch (Exception $e) {
        nadi_capture_exception($e, [
            'tags' => ['cron' => 'my_cron_hook'],
        ]);
    }
});
```

### REST API Errors

```php
add_filter('rest_request_after_callbacks', function($response, $handler, $request) {
    if (is_wp_error($response)) {
        nadi_capture_wp_error($response, [
            'tags' => ['rest_route' => $request->get_route()],
        ]);
    }
    return $response;
}, 10, 3);
```

## Plugin/Theme Errors

### Identify Source

Errors include plugin/theme information:

```json
{
  "tags": {
    "source_type": "plugin",
    "source_name": "woocommerce"
  },
  "extra": {
    "plugin_file": "woocommerce/woocommerce.php",
    "plugin_version": "8.4.0"
  }
}
```

### Filter by Source

```php
add_filter('nadi_should_capture', function($should_capture, $error) {
    // Ignore errors from specific plugins
    $ignore_plugins = ['noisy-plugin', 'broken-plugin'];

    foreach ($ignore_plugins as $plugin) {
        if (strpos($error['file'], "plugins/{$plugin}") !== false) {
            return false;
        }
    }

    return $should_capture;
}, 10, 2);
```

## Breadcrumbs

### Automatic Breadcrumbs

The plugin automatically captures:

- Page loads
- Admin page navigation
- AJAX requests
- Form submissions
- User logins/logouts

### Manual Breadcrumbs

```php
nadi_add_breadcrumb([
    'category' => 'checkout',
    'message' => 'User started checkout',
    'level' => 'info',
    'data' => [
        'cart_items' => WC()->cart->get_cart_contents_count(),
    ],
]);
```

## Testing

### Trigger Test Error

```php
// Add to a template or plugin
if (isset($_GET['nadi_test']) && current_user_can('administrator')) {
    throw new Exception('Nadi test error');
}
```

### Via Admin

1. Go to **Settings** → **Nadi**
2. Click **Test Connection**

### CLI Testing

```bash
wp eval "throw new Exception('CLI test error');"
```

## Next Steps

- [WooCommerce](/sdks/wordpress/woocommerce) - WooCommerce integration
- [Configuration](/sdks/wordpress/configuration) - Full configuration reference
