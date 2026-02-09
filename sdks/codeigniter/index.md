# CodeIgniter SDK

The Nadi CodeIgniter SDK provides integration with CodeIgniter 4 applications, automatically capturing exceptions and providing CodeIgniter-specific context.

## Requirements

- PHP 8.1 or higher
- CodeIgniter 4.3+
- Composer

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-codeigniter
```

Run the installation command:

```bash
php spark nadi:install
```

This command will:

1. Publish the configuration file to `app/Config/Nadi.php`
2. Download and install the Nadi Shipper binary to `vendor/bin/`
3. Create the `writable/nadi/` directory for log files
4. Download the latest shipper configuration from GitHub
5. Prompt for your API credentials (can be skipped)
6. Save credentials to `writable/nadi/nadi.yaml`
7. Display Supervisord setup instructions

### Interactive Credential Setup

During installation, you'll be prompted to enter:

- **API Key** - Create one at [API Tokens](https://nadi.pro/user/api-tokens)
- **App Key** - Available on your application page (e.g., `https://nadi.pro/applications/<your-app-uuid>`)

Press Enter to skip and configure later.

## Service Registration

Register the Nadi service in your `app/Config/Services.php` or call it in your `app/Config/Boot/production.php`:

```php
// app/Config/Boot/production.php
\Nadi\CodeIgniter\NadiService::register();
```

### Filter Setup

Add the Nadi filter to your `app/Config/Filters.php` to capture request context:

```php
// app/Config/Filters.php
namespace Config;

use CodeIgniter\Config\Filters as BaseFilters;

class Filters extends BaseFilters
{
    public array $aliases = [
        // ... other filters
        'nadi' => \Nadi\CodeIgniter\Filters\NadiFilter::class,
    ];

    public array $globals = [
        'before' => [
            'nadi',
        ],
    ];
}
```

## Configuration

Add the following to your `.env`:

```env
NADI_ENABLED=true
NADI_DRIVER=log
```

::: tip Credentials in nadi.yaml
API credentials (`apiKey` and `appKey`) are configured in `writable/nadi/nadi.yaml` for the Shipper agent, not in `.env`. See [Shipper Configuration](/shipper/configuration) for details.
:::

The configuration file `app/Config/Nadi.php` provides additional options:

```php
// app/Config/Nadi.php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Nadi extends BaseConfig
{
    public bool $enabled = true;
    public string $driver = 'log';
    public string $apiKey = '';
    public string $appKey = '';
    public array $scrubFields = [
        'password',
        'password_confirmation',
        'credit_card',
        'cvv',
        'ssn',
        'api_key',
        'secret',
    ];
}
```

## Shipper Setup

The shipper binary monitors `writable/nadi/` for log files and forwards them to the Nadi API.
Set up Supervisord to run the shipper as a background process.

Create a supervisor config file:

```bash
sudo nano /etc/supervisor/conf.d/nadi-shipper.conf
```

Add the configuration (paths are shown during installation):

```ini
[program:nadi-shipper-your-app]
process_name=%(program_name)s
command=/path/to/project/vendor/bin/shipper --config=/path/to/project/writable/nadi/nadi.yaml
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project/writable/logs/shipper.log
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
use Nadi\CodeIgniter\Facades\Nadi;

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
use Nadi\CodeIgniter\Facades\Nadi;

Nadi::captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
use Nadi\CodeIgniter\Facades\Nadi;

Nadi::setUser([
    'id' => session()->get('user_id'),
    'email' => session()->get('email'),
    'name' => session()->get('name'),
]);
```

### Tags

Add tags for filtering:

```php
use Nadi\CodeIgniter\Facades\Nadi;

Nadi::setTag('subscription', 'premium');
Nadi::setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
use Nadi\CodeIgniter\Facades\Nadi;

Nadi::setExtra('order_id', $order->id);
Nadi::setExtras([
    'cart_items' => count($cartItems),
    'total' => $cartTotal,
]);
```

## What's Captured

The CodeIgniter SDK automatically captures:

| Data        | Description                                        |
| ----------- | -------------------------------------------------- |
| Exception   | Type, message, code, file, line                    |
| Stack Trace | Full trace with file paths and line numbers        |
| Request     | URL, method, headers, input (filtered)             |
| User        | Authenticated user (if configured)                 |
| Session     | Session data (filtered)                            |
| Environment | App environment, PHP version, CodeIgniter version  |
| Route       | Controller, method, parameters                     |
| Git         | Commit hash (if available)                         |

## Filtering Sensitive Data

Configure which request fields to exclude in `app/Config/Nadi.php`:

```php
public array $scrubFields = [
    'password',
    'password_confirmation',
    'credit_card',
    'cvv',
    'ssn',
    'api_key',
    'secret',
];
```

## Spark Commands

```bash
# Install Nadi and setup shipper
php spark nadi:install

# Test the API connection
php spark nadi:test

# Verify the App Key
php spark nadi:verify

# Update the shipper binary
php spark nadi:update-shipper
```

## Next Steps

- [PHP SDK — Advanced Usage](/sdks/php/advanced) - Advanced features available in all PHP SDKs
- [PHP SDK — Transporters](/sdks/php/transporters) - Configure transport options
- [PHP SDK — Sampling](/sdks/php/sampling) - Control event volume
- [Shipper](/shipper/) - Shipper agent documentation
