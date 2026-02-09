# CakePHP SDK

The Nadi CakePHP SDK provides integration with CakePHP applications, automatically capturing exceptions and providing CakePHP-specific context.

## Requirements

- PHP 8.1 or higher
- CakePHP 4.5+ or 5.x
- Composer

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-cakephp
```

Run the installation command:

```bash
cake nadi:install
```

This command will:

1. Publish the configuration file to `config/nadi.php`
2. Download and install the Nadi Shipper binary to `vendor/bin/`
3. Create the `storage/nadi/` directory for log files
4. Download the latest shipper configuration from GitHub
5. Prompt for your API credentials (can be skipped)
6. Save credentials to `storage/nadi/nadi.yaml`
7. Display Supervisord setup instructions

### Interactive Credential Setup

During installation, you'll be prompted to enter:

- **API Key** - Create one at [API Tokens](https://nadi.pro/user/api-tokens)
- **App Key** - Available on your application page (e.g., `https://nadi.pro/applications/<your-app-uuid>`)

Press Enter to skip and configure later.

## Plugin Setup

Load the Nadi plugin in your `src/Application.php`:

```php
// src/Application.php
public function bootstrap(): void
{
    parent::bootstrap();

    $this->addPlugin(\Nadi\CakePHP\NadiPlugin::class);
}
```

Load the configuration in your `config/bootstrap.php`:

```php
// config/bootstrap.php
use Cake\Core\Configure;

Configure::load('nadi');
```

## Configuration

Add the following to your `.env`:

```env
NADI_ENABLED=true
NADI_DRIVER=log
```

The configuration file `config/nadi.php` provides additional options:

```php
// config/nadi.php
return [
    'enabled' => env('NADI_ENABLED', true),
    'driver' => env('NADI_DRIVER', 'log'),
    'scrub_fields' => [
        'password',
        'password_confirmation',
        'credit_card',
        'cvv',
        'ssn',
        'api_key',
        'secret',
    ],
];
```

::: tip Credentials in nadi.yaml
API credentials (`apiKey` and `appKey`) are configured in `storage/nadi/nadi.yaml` for the Shipper agent, not in `.env`. See [Shipper Configuration](/shipper/configuration) for details.
:::

## Shipper Setup

The shipper binary monitors `storage/nadi/` for log files and forwards them to the Nadi API.
Set up Supervisord to run the shipper as a background process.

Create a supervisor config file:

```bash
sudo nano /etc/supervisor/conf.d/nadi-shipper.conf
```

Add the configuration (paths are shown during installation):

```ini
[program:nadi-shipper-your-app]
process_name=%(program_name)s
command=/path/to/project/vendor/bin/shipper --config=/path/to/project/storage/nadi/nadi.yaml
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project/storage/logs/shipper.log
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

You can also capture exceptions manually:

```php
use Nadi\CakePHP\Facades\Nadi;

try {
    // Your code
} catch (\Exception $e) {
    Nadi::captureException($e);
    // Handle the exception
}
```

### Capturing Messages

Log messages without an exception:

```php
use Nadi\CakePHP\Facades\Nadi;

Nadi::captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
use Nadi\CakePHP\Facades\Nadi;

Nadi::setUser([
    'id' => $identity->getIdentifier(),
    'email' => $identity->get('email'),
    'name' => $identity->get('name'),
]);
```

### Tags

Add tags for filtering:

```php
use Nadi\CakePHP\Facades\Nadi;

Nadi::setTag('subscription', 'premium');
Nadi::setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
use Nadi\CakePHP\Facades\Nadi;

Nadi::setExtra('order_id', $order->id);
Nadi::setExtras([
    'cart_items' => $cart->count(),
    'total' => $cart->total(),
]);
```

## What's Captured

The CakePHP SDK automatically captures:

| Data        | Description                                    |
| ----------- | ---------------------------------------------- |
| Exception   | Type, message, code, file, line                |
| Stack Trace | Full trace with file paths and line numbers    |
| Request     | URL, method, headers, input (filtered)         |
| User        | Authenticated user (if configured)             |
| Session     | Session data (filtered)                        |
| Environment | App environment, PHP version, CakePHP version  |
| Route       | Controller, action, parameters                 |
| Git         | Commit hash (if available)                     |

## Filtering Sensitive Data

Configure which request fields to exclude:

```php
// config/nadi.php
'scrub_fields' => [
    'password',
    'password_confirmation',
    'credit_card',
    'cvv',
    'ssn',
    'api_key',
    'secret',
],
```

## Console Commands

```bash
# Install Nadi and setup shipper
cake nadi:install

# Test the API connection
cake nadi:test

# Verify the App Key
cake nadi:verify

# Update the shipper binary
cake nadi:update-shipper
```

## Next Steps

- [PHP SDK — Advanced Usage](/sdks/php/advanced) - Advanced features available in all PHP SDKs
- [PHP SDK — Transporters](/sdks/php/transporters) - Configure transport options
- [PHP SDK — Sampling](/sdks/php/sampling) - Control event volume
- [Shipper](/shipper/) - Shipper agent documentation
