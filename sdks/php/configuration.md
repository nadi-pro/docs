# PHP Configuration

Complete configuration reference for the PHP SDK.

## Configuration Methods

### Constructor Options

```php
$client = new Client([
    'apiKey' => 'your-api-key',
    'appKey' => 'your-app-key',
    // ... other options
]);
```

### Environment Variables

```php
// Automatically reads from environment
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);
```

### Configuration File

Create a `nadi.php` config file:

```php
<?php
// config/nadi.php
return [
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'environment' => getenv('APP_ENV') ?: 'production',
    // ...
];
```

Load it:

```php
$config = require 'config/nadi.php';
$client = new Client($config);
```

## Configuration Reference

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `apiKey` | string | Your Nadi API key |
| `appKey` | string | Your application key |

### Core Options

```php
[
    // Application environment (production, staging, development)
    'environment' => 'production',

    // Application release/version identifier
    'release' => 'v1.2.3',

    // Enable/disable error reporting
    'enabled' => true,

    // Server/application name
    'serverName' => gethostname(),
]
```

### Transporter Options

```php
[
    // Transport method: 'file' or 'http'
    'transporter' => 'file',

    // File transporter settings
    'storagePath' => '/var/log/nadi',

    // HTTP transporter settings
    'endpoint' => 'https://nadi.pro/api/',
    'timeout' => 5, // seconds
]
```

### Sampling Options

```php
[
    // Sampling strategy: fixed_rate, dynamic_rate, interval, peak_load
    'samplingStrategy' => 'fixed_rate',

    // Fixed rate: percentage of events to capture (0.0 - 1.0)
    'samplingRate' => 1.0,

    // Dynamic rate settings
    'samplingBaseRate' => 0.05,
    'samplingLoadFactor' => 1.0,

    // Interval settings
    'samplingIntervalSeconds' => 60,
]
```

### Context Options

```php
[
    // Default tags for all events
    'tags' => [
        'server' => gethostname(),
        'datacenter' => 'us-east-1',
    ],

    // Default extra data for all events
    'extra' => [
        'app_version' => APP_VERSION,
    ],
]
```

### Filtering Options

```php
[
    // Fields to scrub from captured data
    'scrubFields' => [
        'password',
        'password_confirmation',
        'secret',
        'token',
        'api_key',
        'credit_card',
        'cvv',
    ],

    // Headers to exclude
    'scrubHeaders' => [
        'Authorization',
        'Cookie',
        'X-API-Key',
    ],

    // Exception classes to ignore
    'dontReport' => [
        'InvalidArgumentException',
        'RuntimeException',
    ],
]
```

### Stack Trace Options

```php
[
    // Maximum stack frames to capture
    'maxStackFrames' => 50,

    // Paths to mark as "in app" (your code)
    'inAppInclude' => [
        '/var/www/app',
    ],

    // Paths to exclude from "in app"
    'inAppExclude' => [
        '/var/www/vendor',
    ],
]
```

### Request Capture Options

```php
[
    // Capture request body
    'captureRequestBody' => true,

    // Maximum request body size (bytes)
    'maxRequestBodySize' => 10240,

    // Capture session data
    'captureSession' => true,

    // Capture cookies
    'captureCookies' => false,
]
```

### Error Handler Options

```php
[
    // PHP error types to capture
    'errorTypes' => E_ALL,

    // Fatal error types
    'fatalErrorTypes' => E_ERROR | E_PARSE | E_CORE_ERROR | E_COMPILE_ERROR,

    // Convert errors to exceptions
    'convertErrorsToExceptions' => true,
]
```

## Complete Example

```php
<?php

use Nadi\Client;

$client = new Client([
    // Required
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),

    // Environment
    'environment' => getenv('APP_ENV') ?: 'production',
    'release' => getenv('APP_VERSION') ?: '1.0.0',
    'serverName' => gethostname(),
    'enabled' => true,

    // Transporter
    'transporter' => 'file',
    'storagePath' => '/var/log/nadi',

    // Sampling
    'samplingStrategy' => 'fixed_rate',
    'samplingRate' => 1.0,

    // Context
    'tags' => [
        'datacenter' => 'us-east-1',
    ],

    // Filtering
    'scrubFields' => [
        'password',
        'credit_card',
        'cvv',
    ],
    'dontReport' => [
        'ValidationException',
    ],

    // Stack Trace
    'maxStackFrames' => 50,
    'inAppInclude' => [
        '/var/www/app/src',
    ],
    'inAppExclude' => [
        '/var/www/app/vendor',
    ],

    // Request
    'captureRequestBody' => true,
    'maxRequestBodySize' => 10240,
]);
```

## Environment-Specific Configuration

### Development

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'environment' => 'development',
    'samplingRate' => 1.0,
    'captureRequestBody' => true,
]);
```

### Production

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'environment' => 'production',
    'samplingRate' => 0.1,
    'captureRequestBody' => false,
    'dontReport' => [
        'ValidationException',
        'NotFoundException',
    ],
]);
```

## Runtime Configuration

Modify configuration at runtime:

```php
// Enable/disable
$client->setEnabled(false);

// Change sampling
$client->setSamplingRate(0.5);

// Add tags
$client->setTag('feature', 'checkout');

// Add to scrub list
$client->addScrubField('custom_secret');
```

## Validation

Validate your configuration:

```php
try {
    $client = new Client($config);
    $client->validateConfig();
} catch (InvalidConfigException $e) {
    echo "Configuration error: " . $e->getMessage();
}
```

## Next Steps

- [Transporters](/sdks/php/transporters) - How events are sent
- [Sampling](/sdks/php/sampling) - Control event volume
- [Advanced Usage](/sdks/php/advanced) - Advanced features
