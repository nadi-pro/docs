# WordPress SDK

The Nadi WordPress plugin provides error monitoring for WordPress sites.

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

## Quick Start

1. Activate the plugin
2. Go to **Settings** → **Nadi**
3. Enter your **API Key** and **Application Key** in the Credentials tab
4. Click **Save Settings**
5. Go to the **Status** tab and click **Test Connection**

## How It Works

1. Exceptions are captured by PHP's exception handler
2. Exception data (stack trace, context, metrics) is written as a JSON file to the `log/` directory
3. A WordPress cron job runs every minute and triggers the Shipper binary
4. The Shipper binary reads pending JSON logs and sends them to the Nadi API
5. Errors appear in your [Nadi dashboard](https://nadi.pro/dashboard)

## What's Captured

Once configured, the plugin automatically captures:

- PHP errors and exceptions
- WordPress-specific errors (WP_Error)
- Plugin/theme errors
- Database errors
- AJAX errors

| Data | Description |
|------|-------------|
| Error | Message, file, line |
| Stack Trace | Full PHP trace |
| WordPress | Version, active theme, plugins |
| PHP | Version, memory limit |
| Request | URL, method, POST data |
| User | Logged-in user (if any) |

## Next Steps

- [Configuration](/sdks/wordpress/configuration) - Settings tabs and options
- [Error Tracking](/sdks/wordpress/error-tracking) - Advanced error tracking
- [Production Setup](/sdks/wordpress/production-setup) - Cron, permissions, and security
