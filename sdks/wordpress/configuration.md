# WordPress Configuration

Complete configuration reference for the Nadi WordPress plugin.

## Configuration Methods

### Admin Interface

Navigate to **Settings** → **Nadi** to configure:

- API Key
- Application Key
- Environment
- Error levels
- Transporter settings

### wp-config.php

Define constants in `wp-config.php` for programmatic configuration:

```php
<?php
// Required
define('NADI_API_KEY', 'your-api-key');
define('NADI_APP_KEY', 'your-application-key');
```

::: tip Priority
Constants in `wp-config.php` take precedence over admin settings.
:::

## Configuration Options

### Required Settings

```php
// Your Nadi API key
define('NADI_API_KEY', 'your-api-key');

// Your application key
define('NADI_APP_KEY', 'your-application-key');
```

### Core Settings

```php
// Enable/disable error capturing
define('NADI_ENABLED', true);

// Environment name
define('NADI_ENVIRONMENT', 'production');

// Release/version identifier
define('NADI_RELEASE', '1.0.0');
```

### Transporter Settings

```php
// Transport method: 'file' or 'http'
define('NADI_TRANSPORTER', 'file');

// File transporter: log directory
define('NADI_STORAGE_PATH', '/var/log/nadi');

// HTTP transporter: endpoint
define('NADI_ENDPOINT', 'https://nadi.pro/api/');

// HTTP transporter: timeout (seconds)
define('NADI_TIMEOUT', 5);
```

### Error Level Settings

```php
// PHP error types to capture
define('NADI_ERROR_TYPES', E_ALL & ~E_NOTICE & ~E_DEPRECATED);

// Capture fatal errors
define('NADI_CAPTURE_FATAL', true);

// Capture warnings
define('NADI_CAPTURE_WARNINGS', true);

// Capture notices
define('NADI_CAPTURE_NOTICES', false);

// Capture deprecated notices
define('NADI_CAPTURE_DEPRECATED', false);
```

### Sampling Settings

```php
// Sampling strategy: fixed_rate, dynamic_rate, interval
define('NADI_SAMPLING_STRATEGY', 'fixed_rate');

// Fixed rate sampling (0.0 - 1.0)
define('NADI_SAMPLING_RATE', 1.0);
```

### Privacy Settings

```php
// Capture user data
define('NADI_CAPTURE_USER', true);

// Capture IP address
define('NADI_CAPTURE_IP', true);

// Fields to scrub from POST data
define('NADI_SCRUB_FIELDS', 'password,credit_card,cvv');
```

### WordPress-Specific Settings

```php
// Capture plugin errors
define('NADI_CAPTURE_PLUGIN_ERRORS', true);

// Capture theme errors
define('NADI_CAPTURE_THEME_ERRORS', true);

// Capture database errors
define('NADI_CAPTURE_DB_ERRORS', true);

// Capture AJAX errors
define('NADI_CAPTURE_AJAX_ERRORS', true);

// Capture REST API errors
define('NADI_CAPTURE_REST_ERRORS', true);
```

## Environment-Specific Configuration

### Development

```php
define('NADI_ENABLED', true);
define('NADI_ENVIRONMENT', 'development');
define('NADI_SAMPLING_RATE', 1.0);
define('NADI_CAPTURE_NOTICES', true);
define('NADI_CAPTURE_DEPRECATED', true);
```

### Staging

```php
define('NADI_ENABLED', true);
define('NADI_ENVIRONMENT', 'staging');
define('NADI_SAMPLING_RATE', 1.0);
```

### Production

```php
define('NADI_ENABLED', true);
define('NADI_ENVIRONMENT', 'production');
define('NADI_SAMPLING_RATE', 0.1);
define('NADI_CAPTURE_NOTICES', false);
define('NADI_CAPTURE_DEPRECATED', false);
```

## Multisite Configuration

For WordPress Multisite, configure per-site or network-wide.

### Network-Wide

Add to `wp-config.php` (applies to all sites):

```php
define('NADI_API_KEY', 'your-api-key');
define('NADI_APP_KEY', 'your-network-app-key');
```

### Per-Site Configuration

Use different app keys per site:

```php
// Network-wide API key
define('NADI_API_KEY', 'your-api-key');

// Per-site app keys (configure in admin)
// Leave NADI_APP_KEY undefined to use admin settings
```

Configure each site's App Key through **Settings** → **Nadi**.

## Filter Hooks

### Custom Configuration

```php
add_filter('nadi_config', function($config) {
    // Modify configuration
    $config['environment'] = wp_get_environment_type();
    return $config;
});
```

### Dynamic Settings

```php
add_filter('nadi_enabled', function($enabled) {
    // Disable for admins
    if (current_user_can('administrator')) {
        return false;
    }
    return $enabled;
});
```

## Verification

### Test Configuration

1. Go to **Settings** → **Nadi**
2. Click **Test Connection**
3. Check for success message

### CLI Verification

```bash
wp eval "var_dump(defined('NADI_API_KEY'));"
wp eval "var_dump(defined('NADI_APP_KEY'));"
```

### Debug Mode

Enable debug output:

```php
define('NADI_DEBUG', true);
```

Check `wp-content/debug.log` for Nadi messages.

## Troubleshooting

### Settings Not Saving

1. Check file permissions on options
2. Verify no plugin conflicts
3. Check for JavaScript errors

### Constants Not Working

1. Ensure defined before `wp-settings.php` is loaded
2. Check for typos in constant names
3. Verify `wp-config.php` syntax

### Connection Errors

1. Verify API key is correct
2. Check firewall/security plugins
3. Test endpoint connectivity

```php
// Test connectivity
$response = wp_remote_get('https://nadi.pro/api/health');
var_dump(wp_remote_retrieve_response_code($response));
```

## Next Steps

- [Error Tracking](/sdks/wordpress/error-tracking) - Capture and report errors
- [WooCommerce](/sdks/wordpress/woocommerce) - WooCommerce integration
