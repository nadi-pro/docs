# Context & Metadata

Enrich error reports with contextual information to make debugging easier.

## Overview

Context provides additional information about the state of your application when an error occurred. This includes:

- **Tags** - Key-value pairs for filtering and searching
- **Extra** - Arbitrary additional data
- **User** - Information about the affected user
- **Request** - HTTP request details

## Tags

Tags are indexed key-value pairs that you can use to filter and search errors in the dashboard.

### Setting Tags

```php
use Nadi\Laravel\Facades\Nadi;

// Set a single tag
Nadi::setTag('subscription', 'premium');

// Set multiple tags
Nadi::setTags([
    'feature' => 'checkout',
    'region' => 'us-east',
    'version' => '2.1.0',
]);
```

### Default Tags

Set tags that apply to all events in `config/nadi.php`:

```php
'tags' => [
    'server' => gethostname(),
    'version' => config('app.version'),
],
```

### Common Tag Patterns

```php
// Feature flags
Nadi::setTag('feature_flag', 'new_checkout_enabled');

// A/B testing
Nadi::setTag('experiment', 'pricing_v2');

// Tenant/customer identification
Nadi::setTag('tenant_id', $tenant->id);

// API version
Nadi::setTag('api_version', 'v2');
```

::: tip Tag Best Practices
- Keep tag names consistent (use snake_case)
- Use tags for values you'll filter by
- Avoid high-cardinality values (like user IDs)
- Keep tag values short
:::

## Extra Data

Extra data contains arbitrary information attached to events. Unlike tags, extra data is not indexed but provides detailed context.

### Setting Extra Data

```php
use Nadi\Laravel\Facades\Nadi;

// Set a single extra value
Nadi::setExtra('order_id', $order->id);

// Set multiple extra values
Nadi::setExtras([
    'cart_items' => $cart->items->count(),
    'cart_total' => $cart->total(),
    'payment_method' => $order->payment_method,
]);
```

### Complex Data Structures

```php
Nadi::setExtra('order_details', [
    'id' => $order->id,
    'items' => $order->items->map(fn($item) => [
        'product_id' => $item->product_id,
        'quantity' => $item->quantity,
        'price' => $item->price,
    ])->toArray(),
    'shipping' => [
        'method' => $order->shipping_method,
        'address' => $order->shipping_address,
    ],
]);
```

### Default Extra Data

Set extra data for all events in `config/nadi.php`:

```php
'extra' => [
    'deployment_id' => env('DEPLOYMENT_ID'),
],
```

## Request Context

The SDK automatically captures request information:

| Data | Description |
|------|-------------|
| URL | Full request URL |
| Method | HTTP method (GET, POST, etc.) |
| Headers | Request headers (filtered) |
| Query | Query string parameters |
| Body | Request body (filtered) |
| IP | Client IP address |

### Configuring Request Capture

```php
// config/nadi.php
'capture_request_body' => true,
'max_request_body_size' => 10240, // 10KB

'scrub_fields' => [
    'password',
    'password_confirmation',
    'credit_card',
    'cvv',
],

'scrub_headers' => [
    'Authorization',
    'Cookie',
],
```

### Adding Custom Request Data

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setRequestContext([
    'custom_header' => request()->header('X-Custom-Header'),
    'trace_id' => request()->header('X-Trace-ID'),
]);
```

## Scopes

Scopes allow you to set context that applies to all events within a certain scope.

### Global Scope

Context set globally applies to all subsequent events:

```php
use Nadi\Laravel\Facades\Nadi;

// In a middleware or service provider
Nadi::configureScope(function ($scope) {
    $scope->setTag('request_id', request()->id());
    $scope->setExtra('session_id', session()->getId());
});
```

### Temporary Scope

Set context for a specific operation:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::withScope(function ($scope) {
    $scope->setTag('operation', 'payment_processing');
    $scope->setExtra('gateway', 'stripe');

    // Errors in this closure include the scoped context
    $this->processPayment($order);
});
// Context is cleared after the closure
```

## Middleware Integration

Set context in middleware for consistent tagging:

```php
namespace App\Http\Middleware;

use Nadi\Laravel\Facades\Nadi;

class NadiContextMiddleware
{
    public function handle($request, $next)
    {
        Nadi::configureScope(function ($scope) use ($request) {
            // Request identification
            $scope->setTag('request_id', $request->id());

            // Feature context
            if ($request->route()) {
                $scope->setTag('route', $request->route()->getName());
            }

            // User context (if authenticated)
            if ($request->user()) {
                $scope->setUser([
                    'id' => $request->user()->id,
                    'email' => $request->user()->email,
                ]);
            }

            // Tenant context (multi-tenant apps)
            if ($tenant = $request->route('tenant')) {
                $scope->setTag('tenant_id', $tenant->id);
            }
        });

        return $next($request);
    }
}
```

Register the middleware:

```php
// app/Http/Kernel.php
protected $middleware = [
    // ...
    \App\Http\Middleware\NadiContextMiddleware::class,
];
```

## Environment Context

Automatically captured environment information:

| Data | Description |
|------|-------------|
| PHP Version | Runtime version |
| Laravel Version | Framework version |
| Server OS | Operating system |
| Server Name | Hostname |
| Memory Limit | PHP memory limit |

### Adding Custom Environment Data

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setContext('runtime', [
    'php_version' => PHP_VERSION,
    'laravel_version' => app()->version(),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
]);
```

## Git Context

If your deployment includes Git information, Nadi captures:

- Commit hash
- Branch name (if available)

Set via environment variable:

```env
NADI_RELEASE=abc123def456
```

Or programmatically:

```php
// AppServiceProvider.php
Nadi::setRelease(trim(exec('git rev-parse HEAD')));
```

## Clearing Context

Reset context when needed:

```php
use Nadi\Laravel\Facades\Nadi;

// Clear specific context
Nadi::setUser(null);
Nadi::setTags([]);
Nadi::setExtras([]);

// Clear all context
Nadi::clearScope();
```

## Context in Queue Jobs

Context is not automatically carried to queue jobs. Set context within the job:

```php
class ProcessOrder implements ShouldQueue
{
    public function handle()
    {
        Nadi::configureScope(function ($scope) {
            $scope->setTag('job', 'process_order');
            $scope->setExtra('order_id', $this->order->id);
        });

        $this->process();
    }
}
```

## Next Steps

- [User Identification](/sdks/laravel/user-identification) - Track affected users
- [Performance Monitoring](/sdks/laravel/performance) - Monitor performance
- [Sampling](/sdks/laravel/sampling) - Control which events are captured
