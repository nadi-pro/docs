# Laravel Configuration

Complete reference for all Laravel SDK configuration options.

## Configuration File

After installation, the configuration file is located at `config/nadi.php`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NADI_API_KEY` | Your Nadi API key | - |
| `NADI_APP_KEY` | Your application key | - |
| `NADI_ENABLED` | Enable/disable reporting | `true` |
| `NADI_ENVIRONMENT` | Environment name | `APP_ENV` |
| `NADI_STORAGE_PATH` | Log file directory | `/var/log/nadi` |
| `NADI_SAMPLING_STRATEGY` | Sampling strategy | `fixed_rate` |
| `NADI_SAMPLING_RATE` | Fixed sampling rate | `1.0` |

## Full Configuration Reference

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Credentials
    |--------------------------------------------------------------------------
    */
    'api_key' => env('NADI_API_KEY'),
    'app_key' => env('NADI_APP_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Enabled
    |--------------------------------------------------------------------------
    |
    | Set to false to completely disable Nadi. Useful for local development.
    |
    */
    'enabled' => env('NADI_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Environment
    |--------------------------------------------------------------------------
    |
    | The environment name sent with each event. Helps filter events in the
    | dashboard by environment (production, staging, development, etc.)
    |
    */
    'environment' => env('NADI_ENVIRONMENT', env('APP_ENV', 'production')),

    /*
    |--------------------------------------------------------------------------
    | Release / Version
    |--------------------------------------------------------------------------
    |
    | The release version of your application. Can be a semantic version,
    | git commit hash, or any identifier that helps you track deployments.
    |
    */
    'release' => env('NADI_RELEASE', null),

    /*
    |--------------------------------------------------------------------------
    | Log Storage Path
    |--------------------------------------------------------------------------
    |
    | Directory where Nadi writes log files. The Shipper agent reads from
    | this location to send events to Nadi.
    |
    */
    'storage_path' => env('NADI_STORAGE_PATH', '/var/log/nadi'),

    /*
    |--------------------------------------------------------------------------
    | Transporter
    |--------------------------------------------------------------------------
    |
    | How events are sent to Nadi:
    | - 'file': Write to log files (recommended, use with Shipper)
    | - 'http': Send directly to Nadi API
    |
    */
    'transporter' => env('NADI_TRANSPORTER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | HTTP Transporter Settings
    |--------------------------------------------------------------------------
    |
    | Settings for direct HTTP transport (when transporter is 'http').
    |
    */
    'http' => [
        'endpoint' => env('NADI_ENDPOINT', 'https://nadi.pro/api/'),
        'timeout' => env('NADI_HTTP_TIMEOUT', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Exception Handling
    |--------------------------------------------------------------------------
    */

    // Exceptions that should not be reported
    'dont_report' => [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Validation\ValidationException::class,
    ],

    // Only report these exceptions (if set, dont_report is ignored)
    'report_only' => [],

    // Exception levels (override default level for specific exceptions)
    'exception_levels' => [
        // \App\Exceptions\WarningException::class => 'warning',
    ],

    /*
    |--------------------------------------------------------------------------
    | Request Data
    |--------------------------------------------------------------------------
    */

    // Fields to scrub from request data
    'scrub_fields' => [
        'password',
        'password_confirmation',
        'secret',
        'token',
        'api_key',
        'credit_card',
        'card_number',
        'cvv',
        'cvc',
        'ssn',
    ],

    // Headers to exclude from capture
    'scrub_headers' => [
        'Authorization',
        'Cookie',
        'X-CSRF-TOKEN',
    ],

    // Capture request body (POST data)
    'capture_request_body' => true,

    // Maximum size of captured request body (in bytes)
    'max_request_body_size' => 10240, // 10KB

    /*
    |--------------------------------------------------------------------------
    | User Identification
    |--------------------------------------------------------------------------
    */
    'user' => [
        // Automatically identify authenticated users
        'auto_identify' => true,

        // Fields to capture from the user model
        'fields' => ['id', 'email', 'name'],

        // Capture IP address
        'capture_ip' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Context
    |--------------------------------------------------------------------------
    */

    // Default tags for all events
    'tags' => [
        // 'server' => gethostname(),
    ],

    // Default extra data for all events
    'extra' => [
        // 'custom_field' => 'value',
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance
    |--------------------------------------------------------------------------
    */

    // Capture slow queries (requires DB logging)
    'capture_slow_queries' => false,
    'slow_query_threshold' => 1000, // milliseconds

    // Capture queue job exceptions
    'capture_queue_exceptions' => true,

    // Capture scheduled task exceptions
    'capture_schedule_exceptions' => true,

    /*
    |--------------------------------------------------------------------------
    | Stack Trace
    |--------------------------------------------------------------------------
    */

    // Maximum frames to capture
    'max_stack_frames' => 50,

    // Paths to mark as "in app" (your code vs vendor code)
    'in_app_include' => [
        base_path('app'),
    ],

    // Paths to exclude from "in app"
    'in_app_exclude' => [
        base_path('vendor'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Sampling
    |--------------------------------------------------------------------------
    */
    'sampling' => [
        // Strategy: fixed_rate, dynamic_rate, interval, peak_load
        'strategy' => env('NADI_SAMPLING_STRATEGY', 'fixed_rate'),

        'config' => [
            // For fixed_rate: percentage of events to capture (0.0 - 1.0)
            'sampling_rate' => env('NADI_SAMPLING_RATE', 1.0),

            // For dynamic_rate: base sampling rate
            'base_rate' => env('NADI_SAMPLING_BASE_RATE', 0.05),

            // For dynamic_rate: multiplier based on load
            'load_factor' => env('NADI_SAMPLING_LOAD_FACTOR', 1.0),

            // For interval: seconds between samples
            'interval_seconds' => env('NADI_SAMPLING_INTERVAL_SECONDS', 60),
        ],

        // Custom sampling strategies
        'strategies' => [
            'dynamic_rate' => \Nadi\Sampling\DynamicRateSampling::class,
            'fixed_rate' => \Nadi\Sampling\FixedRateSampling::class,
            'interval' => \Nadi\Sampling\IntervalSampling::class,
            'peak_load' => \Nadi\Sampling\PeakLoadSampling::class,
        ],
    ],
];
```

## Environment-Specific Configuration

### Development

```env
NADI_ENABLED=false
# Or enable with high verbosity
NADI_ENABLED=true
NADI_ENVIRONMENT=development
NADI_SAMPLING_RATE=1.0
```

### Staging

```env
NADI_ENABLED=true
NADI_ENVIRONMENT=staging
NADI_SAMPLING_RATE=1.0
```

### Production

```env
NADI_ENABLED=true
NADI_ENVIRONMENT=production
NADI_SAMPLING_STRATEGY=dynamic_rate
NADI_SAMPLING_BASE_RATE=0.1
```

## Conditional Configuration

Use Laravel's configuration merging for dynamic settings:

```php
// AppServiceProvider.php
public function boot()
{
    if (app()->environment('production')) {
        config(['nadi.sampling.config.sampling_rate' => 0.1]);
    }
}
```

## Testing Configuration

Verify your configuration:

```bash
php artisan nadi:test
```

This command:
- Validates API credentials
- Tests connectivity to Nadi
- Sends a test exception
- Confirms Shipper can access log files

## Next Steps

- [Error Tracking](/sdks/laravel/error-tracking) - Capture and report errors
- [Context & Metadata](/sdks/laravel/context) - Enrich events with context
- [Sampling](/sdks/laravel/sampling) - Control event volume
