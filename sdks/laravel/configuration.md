# Laravel Configuration

Complete reference for all Laravel SDK configuration options.

## Configuration File

After installation, the configuration file is located at `config/nadi.php`.

## Environment Variables

| Variable                 | Description          | Default                |
| ------------------------ | -------------------- | ---------------------- |
| `NADI_ENABLED`           | Enable/disable Nadi  | `true`                 |
| `NADI_DRIVER`            | Transport driver     | `log`                  |
| `NADI_API_KEY`           | Your Nadi API key    | -                      |
| `NADI_APP_KEY`           | Your application key | -                      |
| `NADI_ENDPOINT`          | API endpoint         | `https://api.nadi.pro` |
| `NADI_STORAGE_PATH`      | Log file directory   | `storage/nadi`         |
| `NADI_SAMPLING_STRATEGY` | Sampling strategy    | `fixed_rate`           |
| `NADI_SAMPLING_RATE`     | Fixed sampling rate  | `0.1`                  |

## Transport Drivers

Nadi supports three transport methods:

### Log Driver (Recommended)

Writes monitoring data to local JSON files. The shipper binary forwards files to the Nadi API.

```env
NADI_DRIVER=log
NADI_STORAGE_PATH=storage/nadi
```

### HTTP Driver

Sends data directly to the Nadi API over HTTP.

```env
NADI_DRIVER=http
NADI_API_KEY=your-sanctum-token
NADI_APP_KEY=your-application-key
NADI_ENDPOINT=https://api.nadi.pro
```

### OpenTelemetry Driver

Exports data using OpenTelemetry Protocol (OTLP).

```env
NADI_DRIVER=opentelemetry
NADI_OTEL_ENDPOINT=http://localhost:4318
NADI_OTEL_SERVICE_NAME=my-app
```

## Full Configuration Reference

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Enabled
    |--------------------------------------------------------------------------
    */
    'enabled' => env('NADI_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Driver
    |--------------------------------------------------------------------------
    |
    | Transport method: log, http, opentelemetry
    |
    */
    'driver' => env('NADI_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Connections
    |--------------------------------------------------------------------------
    */
    'connections' => [
        'log' => [
            'path' => env('NADI_STORAGE_PATH', storage_path('nadi/')),
        ],
        'http' => [
            'apiKey' => env('NADI_API_KEY'),
            'appKey' => env('NADI_APP_KEY'),
            'endpoint' => env('NADI_ENDPOINT', 'https://api.nadi.pro'),
            'version' => env('NADI_API_VERSION', 'v1'),
        ],
        'opentelemetry' => [
            'endpoint' => env('NADI_OTEL_ENDPOINT', 'http://localhost:4318'),
            'service_name' => env('NADI_OTEL_SERVICE_NAME', config('app.name')),
            'service_version' => env('NADI_OTEL_SERVICE_VERSION', '1.0.0'),
            'protocol' => env('NADI_OTEL_PROTOCOL', 'http/protobuf'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Event Observation
    |--------------------------------------------------------------------------
    */
    'observe' => [
        \Illuminate\Log\Events\MessageLogged::class => [
            \Nadi\Laravel\Handler\HandleExceptionEvent::class,
        ],
        \Illuminate\Database\Events\QueryExecuted::class => [
            \Nadi\Laravel\Handler\HandleQueryExecutedEvent::class,
        ],
        \Illuminate\Queue\Events\JobFailed::class => [
            \Nadi\Laravel\Handler\HandleFailedJobEvent::class,
        ],
        \Illuminate\Foundation\Http\Events\RequestHandled::class => [
            \Nadi\Laravel\Handler\HandleHttpRequestEvent::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Query Monitoring
    |--------------------------------------------------------------------------
    */
    'query' => [
        'slow-threshold' => env('NADI_QUERY_SLOW_THRESHOLD', 500), // milliseconds
    ],

    /*
    |--------------------------------------------------------------------------
    | HTTP Request Filtering
    |--------------------------------------------------------------------------
    */
    'http' => [
        'hidden_request_headers' => [
            'authorization',
            'php-auth-pw',
        ],
        'hidden_parameters' => [
            'password',
            'password_confirmation',
        ],
        'ignored_status_codes' => [
            100, 101, 102, 103,
            200, 201, 202, 203, 204, 205, 206, 207,
            300, 302, 303, 304, 305, 306, 307, 308,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Sampling
    |--------------------------------------------------------------------------
    */
    'sampling' => [
        'strategy' => env('NADI_SAMPLING_STRATEGY', 'fixed_rate'),
        'config' => [
            'sampling_rate' => env('NADI_SAMPLING_RATE', 0.1),
            'base_rate' => env('NADI_SAMPLING_BASE_RATE', 0.05),
            'load_factor' => env('NADI_SAMPLING_LOAD_FACTOR', 1.0),
            'interval_seconds' => env('NADI_SAMPLING_INTERVAL_SECONDS', 60),
        ],
        'strategies' => [
            'dynamic_rate' => \Nadi\Sampling\DynamicRateSampling::class,
            'fixed_rate' => \Nadi\Sampling\FixedRateSampling::class,
            'interval' => \Nadi\Sampling\IntervalSampling::class,
            'peak_load' => \Nadi\Sampling\PeakLoadSampling::class,
        ],
    ],
];
```

## Shipper Configuration

The shipper configuration file is located at `storage/nadi/nadi.yaml`. This file is created during installation.

### Manual Configuration

If you skipped credentials during installation, update `storage/nadi/nadi.yaml`:

```yaml
nadi:
  endpoint: https://api.nadi.pro
  apiKey: your-api-key-here
  token: your-app-key-here
  storage: /path/to/project/storage/nadi
```

### Shipper Options

| Option          | Description                        | Default                 |
| --------------- | ---------------------------------- | ----------------------- |
| `endpoint`      | Nadi API endpoint                  | `https://nadi.pro/api/` |
| `apiKey`        | API authentication key             | -                       |
| `token`         | Application identifier             | -                       |
| `storage`       | Directory to monitor for log files | `/var/log/nadi`         |
| `checkInterval` | How often to check for new files   | `5s`                    |
| `maxTries`      | Maximum retry attempts             | `3`                     |
| `timeout`       | Request timeout                    | `1m`                    |
| `workers`       | Concurrent workers                 | `4`                     |
| `compress`      | Enable gzip compression            | `false`                 |

## Environment-Specific Configuration

### Development

```env
NADI_ENABLED=false
# Or enable with full capture
NADI_ENABLED=true
NADI_DRIVER=log
NADI_SAMPLING_RATE=1.0
```

### Staging

```env
NADI_ENABLED=true
NADI_DRIVER=log
NADI_SAMPLING_RATE=1.0
```

### Production

```env
NADI_ENABLED=true
NADI_DRIVER=log
NADI_SAMPLING_STRATEGY=fixed_rate
NADI_SAMPLING_RATE=0.1
```

## Testing Configuration

Test the API connection:

```bash
php artisan nadi:test
```

This command sends a test request to the Nadi API to confirm your API Key is valid and the connection is working.

Verify the App Key:

```bash
php artisan nadi:verify
```

This command validates your App Key is correctly configured and recognized by Nadi.

## Next Steps

- [Error Tracking](/sdks/laravel/error-tracking) - Capture and report errors
- [Context & Metadata](/sdks/laravel/context) - Enrich events with context
- [Sampling](/sdks/laravel/sampling) - Control event volume
