# Yii 3 SDK

The Nadi Yii 3 SDK provides integration with Yii 3 applications, automatically capturing exceptions and providing Yii-specific context.

## Requirements

- PHP 8.1 or higher
- Yii 3
- Composer

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-yii
```

## DI Container Configuration

Merge the Nadi service definitions into your `config/di.php`:

```php
// config/di.php
use Nadi\Yii\NadiServiceProvider;

return array_merge(
    // ... other definitions
    NadiServiceProvider::definitions(),
);
```

## Params Configuration

Add Nadi configuration to your `config/params.php`:

```php
// config/params.php
return [
    // ... other params

    'nadi' => [
        'enabled' => (bool) ($_ENV['NADI_ENABLED'] ?? true),
        'driver' => $_ENV['NADI_DRIVER'] ?? 'log',
        'scrub_fields' => [
            'password',
            'password_confirmation',
            'credit_card',
            'cvv',
            'ssn',
            'api_key',
            'secret',
        ],
    ],
];
```

## Middleware Setup

Add the Nadi middleware to your application pipeline. In your route configuration or application setup:

```php
use Nadi\Yii\Middleware\NadiMiddleware;
use Nadi\Yii\Middleware\OpenTelemetryMiddleware;

// In your route configuration
$collector->middleware(NadiMiddleware::class);

// Optional: Add OpenTelemetry middleware for performance monitoring
$collector->middleware(OpenTelemetryMiddleware::class);
```

## Configuration

Add the following to your `.env`:

```env
NADI_ENABLED=true
NADI_DRIVER=log
```

::: tip Credentials in nadi.yaml
API credentials (`apiKey` and `appKey`) are configured in `runtime/nadi/nadi.yaml` for the Shipper agent, not in `.env`. See [Shipper Configuration](/shipper/configuration) for details.
:::

## Shipper Setup

The shipper binary monitors `runtime/nadi/` for log files and forwards them to the Nadi API.
Set up Supervisord to run the shipper as a background process.

Create a supervisor config file:

::: tip Supervisor Config Path
The supervisor config path and file extension vary by OS:

| OS | Path | Extension |
|----|------|-----------|
| Ubuntu / Debian | `/etc/supervisor/conf.d/` | `.conf` |
| AlmaLinux / CentOS / RHEL / Fedora | `/etc/supervisord.d/` | `.ini` |
| macOS (Homebrew) | `/opt/homebrew/etc/supervisor.d/` | `.conf` |
:::

```bash
sudo nano /etc/supervisor/conf.d/nadi-shipper.conf
```

Add the configuration:

```ini
[program:nadi-shipper-your-app]
process_name=%(program_name)s
command=/path/to/project/vendor/bin/shipper --config=/path/to/project/runtime/nadi/nadi.yaml
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project/runtime/logs/shipper.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
stopwaitsecs=3600
```

::: warning Naming Convention
Use **kebab-case** for both the config filename and program name. Avoid repeated dashes.

**Good**: `nadi-shipper-my-app.conf`, `[program:nadi-shipper-my-app]`
**Bad**: `nadi-shipper--my-app.conf`, `[program:nadi-shipper--my-app]`
:::

Apply the configuration:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start nadi-shipper-your-app
```

## Basic Usage

### Automatic Exception Capturing

Once installed, Nadi automatically captures all unhandled exceptions through the middleware. No additional code is required.

```php
// This exception will be automatically captured
throw new \Exception('Something went wrong');
```

### Manual Exception Capturing

You can also capture exceptions manually using dependency injection:

```php
use Nadi\Yii\NadiClient;

final class OrderController
{
    public function __construct(
        private readonly NadiClient $nadi,
    ) {}

    public function create(): ResponseInterface
    {
        try {
            // Your code
        } catch (\Exception $e) {
            $this->nadi->captureException($e);
            // Handle the exception
        }
    }
}
```

### Capturing Messages

Log messages without an exception:

```php
$this->nadi->captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
$this->nadi->setUser([
    'id' => $currentUser->getId(),
    'email' => $currentUser->getEmail(),
    'name' => $currentUser->getName(),
]);
```

### Tags

Add tags for filtering:

```php
$this->nadi->setTag('subscription', 'premium');
$this->nadi->setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
$this->nadi->setExtra('order_id', $order->getId());
$this->nadi->setExtras([
    'cart_items' => $cart->count(),
    'total' => $cart->getTotal(),
]);
```

## What's Captured

The Yii 3 SDK automatically captures:

| Data        | Description                                |
| ----------- | ------------------------------------------ |
| Exception   | Type, message, code, file, line            |
| Stack Trace | Full trace with file paths and line numbers|
| Request     | URL, method, headers, input (filtered)     |
| User        | Authenticated user (if configured)         |
| Session     | Session data (filtered)                    |
| Environment | App environment, PHP version, Yii version  |
| Route       | Controller, action, parameters             |
| Git         | Commit hash (if available)                 |

## Filtering Sensitive Data

Configure which request fields to exclude in `config/params.php`:

```php
'nadi' => [
    'scrub_fields' => [
        'password',
        'password_confirmation',
        'credit_card',
        'cvv',
        'ssn',
        'api_key',
        'secret',
    ],
],
```

## Next Steps

- [PHP SDK — Advanced Usage](/sdks/php/advanced) - Advanced features available in all PHP SDKs
- [PHP SDK — Transporters](/sdks/php/transporters) - Configure transport options
- [PHP SDK — Sampling](/sdks/php/sampling) - Control event volume
- [Shipper](/shipper/) - Shipper agent documentation
