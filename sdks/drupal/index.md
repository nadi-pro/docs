# Drupal SDK

The Nadi Drupal SDK provides integration with Drupal applications, automatically capturing exceptions and providing Drupal-specific context.

## Requirements

- PHP 8.1 or higher
- Drupal 10.1+ or 11
- Composer
- Drush (recommended)

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-drupal
```

Enable the module using Drush:

```bash
drush en nadi
```

Run the installation command:

```bash
drush nadi:install
```

This command will:

1. Download and install the Nadi Shipper binary to `vendor/bin/`
2. Create the log directory for Nadi files
3. Download the latest shipper configuration from GitHub
4. Prompt for your API credentials (can be skipped)
5. Display Supervisord setup instructions

### Interactive Credential Setup

During installation, you'll be prompted to enter:

- **API Key** - Create one at [API Tokens](https://nadi.pro/user/api-tokens)
- **App Key** - Available on your application page (e.g., `https://nadi.pro/applications/<your-app-uuid>`)

Press Enter to skip and configure later.

## Admin Configuration

After enabling the module, configure Nadi through the admin interface:

1. Navigate to **Administration > Configuration > System > Nadi** (`/admin/config/system/nadi`)
2. Enter your **API Key** and **App Key**
3. Select the **Transport Driver** (log or http)
4. Configure any additional options
5. Save the configuration

### Permission

The `administer nadi` permission controls access to the Nadi configuration page. Assign this permission to trusted administrator roles only.

Navigate to **Administration > People > Permissions** and grant `administer nadi` to the appropriate role.

## Configuration

You can also configure Nadi via `settings.php` or environment variables:

```php
// sites/default/settings.php
$config['nadi.settings']['enabled'] = TRUE;
$config['nadi.settings']['driver'] = 'log';
```

Environment variables:

```env
NADI_ENABLED=true
NADI_DRIVER=log
```

::: tip Credentials in nadi.yaml
API credentials (`apiKey` and `appKey`) are configured in `nadi.yaml` for the Shipper agent, not in `.env` or `settings.php`. See [Shipper Configuration](/shipper/configuration) for details.
:::

### Transport Drivers

| Driver | Description |
| ------ | ----------- |
| `log`  | Writes events to log files for the Shipper to process (recommended) |
| `http` | Sends events directly to the Nadi API |

::: tip Recommended Setup
Use the `log` driver with Shipper for best reliability. This approach handles network issues gracefully and doesn't block your application.
:::

## Shipper Setup

The shipper binary monitors the Nadi log directory for log files and forwards them to the Nadi API.
Set up Supervisord to run the shipper as a background process.

Create a supervisor config file:

```bash
sudo nano /etc/supervisor/conf.d/nadi-shipper.conf
```

Add the configuration (paths are shown during installation):

```ini
[program:nadi-shipper-your-app]
process_name=%(program_name)s
command=/path/to/project/vendor/bin/shipper --config=/path/to/project/sites/default/files/nadi/nadi.yaml
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project/sites/default/files/logs/shipper.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
stopwaitsecs=3600
```

Apply the configuration:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start nadi-shipper-your-app
```

## Basic Usage

### Automatic Exception Capturing

Once installed, Nadi automatically captures all unhandled exceptions. No additional code is required.

```php
// This exception will be automatically captured
throw new \Exception('Something went wrong');
```

### Manual Exception Capturing

You can also capture exceptions manually using the Nadi service:

```php
/** @var \Nadi\Drupal\NadiClient $nadi */
$nadi = \Drupal::service('nadi.client');

try {
    // Your code
} catch (\Exception $e) {
    $nadi->captureException($e);
    // Handle the exception
}
```

### Capturing Messages

Log messages without an exception:

```php
$nadi = \Drupal::service('nadi.client');
$nadi->captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
$nadi = \Drupal::service('nadi.client');
$account = \Drupal::currentUser();

$nadi->setUser([
    'id' => $account->id(),
    'email' => $account->getEmail(),
    'name' => $account->getDisplayName(),
]);
```

### Tags

Add tags for filtering:

```php
$nadi = \Drupal::service('nadi.client');

$nadi->setTag('subscription', 'premium');
$nadi->setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
$nadi = \Drupal::service('nadi.client');

$nadi->setExtra('order_id', $order->id());
$nadi->setExtras([
    'cart_items' => count($cartItems),
    'total' => $cartTotal,
]);
```

## What's Captured

The Drupal SDK automatically captures:

| Data        | Description                                  |
| ----------- | -------------------------------------------- |
| Exception   | Type, message, code, file, line              |
| Stack Trace | Full trace with file paths and line numbers  |
| Request     | URL, method, headers, input (filtered)       |
| User        | Authenticated user (if configured)           |
| Session     | Session data (filtered)                      |
| Environment | App environment, PHP version, Drupal version |
| Route       | Route name, controller, parameters           |
| Git         | Commit hash (if available)                   |

## Filtering Sensitive Data

Configure which request fields to exclude through the admin interface at `/admin/config/system/nadi` or in `settings.php`:

```php
// sites/default/settings.php
$config['nadi.settings']['scrub_fields'] = [
    'password',
    'password_confirmation',
    'credit_card',
    'cvv',
    'ssn',
    'api_key',
    'secret',
];
```

## Drush Commands

```bash
# Install Nadi and setup shipper
drush nadi:install

# Test the API connection
drush nadi:test

# Verify the App Key
drush nadi:verify

# Update the shipper binary
drush nadi:update-shipper
```

## Next Steps

- [PHP SDK — Advanced Usage](/sdks/php/advanced) - Advanced features available in all PHP SDKs
- [PHP SDK — Transporters](/sdks/php/transporters) - Configure transport options
- [PHP SDK — Sampling](/sdks/php/sampling) - Control event volume
- [Shipper](/shipper/) - Shipper agent documentation
