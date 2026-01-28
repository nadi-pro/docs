# Advanced PHP Usage

Advanced features and techniques for the PHP SDK.

## Error Handlers

### Registering All Handlers

```php
$client->registerHandlers();
```

This registers:
- Exception handler
- Error handler
- Shutdown handler (fatal errors)

### Individual Handlers

```php
// Exception handler
$client->registerExceptionHandler();

// Error handler
$client->registerErrorHandler();

// Shutdown handler (fatal errors)
$client->registerShutdownHandler();
```

### Chaining with Existing Handlers

```php
$previousHandler = set_exception_handler(null);

$client->registerExceptionHandler();

$client->setExceptionHandlerCallback(function ($e) use ($previousHandler) {
    if ($previousHandler) {
        call_user_func($previousHandler, $e);
    }
});
```

### Error Types

Control which PHP errors are captured:

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'errorTypes' => E_ALL & ~E_NOTICE & ~E_DEPRECATED,
]);
```

## Event Hooks

### Before Capture

Modify or filter events before capture:

```php
$client->beforeCapture(function (array $event, array $hint): ?array {
    // Add custom data
    $event['tags']['custom'] = 'value';

    // Access the original exception
    $exception = $hint['exception'] ?? null;

    // Filter out certain errors
    if ($exception instanceof IgnoreException) {
        return null; // Don't capture
    }

    // Must return the event or null
    return $event;
});
```

### After Capture

React after an event is captured:

```php
$client->afterCapture(function (array $event): void {
    // Log the event
    error_log('Captured: ' . $event['event_id']);

    // Send to another service
    $this->slack->notify('Error captured: ' . $event['message']);
});
```

### On Error

Handle SDK errors:

```php
$client->onError(function (Throwable $e): void {
    error_log('Nadi SDK error: ' . $e->getMessage());
});
```

## Context Management

### Scopes

```php
// Global scope - affects all events
$client->configureScope(function ($scope) {
    $scope->setTag('server', gethostname());
    $scope->setExtra('memory_limit', ini_get('memory_limit'));
});

// Temporary scope - affects events within closure
$client->withScope(function ($scope) use ($client, $orderId) {
    $scope->setTag('order_id', $orderId);
    $scope->setLevel('warning');

    $client->captureMessage('Order issue');
});
```

### Clearing Context

```php
// Clear user
$client->setUser(null);

// Clear tags
$client->setTags([]);

// Clear all context
$client->clearScope();
```

## Fingerprinting

Control how errors are grouped:

### Custom Fingerprint

```php
$client->captureException($e, [
    'fingerprint' => ['payment-gateway-timeout'],
]);
```

### Dynamic Fingerprinting

```php
$client->beforeCapture(function ($event, $hint) {
    $exception = $hint['exception'] ?? null;

    if ($exception instanceof TimeoutException) {
        $event['fingerprint'] = [
            'timeout',
            $exception->getService(),
        ];
    }

    return $event;
});
```

### Grouping by Message

```php
// These will be grouped together
$client->captureMessage('User 123 not found', 'error', [
    'fingerprint' => ['user-not-found'],
]);
$client->captureMessage('User 456 not found', 'error', [
    'fingerprint' => ['user-not-found'],
]);
```

## Sensitive Data Handling

### Scrubbing Fields

```php
$client = new Client([
    'scrubFields' => [
        'password',
        'credit_card',
        'ssn',
        '/secret.*/i', // Regex pattern
    ],
]);
```

### Data Callback

```php
$client->setDataCallback(function (array $data): array {
    // Remove sensitive data
    if (isset($data['request']['data']['api_key'])) {
        $data['request']['data']['api_key'] = '[REDACTED]';
    }

    return $data;
});
```

### IP Anonymization

```php
$client->setIpCallback(function (string $ip): string {
    // Anonymize last octet
    return preg_replace('/\.\d+$/', '.0', $ip);
});
```

## Async Processing

### Buffering Events

```php
$client = new Client([
    'bufferSize' => 10, // Buffer 10 events before writing
]);

// Force flush
$client->flush();
```

### Deferred Processing

```php
register_shutdown_function(function () use ($client) {
    $client->flush();
});
```

## Integration Patterns

### Singleton Pattern

```php
class NadiClient
{
    private static ?Client $instance = null;

    public static function getInstance(): Client
    {
        if (self::$instance === null) {
            self::$instance = new Client([
                'apiKey' => getenv('NADI_API_KEY'),
                'appKey' => getenv('NADI_APP_KEY'),
            ]);
        }

        return self::$instance;
    }
}

// Usage
NadiClient::getInstance()->captureException($e);
```

### Dependency Injection

```php
// Container registration
$container->singleton(Client::class, function () {
    return new Client([
        'apiKey' => getenv('NADI_API_KEY'),
        'appKey' => getenv('NADI_APP_KEY'),
    ]);
});

// Controller
class PaymentController
{
    public function __construct(private Client $nadi) {}

    public function process()
    {
        try {
            // ...
        } catch (Exception $e) {
            $this->nadi->captureException($e);
        }
    }
}
```

### PSR-3 Logger Integration

```php
use Psr\Log\LoggerInterface;

class NadiLogger implements LoggerInterface
{
    public function __construct(private Client $client) {}

    public function error($message, array $context = []): void
    {
        $this->client->captureMessage($message, 'error', [
            'extra' => $context,
        ]);
    }

    // Implement other methods...
}
```

## Testing

### Mock Client

```php
class MockNadiClient extends Client
{
    public array $capturedEvents = [];

    public function captureException(Throwable $e, array $options = []): ?string
    {
        $this->capturedEvents[] = [
            'type' => 'exception',
            'exception' => $e,
            'options' => $options,
        ];
        return 'mock-event-id';
    }
}
```

### Testing Assertions

```php
public function testErrorIsCaptured()
{
    $mock = new MockNadiClient(['enabled' => false]);

    $service = new PaymentService($mock);

    try {
        $service->process(null);
    } catch (InvalidArgumentException $e) {
        // Expected
    }

    $this->assertCount(1, $mock->capturedEvents);
    $this->assertInstanceOf(
        InvalidArgumentException::class,
        $mock->capturedEvents[0]['exception']
    );
}
```

## Performance Optimization

### Lazy Initialization

```php
class LazyNadiClient
{
    private ?Client $client = null;
    private array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function getClient(): Client
    {
        if ($this->client === null) {
            $this->client = new Client($this->config);
        }
        return $this->client;
    }
}
```

### Batch Processing

```php
$events = [];

// Collect events
$client->beforeCapture(function ($event) use (&$events) {
    $events[] = $event;
    return null; // Don't capture immediately
});

// Batch send at end of request
register_shutdown_function(function () use (&$events, $client) {
    foreach ($events as $event) {
        $client->sendEvent($event);
    }
});
```

## Debugging

### Debug Mode

```php
$client = new Client([
    'debug' => true,
]);
```

### Event Inspection

```php
$client->beforeCapture(function ($event, $hint) {
    var_dump($event);
    return $event;
});
```

### SDK Logging

```php
$client->setLogger(function (string $level, string $message) {
    error_log("[Nadi][$level] $message");
});
```

## Next Steps

- [Configuration](/sdks/php/configuration) - Full configuration reference
- [Transporters](/sdks/php/transporters) - Event transport options
- [Sampling](/sdks/php/sampling) - Control event volume
