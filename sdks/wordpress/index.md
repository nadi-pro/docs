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
2. Enter your **API Key**
3. Enter your **Application Key**
4. Click **Save Changes**

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

## Basic Usage

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

1. Go to **Settings** → **Nadi**
2. Click **Test Connection**
3. Check the Nadi dashboard for the test error

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

## Features

### Error Filtering

The plugin automatically filters:

- Deprecated notices (configurable)
- Strict standards warnings
- Selected error levels

Configure in **Settings** → **Nadi** → **Error Levels**.

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

## Transporters

### File Transporter (Recommended)

Writes errors to log files for Shipper to process:

```php
define('NADI_TRANSPORTER', 'file');
define('NADI_STORAGE_PATH', '/var/log/nadi');
```

### HTTP Transporter

Sends errors directly via HTTP:

```php
define('NADI_TRANSPORTER', 'http');
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
- [WooCommerce](/sdks/wordpress/woocommerce) - WooCommerce integration
