# Performance Monitoring

Track application performance metrics and identify bottlenecks.

## Overview

Nadi can capture performance data alongside error tracking:

- Slow database queries
- HTTP request timing
- Queue job duration
- Custom performance spans

## Slow Query Tracking

Enable slow query tracking to capture database queries that exceed a threshold.

### Configuration

```php
// config/nadi.php
'capture_slow_queries' => true,
'slow_query_threshold' => 1000, // milliseconds
```

### Environment Variables

```env
NADI_CAPTURE_SLOW_QUERIES=true
NADI_SLOW_QUERY_THRESHOLD=1000
```

### What's Captured

For each slow query, Nadi captures:

| Data | Description |
|------|-------------|
| SQL | The query (with bindings) |
| Duration | Execution time in ms |
| Connection | Database connection name |
| Location | File and line where query was executed |

### Example Output

```json
{
  "type": "slow_query",
  "query": "SELECT * FROM orders WHERE user_id = ? AND status = ?",
  "bindings": [1234, "pending"],
  "duration_ms": 1523,
  "connection": "mysql",
  "location": "app/Services/OrderService.php:45"
}
```

### Filtering Queries

Exclude certain queries from tracking:

```php
// config/nadi.php
'slow_query_ignore' => [
    'SHOW *',      // Ignore SHOW queries
    '* information_schema *',  // Ignore schema queries
],
```

## Request Performance

Track overall request performance:

### Enable Request Timing

```php
// config/nadi.php
'capture_request_timing' => true,
```

### Captured Metrics

| Metric | Description |
|--------|-------------|
| Total Duration | Total request time |
| Time to First Byte | Server processing time |
| Database Time | Total time in database queries |
| Memory Peak | Peak memory usage |

## Queue Job Performance

Track queue job execution time:

### Configuration

```php
// config/nadi.php
'capture_queue_performance' => true,
'slow_job_threshold' => 30000, // 30 seconds
```

### Captured Data

```json
{
  "type": "slow_job",
  "job": "App\\Jobs\\ProcessOrder",
  "queue": "orders",
  "duration_ms": 45000,
  "attempts": 1,
  "memory_mb": 128
}
```

## Custom Performance Spans

Create custom performance measurements:

### Basic Usage

```php
use Nadi\Laravel\Facades\Nadi;

$span = Nadi::startSpan('process_order');

try {
    $this->processOrder($order);
} finally {
    $span->finish();
}
```

### With Additional Data

```php
$span = Nadi::startSpan('api_call', [
    'service' => 'payment_gateway',
    'endpoint' => '/charge',
]);

try {
    $response = Http::post('https://api.stripe.com/charge', $data);

    $span->setData([
        'status' => $response->status(),
        'response_size' => strlen($response->body()),
    ]);
} finally {
    $span->finish();
}
```

### Nested Spans

```php
$parentSpan = Nadi::startSpan('checkout_process');

try {
    $validateSpan = Nadi::startSpan('validate_cart');
    $this->validateCart();
    $validateSpan->finish();

    $paymentSpan = Nadi::startSpan('process_payment');
    $this->processPayment();
    $paymentSpan->finish();

    $fulfillSpan = Nadi::startSpan('fulfill_order');
    $this->fulfillOrder();
    $fulfillSpan->finish();
} finally {
    $parentSpan->finish();
}
```

## HTTP Client Performance

Track outgoing HTTP requests:

### Using Laravel's HTTP Client

The SDK automatically instruments Laravel's HTTP client when enabled:

```php
// config/nadi.php
'capture_http_client' => true,
```

### Captured Data

```json
{
  "type": "http_request",
  "method": "POST",
  "url": "https://api.example.com/users",
  "duration_ms": 234,
  "status": 200,
  "response_size": 1024
}
```

## Memory Tracking

Monitor memory usage:

```php
use Nadi\Laravel\Facades\Nadi;

// Log current memory usage
Nadi::recordMemory('after_data_load');

// Check peak memory
$peakMb = memory_get_peak_usage(true) / 1024 / 1024;
if ($peakMb > 100) {
    Nadi::captureMessage('High memory usage detected', 'warning', [
        'extra' => ['peak_memory_mb' => $peakMb],
    ]);
}
```

## Performance Budgets

Alert when performance exceeds thresholds:

```php
use Nadi\Laravel\Facades\Nadi;

class PerformanceMiddleware
{
    public function handle($request, $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = (microtime(true) - $startTime) * 1000;

        // Alert if request exceeds budget
        if ($duration > 3000) { // 3 seconds
            Nadi::captureMessage('Request exceeded performance budget', 'warning', [
                'tags' => ['performance' => 'slow_request'],
                'extra' => [
                    'duration_ms' => $duration,
                    'route' => $request->route()?->getName(),
                    'url' => $request->url(),
                ],
            ]);
        }

        return $response;
    }
}
```

## Viewing Performance Data

In the Nadi dashboard:

1. **Performance Tab** - Overview of slow queries and requests
2. **Error Details** - Performance context for each error
3. **Trends** - Performance metrics over time

## Best Practices

### Do

- Set appropriate thresholds for your application
- Track critical business operations
- Include relevant context with spans
- Monitor trends over time

### Don't

- Set thresholds too low (creates noise)
- Track every operation (creates overhead)
- Include sensitive data in span names
- Ignore consistently slow operations

## Optimization Tips

When you identify slow operations:

1. **Database Queries**
   - Add missing indexes
   - Optimize query structure
   - Implement caching

2. **External APIs**
   - Add timeouts
   - Implement retries with backoff
   - Cache responses when possible

3. **Queue Jobs**
   - Break into smaller jobs
   - Optimize database operations
   - Use job batching

## Next Steps

- [Sampling](/sdks/laravel/sampling) - Control event volume
- [Testing](/sdks/laravel/testing) - Test your integration
- [Troubleshooting](/sdks/laravel/troubleshooting) - Debug issues
