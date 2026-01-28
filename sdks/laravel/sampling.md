# Sampling

Control which events are captured to manage volume and costs while maintaining visibility.

## Overview

Sampling allows you to capture a subset of events instead of every single one. This is useful for:

- Reducing data volume in high-traffic applications
- Managing costs while maintaining error visibility
- Focusing on the most important events
- Preventing Nadi from being overwhelmed during traffic spikes

## Sampling Strategies

Nadi provides four built-in sampling strategies:

| Strategy | Description | Best For |
|----------|-------------|----------|
| `fixed_rate` | Capture a fixed percentage | Predictable volume |
| `dynamic_rate` | Adjust based on system load | Variable traffic |
| `interval` | Capture at time intervals | Time-based sampling |
| `peak_load` | Increase during high load | Spike handling |

## Configuration

Configure sampling in `config/nadi.php`:

```php
'sampling' => [
    'strategy' => env('NADI_SAMPLING_STRATEGY', 'fixed_rate'),
    'config' => [
        'sampling_rate' => env('NADI_SAMPLING_RATE', 1.0),
        'base_rate' => env('NADI_SAMPLING_BASE_RATE', 0.05),
        'load_factor' => env('NADI_SAMPLING_LOAD_FACTOR', 1.0),
        'interval_seconds' => env('NADI_SAMPLING_INTERVAL_SECONDS', 60),
    ],
],
```

Or via environment variables:

```env
NADI_SAMPLING_STRATEGY=fixed_rate
NADI_SAMPLING_RATE=0.1
```

## Fixed Rate Sampling

Capture a fixed percentage of all events.

### Configuration

```env
NADI_SAMPLING_STRATEGY=fixed_rate
NADI_SAMPLING_RATE=0.1  # 10% of events
```

### How It Works

Each event has a 10% chance of being captured. Over time, you'll capture approximately 10% of all events with an even distribution.

### Use Cases

- Stable, predictable traffic patterns
- When you need consistent sampling
- Budget-conscious monitoring

### Example Rates

| Traffic | Rate | Events/Day |
|---------|------|------------|
| 100,000 | 1.0 | 100,000 |
| 100,000 | 0.1 | ~10,000 |
| 100,000 | 0.01 | ~1,000 |

## Dynamic Rate Sampling

Automatically adjust sampling based on system load.

### Configuration

```env
NADI_SAMPLING_STRATEGY=dynamic_rate
NADI_SAMPLING_BASE_RATE=0.05    # 5% base rate
NADI_SAMPLING_LOAD_FACTOR=1.5   # Multiplier
```

### How It Works

The effective sampling rate is calculated as:

```
effective_rate = base_rate * load_factor
```

When system load is high, the SDK increases the load factor, capturing more events during critical periods.

### Use Cases

- Variable traffic patterns
- Applications with unpredictable spikes
- When important events cluster during high load

## Interval Sampling

Capture events at fixed time intervals.

### Configuration

```env
NADI_SAMPLING_STRATEGY=interval
NADI_SAMPLING_INTERVAL_SECONDS=60  # One event per minute
```

### How It Works

Only the first event within each interval is captured. Subsequent events in the same interval are skipped.

### Use Cases

- Recurring errors (don't need every occurrence)
- Rate limiting event capture
- Monitoring periodic processes

## Peak Load Sampling

Increase sampling during high traffic periods.

### Configuration

```env
NADI_SAMPLING_STRATEGY=peak_load
NADI_SAMPLING_BASE_RATE=0.05
```

### How It Works

The strategy monitors request rate and automatically increases sampling when traffic exceeds normal levels.

### Use Cases

- E-commerce during sales
- Applications with known traffic spikes
- Event-driven traffic patterns

## Custom Sampling Strategies

Create your own sampling logic:

### Step 1: Create the Strategy Class

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

        // Full sampling during business hours (9 AM - 6 PM)
        if ($hour >= 9 && $hour < 18) {
            return true;
        }

        // 10% sampling outside business hours
        return random_int(1, 100) <= 10;
    }
}
```

### Step 2: Register the Strategy

```php
// config/nadi.php
'sampling' => [
    'strategy' => env('NADI_SAMPLING_STRATEGY', 'business_hours'),
    'strategies' => [
        'dynamic_rate' => \Nadi\Sampling\DynamicRateSampling::class,
        'fixed_rate' => \Nadi\Sampling\FixedRateSampling::class,
        'interval' => \Nadi\Sampling\IntervalSampling::class,
        'peak_load' => \Nadi\Sampling\PeakLoadSampling::class,
        'business_hours' => \App\Sampling\BusinessHoursSampling::class,
    ],
],
```

### Step 3: Use the Strategy

```env
NADI_SAMPLING_STRATEGY=business_hours
```

## Error-Level Sampling

Apply different sampling rates based on error severity:

```php
<?php

namespace App\Sampling;

use Nadi\Sampling\Config;
use Nadi\Sampling\Contract;

class SeverityBasedSampling implements Contract
{
    protected Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function shouldSample(): bool
    {
        // This is checked at runtime with the current event context
        return true; // Always sample at this stage
    }

    public function shouldSampleEvent(array $event): bool
    {
        $level = $event['level'] ?? 'error';

        return match ($level) {
            'fatal' => true,           // Always capture fatal
            'error' => true,           // Always capture errors
            'warning' => rand(1, 100) <= 50,  // 50% of warnings
            'info' => rand(1, 100) <= 10,     // 10% of info
            default => rand(1, 100) <= 5,     // 5% of others
        };
    }
}
```

## Conditional Sampling

Bypass sampling for specific conditions:

```php
use Nadi\Laravel\Facades\Nadi;

// Always capture for premium users
if ($user->isPremium()) {
    Nadi::setSamplingRate(1.0);
}

// Always capture specific exceptions
Nadi::beforeCapture(function ($event, $hint) {
    if ($hint['exception'] instanceof PaymentException) {
        return $event; // Always capture payment errors
    }

    return $event;
});
```

## Sampling Best Practices

### Do

- Start with 100% sampling, then reduce as needed
- Use higher rates for critical paths (checkout, authentication)
- Monitor sampling rates in production
- Test sampling changes in staging first

### Don't

- Sample too aggressively (miss important errors)
- Use different rates across similar services
- Forget about sampling when debugging

### Recommended Rates by Traffic

| Daily Events | Recommended Rate |
|--------------|------------------|
| < 10,000 | 1.0 (100%) |
| 10,000 - 100,000 | 0.5 - 1.0 (50-100%) |
| 100,000 - 1,000,000 | 0.1 - 0.5 (10-50%) |
| > 1,000,000 | 0.01 - 0.1 (1-10%) |

## Monitoring Sampling

Check your effective sampling in the Nadi dashboard:

1. **Events Overview** - See captured vs estimated total
2. **Sampling Indicator** - Shows current sampling rate
3. **Trends** - Track sampling changes over time

## Troubleshooting

### Events Not Appearing?

1. Check sampling rate isn't too low
2. Verify sampling strategy is correct
3. Test with `NADI_SAMPLING_RATE=1.0`

### Too Many Events?

1. Reduce sampling rate gradually
2. Consider error-level sampling
3. Filter out noisy error types

## Next Steps

- [Testing](/sdks/laravel/testing) - Test your configuration
- [Troubleshooting](/sdks/laravel/troubleshooting) - Debug issues
