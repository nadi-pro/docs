# Laravel SDK

The Nadi Laravel SDK provides seamless integration with Laravel applications,
automatically capturing exceptions and providing Laravel-specific context.

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

1. Publish the configuration file to `config/nadi.php`
2. Download and install the Nadi Shipper binary to `vendor/bin/`
3. Create the `storage/nadi/` directory for log files
4. Download the latest shipper configuration from GitHub
5. Prompt for your API credentials (can be skipped)
6. Display Supervisord setup instructions

### Interactive Credential Setup

During installation, you'll be prompted to enter:

- **API Key** - Your Sanctum token from your Nadi account
- **App Key** - Your application identifier from Nadi

Press Enter to skip and configure later. Get your credentials at [https://nadi.pro](https://nadi.pro).

### Installation Options

```bash
# Skip shipper binary installation
php artisan nadi:install --skip-shipper

# Skip shipper config (nadi.yaml) setup
php artisan nadi:install --skip-config

# Force overwrite existing configuration files
php artisan nadi:install --force
```

## Configuration

Add your credentials to `.env`:

```env
NADI_ENABLED=true
NADI_DRIVER=log
NADI_API_KEY=your-api-key
NADI_APP_KEY=your-application-key
```

The configuration file `config/nadi.php` provides additional options.
See [Configuration](/sdks/laravel/configuration) for full reference.

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

| Data        | Description                                   |
| ----------- | --------------------------------------------- |
| Exception   | Type, message, code, file, line               |
| Stack Trace | Full trace with file paths and line numbers   |
| Request     | URL, method, headers, input (filtered)        |
| User        | Authenticated user (if configured)            |
| Session     | Session data (filtered)                       |
| Environment | App environment, PHP version, Laravel version |
| Route       | Route name, action, parameters                |
| Git         | Commit hash (if available)                    |

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
# Install Nadi and setup shipper
php artisan nadi:install

# Test your Nadi configuration
php artisan nadi:test

# Verify configuration and connectivity
php artisan nadi:verify

# Republish configuration
php artisan vendor:publish --tag=nadi-config --force
```

## Next Steps

- [Configuration](/sdks/laravel/configuration) - Full configuration options
- [Error Tracking](/sdks/laravel/error-tracking) - Advanced error tracking
- [Context & Metadata](/sdks/laravel/context) - Adding context to events
- [User Identification](/sdks/laravel/user-identification) - Tracking users
- [Sampling](/sdks/laravel/sampling) - Control event volume
