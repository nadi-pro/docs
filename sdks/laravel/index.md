# Laravel SDK

The Nadi Laravel SDK provides seamless integration with Laravel applications, automatically capturing exceptions and providing Laravel-specific context.

## Requirements

- PHP 8.1 or higher
- Laravel 9.0 or higher
- Composer

## Installation

Install the package via Composer:

```bash
composer require nadi-pro/nadi-laravel
```

Run the installation command:

```bash
php artisan nadi:install
```

This command will:
- Publish the configuration file to `config/nadi.php`
- Add environment variables to your `.env` file
- Register the exception handler

## Configuration

Add your credentials to `.env`:

```env
NADI_API_KEY=your-api-key
NADI_APP_KEY=your-application-key
```

The configuration file `config/nadi.php` provides additional options:

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Nadi API Key
    |--------------------------------------------------------------------------
    |
    | Your Nadi API key for authentication.
    |
    */
    'api_key' => env('NADI_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Nadi Application Key
    |--------------------------------------------------------------------------
    |
    | Your application key identifies this project in Nadi.
    |
    */
    'app_key' => env('NADI_APP_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Environment
    |--------------------------------------------------------------------------
    |
    | The environment name to tag events with.
    |
    */
    'environment' => env('NADI_ENVIRONMENT', env('APP_ENV', 'production')),

    /*
    |--------------------------------------------------------------------------
    | Enabled
    |--------------------------------------------------------------------------
    |
    | Enable or disable Nadi error reporting.
    |
    */
    'enabled' => env('NADI_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Log Storage Path
    |--------------------------------------------------------------------------
    |
    | The path where Nadi writes log files for Shipper to process.
    |
    */
    'storage_path' => env('NADI_STORAGE_PATH', '/var/log/nadi'),

    /*
    |--------------------------------------------------------------------------
    | Sampling Configuration
    |--------------------------------------------------------------------------
    */
    'sampling' => [
        'strategy' => env('NADI_SAMPLING_STRATEGY', 'fixed_rate'),
        'config' => [
            'sampling_rate' => env('NADI_SAMPLING_RATE', 1.0),
            'base_rate' => env('NADI_SAMPLING_BASE_RATE', 0.05),
            'load_factor' => env('NADI_SAMPLING_LOAD_FACTOR', 1.0),
            'interval_seconds' => env('NADI_SAMPLING_INTERVAL_SECONDS', 60),
        ],
    ],
];
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
use Nadi\Laravel\Facades\Nadi;

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
use Nadi\Laravel\Facades\Nadi;

Nadi::captureMessage('User performed an important action', 'info');
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Adding Context

### User Context

Identify the current user:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setUser([
    'id' => auth()->id(),
    'email' => auth()->user()->email,
    'name' => auth()->user()->name,
]);
```

Or configure automatic user identification in `config/nadi.php`:

```php
'user' => [
    'auto_identify' => true,
    'fields' => ['id', 'email', 'name'],
],
```

### Tags

Add tags for filtering:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setTag('subscription', 'premium');
Nadi::setTags([
    'feature' => 'checkout',
    'version' => '2.1.0',
]);
```

### Extra Data

Attach additional data:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setExtra('order_id', $order->id);
Nadi::setExtras([
    'cart_items' => $cart->count(),
    'total' => $cart->total(),
]);
```

## What's Captured

The Laravel SDK automatically captures:

| Data | Description |
|------|-------------|
| Exception | Type, message, code, file, line |
| Stack Trace | Full trace with file paths and line numbers |
| Request | URL, method, headers, input (filtered) |
| User | Authenticated user (if configured) |
| Session | Session data (filtered) |
| Environment | App environment, PHP version, Laravel version |
| Route | Route name, action, parameters |
| Git | Commit hash (if available) |

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

## Exception Ignore List

Don't report certain exceptions:

```php
// config/nadi.php
'dont_report' => [
    \Illuminate\Auth\AuthenticationException::class,
    \Illuminate\Validation\ValidationException::class,
    \Symfony\Component\HttpKernel\Exception\NotFoundHttpException::class,
],
```

## Artisan Commands

```bash
# Test your Nadi configuration
php artisan nadi:test

# Republish configuration
php artisan vendor:publish --tag=nadi-config --force
```

## Next Steps

- [Configuration](/sdks/laravel/configuration) - Full configuration options
- [Error Tracking](/sdks/laravel/error-tracking) - Advanced error tracking
- [Context & Metadata](/sdks/laravel/context) - Adding context to events
- [User Identification](/sdks/laravel/user-identification) - Tracking users
- [Sampling](/sdks/laravel/sampling) - Control event volume
