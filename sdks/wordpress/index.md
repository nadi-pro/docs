# WordPress SDK

The Nadi WordPress plugin provides error monitoring for WordPress sites, including WooCommerce integration.

## Requirements

- PHP 8.1 or higher
- WordPress 5.0 or higher

## Installation

### From WordPress Admin

1. Download the latest release from [GitHub](https://github.com/nadi-pro/nadi-wordpress/releases/latest)
2. Go to **Plugins** → **Add New** → **Upload Plugin**
3. Select the downloaded ZIP file
4. Click **Install Now**
5. Click **Activate Plugin**

### Manual Installation

1. Download and extract the plugin
2. Upload the `nadi-wordpress` folder to `/wp-content/plugins/`
3. Activate the plugin through the **Plugins** menu

### Via WP-CLI

```bash
wp plugin install https://github.com/nadi-pro/nadi-wordpress/releases/latest/download/nadi-wordpress.zip --activate
```

## Configuration

### Admin Interface

1. Go to **Settings** → **Nadi**
2. In the **Credentials** tab, enter your **API Key** and **Application Key**
3. Click **Save Changes**
4. Go to the **Status** tab to verify setup

### wp-config.php

Alternatively, configure via `wp-config.php`:

```php
// API credentials
define('NADI_API_KEY', 'your-api-key');
define('NADI_APP_KEY', 'your-application-key');

// Optional settings
define('NADI_ENVIRONMENT', 'production');
define('NADI_ENABLED', true);
```

## How It Works

1. Exceptions are captured by PHP's exception handler
2. Exception data (stack trace, context, metrics) is written as a JSON file to the `log/` directory
3. A WordPress cron job runs every minute and triggers the Shipper binary
4. The Shipper binary reads pending JSON logs and sends them to the Nadi API
5. Errors appear in your [Nadi dashboard](https://nadi.pro/dashboard)

### Automatic Error Capturing

Once configured, the plugin automatically captures:

- PHP errors and exceptions
- WordPress-specific errors
- Plugin/theme errors
- Database errors
- AJAX errors

### Manual Error Capturing

```php
// In your theme or plugin
if (function_exists('nadi_capture_exception')) {
    try {
        // Risky code
    } catch (Exception $e) {
        nadi_capture_exception($e);
    }
}
```

### Logging Messages

```php
if (function_exists('nadi_capture_message')) {
    nadi_capture_message('User completed checkout', 'info');
}
```

## Test Connection

1. Go to **Settings** → **Nadi** → **Status** tab
2. Click **Test Connection**
3. A test exception is written to the log directory
4. The Shipper will send it to Nadi on the next cron run (within 1 minute)
5. Check the [Nadi dashboard](https://nadi.pro/dashboard) for the test error

## What's Captured

| Data | Description |
|------|-------------|
| Error | Message, file, line |
| Stack Trace | Full PHP trace |
| WordPress | Version, active theme, plugins |
| PHP | Version, memory limit |
| Request | URL, method, POST data |
| User | Logged-in user (if any) |
| Database | Query errors |

## Settings Tabs

The settings page (**Settings** → **Nadi**) has 4 tabs:

| Tab | Description |
|-----|-------------|
| **Credentials** | API Key and Application Key |
| **Shipper** | Shipper binary configuration (connection, storage, performance, retry, security, monitoring) |
| **Sampling** | Sampling strategy and rate configuration |
| **Status** | Health checks, shipper installation, test connection |

## Features

### Error Filtering

The plugin filters sensitive data from captured errors:

- Hidden request headers (e.g., `Authorization`)
- Hidden parameters (e.g., `password`, `password_confirmation`)
- Hidden response parameters

Configure in **Settings** → **Nadi** admin page.

### User Identification

Logged-in users are automatically identified:

```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "roles": ["administrator"]
  }
}
```

### Plugin/Theme Context

Errors include context about active plugins and themes:

```json
{
  "wordpress": {
    "version": "6.4.2",
    "theme": "Twenty Twenty-Four",
    "active_plugins": [
      "woocommerce/woocommerce.php",
      "advanced-custom-fields/acf.php"
    ]
  }
}
```

## Hooks and Filters

### Filter Captured Data

```php
add_filter('nadi_before_capture', function($event) {
    // Add custom data
    $event['extra']['custom_field'] = get_option('my_option');

    // Filter out certain errors
    if (strpos($event['message'], 'ignore-this') !== false) {
        return null; // Don't capture
    }

    return $event;
});
```

### Custom User Data

```php
add_filter('nadi_user_context', function($user) {
    if (is_user_logged_in()) {
        $user['subscription'] = get_user_meta(get_current_user_id(), 'subscription', true);
    }
    return $user;
});
```

### Custom Tags

```php
add_filter('nadi_tags', function($tags) {
    $tags['site_type'] = is_multisite() ? 'multisite' : 'single';
    return $tags;
});
```

### Disable Capturing

```php
add_filter('nadi_should_capture', function($should_capture, $error) {
    // Don't capture 404 errors
    if (is_404()) {
        return false;
    }
    return $should_capture;
}, 10, 2);
```

## Next Steps

- [Configuration](/sdks/wordpress/configuration) - Full configuration options
- [Error Tracking](/sdks/wordpress/error-tracking) - Advanced error tracking
- [Production Setup](/sdks/wordpress/production-setup) - Cron, permissions, and security
