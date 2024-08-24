# Nadi Sampling

[[toc]]

## Overview

The sampling configuration is designed to manage how data is captured and processed. Sampling helps in controlling the volume of data logged by selectively capturing a subset of events, making it easier to manage resources and focus on the most critical data. This section allows you to configure in your application.

## Purpose

The purpose of the sampling configuration is to:

- **Optimize Resource Usage:** By reducing the volume of data captured, sampling prevents overloading storage and processing resources.
- **Focus on Critical Data:** Sampling strategies can prioritize capturing significant events, such as during peak loads or specific intervals, ensuring that the most relevant data is logged.
- **Flexible Data Capture:** With different sampling strategies, you can tailor data capture to meet specific application requirements and conditions.

## Configuration Options

- **strategy** (`NADI_SAMPLING_STRATEGY`):
  - Defines the sampling strategy to use. Available options include:
    - `fixed_rate`: Samples a fixed percentage of events.
    - `dynamic_rate`: Adjusts the sampling rate based on system load.
    - `interval`: Samples events at specific time intervals.
    - `peak_load`: Increases sampling during high system load.

- **config**:
  - Contains configuration parameters that apply to the selected sampling strategy:
    - **sampling_rate** (`NADI_SAMPLING_RATE`):
      - The percentage of events to sample when using the `fixed_rate` strategy. Default is `0.1` (10%).
    - **base_rate** (`NADI_SAMPLING_BASE_RATE`):
      - The base sampling rate used in the `dynamic_rate` strategy. Default is `0.05` (5%).
    - **load_factor** (`NADI_SAMPLING_LOAD_FACTOR`):
      - A multiplier for the base rate in the `dynamic_rate` strategy to adjust for system load. Default is `1.0`.
    - **interval_seconds** (`NADI_SAMPLING_INTERVAL_SECONDS`):
      - The time interval in seconds for sampling when using the `interval` strategy. Default is `60` seconds.

- **strategies**:
  - Maps the strategy names to their corresponding classes. This allows for easy extension or modification of sampling strategies. The available strategies are:
    - **dynamic_rate**: Uses `Nadi\Sampling\DynamicRateSampling`.
    - **fixed_rate**: Uses `Nadi\Sampling\FixedRateSampling`.
    - **interval**: Uses `Nadi\Sampling\IntervalSampling`.
    - **peak_load**: Uses `Nadi\Sampling\PeakLoadSampling`.

## How to Use

1. **Choose a Sampling Strategy**:
   - Set the `NADI_SAMPLING_STRATEGY` environment variable to one of the available strategies (`fixed_rate`, `dynamic_rate`, `interval`, `peak_load`) to control how events are sampled.

2. **Configure Sampling Parameters**:
   - Depending on the chosen strategy, adjust the corresponding parameters in the `config` section:
     - For `fixed_rate`, set `sampling_rate` to determine what percentage of events are sampled.
     - For `dynamic_rate`, set `base_rate` and `load_factor` to dynamically adjust sampling based on system conditions.
     - For `interval`, set `interval_seconds` to specify how often events are sampled.

3. **Extend or Modify Strategies**:
   - The `strategies` mapping allows you to add custom sampling strategies by defining new classes and mapping them in this section.

4. **Apply Sampling**:
   - The sampling manager in your application will use this configuration to determine whether to capture each event based on the selected strategy and parameters.

## Example Usage

If you want to use the `dynamic_rate` sampling strategy with a base rate of 5% and a load factor of 1.5, set your environment variables as follows:

```env
NADI_SAMPLING_STRATEGY=dynamic_rate
NADI_SAMPLING_BASE_RATE=0.05
NADI_SAMPLING_LOAD_FACTOR=1.5
```

This configuration will dynamically adjust the sampling rate based on system load, capturing more events during high load and fewer during normal operation.

## Custom Sampling Strategy

Nadi allowing you to create custom sampling strategies tailored to your application's specific needs. This flexibility enables you to implement specialized logic for when and how events are sampled, beyond the default strategies provided.

Custom sampling is useful when the existing sampling strategies do not fully meet your requirements. By defining a custom strategy, you can:

- Implement complex or unique sampling rules.
- Integrate external factors or third-party services into your sampling decisions.
- Tailor the sampling logic to specific application contexts or business needs.

### How to Implement Custom Sampling

To create a custom sampling strategy, follow these steps:

1. Create a Custom Sampling Class
2. Register the Custom Sampling Strategy
3. Configure the Strategy

#### Step 1: Create a Custom Sampling Class

First, create a new class that implements the `Contract` and uses the `Config` class to access the necessary configuration parameters.

```php
<?php

namespace App\Sampling;

use Nadi\Sampling\Config;
use Nadi\Sampling\Contract;

class CustomTimeBasedSampling implements Contract
{
    protected $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function shouldSample(): bool
    {
        // Custom logic: Sample only during business hours (9 AM - 5 PM)
        $currentHour = date('G');
        return $currentHour >= 9 && $currentHour < 17;
    }
}
```

#### Step 2: Register the Custom Sampling Strategy

Next, you need to register your custom sampling strategy in the `sampling` section of your NADI configuration file.

Add your custom class to the `strategies` array in the `config/nadi.php` file:

```php
return [
    // Existing configuration...

    'sampling' => [
        'strategy' => env('NADI_SAMPLING_STRATEGY', 'custom_time_based'), // Default to custom sampling
        'config' => [
            'sampling_rate' => env('NADI_SAMPLING_RATE', 0.1),
            'base_rate' => env('NADI_SAMPLING_BASE_RATE', 0.05),
            'load_factor' => env('NADI_SAMPLING_LOAD_FACTOR', 1.0),
            'interval_seconds' => env('NADI_SAMPLING_INTERVAL_SECONDS', 60),
        ],
        'strategies' => [
            'dynamic_rate' => Nadi\Sampling\DynamicRateSampling::class,
            'fixed_rate' => Nadi\Sampling\FixedRateSampling::class,
            'interval' => Nadi\Sampling\IntervalSampling::class,
            'peak_load' => Nadi\Sampling\PeakLoadSampling::class,
            'custom_time_based' => App\Sampling\CustomTimeBasedSampling::class, // Register custom strategy
        ],
    ],
];
```

#### Step 3: Configure the Strategy

Now, set the environment variable `NADI_SAMPLING_STRATEGY` to your custom strategy, or set it directly in the config file:

```env
NADI_SAMPLING_STRATEGY=custom_time_based
```

## Summary

The sampling configuration section provides a powerful and flexible way to manage data capture in your application. By selecting the appropriate strategy and configuring the relevant parameters, you can optimize resource usage and focus on capturing the most important data for your specific needs.
