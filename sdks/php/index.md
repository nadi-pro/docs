# PHP SDK

The Nadi PHP SDK provides error monitoring for any PHP application. It's the foundation for framework-specific SDKs like Laravel and WordPress.

## Requirements

- PHP 8.1 or higher
- Composer
- JSON extension
- cURL extension (for HTTP transporter)

## Installation

Install via Composer:

```bash
composer require nadi-pro/nadi-php
```

## Quick Start

### Initialize the Client

```php
<?php

require_once 'vendor/autoload.php';

use Nadi\Client;

$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);
```

### Capture Exceptions

```php
try {
    // Your code
    throw new Exception('Something went wrong');
} catch (Exception $e) {
    $client->captureException($e);
}
```

### Set Up Global Exception Handler

```php
$client->registerErrorHandler();
$client->registerExceptionHandler();
$client->registerShutdownHandler();
```

Or use the convenience method:

```php
$client->registerHandlers();
```

## Configuration

### Full Configuration Options

```php
$client = new Client([
    // Required
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),

    // Optional
    'environment' => getenv('APP_ENV') ?: 'production',
    'release' => getenv('APP_VERSION'),
    'storagePath' => '/var/log/nadi',

    // Transporter
    'transporter' => 'file', // 'file' or 'http'

    // HTTP transporter settings
    'endpoint' => 'https://nadi.pro/api/',
    'timeout' => 5,

    // Sampling
    'samplingRate' => 1.0,
    'samplingStrategy' => 'fixed_rate',

    // Context
    'tags' => [
        'server' => gethostname(),
    ],
    'extra' => [],

    // Filtering
    'scrubFields' => ['password', 'secret', 'token'],
]);
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NADI_API_KEY` | Your API key | - |
| `NADI_APP_KEY` | Your application key | - |
| `NADI_ENVIRONMENT` | Environment name | `production` |
| `NADI_STORAGE_PATH` | Log directory | `/var/log/nadi` |
| `NADI_TRANSPORTER` | Transport method | `file` |
| `NADI_SAMPLING_RATE` | Sampling rate (0-1) | `1.0` |

## Basic Usage

### Capturing Exceptions

```php
try {
    $this->processOrder($order);
} catch (Exception $e) {
    $client->captureException($e);
    throw $e; // Re-throw if needed
}
```

### Capturing Messages

```php
// Simple message
$client->captureMessage('User completed checkout');

// With level
$client->captureMessage('Low inventory warning', 'warning');

// With context
$client->captureMessage('Order processed', 'info', [
    'order_id' => $order->id,
    'total' => $order->total,
]);
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

### Adding Context

```php
// Set user information
$client->setUser([
    'id' => $user->id,
    'email' => $user->email,
    'name' => $user->name,
]);

// Set tags
$client->setTag('subscription', 'premium');
$client->setTags([
    'feature' => 'checkout',
    'version' => '2.0',
]);

// Set extra data
$client->setExtra('cart_items', count($cart->items));
$client->setExtras([
    'cart_total' => $cart->total,
    'discount_code' => $cart->discountCode,
]);
```

### Breadcrumbs

```php
// Add a breadcrumb
$client->addBreadcrumb('Page loaded', 'navigation', [
    'url' => $_SERVER['REQUEST_URI'],
]);

// Add before an error
$client->addBreadcrumb('Processing payment', 'action', [
    'gateway' => 'stripe',
    'amount' => $amount,
]);

try {
    $this->chargeCard($card, $amount);
} catch (PaymentException $e) {
    $client->captureException($e);
}
```

## Event Lifecycle

### Before Capture Hook

Modify events before they're captured:

```php
$client->beforeCapture(function (array $event, array $hint) {
    // Add custom data
    $event['extra']['request_id'] = uniqid();

    // Filter certain events
    if ($hint['exception'] instanceof IgnorableException) {
        return null; // Don't capture
    }

    return $event;
});
```

### After Capture Hook

Perform actions after capture:

```php
$client->afterCapture(function (array $event) {
    // Log that event was captured
    error_log('Nadi: Captured event ' . $event['event_id']);
});
```

## Scopes

### Global Scope

Set context for all events:

```php
$client->configureScope(function ($scope) {
    $scope->setTag('server', gethostname());
    $scope->setUser(['id' => $userId]);
});
```

### Temporary Scope

Set context for a specific operation:

```php
$client->withScope(function ($scope) use ($client, $order) {
    $scope->setTag('operation', 'order_processing');
    $scope->setExtra('order_id', $order->id);

    $client->captureMessage('Processing order');
});
// Scope is cleared after the closure
```

## Integration Examples

### Vanilla PHP

```php
<?php

require_once 'vendor/autoload.php';

use Nadi\Client;

$nadi = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);

$nadi->registerHandlers();

// Your application code
```

### With a Router

```php
$router->setErrorHandler(function (Throwable $e) use ($nadi) {
    $nadi->captureException($e);
    // Display error page
});
```

### In a Controller

```php
class PaymentController
{
    private Client $nadi;

    public function __construct(Client $nadi)
    {
        $this->nadi = $nadi;
    }

    public function charge(Request $request)
    {
        try {
            return $this->processPayment($request);
        } catch (PaymentException $e) {
            $this->nadi->captureException($e, [
                'extra' => ['request_id' => $request->id],
            ]);
            throw $e;
        }
    }
}
```

## What's Captured

Each error event includes:

| Data | Description |
|------|-------------|
| Exception | Type, message, code |
| Stack Trace | Full trace with file/line info |
| Context | Tags, extra data, user |
| Request | URL, method, headers (if available) |
| Server | PHP version, OS, hostname |
| Timestamp | When the error occurred |

## Next Steps

- [Configuration](/sdks/php/configuration) - Full configuration reference
- [Transporters](/sdks/php/transporters) - How events are sent
- [Sampling](/sdks/php/sampling) - Control event volume
- [Advanced Usage](/sdks/php/advanced) - Advanced features
