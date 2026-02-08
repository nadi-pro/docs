# WordPress Configuration

Complete configuration reference for the Nadi WordPress plugin.

## Configuration Methods

### Admin Interface

Navigate to **Settings** → **Nadi** to configure:

- **Credentials** — API Key and Application Key
- **Shipper** — Shipper binary settings (connection, storage, performance, retry, security, monitoring)
- **Sampling** — Sampling strategy and rate
- **Status** — Health checks and test connection

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

### Shipper Configuration

The Shipper is configured via `config/nadi.yaml` in the plugin directory. All settings are manageable from the **Shipper** tab in admin settings.

```yaml
nadi:
  # API credentials
  apiKey: "your-sanctum-token"
  token: "your-application-key"

  # Connection
  endpoint: "https://nadi.pro/api/"
  accept: "application/vnd.nadi.v1+json"

  # Storage
  storage: "/path/to/wp-content/plugins/nadi-wordpress/log"
  trackerFile: "tracker.json"
  filePattern: "*.json"
  deadLetterDir: ""

  # Performance
  workers: 4
  compress: false
  persistent: false

  # Retry
  maxTries: 3
  timeout: "1m"
  checkInterval: "5s"

  # Security (Beta)
  tlsCACert: ""
  tlsSkipVerify: false

  # Monitoring (Beta)
  healthCheckAddr: ""
  metricsEnabled: false
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `endpoint` | string | `https://nadi.pro/api/` | Nadi API endpoint |
| `accept` | string | `application/vnd.nadi.v1+json` | HTTP Accept header |
| `storage` | string | Plugin's `log/` dir | Log file directory |
| `trackerFile` | string | `tracker.json` | Sent logs tracker |
| `filePattern` | string | `*.json` | Log file glob pattern |
| `deadLetterDir` | string | _(empty)_ | Failed delivery directory |
| `workers` | int | `4` | Concurrent workers |
| `compress` | bool | `false` | Gzip compression |
| `persistent` | bool | `false` | Persistent HTTP connections |
| `maxTries` | int | `3` | Max retry attempts |
| `timeout` | string | `1m` | Request timeout |
| `checkInterval` | string | `5s` | New log check interval |
| `tlsCACert` | string | _(empty)_ | Custom TLS CA cert path |
| `tlsSkipVerify` | bool | `false` | Skip TLS verification |
| `healthCheckAddr` | string | _(empty)_ | Health check address |
| `metricsEnabled` | bool | `false` | Prometheus metrics |

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
// Sampling strategy: fixed_rate, dynamic_rate, interval, peak_load
define('NADI_SAMPLING_STRATEGY', 'fixed_rate');

// Fixed rate sampling (0.0 - 1.0)
define('NADI_SAMPLING_RATE', 1.0);
```

| Strategy | Description |
|----------|-------------|
| `fixed_rate` | Fixed percentage of events (default: 10%) |
| `dynamic_rate` | Adjusts rate based on system load |
| `interval` | Captures one event per time interval |
| `peak_load` | Adjusts during high traffic periods |

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

1. Go to **Settings** → **Nadi** → **Status** tab
2. Verify all checklist items are green
3. Click **Test Connection**
4. Check the [Nadi dashboard](https://nadi.pro/dashboard) within 1-2 minutes

### CLI Verification

```bash
wp eval "var_dump(defined('NADI_API_KEY'));"
wp eval "var_dump(defined('NADI_APP_KEY'));"
wp option get nadi_api_key
wp option get nadi_application_key
```

### Debug Mode

Enable debug output:

```php
define('NADI_DEBUG', true);
```

Check `wp-content/debug.log` for Nadi messages.

## Next Steps

- [Error Tracking](/sdks/wordpress/error-tracking) - Capture and report errors
- [Production Setup](/sdks/wordpress/production-setup) - Cron, permissions, and security
