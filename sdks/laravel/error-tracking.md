# Error Tracking

Learn how to capture and report errors with the Laravel SDK.

## Automatic Error Capturing

The Laravel SDK automatically captures all unhandled exceptions. Once installed, exceptions thrown in your application are reported to Nadi without any additional code.

```php
// This is automatically captured
public function show($id)
{
    $user = User::findOrFail($id); // 404 exceptions are captured
}
```

## Manual Error Capturing

### Capturing Exceptions

Capture exceptions while still handling them in your code:

```php
use Nadi\Laravel\Facades\Nadi;

try {
    $this->processPayment($order);
} catch (PaymentException $e) {
    Nadi::captureException($e);

    // Continue handling the exception
    return back()->withError('Payment failed. Please try again.');
}
```

### Capturing with Context

Add context when capturing:

```php
use Nadi\Laravel\Facades\Nadi;

try {
    $this->processPayment($order);
} catch (PaymentException $e) {
    Nadi::captureException($e, [
        'extra' => [
            'order_id' => $order->id,
            'amount' => $order->total,
            'gateway' => $order->payment_gateway,
        ],
        'tags' => [
            'payment_type' => 'credit_card',
        ],
    ]);
}
```

### Capturing Messages

Log important events without exceptions:

```php
use Nadi\Laravel\Facades\Nadi;

// Info level message
Nadi::captureMessage('User upgraded to premium');

// With explicit level
Nadi::captureMessage('API rate limit approaching', 'warning');

// With context
Nadi::captureMessage('Large export completed', 'info', [
    'extra' => [
        'records' => 50000,
        'duration_ms' => 12500,
    ],
]);
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Error Levels

### Automatic Level Assignment

The SDK assigns levels based on exception type:

| Exception Type | Level |
|----------------|-------|
| `ErrorException` (E_ERROR, E_PARSE) | `fatal` |
| `ErrorException` (E_WARNING) | `warning` |
| `ErrorException` (E_NOTICE) | `info` |
| Other exceptions | `error` |

### Custom Level Mapping

Override levels for specific exceptions in `config/nadi.php`:

```php
'exception_levels' => [
    \App\Exceptions\MinorException::class => 'warning',
    \App\Exceptions\DeprecationException::class => 'info',
    \App\Exceptions\CriticalException::class => 'fatal',
],
```

## Filtering Exceptions

### Ignoring Exceptions

Don't report certain exception types:

```php
// config/nadi.php
'dont_report' => [
    \Illuminate\Auth\AuthenticationException::class,
    \Illuminate\Validation\ValidationException::class,
    \Symfony\Component\HttpKernel\Exception\NotFoundHttpException::class,
    \App\Exceptions\ExpectedException::class,
],
```

### Allowlist Mode

Only report specific exceptions (ignores `dont_report`):

```php
// config/nadi.php
'report_only' => [
    \App\Exceptions\CriticalException::class,
    \App\Exceptions\PaymentException::class,
],
```

### Dynamic Filtering

Filter exceptions at runtime:

```php
// AppServiceProvider.php
use Nadi\Laravel\Facades\Nadi;

public function boot()
{
    Nadi::beforeCapture(function ($event, $hint) {
        // Don't report exceptions from bots
        if (request()->header('User-Agent') === 'Bot/1.0') {
            return null; // Returning null prevents capture
        }

        return $event;
    });
}
```

## Exception Handler Integration

### Laravel 11+

The SDK integrates automatically. For custom behavior, modify `bootstrap/app.php`:

```php
use Nadi\Laravel\Facades\Nadi;

return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e) {
            Nadi::captureException($e);
        });
    })
    ->create();
```

### Laravel 9-10

Modify `app/Exceptions/Handler.php`:

```php
use Nadi\Laravel\Facades\Nadi;

public function register()
{
    $this->reportable(function (Throwable $e) {
        Nadi::captureException($e);
    });
}
```

## Queue Job Exceptions

Queue job exceptions are automatically captured. Configure in `config/nadi.php`:

```php
'capture_queue_exceptions' => true,
```

Additional context is included:

- Job class name
- Queue name
- Attempt number
- Job payload (filtered)

### Manual Queue Exception Handling

```php
use Nadi\Laravel\Facades\Nadi;

class ProcessOrder implements ShouldQueue
{
    public function handle()
    {
        try {
            $this->process();
        } catch (\Exception $e) {
            Nadi::captureException($e, [
                'tags' => ['job' => 'process_order'],
                'extra' => ['order_id' => $this->order->id],
            ]);
            throw $e; // Re-throw for retry logic
        }
    }
}
```

## Console Command Exceptions

Exceptions in Artisan commands are automatically captured:

```php
class ImportData extends Command
{
    public function handle()
    {
        // Exceptions here are captured with command context
        $this->import();
    }
}
```

## Scheduled Task Exceptions

Enable scheduled task exception capturing:

```php
// config/nadi.php
'capture_schedule_exceptions' => true,
```

## Breadcrumbs

Breadcrumbs provide a trail of events leading up to an error:

```php
use Nadi\Laravel\Facades\Nadi;

// Add a breadcrumb
Nadi::addBreadcrumb('Loaded user profile', 'navigation', [
    'user_id' => $user->id,
]);

// Later, when an error occurs, breadcrumbs are included
throw new \Exception('Failed to update profile');
```

### Automatic Breadcrumbs

The SDK automatically records:

- Route navigation
- Database queries (optional)
- Log messages
- HTTP requests
- User authentication events

Configure in `config/nadi.php`:

```php
'breadcrumbs' => [
    'sql_queries' => true,
    'log_messages' => true,
    'http_requests' => true,
    'auth_events' => true,
    'max_breadcrumbs' => 100,
],
```

## Error Grouping

Nadi automatically groups similar errors. The grouping is based on:

1. Exception class
2. Error message (with dynamic values normalized)
3. Stack trace signature

### Custom Fingerprinting

Override the default grouping:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::beforeCapture(function ($event, $hint) {
    // Group all timeout errors together
    if ($hint['exception'] instanceof TimeoutException) {
        $event['fingerprint'] = ['timeout-exception'];
    }

    return $event;
});
```

## Next Steps

- [Context & Metadata](/sdks/laravel/context) - Add rich context to errors
- [User Identification](/sdks/laravel/user-identification) - Track affected users
- [Sampling](/sdks/laravel/sampling) - Control which errors are captured
