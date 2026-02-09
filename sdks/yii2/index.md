# Yii 2 SDK

The Nadi Yii 2 SDK provides integration with Yii 2 applications, automatically capturing exceptions and providing Yii 2-specific context.

## Requirements

- PHP 8.1 or higher
- Yii 2.0.45+
- Composer

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-yii2
```

## Component Configuration

Add the Nadi component to your web application config in `config/web.php`:

```php
// config/web.php
return [
    'bootstrap' => [
        // ... other bootstrap components
        'nadi',
    ],
    'components' => [
        // ... other components
        'nadi' => [
            'class' => \Nadi\Yii2\NadiComponent::class,
            'enabled' => true,
            'driver' => 'log',
        ],
    ],
];
```

For console applications, add the same configuration to `config/console.php`:

```php
// config/console.php
return [
    'bootstrap' => [
        // ... other bootstrap components
        'nadi',
    ],
    'components' => [
        'nadi' => [
            'class' => \Nadi\Yii2\NadiComponent::class,
            'enabled' => true,
            'driver' => 'log',
        ],
    ],
];
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

Additional configuration options on the component:

```php
'nadi' => [
    'class' => \Nadi\Yii2\NadiComponent::class,
    'enabled' => true,
    'driver' => 'log',
    'scrubFields' => [
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

## Shipper Setup

The shipper binary monitors `runtime/nadi/` for log files and forwards them to the Nadi API.
Set up Supervisord to run the shipper as a background process.

Create a supervisor config file:

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
try {
    // Your code
} catch (\Exception $e) {
    \Yii::$app->nadi->captureException($e);
    // Handle the exception
}
```

### Capturing Messages

Log messages without an exception:

```php
\Yii::$app->nadi->captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
\Yii::$app->nadi->setUser([
    'id' => \Yii::$app->user->id,
    'email' => \Yii::$app->user->identity->email,
    'name' => \Yii::$app->user->identity->name,
]);
```

### Tags

Add tags for filtering:

```php
\Yii::$app->nadi->setTag('subscription', 'premium');
\Yii::$app->nadi->setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
\Yii::$app->nadi->setExtra('order_id', $order->id);
\Yii::$app->nadi->setExtras([
    'cart_items' => count($cartItems),
    'total' => $cartTotal,
]);
```

## What's Captured

The Yii 2 SDK automatically captures:

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

Configure which request fields to exclude:

```php
'nadi' => [
    'scrubFields' => [
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
