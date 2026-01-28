# PHP Sampling

Control which events are captured to manage volume and costs.

## Overview

Sampling determines which events are captured and sent to Nadi. Use sampling to:

- Reduce data volume for high-traffic applications
- Control costs while maintaining error visibility
- Focus on important events
- Handle traffic spikes gracefully

## Configuration

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'samplingStrategy' => 'fixed_rate',
    'samplingRate' => 0.1, // 10%
]);
```

## Sampling Strategies

### Fixed Rate

Capture a fixed percentage of all events.

```php
[
    'samplingStrategy' => 'fixed_rate',
    'samplingRate' => 0.1, // 10% of events
]
```

**How it works:** Each event has a 10% chance of being captured.

### Dynamic Rate

Adjust sampling based on system load.

```php
[
    'samplingStrategy' => 'dynamic_rate',
    'samplingBaseRate' => 0.05,  // 5% base rate
    'samplingLoadFactor' => 1.5, // Multiplier
]
```

**How it works:** Effective rate = base_rate × load_factor. The SDK increases the load factor during high-traffic periods.

### Interval

Capture events at time intervals.

```php
[
    'samplingStrategy' => 'interval',
    'samplingIntervalSeconds' => 60, // One per minute
]
```

**How it works:** Only the first event in each 60-second window is captured.

### Peak Load

Increase sampling during traffic spikes.

```php
[
    'samplingStrategy' => 'peak_load',
    'samplingBaseRate' => 0.05,
]
```

**How it works:** Monitors request rate and increases sampling when traffic exceeds normal levels.

## Runtime Sampling Control

### Change Sampling Rate

```php
// Reduce sampling
$client->setSamplingRate(0.05);

// Disable sampling (capture all)
$client->setSamplingRate(1.0);

// Stop capturing
$client->setSamplingRate(0.0);
```

### Conditional Sampling

```php
// Always capture errors for premium users
if ($user->isPremium()) {
    $client->setSamplingRate(1.0);
}

// Always capture specific error types
$client->beforeCapture(function ($event, $hint) {
    if ($hint['exception'] instanceof PaymentException) {
        return $event; // Always capture
    }
    return $event;
});
```

### Skip Sampling for Specific Events

```php
// Capture this event regardless of sampling
$client->captureException($exception, ['skipSampling' => true]);

$client->captureMessage('Critical event', 'error', [
    'skipSampling' => true,
]);
```

## Custom Sampling Strategies

### Creating a Strategy

```php
<?php

namespace App\Sampling;

use Nadi\Sampling\Config;
use Nadi\Sampling\Contract;

class BusinessHoursSampling implements Contract
{
    protected Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function shouldSample(): bool
    {
        $hour = (int) date('G');

        // Full sampling during business hours (9-18)
        if ($hour >= 9 && $hour < 18) {
            return true;
        }

        // 10% sampling outside business hours
        return random_int(1, 100) <= 10;
    }
}
```

### Registering the Strategy

```php
use App\Sampling\BusinessHoursSampling;
use Nadi\Sampling\SamplingManager;

$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);

$samplingManager = $client->getSamplingManager();
$samplingManager->registerStrategy('business_hours', BusinessHoursSampling::class);
$samplingManager->setStrategy('business_hours');
```

### Error-Level Sampling

```php
<?php

namespace App\Sampling;

use Nadi\Sampling\Config;
use Nadi\Sampling\Contract;

class SeveritySampling implements Contract
{
    protected Config $config;
    private array $rates = [
        'fatal' => 1.0,    // 100%
        'error' => 1.0,    // 100%
        'warning' => 0.5,  // 50%
        'info' => 0.1,     // 10%
        'debug' => 0.01,   // 1%
    ];

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function shouldSample(): bool
    {
        // Will be determined per-event
        return true;
    }

    public function shouldSampleEvent(array $event): bool
    {
        $level = $event['level'] ?? 'error';
        $rate = $this->rates[$level] ?? 0.1;

        return (random_int(1, 100) / 100) <= $rate;
    }
}
```

## Sampling Best Practices

### Starting Point

1. Start with 100% sampling
2. Monitor event volume and costs
3. Reduce gradually if needed

### Recommended Rates

| Daily Events | Recommended Rate |
|--------------|------------------|
| < 10,000 | 100% (1.0) |
| 10,000 - 100,000 | 50-100% (0.5-1.0) |
| 100,000 - 1,000,000 | 10-50% (0.1-0.5) |
| > 1,000,000 | 1-10% (0.01-0.1) |

### Critical Path Sampling

Always capture errors in critical paths:

```php
class PaymentService
{
    public function processPayment($order)
    {
        // Set 100% sampling for payment processing
        $this->nadi->setSamplingRate(1.0);

        try {
            return $this->gateway->charge($order);
        } catch (PaymentException $e) {
            $this->nadi->captureException($e);
            throw $e;
        } finally {
            // Restore normal sampling
            $this->nadi->setSamplingRate(0.1);
        }
    }
}
```

### Environment-Based Sampling

```php
$rate = match (getenv('APP_ENV')) {
    'production' => 0.1,
    'staging' => 0.5,
    'development' => 1.0,
    default => 1.0,
};

$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'samplingRate' => $rate,
]);
```

## Monitoring Sampling

### Check Current Rate

```php
$rate = $client->getSamplingRate();
echo "Current sampling rate: " . ($rate * 100) . "%";
```

### Log Sampled Events

```php
$client->afterCapture(function ($event) {
    error_log("Nadi: Event captured - " . $event['event_id']);
});
```

### Track Sampling Statistics

```php
$client->beforeCapture(function ($event, $hint) use (&$stats) {
    $stats['total']++;
    if ($event !== null) {
        $stats['captured']++;
    }
    return $event;
});
```

## Troubleshooting

### Events Not Appearing

1. Check sampling rate isn't 0:
   ```php
   var_dump($client->getSamplingRate());
   ```

2. Test with 100% sampling:
   ```php
   $client->setSamplingRate(1.0);
   ```

3. Verify sampling strategy:
   ```php
   var_dump($client->getSamplingStrategy());
   ```

### Too Many Events

1. Reduce sampling rate
2. Use severity-based sampling
3. Add to don't report list

## Next Steps

- [Advanced Usage](/sdks/php/advanced) - Advanced features
- [Configuration](/sdks/php/configuration) - Full configuration reference
